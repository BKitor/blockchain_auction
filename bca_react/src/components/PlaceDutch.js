import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Api from '../Api';
import Web3 from "web3"
import contract_artifact from "../contracts/DutchAuction.json"
import Typography from '@material-ui/core/Typography';
import Error404 from './Error404.js'
import Util from '../util.js';


export default function PlaceDutch() {
  let { auction_pk } = useParams();
  const [token, user] = Util.checkSignedIn();

  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const [minBid, setMinBid] = useState('loading...');
  const [itemDescription, setItemDiscription] = useState('loading...');
  const [endTime, setEndTime] = useState(new Date());
  const [contract, setContract] = useState(null);
  const [auctionNotFound, setNotFound] = useState(false);
  const [auctionOwner, setAuctionOwner] = useState(null);
  const [auctionID, setAuctionID] = useState(null)
  const [auctionIsOver, setAuctionIsOver] = useState(false);

  const [startTime, setStartTime] = useState()
  const [rate, setRate] = useState('loading...');
  const [startPrice, setStartPrice] = useState("loading...");
  const [currentPrice, setCurrentPrice] = useState("loading...");
  const [bidEvents, setBidEvents] = useState([]);

  const onBidEvent = (error, event) => {
    if (error) {
      console.log(error);
    }
    else {
      setAuctionIsOver(true)
      // TODO: auction is over, transition to withdraw 
      // if (parseInt(event.returnValues.bid, 10) > parseInt(currentBid, 10)) {
      //   setCurrentBid(Number(event.returnValues.bid))
      // }
    }
  }

  function getEthData() {
    if (!auctionID) { return }
    const web3 = new Web3(Util.bcURL)
    const dutchContract = new web3.eth.Contract(contract_artifact.abi, auctionID)
    setContract(dutchContract)
    const subsription = dutchContract.events.BidEvent({}, onBidEvent)
    dutchContract.methods.auctionStart().call().then(st => setStartTime(new Date(st * 1000)))
    // dutchContract.methods.ongoingAuction().call().then(oa => setAuctionIsOver(!oa))
    // dutchContract.methods.ongoingAuction().call().then(oa=>console.log("ongoing", oa))
    dutchContract.getPastEvents('BidEvent').then(setBidEvents)
    return function cleanup() {
      subsription.unsubscribe()
    }
  }

  function getDjangoData() {
    Api.auctions.getDutchByPK(auction_pk, token)
      .then(res => {
        // console.log(res)
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

  Util.useInterval(() => {
    setCurrentTime(currentTime + 1000)
  }, 1000)

  function updateCurrentPrice() {
    if (!startTime) { return }
    const newPrice = startPrice - rate * (currentTime - startTime.getTime()) / 1000 / 60
    setCurrentPrice((newPrice > minBid) ? newPrice : minBid)
  }

  useEffect(getDjangoData, [auction_pk, token])
  useEffect(getEthData, [auctionID])
  useEffect(updateCurrentPrice, [startTime, rate, currentTime])

  const submitDutchBid = () => {
    // TODO: Needs Modal
    contract.methods.bid().send({ from: user.wallet, value: currentPrice * Math.pow(10, 18), gas: 500000 })
      .then(res => console.log(res))
      .catch(err => console.error(err))
  }

  function isSignedIn() {
    return (!token && !user) ? < Redirect to='/signin' /> : null;
  }

  // could probably be a util fn
  function redirectIfOver(){
    // console.log(bidEvents.length>0)
    // return (auctionIsOver)?
    return (bidEvents.length>0)?
      <Redirect to={`/withdraw/dutch/${auction_pk}`} />:null;
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {isSignedIn()}
      {redirectIfOver()}
      {(auctionNotFound) ? <Error404 type={"Auction"} identifier={auction_pk}></Error404> : null}
      <Typography variant="h4">Place Bid on: {itemDescription}</Typography>
      <Typography>Start Price: {startPrice}</Typography>
      <Typography variant="h4">Current Price: {(currentPrice.toFixed) ? currentPrice.toFixed(4) : currentPrice} eth</Typography>
      <Typography>Rate: {rate}</Typography>
      {/* <Typography>Minimum Bid: {minBid} eth</Typography> */}
      <Typography variant="h6">End Time: {endTime.toLocaleString()} </Typography>
      {(user && user.user_id !== auctionOwner) ?
        <BidderView itemDescription={itemDescription}
          currentPrice={currentPrice}
          submitDutchBid={submitDutchBid}
        />
        : null}
    </div>
  )
}

function BidderView(props) {
  const { currentPrice, submitDutchBid } = props;
  return (
    <>
      <Button onClick={submitDutchBid}>{(currentPrice.toFixed) ? currentPrice.toFixed(4) : null} Place Bid</Button>
      <br style={{ padding: '50px' }}></br>
    </>
  )

}
