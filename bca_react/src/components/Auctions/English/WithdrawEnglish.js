import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Api from '../../../Api';
import Web3 from "web3"
import contract_artifact from "../../../contracts/EnglishAuction.json"
import Typography from '@material-ui/core/Typography';
import NotFound from '../../global/NotFound.js'
import Util from '../../../util.js';

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
  const [withdrawEvents, setWithdrawEvents] = useState(null);

  function onWithdrawEvent(wError, wEvent) {
    if (wError) {
      console.log("wError", wError)
      return
    }
    // ik that there's a filter passed to the subscription creator, but it strait up doesn't work, probably because Javascript is a shit language
    if (wEvent.returnValues.withdrawer !== user.wallet) { return }
    console.log("wEvent", wEvent)
    setWithdrawEvents([wEvent])
  }

  function getDjangoData() {
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

  function getEthData() {
    if (!contract) { return }
    const withdrawSub = contract.events.WithdrawalEvent({ filter: { withdrawer: user.wallet } }, onWithdrawEvent)
    contract.getPastEvents('BidEvent', { fromBlock: "earliest" }).then(be => {
      console.log("bidEvents",be)
      if (be.length === 0) {//no bids
        setHighestBid(0)
        setUserBid(0)
        return
      }
      const highestBid = be[be.length - 1].returnValues.bid / 1e18
      setHighestBid(highestBid)

      const myBids = be.filter(b => b.returnValues.bidder === user.wallet)
      if (myBids.length === 0) {//no user bids
        setUserBid(0)
      } else {
        const lastBid = myBids[myBids.length - 1].returnValues.bid / 1e18
        setUserBid(lastBid)
      }
      console.log("be all", be)
      console.log("be filter", myBids)
      console.log("highestBid", highestBid)
    })

    contract.getPastEvents('WithdrawalEvent', { fromBlock: "earliest" })
      .then(wea => {
        const myWEvents = wea.filter(we => we.returnValues.withdrawer === user.wallet)
        setWithdrawEvents(myWEvents)
        console.log("we filter", myWEvents)
      })

    return function cleanup() {
      withdrawSub.unsubscribe()
    }
  }

  useEffect(getDjangoData, [auction_pk, token, loadTime]);
  useEffect(getEthData, [contract]);

  const withdrawFunds = () => {
    const noBidStr = "revert You have no bid to withdraw";
    const winnerStr = "revert You won, you cannot withdraw funds";
    if (Array.isArray(withdrawEvents) && withdrawEvents.length > 0) { alert("You've already withdrawn your funds"); return}
    if (userBid === 0 && user.user_id !== auctionOwner) {alert("You didn't participate in this auction"); return}
    if (userBid === highestBid){alert("You Won! congrats! TODO: IMPLIMENT SHIPPING"); return}
    contract.methods.withdraw().send({ from: user.wallet, gas: 500000 })
      .then(res => {
        alert("Eth successfuly withdrawn")
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
      {(auctionNotFound) ? <NotFound type={"Auction"} identifier={auction_pk}></NotFound> : null}
      <Typography variant="h2">English auction ended for: {itemDescription}</Typography>
      <Typography>Winning Bid: {highestBid} eth</Typography>
      <Typography>End Time: {endTime.toLocaleString()}</Typography>
      {(user && user.user_id !== auctionOwner) ?
        <BidderView
          winningBid={highestBid}
          userBid={userBid}
          withdrawFunds={withdrawFunds}>
        </BidderView>
        :
        <AuctioneerView itemDescription={itemDescription}
          withdrawWinnings={withdrawFunds}>
        </AuctioneerView>
      }
    </div>
  )
}

function AuctioneerView(props) {
  const { withdrawWinnings, } = props;
  return (
    <>
      <Button onClick={withdrawWinnings}>Withdraw Winnings</Button>
    </>
  )
}

function BidderView(props) {
  const { withdrawFunds, userBid, winningBid } = props;
  return (
    <>
      <Typography>Your Bid: {userBid} eth {(userBid === winningBid) ? "☜(ﾟヮﾟ☜) You're the winner!" : null}</Typography>
      <Button onClick={withdrawFunds}>Withdraw Funds</Button>
    </>
  )

}
