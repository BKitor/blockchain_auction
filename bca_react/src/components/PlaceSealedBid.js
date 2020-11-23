import { Button, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Api from '../Api';

export default function PlaceSealedBid() {
    // const [owner, setOwner] = useState('');

    // const [minBid, setMinBid] = useState(0);
    // const [itemDescription, setItemDescription] = useState('');
    // const [value, onChange] = useState(new Date());

    // useEffect(() => {
    //     function checkSignedIn() {
    //         if (window.localStorage.getItem('user')) {
    //             setOwner(JSON.parse(window.localStorage.getItem('user')).user_id)
    //         } else {
    //             window.location = '/signin'
    //         }
    //     }
    //     checkSignedIn();
    // }, []);

    // const handleBidChange = e => {
    //     setMinBid(e.target.value);
    // }

    // const handleItemDescription = (e) => {
    //     setItemDescription(e.target.value);
    // }

    // const submitSealedBid = () => {
    //     if (itemDescription === '' || minBid === 0) {
    //         window.alert("Invalid Inputs")
    //     } else {
    //         const body = {
    //             owner: parseInt(owner), 
    //             end_time: value.toISOString(),
    //             auction_id: "",
    //             min_bid: parseInt(minBid), 
    //             item_description: itemDescription,
    //         }
    //         Api.auctions.newSealedBid(body).then(res => {
    //             Api.auctions.luanchSealedBid(res.data.id)
    //         }).then(res => {
    //             console.log(res)
    //         })
    //     }
    // }

var minBid = '20';
var itemDescription = "Hockey Stick";

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Place Bid</h1>
            <br style={{ padding: '50px' }}></br>
            <h1>Minimum Bid: {minBid}</h1>
            <br style={{ padding: '50px' }}></br>

            <h1>Item Description: {itemDescription} </h1>
            <br style={{ padding: '50px' }}></br>
        </div>
    )
}