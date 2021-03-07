
import { Button, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Api from '../Api';
import Web3 from "web3"
import contract_artifact from "../contracts/EnglishAuction.json"
import Typography from '@material-ui/core/Typography';
import Error404 from './global/Error404.js'
import Util from '../util.js';

export default function PlaceEnglish() {
  let { auction_pk } = useParams();
  const [token, user] = Util.checkSignedIn();

  const [minBid, setMinBid] = useState('loading...');
  const [itemDescription, setItemDiscription] = useState('loading...');
  const [endTime, setEndTime] = useState(new Date());
  const [userBid, setUserBid] = useState(0);
  const [contract, setContract] = useState(null);
  const [auctionNotFound, setNotFound] = useState(false);
  const [auctionOwner, setAuctionOwner] = useState(null);
  const [currentBid, setCurrentBid] = useState("loading...");
  const [auctionID, setAuctionID] = useState(null)

  const onBidEvent = (error, event) => {
    if (error) {
      console.log(error);
    }
    else {
      if (parseInt(event.returnValues.bid, 10) > parseInt(currentBid, 10)) {
        setCurrentBid(Number(event.returnValues.bid))
      }
    }
  }

  function getEthData() {
    if (!auctionID) { return }
    const web3 = new Web3(Util.bcURL)
    const englishContract = new web3.eth.Contract(contract_artifact.abi, auctionID)
    setContract(englishContract)
    const subsription = englishContract.events.BidEvent({}, onBidEvent)
    englishContract.methods.getHighestBid().call().then(hb => { setCurrentBid(hb) })
    return function cleanup() {
      subsription.unsubscribe()
    }
  }

  function getDjangoData() {
    Api.auctions.getEnglishByPK(auction_pk, token)
      .then(res => {
        setAuctionID(res.data.auction_id)
        setMinBid(`${res.data.min_bid}`);
        setItemDiscription(`${res.data.item_description}`);
        setEndTime(new Date(res.data.end_time));
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
  useEffect(getEthData, [auctionID, currentBid])


  const handleBidChange = (e) => {
    console.log(e)
    if (isNaN(e.target.value)) {
      setUserBid(0);
    }
    else {
      setUserBid(e.target.value)
    }
  }
  const submitEnglishBid = () => {
    console.log(userBid)
    console.log(minBid)
    console.log(currentBid)
    if (userBid === 0 || parseInt(userBid)<parseInt(minBid) || parseInt(userBid)<parseInt(currentBid)) {
      window.alert("Your bid isn't high enough")
    } else {
      contract.methods.bid().send({ from: user.wallet, value: userBid * Math.pow(10, 18), gas: 500000 })
        .then(res => console.log(res))
        .catch(err => console.error(err))
    }
  }
  function isSignedIn() {
    return (!token && !user) ? < Redirect to='/signin' /> : null;
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {isSignedIn()}
      {(auctionNotFound) ?
        <Error404 type={"Auction"} identifier={auction_pk}></Error404>
        :
        (user && user.user_id !== auctionOwner) ?
          <BidderView itemDescription={itemDescription}
            minBid={minBid}
            endTime={endTime}
            handleBidChange={handleBidChange}
            submitEnglishBid={submitEnglishBid}
            currentBid={currentBid} />
          :
          <AuctioneerView itemDescription={itemDescription}
            minBid={minBid}
            endTime={endTime}
            currentBid={currentBid} />
      }
    </div>
  )
}

function AuctioneerView(props) {
  const { itemDescription, minBid, endTime, currentBid } = props;
  return (
    <>
      <Typography>Item : {itemDescription}</Typography>
      <Typography>Starting Bid: {minBid} eth</Typography>
      <Typography>Current Bid: {currentBid}</Typography>
      <Typography>End Time: {endTime.toLocaleString()}</Typography>
    </>
  )
}

function BidderView(props) {
  const { itemDescription, minBid, currentBid, endTime, handleBidChange, submitEnglishBid } = props;
  return (
    <>
      <Typography variant="h2">Place Bid on: {itemDescription}</Typography>
      <br style={{ padding: '50px' }}></br>
      <Typography variant="h4">Minimum Bid: {minBid} eth</Typography>
      <Typography variant="h4">Current Highest Bid: {currentBid} </Typography>
      <Typography variant="h4">End Time: {endTime.toLocaleString()} </Typography>
      <br style={{ padding: '50px' }}></br>
      <TextField onChange={handleBidChange} placeholder='Bid ammount'></TextField>
      <Button onClick={submitEnglishBid}>Place Bid</Button>
      <br style={{ padding: '50px' }}></br>
    </>
  )

}
