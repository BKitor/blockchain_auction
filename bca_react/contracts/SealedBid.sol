pragma solidity ^0.7.5;

import "./Auction.sol";

contract SealedBid is Auction{

	constructor (uint _biddingTime, address payable _owner, uint _minBid) public {
		auction_owner = _owner;
		auction_start = block.timestamp; 
		auction_end = auction_start + _biddingTime * 1 minutes;
		STATE = auction_state.STARTED;
		minimum_price = _minBid;
	}

	function bid() public payable ongoing_auction override returns (bool) {
		require(block.timestamp < auction_end, "Auction Ended");
		require(bids[msg.sender] + msg.value > minimum_price, "Bid too low");
		bidders.push(msg.sender);
		bids[msg.sender] = bids[msg.sender] + msg.value;

		//Note: highestBid and highestBidder are public (bc of other auction types), so this may not be the most secure 
		if(bids[msg.sender] > highestBid){
			highestBid = bids[msg.sender];
			highestBidder = msg.sender;
		}

		emit BidEvent(msg.sender, bids[msg.sender]);
		return true;
	}

	function end() public admin returns (bool) {
		//this function is just for dev purposes
		auction_end = block.timestamp - 1;
		return true;
	}

}