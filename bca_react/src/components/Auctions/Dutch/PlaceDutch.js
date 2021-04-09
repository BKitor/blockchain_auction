import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Api from '../../../Api';
import Web3 from "web3"
import contract_artifact from "../../../contracts/DutchAuction.json"
import Typography from '@material-ui/core/Typography';
import NotFound from '../../global/NotFound.js';
import Util from '../../../util.js';


export default function PlaceDutch() {
  let { auction_pk } = useParams();
  const [token, user] = Util.checkSignedIn();

  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const [minBid, setMinBid] = useState('loading...');
  const [itemDescription, setItemDiscription] = useState('loading...');
  const [endTime, setEndTime] = useState(null);
  const [contract, setContract] = useState(null);
  const [auctionNotFound, setNotFound] = useState(false);
  const [auctionOwner, setAuctionOwner] = useState(null);
  const [auctionID, setAuctionID] = useState(null)

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
      setBidEvents([event])
    }
  }

  function getEthData() {
    if (!auctionID) { return }
    const web3 = new Web3(Util.bcURL)
    const dutchContract = new web3.eth.Contract(contract_artifact.abi, auctionID)
    setContract(dutchContract)
    const subsription = dutchContract.events.BidEvent({}, onBidEvent)
    dutchContract.methods.auctionStart().call().then(st => setStartTime(new Date(st * 1000)))
    dutchContract.getPastEvents('BidEvent', { fromBlock: "earliest" }).then(setBidEvents)
    return function cleanup() {
      subsription.unsubscribe()
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
    console.log(contract)
    console.log("current Price:", currentPrice)
    contract.methods.current_price().call().then(console.log)
    contract.methods.bid().send({ from: user.wallet, value: currentPrice * 1e18, gas: 500000 })
      .then(res => console.log(res))
      .catch(err => console.error(err))
  }

  function isSignedIn() {
    return (!token && !user) ? < Redirect to='/signin' /> : null;
  }

  function redirectIfOver() {
    if (endTime === null) { return null }
    // const d = new Date();
    const timeExpired = endTime.getTime() < currentTime
    const bidPlaced = bidEvents.length > 0;
    return (timeExpired || bidPlaced) ?
      <Redirect to={`/withdraw/dutch/${auction_pk}`} /> : null;
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {isSignedIn()}
      {redirectIfOver()}
      {(auctionNotFound) ? <NotFound type={"Auction"} identifier={auction_pk}></NotFound> : null}
      <Typography variant="h4">Place Bid on: {itemDescription}</Typography>
      <br />
      <br />
      <br />
      <Typography>Start Price: {startPrice}</Typography>
      <Typography variant="h5">Current Price: {(currentPrice.toFixed) ? currentPrice.toFixed(4) : currentPrice} eth</Typography>
      <br />
      <Typography>Rate: {rate}</Typography>
      <Typography variant="h5">End Time: {(endTime) ? endTime.toLocaleString() : "Loading..."} </Typography>
      <br />
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
