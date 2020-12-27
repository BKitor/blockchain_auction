import { Button, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Api from '../Api';
import Web3 from "web3"
import contract_artifact from "../../src/contracts/SealedBid.json"

export default function PlaceSealedBid() {
    let { auction_pk } = useParams();
    const [token, setToken] = useState(window.localStorage.getItem('user_token'));
    const [minBid, setMinBid] = useState('loading...');
    const [itemDescription, setItemDiscription] = useState('loading...');
    const [endTime, setEndTime] = useState(new Date());
    const [, setOwner] = useState('');
    const [, setOwnerAddr] = useState('');
    const [userBid, setUserBid] = useState(0);
    const [, setContractAddr] = useState('');
    const [web3, ] = useState(new Web3("http://localhost:8545"));
    const [contract, setContract] = useState(null);

    useEffect(() => {
        function checkSignedIn() {
            if (window.localStorage.getItem('user_token')) {
                setOwner(JSON.parse(window.localStorage.getItem('user')).user_id)
                setOwnerAddr(JSON.parse(window.localStorage.getItem('user')).user_id)
                setToken(window.localStorage.getItem('user_token'))
            } else {
                window.location = '/signin'
            }
        }
        function getAuctionInfo() {
            Api.auctions.getAuctionByPK(auction_pk, token)
                .then(res => {
                    setMinBid(`${res.data.min_bid} eth`);
                    setItemDiscription(`${res.data.item_description}`);
                    setEndTime(new Date(res.data.end_time));
                    setContractAddr(res.data.auction_id);
                    setContract(new web3.eth.Contract(contract_artifact.abi, res.data.auction_id))
                }).catch(e=>{
                    alert("There was an issue getting auction info, this might be broken")
                    console.error(e);
                })
        }
        checkSignedIn();
        getAuctionInfo();
    }, [auction_pk, web3.eth.Contract, token]);

    const handleBidChange = (e) => {
        if (isNaN(e.target.value)){
            setUserBid(0);
        }
        else{
            setUserBid(e.target.value)
        }
    }
    const submitSealedBid = () => {
        if (userBid === 0){
        }else{
            const u = "0xD26f38099d8C6378f52bE5ff0cC1b5f4E7da2dC0"
            // contract.methods.bid().estimateGas({from:u}).then(e=>console.log(e))
            contract.methods.bid().send({from:u, value:userBid*Math.pow(10,18), gas:500000})
            .then(res=>console.log(res))
            .catch(err=>console.error(err))
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