
import { Button, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import Api from '../../Api';
import Util from '../../util.js';
import '../../styles/auctions.css';
import { Link } from 'react-router-dom';

const englsihBidText = "A sealed-bid auction is a type of auction process in \
  which all bidders simultaneously submit sealed bids to the auctioneer so that \
  no bidder knows how much the other auction participants have bid."

export default function English() {
  const [token, user] = Util.checkSignedIn();
  const [minBid, setMinBid] = useState(0);
  const [itemDescription, setItemDescription] = useState('');
  const [value, onChange] = useState(new Date());

  const handleBidChange = e => {
    setMinBid(e.target.value);
  }

  const handleItemDescription = (e) => {
    setItemDescription(e.target.value);
  }

  const submitEnglish = () => {
    if (itemDescription === '' || minBid === 0) {
      window.alert("Invalid Inputs")
    } else {
      const body = {
        owner: parseInt(user.user_id),
        end_time: value.toISOString(),
        auction_id: "",
        min_bid: parseInt(minBid),
        item_description: itemDescription,
      }
      Api.auctions.newEnglish(body, token).then(res => {
        Api.auctions.launchEnglish(res.data.id, token)
        window.location = `/place/english/${res.data.id}`
      }).then(res => {
        console.log(res)
      })
        .catch(err => {
          console.error(err)
          if (err.response && err.response.data) {
            console.log(err.response.data)
          }
        })
    }
  }

  function isLoggedIn() {
    return (!user && !token) ? <Redirect to='/sign-in' /> : null;
  }

  return (
    <div>
      {/* Redirect bad pages */}
      {isLoggedIn()}
      <div className="title">
        <Typography variant="h4">English Bid</Typography>
      </div>
      <div className="auction-container">
        {/* Left Side - Auction Creation Dialog */}
        <div className="auction-left">
          <div className="title">
            <Typography variant="h4">Create an English Bid</Typography>
          </div>
          <div className="grey-container auction-box">
            <div className="spacer" />
            <TextField onChange={handleBidChange} color="primary" placeholder='Minimum Bid'></TextField>
            <div className="spacer" />
            
            <TextField onChange={handleItemDescription} placeholder='Item Description'></TextField>
            <div className="spacer" />
            
            <DateTimePicker
              onChange={onChange}
              value={value}
            />
            <div className="spacer" />

            <Button className="auction-button" onClick={submitEnglish}>Create a new English Bid!</Button>
          </div>
        </div>

        {/* Right Side - About the type of bid */}
        <div className="auction-right">
          <div className="title">
            <Typography variant="h4">What is an English Bid?</Typography>
            </div>
            <div className="grey-container auction-box">
              <p>
              An English Auction, also referred to as an open cry ascending auction, starts by an auctioneer announcing the suggested opening bid or reserve price for the item on sale. The buyers with interest in the item start placing bids on the item on sale, with the auctioneer accepting higher bids as they come.
              <br/>
    <br/>
The buyer with the highest bid at any time is considered the one with a standing bid, which can only be displaced by a higher bid from the floor. If there are no higher bids than the standing bid, the auctioneer announces the winner, and the item is sold to the person with the standing bid at a price equal to their bid. If the reserve price is not met or no buyer places an economically fair bid, the seller can take the item off the market.
          </p>
          </div>
        </div>
      </div>

      <div className="auction-all">
            <Link to="/auctions">&#8592; View all auctions</Link>
      </div>
    </div>
  )
}