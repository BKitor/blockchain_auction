// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

import "./Auction.sol";

contract ChannelAuction is Auction{

    //If we want it to be a legitimate channel auction, 
    //ChannelAuction will need additional parameters like the rate at which the price is lowered 
    //How much is the value being decremented by and how often is the decrement taking place?
    //Alternatively, we can have a static buy now price (like ebay or games like FIFA)
    
    uint256 public buyNowPrice;

    constructor (address payable _owner, uint _biddingTime, uint _startBid, uint _buyNowPrice) {
        auctionOwner = _owner;
        auctionStart = block.timestamp; 
        auctionEnd = auctionStart + _biddingTime * 1 minutes;
        minPrice = _startBid;
        ongoingAuction = true;
        buyNowPrice = _buyNowPrice;
    }

    function bid() public payable ongoing_auction override returns (bool) {
        require(bids[msg.sender] + msg.value > highestBid, "Bid too low.");
        
        if(bids[msg.sender] == 0){
            bidders.push(msg.sender);
        }   

        bids[msg.sender] = bids[msg.sender] + msg.value;

        highestBidder = msg.sender;
        highestBid = bids[msg.sender];

        emit BidEvent(highestBidder, highestBid);
        return true;
    }

    function buy_now() public payable ongoing_auction returns (bool) {
        require(msg.value >= buyNowPrice, "Sent less than buy now price.");

        ongoingAuction = false; 

        highestBidder = 0x638Ba56Adef3c8235ba7fC2a907f4ddb763Be608;       //setting to TEMP PLACEHOLDER VAL so prev. highest bidder can still withdraw and winner by buy_now can withdraw past bids
        highestBid = msg.value;

        emit BuyEvent(highestBidder, highestBid);
        return true;
    }

    event BuyEvent(address indexed buyer, uint256 price);

}