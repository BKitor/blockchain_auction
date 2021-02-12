// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

import "./Auction.sol";

contract DutchAuction is Auction{
	
	uint public rate;
	uint public startPrice;
	//might want to also add a var for the winning bid here

	constructor (address payable _owner, uint _biddingTime, uint _startPrice, uint _rate, uint _minBid) {
		auctionOwner = _owner;
		auctionStart = block.timestamp; 
		auctionEnd = auctionStart + _biddingTime * 1 minutes;
		minPrice = _minBid;
		startPrice = _startPrice;
		rate = _rate;
		ongoingAuction = true;
	}

	function bid() public payable ongoing_auction override returns (bool) {
		require(msg.value >= startPrice - (rate * (block.timestamp - auctionStart)));
		require(msg.value >= minPrice);

		highestBid = msg.value;
		highestBidder = msg.sender;
		bidders.push(msg.sender);
		bids[msg.sender] = msg.value;

		ongoingAuction = false;

		emit BidEvent(highestBidder, highestBid);
		return true;
	}

	// what's the best way to set this so that it can only be called when an auction is over?
    function getHighestBid() public view returns (uint256){
        return highestBid; 
    }
}