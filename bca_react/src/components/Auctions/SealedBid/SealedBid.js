import { Button, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import Api from '../../../Api';
import Util from '../../../util.js';
import '../../../styles/react-datepicker.css'

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
    return (!user && !token) ? <Redirect to='/signin' /> : null;
  }

  return (

    <div style={{ textAlign: 'center', padding: '20px' }}>
      {isLoggedIn()}
      <h1>Create a new Sealed Bid</h1>
      <TextField onChange={handleBidChange} placeholder='Minimum Bid'></TextField>
      <br style={{ padding: '50px' }}></br>
      <TextField onChange={handleItemDescription} placeholder='Item Description'></TextField>
      <br style={{ padding: '50px' }}></br>
      <DateTimePicker
        onChange={onChange}
        value={value}
      />
      <br style={{ padding: '50px' }}></br>
      <Button onClick={submitSealedBid}>Create new Sealed Bid!</Button>

    </div>
  )
}