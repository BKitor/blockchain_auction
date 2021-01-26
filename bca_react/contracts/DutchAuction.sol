pragma solidity ^0.7.5;

import "./Auction.sol";

contract DutchAuction is Auction{
	
	uint public rate;
	uint public startPrice;

	constructor (address payable _owner, uint _biddingTime, uint _startPrice, uint _rate, uint _minBid) public {
		auctionOwner = _owner;
		auctionStart = block.timestamp; 
		auctionEnd = auctionStart + _biddingTime * 1 minutes;
		minPrice = _minBid;
		startPrice = _startPrice;
		rate = _rate;
		ongoingAuction = true;
	}

	function bid() public payable ongoing_auction override returns (bool) {
		require(msg.value >= rate * (block.timestamp - auctionStart));
		require(msg.value >= minPrice);

		highestBid = msg.value;
		highestBidder = msg.sender;

		ongoingAuction = false;

		emit BidEvent(highestBidder, highestBid);
		return true;
	}

}