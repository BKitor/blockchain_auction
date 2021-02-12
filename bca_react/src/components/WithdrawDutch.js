import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Api from '../Api';
import Web3 from "web3"
import contract_artifact from "../contracts/DutchAuction.json"
import Typography from '@material-ui/core/Typography';
import Error404 from './Error404.js'
import Util from '../util.js';

export default function WithdrawDutch() {
  let { auction_pk } = useParams();
  const [token, user] = Util.checkSignedIn();

  const [winningBid, setWinningBid] = useState(0);
  const [minBid, setMinBid] = useState('loading...');
  const [itemDescription, setItemDiscription] = useState('loading...');
  const [endTime, setEndTime] = useState(new Date());
  const [auctionNotFound, setNotFound] = useState(false);
  const [auctionOwner, setAuctionOwner] = useState(null);
  const [auctionID, setAuctionID] = useState(null)
  const [auctionIsOver, setAuctionIsOver] = useState(true);

  const [rate, setRate] = useState('loading...');
  const [startPrice, setStartPrice] = useState("loading...");

  function getEthData() {
    if (!auctionID) { return }
    const web3 = new Web3(Util.bcURL)
    const dutchContract = new web3.eth.Contract(contract_artifact.abi, auctionID)
    dutchContract.methods.ongoingAuction().call().then(oa => setAuctionIsOver(!oa))
    // dutchContract.methods.highestBid().call().then(console.log)
    dutchContract.methods.getHighestBid().call().then(console.log)
  }

  function getDjangoData() {
    Api.auctions.getDutchByPK(auction_pk, token)
      .then(res => {
        setAuctionID(res.data.auction_id)
        setMinBid(res.data.min_bid);
        setItemDiscription(`${res.data.item_description}`);
        setEndTime(new Date(res.data.end_time));
        setRate(res.data.rate)
        setStartPrice(res.data.start_price)
        setAuctionOwner(res.data.owner);
      })
      .catch(e => {
        if (e.response && e.response.status === 404) {
          setNotFound(true);
        }
        console.error(e);
      })
  }
  useEffect(getDjangoData, [auction_pk, token])
  useEffect(getEthData, [auctionID])

  function userIsSignedIn() {
    return (!token && !user) ? < Redirect to='/signin' /> : null;
  }

  function auctionIsLive() {
    return (auctionIsOver) ? null : (
      <Redirect to={`/place/dutch/${auction_pk}`} />
    )
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {userIsSignedIn()}
      {auctionIsLive()}
      {(auctionNotFound) ? <Error404 type={"Auction"} identifier={auction_pk}></Error404> : null}
      <Typography variant="h4">Auction over for : {itemDescription}</Typography>
      <Typography>Start Price: {startPrice}</Typography>
      <Typography variant="h4">Winning Bid: {winningBid.toFixed(4)} eth</Typography>
      <Typography>Rate: {rate}</Typography>
      <Typography>Minimum Bid: {minBid} eth</Typography>
      <Typography variant="h6">End Time: {endTime.toLocaleString()} </Typography>
      {(user && user.user_id !== auctionOwner) ? null :
        <AuctioneerView/>}
    </div >
  )
}
function AuctioneerView(props) {
  return (<Button onClick={window.alert("TODO:withdraw auctioneer eth")}>Withdraw Winnings</Button>)
}