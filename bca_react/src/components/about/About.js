import React from 'react';
import { Typography } from '@material-ui/core';
import '../../styles/global.css';

const topText = `The best place to run an auction is a decentralized platform so that 
  the owners or the company can have a direct entry to this occurrence. Users can 
  auction off anything on the chain that is available to them. The smart contract 
  takes holds the auctioned asset and thereafter it manages bids associated`;

const workflowText = `Seller is the candidate or the user who creates the auction 
  The Seller defines the ownership of the asset to auction contract with the commencement 
  of the auction, thereby activating it. The users who take part in the auction bid on 
  the item, and if the amount raises more than the bid amount it is available for 
   withdrawal process.At the end of the auction, if the reserve price hits, the winner 
   receives the item. If not then the opposite. The digital auction is now becoming a new 
   trend and has global followers who believe that this is the next big thing.`;

export default function About() {
  return (
    <div className="about">
      <div className="title page-title">
        <Typography variant="h4">About BlockChain Auctions</Typography>
      </div>

      <div className="grey-container">
        <div className="about-title">
          <Typography variant="h5">What is a Blockchain Auction?</Typography>
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
          <Typography variant="h6">Types of BlockChain Auctions</Typography>
          <ul>
            <li className="auction-list">
              <a href='/about/sealed-bid'>
                Sealed Bid Auction
              </a>
            </li>
            <li className="auction-list">
              <a href='/about/dutch-bid'>
                Dutch Bid Auction
              </a>
            </li>
            <li className="auction-list">
              <a href='/about/english-bid'>
                English Bid Auction
              </a>
            </li>
          </ul>
        </p>
      </div>
    </div>
  )
}