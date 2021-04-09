import React from 'react';
import { Typography } from '@material-ui/core';
import '../../styles/global.css';
import { Link } from 'react-router-dom';

// TODO: Update text
const topText = "An English auction is a process of selling goods and the most common form of auction. The price starts low and increases as buyers bid for the item until one buyer is left willing to pay a certain amount and a higher bid isn't received during the given time period. The auction is overseen by an auctioneer who announces prices and makes sure all bidders have the opportunity to increase the price they are offering against rival bids. When items are entered for auction a reserve price is usually set and the item won't be sold if a bid doesn't";
const workflowText = "English auctions differ from Dutch auctions because the price goes up rather than down. In a Dutch auction the auctioneer sets a high price and gradually comes down in price until someone wants to buy at that price. The risk here is the waiting game and somebody jumping in before it reaches the price you want to pay.";

export default function AboutEnglishBid() {
  return (
    <div className="about">
      <div className="title page-title">
        <Typography variant="h4">About English Bid Auctions</Typography>
      </div>

      <div className="grey-container">
        <div className="about-title">
          <Typography variant="h5">What is an English Bid Auction?</Typography>
        </div>

        <p>
          {topText}
          <br />
          <br />
          <Typography variant="h6">The workflow is as follows:</Typography>
          <br />
          {workflowText}
          <br />
          <br />
        </p>
      </div>
      <div className="back">
        <Typography variant="h6"><Link to="/about">&#8592; About</Link></Typography>
      </div>
    
    </div>
  )
}