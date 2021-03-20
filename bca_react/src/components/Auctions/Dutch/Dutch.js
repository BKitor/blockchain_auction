
import { Button, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import Api from '../../../Api';
import Util from '../../../util.js';

const textBoxes = [
  "A Dutch auction is a market structure in which the price of something offered \
  is determined after taking in all bids to arrive at the highest price at which \
  the total offering can be sold. In this type of auction, investors place a bid \
  for the amount they are willing to buy in terms of quantity and price.",

  "A Dutch auction also refers to a type of auction in which the price of an item \
  is lowered until it gets a bid. The first bid made is the winning bid and results \
  in a sale, assuming that the price is above the reserve price. This is in contrast \
  to typical auction markets, where the price starts low and then rise as bidders \
  compete among one another to be the successful buyer."

]
export default function Dutch() {
  const [token, user] = Util.checkSignedIn();
  const [minBid, setMinBid] = useState(0);
  const [startBid, setStartBid] = useState(0);
  const [rate, setRate] = useState(0);
  const [itemDescription, setItemDescription] = useState('');
  const [endTime, onChange] = useState(new Date());

  const handleMinBidChange = e => {
    setMinBid(e.target.value);
  }

  const handleRateChange = e => {
    setRate(e.target.value);
  }

  const handleStartBidChange = e => {
    setStartBid(e.target.value);
  }

  const handleItemDescription = (e) => {
    setItemDescription(e.target.value);
  }

  const submitDutch = () => {
    if (itemDescription === '' || minBid === 0) {
      window.alert("Invalid Inputs")
    } else {
      const body = {
        owner: parseInt(user.user_id),
        end_time: endTime.toISOString(),
        auction_id: "",
        min_bid: parseInt(minBid),
        item_description: itemDescription,
        rate: rate,
        start_price: startBid
      }
      Api.auctions.newDutch(body, token).then(res => {
        Api.auctions.launchDutch(res.data.id, token)
        window.location = `/place/dutch/${res.data.id}`
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
        <Typography variant="h4">Dutch Bid</Typography>
      </div>
      <div className="auction-container">
        {/* Left Side - Auction Creation Dialog */}
        <div className="auction-left">
          <div className="title page-title">
            <Typography variant="h4">Create a Dutch Bid</Typography>
          </div>
          <div className="grey-container auction-box">
            <div className="spacer" />
            <TextField onChange={handleStartBidChange} color="primary" placeholder='Starting Bid'></TextField>
            <div className="spacer" />
            <TextField onChange={handleMinBidChange} color="primary" placeholder='Minimum Bid'></TextField>
            <div className="spacer" />
            <TextField onChange={handleRateChange} color="primary" placeholder='Rate'></TextField>
            <div className="spacer" />
            <TextField onChange={handleItemDescription} placeholder='Item Description'></TextField>
            <div className="spacer" />

            <DateTimePicker
              onChange={onChange}
              value={endTime}
            />
            <div className="spacer" />

            <Button variant='outlined' color='primary' className="auction-button" onClick={submitDutch}>Create a new Dutch Bid!</Button>
          </div>
        </div>

        {/* Right Side - About the type of bid */}
        <div className="auction-right">
          <div className="title page-title">
            <Typography variant="h4">What is a Dutch Bid?</Typography>
          </div>
          <div className="grey-container auction-box">
            <p>
              {
                textBoxes.map(info =>
                (
                  <>
                    A Dutch auction is a market structure in which the price of something offered is determined after taking in all bids to arrive at the highest price at which the total offering can be sold. In this type of auction, investors place a bid for the amount they are willing to buy in terms of quantity and price.
              <br />
                    <br /></>
                ))}
            </p>
          </div>
        </div>
      </div>

      <div className="auction-all">
        <Typography variant="h6">
          <Link to="/auctions">&#8592; View all auctions</Link>
        </Typography>
      </div>
    </div>
  )
}

