import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Api from '../../../Api';
import Web3 from "web3"
import contract_artifact from "../../../contracts/DutchAuction.json"
import Typography from '@material-ui/core/Typography';
import NotFound from '../../global/NotFound.js';
import Util from '../../../util.js';

export default function WithdrawDutch() {
  let { auction_pk } = useParams();
  const [token, user] = Util.checkSignedIn();

  const [winningBid, setWinningBid] = useState(0);
  const [minBid, setMinBid] = useState('loading...');
  const [itemDescription, setItemDiscription] = useState('loading...');
  const [endTime, setEndTime] = useState(null);
  const [auctionNotFound, setNotFound] = useState(false);
  const [auctionOwner, setAuctionOwner] = useState(null);
  const [auctionID, setAuctionID] = useState(null)
  const [bidEvents, setBidEvents] = useState(null);
  const [withdrawArray, setWithdrawArray] = useState(null)

  const [rate, setRate] = useState('loading...');
  const [startPrice, setStartPrice] = useState("loading...");
  const [contract, setContract] = useState(null);

  function onWithdrawlsEvent(withdrawError, withdrawEvent) {
    if (withdrawError) {
      console.log(withdrawError)
      return
    }
    if (withdrawEvent) {
      setWithdrawArray([withdrawEvent])
    }
  }

  function getEthData() {
    if (!auctionID) { return }
    const web3 = new Web3(Util.bcURL)
    const dutchContract = new web3.eth.Contract(contract_artifact.abi, auctionID)
    setContract(dutchContract)
    const withdrawSub = dutchContract.events.WithdrawalEvent({}, onWithdrawlsEvent)
    dutchContract.getPastEvents('BidEvent', { fromBlock: "earliest" }).then(bidArr => {
      setBidEvents(bidArr)
      if (bidArr.length > 0) {
        setWinningBid(bidArr[0].returnValues.bid / 1e18)
      }
    })
    dutchContract.getPastEvents('WithdrawalEvent').then(wdArr => {
      setWithdrawArray(wdArr)
    })
    return function cleanup() {
      withdrawSub.unsubscribe()
    }
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

  function redirectifNotOver() {
    if (endTime === null) { return null }
    if (bidEvents === null) { return null }
    const d = new Date();
    const timeExpired = endTime.getTime() < d.getTime()
    const bidPlaced = bidEvents.length > 0;
    return (timeExpired || bidPlaced) ? null :
      <Redirect to={`/place/dutch/${auction_pk}`} />
  }


  function handleWithdraw() {
    if (contract === null) { return }
    if (withdrawArray === null) { return }
    if (bidEvents === null) {return}
    if (withdrawArray.length > 0) {
      window.alert("Ethereum already withdrawn")
    }
    else if (bidEvents.length<1) {
      window.alert("No bids were placed")
    }
    else {
      contract.methods.withdraw().send({ from: user.wallet, gas: 500000 })
        .then(res => {
          alert("eth successfully extracted")
        })
    }
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {userIsSignedIn()}
      {redirectifNotOver()}
      {(auctionNotFound) ? <NotFound type={"Auction"} identifier={auction_pk}></NotFound> : null}
      <Typography variant="h4">Auction over for : {itemDescription}</Typography>
      <Typography>Start Price: {startPrice}</Typography>
      <Typography variant="h4">Winning Bid: {winningBid.toFixed(4)} eth</Typography>
      <Typography>Rate: {rate}</Typography>
      <Typography>Minimum Bid: {minBid} eth</Typography>
      <Typography variant="h6">End Time: {(endTime) ? endTime.toLocaleString() : "Loading..."} </Typography>
      {(user && user.user_id !== auctionOwner) ? null :
        <AuctioneerView handleWithdraw={handleWithdraw} />}
    </div >
  )
}
function AuctioneerView(props) {
  const { handleWithdraw } = props;
  return (<Button onClick={handleWithdraw}>Withdraw Winnings</Button>)
}