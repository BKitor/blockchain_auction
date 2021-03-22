
import { Button, Dialog, Typography, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Api from '../Api';
import Web3 from "web3"
import contract_artifact from "../contracts/EnglishAuction.json"
import NotFound from './global/NotFound.js'
import Util from '../util.js';
import '../styles/global.css';

export default function PlaceEnglish() {
  let { auction_pk } = useParams();
  const [token, user] = Util.checkSignedIn();
  const [loadTime,] = useState(new Date());

  const [minBid, setMinBid] = useState('loading...');
  const [itemDescription, setItemDiscription] = useState('loading...');
  const [endTime, setEndTime] = useState(new Date());
  const [userBidSumbission, setUserBidSubmission] = useState(0);
  const [contract, setContract] = useState(null);
  const [auctionNotFound, setNotFound] = useState(false);
  const [auctionOwner, setAuctionOwner] = useState(null);
  const [currentHighestBid, setCurrentHighestBid] = useState("Loading...");
  const [currentUserBid, setCurrentUserBid] = useState("Loading");
  const [auctionID, setAuctionID] = useState(null)
  const [openBidSubmitDialog, setOpenBidSubmitDialog] = useState(false);
  const [auctionIsOver, setAuctionIsOver] = useState(false);

  function handleSubmitDialogOpen() {
    setOpenBidSubmitDialog(true);
  }

  function handleSubmitDialogClose() {
    setOpenBidSubmitDialog(false);
  }

  const onBidEvent = (error, event) => {
    if (error) {
      console.log(error);
    }
    else {
      if (parseInt(event.returnValues.bid, 10) > parseInt(currentHighestBid, 10)) {
        setCurrentHighestBid(Number(event.returnValues.bid))
      }
    }
  }

  function getEthData() {
    if (!auctionID) { return }
    const web3 = new Web3(Util.bcURL)
    const englishContract = new web3.eth.Contract(contract_artifact.abi, auctionID)
    setContract(englishContract)
    const subsription = englishContract.events.BidEvent({}, onBidEvent)
    englishContract.methods.getHighestBid().call().then(hb => { setCurrentHighestBid(hb) })
    englishContract.methods.get_bid().call({ from: user.wallet }).then(cb => { setCurrentUserBid(cb) })
    return function cleanup() {
      subsription.unsubscribe()
    }
  }

  function getDjangoData() {
    Api.auctions.getEnglishByPK(auction_pk, token)
      .then(res => {
        const d = new Date(res.data.end_time)
        setAuctionID(res.data.auction_id)
        setMinBid(`${res.data.min_bid}`);
        setItemDiscription(`${res.data.item_description}`);
        setEndTime(new Date(res.data.end_time));
        setAuctionOwner(res.data.owner);
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

  const submitEnglishBid = () => {
    // console.log(`chb: ${parseInt(currentHighestBid)/1e18}`)
    // console.log((parseInt(userBidSumbission)*1e18 - parseInt(currentUserBid))/1e18)
    if (userBidSumbission === 0
      || parseInt(userBidSumbission) < parseInt(minBid)
      || (parseInt(userBidSumbission)*1e18) <= parseInt(currentHighestBid)) {
      window.alert("Your bid isn't high enough")
    } else {
      handleSubmitDialogOpen();
    }
  }

  function submitBidToBlockchain() {
    contract.methods.bid().send({ from: user.wallet, value: calcNewSubmission() * Math.pow(10, 18), gas: 500000 })
      .then(res => { handleSubmitDialogClose()})
      .catch(err => console.error(err))
  }


  function isSignedIn() {
    return (!token && !user) ? < Redirect to='/signin' /> : null;
  }

  function auctionIsLive(){
    return (auctionIsOver)?
      <Redirect to={`/withdraw/english/${auction_pk}`}/>
      :null;
  }

  function calcNewSubmission(){
    return (parseInt(userBidSumbission)-parseInt(currentUserBid)/1e18)
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {isSignedIn()}
      {auctionIsLive()}
      {(auctionNotFound) ?
        <NotFound type={"Auction"} identifier={auction_pk}></NotFound>
        :
        (user && user.user_id !== auctionOwner) ?
          <BidderView itemDescription={itemDescription}
            minBid={minBid}
            endTime={endTime}
            handleBidChange={handleBidChange}
            submitEnglishBid={submitEnglishBid}
            currentBid={currentHighestBid}
            userBid={currentUserBid}
          />
          :
          <AuctioneerView itemDescription={itemDescription}
            minBid={minBid}
            endTime={endTime}
            currentBid={currentHighestBid} />
      }
      <Dialog
        open={openBidSubmitDialog}
        onClose={handleSubmitDialogClose}
      >
        <DialogTitle>Confirm Bid Submission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {(currentHighestBid === 0 || parseInt(currentUserBid) === 0)?`Place bet of ${userBidSumbission}`
            :`You've already placed ${currentUserBid/1e18} eth,
             submit another ${calcNewSubmission()} eth to total ${userBidSumbission} eth`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={submitBidToBlockchain}>Submit Bid</Button>
          <Button onClick={handleSubmitDialogClose}>Wait go back</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

function AuctioneerView(props) {
  const { itemDescription, minBid, endTime, currentBid } = props;
  return (
    <div className="grey-container">
      <Typography variant="h2">Item : {itemDescription}</Typography>
      <br />
      <br />
      <br />
      <Typography variant="h5">Starting Bid: {minBid} eth</Typography>
      <br />
      <Typography variant="h5">Highest Bid: {currentBid / 1e18} eth</Typography>
      <br />
      <Typography variant="h5">End Time: {endTime.toLocaleString()}</Typography>
    </div>
  )
}

function BidderView(props) {
  const { itemDescription, minBid, currentBid, endTime, handleBidChange, submitEnglishBid, userBid } = props;
  return (
    <div className="grey-container">
      <Typography variant="h2">Place Bid on: {itemDescription}</Typography>
      <br />
      <br />
      <br />
      <br style={{ padding: '50px' }}></br>
      <Typography variant="h5">Minimum Bid: {minBid} eth</Typography>
      <br />
      <Typography variant="h5">
        { typeof currentBid == "number" ?
        <>Current Highest Bid: {currentBid / 1e18} eth</>
        :
        <>Current Highest Bid: loading..</>
        }
        </Typography>
      <br />
      <Typography variant="h5">Your Bid: {userBid / 1e18} eth {(userBid===currentBid)}</Typography>
      <br />
      <Typography variant="h5">End Time: {endTime.toLocaleString()} </Typography>
      <br style={{ padding: '50px' }}></br>
      <TextField onChange={handleBidChange} placeholder='Bid ammount'></TextField>
      <Button onClick={submitEnglishBid}>Place Bid</Button>
      <br style={{ padding: '50px' }}></br>
    </div>
  )

}
