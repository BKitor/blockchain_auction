import React from 'react';
import {Typography} from '@material-ui/core';

import '../../styles/global.css';
import '../../styles/about.css';

export default function About() {
    return (
        <div className="about">
        <div className="title">
        <Typography variant="h4">About BlockChain Auctions</Typography>
      </div>

    <div className="about-container">
        <h1>Why use a blockchain auction?</h1>
      <p>
      The best place to run an auction is a decentralized platform so that the owners or the company can have a direct entry to this occurrence. Users can auction off anything on the chain that is available to them. The smart contract takes holds the auctioned asset and thereafter it manages bids associated
    <br/>
    <br/>
    The workflow is as follows:
    <br/>
    <br/>
    Seller is the candidate or the user who creates the auction
    The Seller defines the ownership of the asset to auction contract with the commencement of the auction, thereby activating it.
    The users who take part in the auction bid on the item, and if the amount raises more than the bid amount it is available for withdrawal process.
    At the end of the auction, if the reserve price hits, the winner receives the item. If not then the opposite.
    The digital auction is now becoming a new trend and has global followers who believe that this is the next big thing.
      </p>
      </div>

      {/* TODO: Links to each about page */}
      </div>
    )
}