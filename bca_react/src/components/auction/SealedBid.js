import { Button, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import Api from '../../Api';
import Util from '../../util.js';
import '../../styles/auctions.css';
import { Link } from 'react-router-dom';

const sealedBidText = "A sealed-bid auction is a type of auction process in \
  which all bidders simultaneously submit sealed bids to the auctioneer so that \
  no bidder knows how much the other auction participants have bid."

export default function SealedBid() {
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

  const submitSealedBid = () => {
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
      Api.auctions.newSealedBid(body, token).then(res => {
        Api.auctions.launchSealedBid(res.data.id, token)
        window.location = `/place/sealed-bid/${res.data.id}`
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
      <div className="title page-title">
        <Typography variant="h4">Sealed Bid</Typography>
      </div>
      <div className="auction-container">
        {/* Left Side - Auction Creation Dialog */}
        <div className="auction-left">
          <div className="title page-title">
            <Typography variant="h4">Create a Sealed Bid</Typography>
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

            <Button className="auction-button" onClick={submitSealedBid}>Create new Sealed Bid!</Button>
          </div>
        </div>

        {/* Right Side - About the type of bid */}
        <div className="auction-right">
          <div className="title page-title">
            <Typography variant="h4">What is a Sealed Bid?</Typography>
            </div>
            <div className="grey-container auction-box">
              <p>
                {sealedBidText}
              </p>
          <p>
            Read more information about sealed bids <a href="/about/sealed-bid">here!</a>
          </p>
          </div>
        </div>
      </div>
      <br/>
      <br/>
      <br/>
      <div className="back">
        <Typography variant="h6"><Link to="/auctions">&#8592; Auctions</Link></Typography>
      </div>
    </div>
  )
}