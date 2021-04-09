import { Button, Dialog, Typography, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Api from '../../../Api';
import Web3 from "web3";
import contract_artifact from "../../../contracts/ChannelAuction.json";
import Error404 from '../../Error404.js';
import Util from '../../../util.js';

export default function PlaceChannel() {
  let { auction_pk } = useParams();
  const [token, user] = Util.checkSignedIn();
  const [loadTime,] = useState(new Date());

  const [minBid, setMinBid] = useState('loading...');
  const [itemDescription, setItemDiscription] = useState('loading...');
  const [endTime, setEndTime] = useState(new Date());
  const [userBidSubmission, setUserBidSubmission] = useState(0);
  const [contract, setContract] = useState(null);
  const [auctionNotFound, setNotFound] = useState(false);
  const [auctionOwner, setAuctionOwner] = useState(null);
  const [currentHighestBid, setCurrentHighestBid] = useState("Loading...");
  const [currentUserBid, setCurrentUserBid] = useState("Loading");
  const [auctionID, setAuctionID] = useState(null)
  const [openBidSubmitDialog, setOpenBidSubmitDialog] = useState(false);
  const [openBuyNowDialog, setOpenBuyNowDialog] = useState(false);
  const [auctionIsOver, setAuctionIsOver] = useState(false);
  const [buyNowPrice, setBuyNowPrice] = useState(0);
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
        setCurrentHighestBid(event.returnValues.bid/1e18)
      }
    }
  }

  const onBuyEvent = (error, event) => {
    if (error) {
      console.log(error);
    }
    else {
      setItemBought(true);
    }
  }

  function getEthData() {
    if (!auctionID) { return }
    const web3 = new Web3(Util.bcURL)
    const channelContract = new web3.eth.Contract(contract_artifact.abi, auctionID)
    setContract(channelContract)
    const subsription = channelContract.events.BidEvent({}, onBidEvent)
    const buySub = channelContract.events.BuyEvent({}, onBuyEvent)

    channelContract.getPastEvents('BidEvent', { fromBlock: "earliest" }).then(be => {
      if (be.length > 0) {
        const highestBid = be[be.length - 1].returnValues.bid / 1e18
        setCurrentHighestBid(highestBid)
      }
      else{
        setCurrentHighestBid(0)
      }
    })

    channelContract.getPastEvents('BuyEvent', { fromBlock: "earliest" }).then(be => {
      if (be.length > 0) {
        setItemBought(true)
      }
    })

    channelContract.methods.get_bid().call({ from: user.wallet }).then(cb => { setCurrentUserBid(cb) })

    return function cleanup() {
      subsription.unsubscribe()
      buySub.unsubscribe()
    }
  }

  function getDjangoData() {
    Api.auctions.getChannelByPK(auction_pk, token)
      .then(res => {
        const d = new Date(res.data.end_time)
        setAuctionID(res.data.auction_id)
        setMinBid(`${res.data.min_bid}`);
        setItemDiscription(`${res.data.item_description}`);
        setEndTime(new Date(res.data.end_time));
        setAuctionOwner(res.data.owner);
        setBuyNowPrice(res.data.buy_now_price)
        setAuctionIsOver((d.getTime() < loadTime.getTime()))
      })
      .catch(e => {
        if (e.response && e.response.status === 404) {
          setNotFound(true);
        }
        console.error(e);
      })
  }

  useEffect(getDjangoData, [auction_pk, token])
  useEffect(getEthData, [auctionID, currentHighestBid])

  const handleBidChange = (e) => {
    console.log(e)
    if (isNaN(e.target.value)) {
      setUserBidSubmission(0);
    }
    else {
      setUserBidSubmission(e.target.value)
    }
  }

  const submitChannelBid = () => {
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
    contract.methods.buy_now().send({ from: user.wallet, value: calcBuyNowSubmission() * 1e18, gas: 500000 })
      .then(res => { handleBuyNowDialogClose() })
      .catch(err => console.log(err))
  }


  function isSignedIn() {
    return (!token && !user) ? < Redirect to='/signin' /> : null;
  }

  function auctionIsLive() {
    return (auctionIsOver || itemBought) ?
      <Redirect to={`/withdraw/channel/${auction_pk}`} />
      : null;
  }

  function calcNewSubmission() {
    return (parseInt(userBidSubmission) - parseInt(currentUserBid) / 1e18)
  }

  function calcBuyNowSubmission() {
    return (parseInt(buyNowPrice) - parseInt(currentUserBid) / 1e18)
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
          <Typography>Buy Now Price : {buyNowPrice} eth</Typography>
          <Typography>End Time: {endTime.toLocaleString()}</Typography>
        </>
      }
      {
        (user && user.user_id !== auctionOwner && !auctionNotFound) ?
          <BidderView
            handleBidChange={handleBidChange}
            submitChannelBid={submitChannelBid}
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
  const { currentHighestBid, handleBidChange, submitChannelBid, userBid, handleBuyNowClick } = props;
  return (
    <>
      <Typography variant="h4">Your Bid: {userBid / 1e18} eth {(userBid/1e18 === currentHighestBid) ? "☜(ﾟヮﾟ☜) You're the highest bidder" : ''}</Typography>
      <TextField onChange={handleBidChange} placeholder='Bid ammount'></TextField>
      <Button onClick={submitChannelBid}>Place Bid</Button>
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
             submit another ${calcBuyNowSubmission()} eth to total ${buyNowPrice} eth`}
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
