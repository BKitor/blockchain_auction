import { Button, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import Api from '../../../Api';
import Util from '../../../util.js';
import '../../../styles/react-datepicker.css'

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
    return (!user && !token) ? <Redirect to='/signin' /> : null;
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {isLoggedIn()}
      <h1>Create a new Dutch Auction</h1>
      <TextField onChange={handleStartBidChange} placeholder='Starting Bid'></TextField>
      <br style={{ padding: '50px' }}></br>
      <TextField onChange={handleMinBidChange} placeholder='Minimum Bid'></TextField>
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
      <Button onClick={submitDutch}>Create new Dutch</Button>

    </div>
  )
}