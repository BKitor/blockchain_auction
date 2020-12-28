import { Button, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Api from '../Api';
import Web3 from "web3"
import contract_artifact from "../../src/contracts/SealedBid.json"
import Typography from '@material-ui/core/Typography';
import Error404 from '../components/Error404.js'

export default function PlaceSealedBid() {
    let { auction_pk } = useParams();
    const [token, setToken] = useState(window.localStorage.getItem('user_token'));
    const [minBid, setMinBid] = useState('loading...');
    const [itemDescription, setItemDiscription] = useState('loading...');
    const [endTime, setEndTime] = useState(new Date());
    const [userID, setUserID] = useState('');
    const [userBid, setUserBid] = useState(0);
    const [web3,] = useState(new Web3("http://localhost:8545"));
    const [contract, setContract] = useState(null);
    const [auctionNotFound, setNotFound] = useState(false);
    const [auctionOwner, setAuctionOwner] = useState(null);
    const [userWallet, setUserWallet] = useState("");

    useEffect(() => {
        function checkSignedIn() {
            if (window.localStorage.getItem('user_token')) {
                const u = JSON.parse(window.localStorage.getItem('user'));
                setUserID(u.user_id)
                setToken(window.localStorage.getItem('user_token'))
                setUserWallet(u.wallet)
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
                    setContract(new web3.eth.Contract(contract_artifact.abi, res.data.auction_id))
                    setAuctionOwner(res.data.owner);
                }).catch(e => {
                    if (e.response && e.response.status === 404) {
                        setNotFound(true);
                    }
                    console.error(e);
                })
        }
        checkSignedIn();
        getAuctionInfo();
    }, [auction_pk, web3.eth.Contract, token]);

    const handleBidChange = (e) => {
        console.log(e)
        if (isNaN(e.target.value)) {
            setUserBid(0);
        }
        else {
            setUserBid(e.target.value)
        }
    }
    const submitSealedBid = () => {
        if (userBid === 0) {
            console.log("not happening cheif")
        } else {
            contract.methods.bid().send({ from: userWallet, value: userBid * Math.pow(10, 18), gas: 500000 })
                .then(res => console.log(res))
                .catch(err => console.error(err))
        }
    }

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            {(auctionNotFound) ?
                <Error404 type={"Auction"} identifier={auction_pk}></Error404>
                :
                (userID !== auctionOwner) ?
                    <BidderView itemDescription={itemDescription}
                        minBid={minBid}
                        endTime={endTime}
                        handleBidChange={handleBidChange}
                        submitSealedBid={submitSealedBid}></BidderView>
                    :
                    <AuctioneerView itemDescription={itemDescription}
                        minBid={minBid}
                        endTime={endTime}></AuctioneerView>
            }
        </div>
    )
}

function AuctioneerView(props) {
    const { itemDescription, minBid, endTime } = props;
    return (
        <>
            <Typography>Item : {itemDescription}</Typography>
            <Typography>Minimum Bid: {minBid}</Typography>
            <Typography>End Time: {endTime.toLocaleString()}</Typography>
        </>
    )
}

function BidderView(props) {
    const { itemDescription, minBid, endTime, handleBidChange, submitSealedBid } = props;
    return (
        <>
            <Typography variant="h2">Place Bid on: {itemDescription}</Typography>
            <br style={{ padding: '50px' }}></br>
            <Typography variant="h4">Minimum Bid: {minBid} </Typography>
            <Typography variant="h4">End Time: {endTime.toLocaleString()} </Typography>
            <br style={{ padding: '50px' }}></br>
            <TextField onChange={handleBidChange} placeholder='Bid ammount'></TextField>
            <Button onClick={submitSealedBid}>Place Bid</Button>
            <br style={{ padding: '50px' }}></br>
        </>
    )

}