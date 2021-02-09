import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Api from '../Api';
import Web3 from "web3"
import contract_artifact from "../contracts/EnglishAuction.json"
import Typography from '@material-ui/core/Typography';
import Error404 from './Error404.js'
import Util from '../util.js';

export default function WithdrawEnglish() {
  let { auction_pk } = useParams();
  const [token, user] = Util.checkSignedIn();
  const [loadTime,] = useState(new Date());

  const [itemDescription, setItemDiscription] = useState('loading...');
  const [endTime, setEndTime] = useState(new Date());
  const [contract, setContract] = useState(null);
  const [auctionNotFound, setNotFound] = useState(false);
  const [auctionOwner, setAuctionOwner] = useState(null);
  const [auctionIsOver, setAuctionIsOver] = useState(true);
  const [highestBid, setHighestBid] = useState("Loading...")
  const [userBid, setUserBid] = useState("Loading...");

  function getDjangoData(){
    const web3 = new Web3(Util.bcURL)
    Api.auctions.getEnglishByPK(auction_pk, token)
      .then(res => {
        const d = new Date(res.data.end_time)
        setItemDiscription(`${res.data.item_description}`);
        setEndTime(d);
        setContract(new web3.eth.Contract(contract_artifact.abi, res.data.auction_id))
        setAuctionIsOver((d.getTime() < loadTime.getTime()))
        setAuctionOwner(res.data.owner);
      })
      .catch(e => {
        if (e.response && e.response.status === 404) {
          setNotFound(true);
        }
        console.error(e);
      })
  }

  function getEthData(){
    if(!contract){return}
    contract.methods.getHighestBid().call().then(hb=>{setHighestBid(hb/1e18)})
    contract.methods.get_bid().call({from:user.wallet}).then(ub=>{setUserBid(ub/1e18)})
  }

  useEffect(getDjangoData, [auction_pk, token, loadTime]);
  useEffect(getEthData, [contract]);

  const withdrawFunds = () => {
    const noBidStr = "revert You have no bid to withdraw";
    const winnerStr = "revert You won, you cannot withdraw funds";
    contract.methods.withdraw().send({ from: user.wallet, gas: 500000 })
      .then(res => {
        alert("Eth successfuly withdrawn, sorry you din't win")
        console.log(res)
      })
      .catch(err => {
        if (err.stack.includes(noBidStr)) {
          alert("no bid withdrawn, either you didn't participate or you've already withdrawn your funds")
        }
        else if (err.stack.includes(winnerStr)) {
          alert("Congradulation! you won! we'll figure out shipping details later...")
        }
      })
  }

  function userIsSignedIn() {
    return (!token && !user) ? < Redirect to='/signin' /> : null;
  }

  function auctionIsLive() {
    return (auctionIsOver) ? null : (
      <Redirect to={`/place/english/${auction_pk}`} />
    )
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {userIsSignedIn()}
      {auctionIsLive()}
      {(auctionNotFound) ?
        <Error404 type={"Auction"} identifier={auction_pk}></Error404>
        :
        (user && user.user_id !== auctionOwner) ?
          <BidderView itemDescription={itemDescription}
            endTime={endTime}
            winningBid={highestBid}
            userBid={userBid}
            withdrawFunds={withdrawFunds}></BidderView>
          :
          <AuctioneerView itemDescription={itemDescription}
            endTime={endTime}
            winningBid={highestBid}
            withdrawWinnings={withdrawFunds}>
            </AuctioneerView>
      }
    </div>
  )
}

function AuctioneerView(props) {
  const { itemDescription, withdrawWinnings, endTime, winningBid } = props;
  return (
    <>
      <Typography>Item : {itemDescription}</Typography>
      <Typography>End Time: {endTime.toLocaleString()}</Typography>
      <Typography>Winning Bid: {winningBid} eth</Typography>
      <Button onClick={withdrawWinnings}>Withdraw Winnings</Button>
    </>
  )
}

function BidderView(props) {
  const { itemDescription, endTime, withdrawFunds, userBid, winningBid } = props;
  return (
    <>
      <Typography variant="h2">English auction ended for: {itemDescription}</Typography>
      <br style={{ padding: '50px' }}></br>
      <Typography variant="h4">End Time: {endTime.toLocaleString()} </Typography>
      <br style={{ padding: '50px' }}></br>
      <Typography>Winning Bid: {winningBid} eth</Typography>
      <Typography>Your Bid: {userBid} eth {(userBid === winningBid)?"☜(ﾟヮﾟ☜) You're the winner!":null}</Typography>
      <Button onClick={withdrawFunds}>Withdraw Funds</Button>
      <br style={{ padding: '50px' }}></br>
    </>
  )

}
