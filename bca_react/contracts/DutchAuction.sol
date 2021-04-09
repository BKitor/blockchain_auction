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

	function bid() external payable ongoing_auction override returns (bool) {
		// $ - $/m * s * m/s = start_price - rate * Δt * min/sec
		require(msg.value >= startPrice - (rate * (block.timestamp - auctionStart)/1 minutes) || minPrice >= startPrice - (rate * (block.timestamp - auctionStart)/1 minutes), "Bid to low, wait a bit longer");
		require(msg.value >= minPrice, "Price need to be below min price");

		highestBid = msg.value;
		highestBidder = msg.sender;

		bidders.push(msg.sender);
		bids[msg.sender] = Bid(msg.value, false);

		ongoingAuction = false;
		// auctionEnd = block.timestamp;

		emit BidEvent(highestBidder, highestBid);
		return true;
	}
}