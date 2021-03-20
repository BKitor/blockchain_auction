import { Button, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Api from '../Api';
import Web3 from "web3"
import contract_artifact from "../contracts/SealedBid.json"
import Typography from '@material-ui/core/Typography';
import NotFound from '../components/global/NotFound.js'
import Util from '../util.js';

export default function PlaceSealedBid() {
  let { auction_pk } = useParams();
  const [loadTime,] = useState(new Date());
  const [token, user] = Util.checkSignedIn();

  const [minBid, setMinBid] = useState('loading...');
  const [itemDescription, setItemDiscription] = useState('loading...');
  const [endTime, setEndTime] = useState(new Date());
  const [userBid, setUserBid] = useState(0);
  const [contract, setContract] = useState(null);
  const [auctionNotFound, setNotFound] = useState(false);
  const [auctionOwner, setAuctionOwner] = useState(null);
  const [auctionIsOver, setAuctionIsOver] = useState(false);


  useEffect(() => {
    const web3 = new Web3(Util.bcURL)
    Api.auctions.getSealedBidByPK(auction_pk, token)
      .then(res => {
        const d = new Date(res.data.end_time)
        setMinBid(`${res.data.min_bid}`);
        setItemDiscription(`${res.data.item_description}`);
        setEndTime(d);
        setContract(new web3.eth.Contract(contract_artifact.abi, res.data.auction_id))
        setAuctionOwner(res.data.owner);
        setAuctionIsOver((d.getTime() < loadTime.getTime()))
      }).catch(e => {
        if (e.response && e.response.status === 404) {
          setNotFound(true);
        }
        console.error(e);
      })
  }, [auction_pk, token, loadTime]);

  const handleBidChange = (e) => {
    console.log(e)
    if (isNaN(e.target.value)) {
      setUserBid(0);
    }
    else {
      setUserBid(e.target.value)
    }
  }
  const submitSealedBid = () => {
    if (userBid === 0 || parseInt(userBid)<parseInt(minBid)) {
      window.alert("Your bid's to low")
    } else {
      contract.methods.bid().send({ from: user.wallet, value: userBid * Math.pow(10, 18), gas: 500000 })
        .then(res => {
          console.log(res)
          alert(`Bid for ${userBid} successfuly submitted`)
        })
        .catch(err => console.error(err))
    }
  }
  function userIsSignedIn() {
    return (!token && !user) ? < Redirect to='/signin' /> : null;
  }
  function auctionIsLive() {
    return (auctionIsOver) ?
      <Redirect to={`/withdraw/sealed-bid/${auction_pk}`} />
      : null;
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {userIsSignedIn()}
      {auctionIsLive()}
      {(auctionNotFound) ?
        <NotFound type={"Auction"} identifier={auction_pk}></NotFound>
        :
        (user && user.user_id !== auctionOwner) ?
          <BidderView itemDescription={itemDescription}
            minBid={minBid}
            endTime={endTime}
            handleBidChange={handleBidChange}
            submitSealedBid={submitSealedBid}></BidderView>
          :
          <AuctioneerView itemDescription={itemDescription}
            minBid={minBid}
            endTime={endTime}></AuctioneerView>
      }
    </div>
  )
}

function AuctioneerView(props) {
  const { itemDescription, minBid, endTime } = props;
  return (
    <>
      <Typography variant="h2">Item : {itemDescription}</Typography>
      <br />
      <br />
      <br />
      <Typography variant="h5">Minimum Bid: {minBid} eth</Typography>
      <br style={{ padding: '50px' }}></br>
      <Typography variant="h5">End Time: {endTime.toLocaleString()}</Typography>
    </>
  )
}

function BidderView(props) {
  const { itemDescription, minBid, endTime, handleBidChange, submitSealedBid } = props;
  return (
    <>
      <Typography variant="h2">Place Bid on: {itemDescription}</Typography>
      <br />
      <br />
      <br />
      <br style={{ padding: '50px' }}></br>
      <Typography variant="h5">Minimum Bid: {minBid} eth</Typography>
      <br />
      <Typography variant="h5">End Time: {endTime.toLocaleString()} </Typography>
      <br />
      <br style={{ padding: '50px' }}></br>
      <TextField onChange={handleBidChange} placeholder='Bid ammount'></TextField>
      <Button onClick={submitSealedBid}>Place Bid</Button>
      <br style={{ padding: '50px' }}></br>
    </>
  )

}