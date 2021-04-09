import React from 'react';
import { Typography } from '@material-ui/core';
import '../../styles/global.css';
import { Link } from 'react-router-dom';

// TODO: Update text
const topText = "An auction in which the auctioneer begins with a high asking price in the case of selling, and lowers it until some participant accepts the price, or it reaches a predetermined reserve price.";
const workflowText = "A Dutch auction initially offers an item at a price in excess of the amount the seller expects to receive. The price lowers in steps until a bidder accepts the current price. That bidder wins the auction and pays that price for the item. For example, a business might auction a used company car at a starting bid of $15,000. If nobody accepts the initial bid, the seller successively reduces the price in $1,000 increments. When the price reaches $10,000, a particular bidder—who feels that price is acceptable and that someone else might soon bid—quickly accepts the bid, and pays $10,000 for the car. Dutch auctions are a competitive alternative to a traditional auction, in which customers make bids of increasing value until nobody is willing to bid higher.";

export default function AboutDutchBid() {
  return (
    <div className="about">
      <div className="title page-title">
        <Typography variant="h4">About Dutch Bid Auctions</Typography>
      </div>

      <div className="grey-container">
        <div className="about-title">
          <Typography variant="h5">What is a Dutch Bid Auction?</Typography>
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