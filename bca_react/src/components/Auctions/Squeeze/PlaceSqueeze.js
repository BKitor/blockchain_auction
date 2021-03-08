import { Button, Dialog, Typography, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Api from '../../../Api';
import Web3 from "web3";
import contract_artifact from "../../../contracts/SqueezeAuction.json";
import Error404 from '../../Error404.js';
import Util from '../../../util.js';

export default function PlaceSqueeze() {
  let { auction_pk } = useParams();
  const [token, user] = Util.checkSignedIn();

  const [itemDescription, setItemDiscription] = useState('loading...');
  const [auctionOwner, setAuctionOwner] = useState(null);
  const [auctionID, setAuctionID] = useState(null)
  const [minBid, setMinBid] = useState('loading...');
  const [rate, setRate] = useState(0);
  const [startHigh, setStartHigh] = useState(0);
  const [currentHighestBid, setCurrentHighestBid] = useState("Loading...");
  const [currentUserBid, setCurrentUserBid] = useState("Loading");
  const [buyNowPrice, setBuyNowPrice] = useState(Infinity);
  const [endTime, setEndTime] = useState(new Date());

  const [currentTime, setCurrentTime] = useState(new Date().getTime())
  const [startTime, setStartTime] = useState();
  const [contract, setContract] = useState(null);
  const [userBidSubmission, setUserBidSubmission] = useState(0);
  const [auctionNotFound, setNotFound] = useState(false);
  const [openBidSubmitDialog, setOpenBidSubmitDialog] = useState(false);
  const [openBuyNowDialog, setOpenBuyNowDialog] = useState(false);
  const [itemBought, setItemBought] = useState(false);

  function handleSubmitDialogOpen() {
    setOpenBidSubmitDialog(true);
  }

  function handleSubmitDialogClose() {
    setOpenBidSubmitDialog(false);
  }

  function handleBuyNowDialogOpen() {
    setOpenBuyNowDialog(true);
  }

  function handleBuyNowDialogClose() {
    setOpenBuyNowDialog(false)
  }

  const onBidEvent = (error, event) => {
    if (error) {
      console.log(error);
    }
    else {
      if (parseInt(event.returnValues.bid, 10) > parseInt(currentHighestBid, 10)) {
        setCurrentHighestBid(event.returnValues.bid / 1e18)
        if (parseInt(event.returnValues.bid, 10) > buyNowPrice) {
          setItemBought(true)
        }
      }
    }
  }

  function getEthData() {
    if (!auctionID) { return }
    const web3 = new Web3(Util.bcURL)
    const squeezeContract = new web3.eth.Contract(contract_artifact.abi, auctionID)
    setContract(squeezeContract)
    const subsription = squeezeContract.events.BidEvent({}, onBidEvent)

    squeezeContract.getPastEvents('BidEvent', { fromBlock: "earliest" }).then(be => {
      if (be.length > 0) {
        const highestBid = be[be.length - 1].returnValues.bid / 1e18
        setCurrentHighestBid(highestBid)
      }
      else {
        setCurrentHighestBid(0)
      }
    })

    squeezeContract.methods.get_bid().call({ from: user.wallet }).then(cb => { setCurrentUserBid(cb) })
    squeezeContract.methods.auctionStart().call().then(st => setStartTime(new Date(st * 1000)))

    return function cleanup() {
      subsription.unsubscribe()
    }
  }

  function getDjangoData() {
    Api.auctions.getSqueezeByPK(auction_pk, token)
      .then(res => {
        setAuctionID(res.data.auction_id)
        setMinBid(`${res.data.start_low}`);
        setStartHigh(res.data.start_high)
        setRate(res.data.rate)
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

  Util.useInterval(() => {
    console.log("benis")
    setCurrentTime(currentTime + 1000)
  }, 1000)


  function updateBuyNowPrice() {
    if (!startTime) { return }
    const newPrice = startHigh - rate * (currentTime - startTime.getTime()) / 1000 / 60
    setBuyNowPrice((newPrice > minBid) ? newPrice : minBid)
  }

  useEffect(getDjangoData, [auction_pk, token])
  useEffect(getEthData, [auctionID, currentHighestBid])
  useEffect(updateBuyNowPrice, [currentTime])

  const handleBidChange = (e) => {
    console.log(e)
    if (isNaN(e.target.value)) {
      setUserBidSubmission(0);
    }
    else {
      setUserBidSubmission(e.target.value)
    }
  }

  const submitSqueezeBid = () => {
    if (userBidSubmission === 0
      || parseInt(userBidSubmission) < parseInt(minBid)
      || (parseInt(userBidSubmission) * 1e18) <= parseInt(currentHighestBid)) {
      window.alert("Your bid isn't high enough")
    } else {
      handleSubmitDialogOpen();
    }
  }

  function submitBidToBlockchain() {
    if (userBidSubmission >= buyNowPrice) {
      submitBuyNowToBlockchain()
    }
    else {
      contract.methods.bid().send({ from: user.wallet, value: calcNewSubmission() * Math.pow(10, 18), gas: 500000 })
        .then(res => { handleSubmitDialogClose() })
        .catch(err => console.error(err))
    }
  }

  function submitBuyNowToBlockchain() {
    contract.methods.startPrice().call().then(console.log)
    contract.methods.minPrice().call().then(console.log)
    console.log(calcBuyNowSubmission(), calcBuyNowSubmission()*1e18)
    contract.methods.bid_high().send({ from: user.wallet, value: calcBuyNowSubmission() * 1e18, gas: 500000 })
      .then(res => { handleBuyNowDialogClose() })
      .catch(err => console.log(err))
  }

  function isSignedIn() {
    return (!token && !user) ? < Redirect to='/signin' /> : null;
  }

  function auctionIsLive() {
    const timeExceeded = currentTime > endTime.getTime();
    const bidPassBuyNow =  currentHighestBid >= buyNowPrice;
    return (itemBought || timeExceeded || bidPassBuyNow) ?
      <Redirect to={`/withdraw/squeeze/${auction_pk}`} />
      : null;
  }

  function calcNewSubmission() {
    return (parseInt(userBidSubmission) - parseInt(currentUserBid) / 1e18)
  }

  function calcBuyNowSubmission() {
    return (buyNowPrice - currentUserBid / 1e18)
  }

  function handleBuyNowClick() {
    handleBuyNowDialogOpen()
  }


  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {isSignedIn()}
      {auctionIsLive()}
      {(auctionNotFound) ?
        <Error404 type={"Auction"} identifier={auction_pk}></Error404>
        :
        <>
          <Typography>Item : {itemDescription}</Typography>
          <Typography>Starting Bid: {minBid} eth</Typography>
          <Typography variant="h4">Highest Bid: {currentHighestBid} eth</Typography>
          <Typography variant="h5">Buy Now Price : {(buyNowPrice.toFixed) ? buyNowPrice.toFixed(4):buyNowPrice} eth</Typography>
          <Typography>End Time: {endTime.toLocaleString()}</Typography>
        </>
      }
      {
        (user && user.user_id !== auctionOwner && !auctionNotFound) ?
          <BidderView
            handleBidChange={handleBidChange}
            submitSqueezeBid={submitSqueezeBid}
            currentHighestBid={currentHighestBid}
            userBid={currentUserBid}
            handleBuyNowClick={handleBuyNowClick}
          />
          :
          null
      }
      <PlaceBidDialog
        openBidSubmitDialog={openBidSubmitDialog}
        handleSubmitDialogClose={handleSubmitDialogClose}
        currentHighestBid={currentHighestBid}
        currentUserBid={currentUserBid}
        userBidSubmission={userBidSubmission}
        submitBidToBlockchain={submitBidToBlockchain}
        calcNewSubmission={calcNewSubmission}
      />
      <BuyNowDialog
        openBuyNowDialog={openBuyNowDialog}
        handleBuyNowDialogClose={handleBuyNowDialogClose}
        itemDescription={itemDescription}
        currentUserBid={currentUserBid}
        calcBuyNowSubmission={calcBuyNowSubmission}
        buyNowPrice={buyNowPrice}
        submitBuyNowToBlockchain={submitBuyNowToBlockchain}
      />
    </div>
  )
}


function BidderView(props) {
  const { currentHighestBid, handleBidChange, submitSqueezeBid, userBid, handleBuyNowClick } = props;
  return (
    <>
      <Typography variant="h4">Your Bid: {userBid / 1e18} eth {(userBid / 1e18 === currentHighestBid) ? "☜(ﾟヮﾟ☜) You're the highest bidder" : ''}</Typography>
      <TextField onChange={handleBidChange} placeholder='Bid ammount'></TextField>
      <Button onClick={submitSqueezeBid}>Place Bid</Button>
      <Button onClick={handleBuyNowClick}>Buy Now</Button>
    </>
  )
}

function BuyNowDialog(props) {
  const { openBuyNowDialog, handleBuyNowDialogClose, itemDescription, currentUserBid, calcBuyNowSubmission, buyNowPrice, submitBuyNowToBlockchain } = props;
  return <Dialog
    open={openBuyNowDialog}
    onClose={handleBuyNowDialogClose}
  >
    <DialogTitle>Buy {itemDescription} now?</DialogTitle>
    <DialogContent>
      <DialogContentText>
        {(parseInt(currentUserBid) === 0) ? `Buy now for ${calcBuyNowSubmission()} eth`
          : `You've already placed ${currentUserBid / 1e18} eth,
             submit another ${calcBuyNowSubmission().toFixed(4)} eth to total ${buyNowPrice.toFixed(4)} eth`}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={submitBuyNowToBlockchain}>Buy Now</Button>
      <Button onClick={handleBuyNowDialogClose}>Wait go back</Button>
    </DialogActions>
  </Dialog>
}

function PlaceBidDialog(props) {
  const { openBidSubmitDialog, handleSubmitDialogClose, currentHighestBid, currentUserBid, userBidSubmission, submitBidToBlockchain, calcNewSubmission } = props

  return (
    <Dialog
      open={openBidSubmitDialog}
      onClose={handleSubmitDialogClose}
    >
      <DialogTitle>Confirm Bid Submission</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {(currentHighestBid === 0 || parseInt(currentUserBid) === 0) ? `Place bet of ${userBidSubmission}`
            : `You've already placed ${currentUserBid / 1e18} eth,
             submit another ${calcNewSubmission()} eth to total ${userBidSubmission} eth`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={submitBidToBlockchain}>Submit Bid</Button>
        <Button onClick={handleSubmitDialogClose}>Wait go back</Button>
      </DialogActions>
    </Dialog>
  )
}
