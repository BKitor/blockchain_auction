import { Button, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Api from '../Api';

export default function PlaceSealedBid() {
    let { auction_pk } = useParams();
    const [minBid, setMinBid] = useState('loading...');
    const [itemDescription, setItemDiscription] = useState('loading...');
    const [endTime, setEndTime] = useState(new Date());
    const [owner, setOwner] = useState('');
    const [userBid, setUserBid] = useState(0);
    const [contractAddr, setContractAddr] = useState('');

    useEffect(() => {
        function checkSignedIn() {
            if (window.localStorage.getItem('user')) {
                setOwner(JSON.parse(window.localStorage.getItem('user')).user_id)
            } else {
                window.location = '/signin'
            }
        }
        function getAuctionInfo() {
            Api.auctions.getAuctionByPK(auction_pk)
                .then(res => {
                    setMinBid(`${res.data.min_bid} eth`);
                    setItemDiscription(`${res.data.item_description}`);
                    setEndTime(new Date(res.data.end_time));
                    setContractAddr(res.data.auction_id);
                })
        }
        checkSignedIn();
        getAuctionInfo();
    }, []);

    const handleBidChange = (e) => {
        if (isNaN(e.target.value)){
            setUserBid(0);
        }
        else{
            setUserBid(e.target.value)
        }
    }
    const submitSealedBid = () => {
        if (userBid == 0){
            alert('Bid is not vallid')
        }else{
            console.log("placing bet")
            // do some spoopy blockchain stuff
        }
    }

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Place Bid on {itemDescription}</h1>
            <br style={{ padding: '50px' }}></br>
            <h1>Minimum Bid: {minBid} </h1>
            <h1>End Time: {endTime.toLocaleString()} </h1>
            <br style={{ padding: '50px' }}></br>
            <TextField onChange={handleBidChange} placeholder='Bid ammount'></TextField>
            <Button onClick={submitSealedBid}>Place Bid</Button>
            <br style={{ padding: '50px' }}></br>
        </div>
    )
}