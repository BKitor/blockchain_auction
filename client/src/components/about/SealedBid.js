import React from 'react';
import {Typography} from '@material-ui/core';

import '../../styles/global.css';

export default function AboutSealedBid() {
    return (
        <>
        <div className="title">
        <Typography variant="h4">About Sealed Bid Auctions</Typography>
      </div>

      <p>
      A sealed-bid auction is a type of auction process in which all bidders simultaneously submit sealed bids to the auctioneer so that no bidder knows how much the other auction participants have bid.
      </p>

      {/* TODO: Links to each about page */}
      </>
    )
}