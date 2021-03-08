
import { Button, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import Typography from '@material-ui/core/Typography';
import Api from '../../../Api';
import Util from '../../../util.js';

// Channel but the 'buy_now' price drops over time
export default function Squeeze() {
  const [token, user] = Util.checkSignedIn();
  const [startingBid, setStartingBid] = useState(0);
  const [startingBuyNowPrice, setStartingBuyNowPrice] = useState(0);
  const [rate, setRate] = useState(0);
  const [itemDescription, setItemDescription] = useState('');
  const [endTime, onChange] = useState(new Date());

  const handleStartingBidChange = e => {
    setStartingBid((isNaN(e.target.value)) ? 0 : e.target.value)
  }

  const handleStartingBuyNowPriceChange = e => {
    setStartingBuyNowPrice((isNaN(e.target.value))?0:e.target.value);
  }

  const handleRateChange = e => {
    setRate((isNaN(e.target.value))?0:e.target.value);
  }

  const handleItemDescription = (e) => {
    setItemDescription(e.target.value);
  }

  const submitSqueeze = () => {
    if (itemDescription === '' || startingBid === 0 || startingBuyNowPrice === 0 || rate === 0) {
      window.alert("Invalid Inputs")
    } else {
      const body = {
        owner: parseInt(user.user_id),
        end_time: endTime.toISOString(),
        auction_id: "",
        item_description: itemDescription,
        start_low: parseInt(startingBid),
        start_high: parseInt(startingBuyNowPrice),
        rate: rate
      }
      Api.auctions.newSqueeze(body, token).then(res => {
        return Promise.all([
          Api.auctions.launchSqueeze(res.data.id, token),
          Promise.resolve(res)
        ])
      }).then(([lres, cres]) => {
        window.location = `/place/squeeze/${cres.data.id}`
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
      <Typography variant="h3">Create a new Squeeze Auction</Typography>
      <TextField onChange={handleStartingBidChange} placeholder='Starting Bid'></TextField>
      <br style={{ padding: '50px' }}></br>
      <TextField onChange={handleStartingBuyNowPriceChange} placeholder='Starting Buy Price'></TextField>
      <br style={{ padding: '50px' }}></br>
      <TextField onChange={handleRateChange} placeholder='Rate'></TextField>
      <br style={{ padding: '50px' }}></br>
      <TextField onChange={handleItemDescription} placeholder='Item Description'></TextField>
      <br style={{ padding: '50px' }}></br>
      <DateTimePicker
        onChange={onChange}
        value={endTime}
      />
      <br style={{ padding: '50px' }}></br>
      <Button onClick={submitSqueeze}>Create new Squeeze</Button>

    </div>
  )
}