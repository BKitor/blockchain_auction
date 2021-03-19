import React from 'react';
import { Typography } from '@material-ui/core';
import '../../styles/global.css';
import { Link } from 'react-router-dom';

// TODO: Update text
const topText = "A sealed bid is a type of auction that is used when there is significant interest in a item from competing buyers. It is most often found when the market is up, and is a way for sellers to receive multiple offers before settling on a final price and choosing a winner. ";
const workflowText = "In a sealed-bid auction, bidders can only submit one sealed bid and therefore cannot adjust their bids based on competing bids. This sets it apart from the more common English auction, also known as the open ascending price auction, where participants can make multiple bids and bid against each other. A sealed-bid auction process may also not be as transparent as an English auction. The seller retains a tremendous amount of control in a sealed-bid auction because they can see how each bidder values the property up for sale. Sealed-bid auctions are generally used in bidding for government contracts.";

export default function AboutSealedBid() {
  return (
    <div className="about">
      <div className="title page-title">
        <Typography variant="h4">About Sealed Bid Auctions</Typography>
      </div>

      <div className="grey-container">
        <div className="about-title">
          <Typography variant="h5">What is a Sealed Bid Auction?</Typography>
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