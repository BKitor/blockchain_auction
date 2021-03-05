import { Button, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import Typography from '@material-ui/core/Typography';
import Api from '../Api';
import Util from '../util.js';

// English with a 'buy now' button
export default function Channel() {
  const [token, user] = Util.checkSignedIn();
  const [startingBid, setStartingBid] = useState(0);
  const [buyNowPrice, setBuyNowPrice] = useState(0);
  const [itemDescription, setItemDescription] = useState('');
  const [endTime, onChange] = useState(new Date());

  const handleStartingBidChange = e => {
    setStartingBid((isNaN(e.target.value)) ? 0 : e.target.value)
  }

  const handleBuyNowPriceChange = e => {
    setBuyNowPrice((isNaN(e.target.value))?0:e.target.value);
  }

  const handleItemDescription = (e) => {
    setItemDescription(e.target.value);
  }

  const submitChannel = () => {
    if (itemDescription === '' || buyNowPrice === 0 || startingBid === 0) {
      window.alert("Invalid Inputs")
    } else {
      const body = {
        owner: parseInt(user.user_id),
        end_time: endTime.toISOString(),
        auction_id: "",
        item_description: itemDescription,
        min_bid: parseInt(startingBid),
        buy_now_price: buyNowPrice
      }
      Api.auctions.newChannel(body, token).then(res => {
        return Promise.all([
          Api.auctions.launchChannel(res.data.id, token),
          Promise.resolve(res)
        ])
      }).then(([lres, cres]) => {
        window.location = `/place/channel/${cres.data.id}`
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
    return (!user && !token) ? <Redirect to='/signin' /> : null;
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {isLoggedIn()}
      <Typography variant="h3">Create a new Channel Auction</Typography>
      <TextField onChange={handleStartingBidChange} placeholder='Starting Bid'></TextField>
      <br style={{ padding: '50px' }}></br>
      <TextField onChange={handleBuyNowPriceChange} placeholder='BuyNowPrice'></TextField>
      <br style={{ padding: '50px' }}></br>
      <TextField onChange={handleItemDescription} placeholder='Item Description'></TextField>
      <br style={{ padding: '50px' }}></br>
      <DateTimePicker
        onChange={onChange}
        value={endTime}
      />
      <br style={{ padding: '50px' }}></br>
      <Button onClick={submitChannel}>Create new Channel</Button>

    </div>
  )
}