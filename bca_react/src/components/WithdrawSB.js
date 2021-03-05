import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Api from '../Api';
import Web3 from "web3"
import contract_artifact from "../contracts/SealedBid.json"
import Typography from '@material-ui/core/Typography';
import Error404 from './Error404.js'
import Util from '../util.js';

export default function WithdrawSealedBid() {
  let { auction_pk } = useParams();
  const [token, user] = Util.checkSignedIn();
  const [loadTime,] = useState(new Date());

  const [itemDescription, setItemDiscription] = useState('loading...');
  const [endTime, setEndTime] = useState(new Date());
  const [contract, setContract] = useState(null);
  const [auctionNotFound, setNotFound] = useState(false);
  const [auctionOwner, setAuctionOwner] = useState(null);
  const [auctionIsOver, setAuctionIsOver] = useState(true);

  useEffect(() => {
    const web3 = new Web3(Util.bcURL)
    Api.auctions.getSealedBidByPK(auction_pk, token)
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
  }, [auction_pk, token, loadTime]);

  const withdrawFunds = () => {
    const noBidStr = "revert You have no bid to withdraw";
    const winnerStr = "revert You won, you cannot withdraw funds";
    const stillOpenStr = "Auction still open. Cannot withdraw";
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
        else if(err.stack.includes(stillOpenStr)){
          alert("You're probably seeing this cause Ganache is dumb, I swear this won't happen in prod")
        }
      })

  }

  function userIsSignedIn() {
    return (!token && !user) ? < Redirect to='/signin' /> : null;
  }

  function auctionIsLive() {
    return (auctionIsOver) ? null : (
      <Redirect to={`/place/sealed-bid/${auction_pk}`} />
    )
  }

  function withdrawWinnings(){
    alert("TODO:THIS NEEDS TO BE IMPLIMENTED")
    return
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
            withdrawFunds={withdrawFunds}></BidderView>
          :
          <AuctioneerView itemDescription={itemDescription}
            endTime={endTime}
            withdrawWinnings={withdrawWinnings}>
            </AuctioneerView>
      }
    </div>
  )
}

function AuctioneerView(props) {
  const { itemDescription, withdrawWinnings, endTime } = props;
  return (
    <>
      <Typography>Item : {itemDescription}</Typography>
      <Typography>End Time: {endTime.toLocaleString()}</Typography>
      <Button onClick={withdrawWinnings}>Withdraw Winnings</Button>
    </>
  )
}

function BidderView(props) {
  const { itemDescription, endTime, withdrawFunds } = props;
  return (
    <>
      <Typography variant="h2">Sealed Bid ended for: {itemDescription}</Typography>
      <br style={{ padding: '50px' }}></br>
      <Typography variant="h4">End Time: {endTime.toLocaleString()} </Typography>
      <br style={{ padding: '50px' }}></br>
      <Button onClick={withdrawFunds}>Withdraw Funds</Button>
      <br style={{ padding: '50px' }}></br>
    </>
  )

}
