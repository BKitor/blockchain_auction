import { Button, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import Api from '../Api';

export default function SealedBid() {
    const [owner, setOwner] = useState('');

    const [minBid, setMinBid] = useState(0);
    const [itemDescription, setItemDescription] = useState('');
    const [value, onChange] = useState(new Date());

    useEffect(() => {
        function checkSignedIn() {
            if (window.localStorage.getItem('user')) {
                setOwner(JSON.parse(window.localStorage.getItem('user')).user_id)
            } else {
                window.location = '/signin'
            }
        }
        checkSignedIn();
    }, []);

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
                owner: parseInt(owner), 
                end_time: value.toISOString(),
                auction_id: "",
                min_bid: parseInt(minBid), 
                item_description: itemDescription,
            }
            Api.auctions.newSealedBid(body).then(res => {
                Api.auctions.luanchSealedBid(res.data.id)
            }).then(res => {
                console.log(res)
            })
        }
    }

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
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