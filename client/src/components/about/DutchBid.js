import React from 'react';
import { Typography } from '@material-ui/core';
import '../../styles/global.css';
import { Link } from 'react-router-dom';

// TODO: Update text
const topText = "Blah blah blah";
const workflowText = "Blah blah";

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