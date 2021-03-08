// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

import "./Auction.sol";

contract SqueezeAuction is Auction{
    
    uint public rate;
    uint public startPrice;

    constructor (address payable _owner, uint _biddingTime, uint _startLow, uint _startHigh, uint _rate) {
        auctionOwner = _owner;
        auctionStart = block.timestamp; 
        auctionEnd = auctionStart + _biddingTime * 1 minutes;
        minPrice = _startLow;
        ongoingAuction = true;
        startPrice = _startHigh;
        rate = _rate;
    }

    function bid() public payable ongoing_auction override returns (bool) {
        require(bids[msg.sender].value + msg.value > highestBid, "Bid too low.");
        
        if(bids[msg.sender].value == 0){
            bidders.push(msg.sender);
            bids[msg.sender] = Bid(msg.value, false);
        } else {
            bids[msg.sender].value = bids[msg.sender].value + msg.value;
        }

        highestBidder = msg.sender;
        highestBid = bids[msg.sender].value;

        emit BidEvent(highestBidder, highestBid);
        return true;
    }

    function bid_high() public payable ongoing_auction returns (bool) {
        // $ - dt(s) * m/s * $/m
        require(msg.value + bids[msg.sender].value >= startPrice - (rate * (block.timestamp - auctionStart)/60) || minPrice >= startPrice - (rate * (block.timestamp - auctionStart)/1 minutes), "bad rate calc revert");
        require(msg.value >= minPrice, "min price revert");

        highestBid = msg.value;
        highestBidder = msg.sender;

        bidders.push(msg.sender);
        bids[msg.sender] = Bid(msg.value, false);

        ongoingAuction = false;

        emit BidEvent(highestBidder, highestBid);
        return true;
    }

}