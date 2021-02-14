pragma solidity ^0.7.5;

import "./Auction.sol";

contract SealedBid is Auction{

	constructor (address payable _owner, uint _biddingTime, uint _minBid) public {
		auctionOwner = _owner;
		auctionStart = block.timestamp; 
		auctionEnd = auctionStart + _biddingTime * 1 minutes;
		minPrice = _minBid;
		ongoingAuction = true;
	}

	function bid() public payable ongoing_auction override returns (bool) {
		require(bids[msg.sender].value + msg.value > minPrice, "Bid too low");
		
		if(bids[msg.sender].value == 0){
			bidders.push(msg.sender);
			bids[msg.sender] = Bid(msg.value, false);
		} else {
			bids[msg.sender].value = bids[msg.sender].value + msg.value;
		}		

		//Note: highestBid and highestBidder are public (bc of other auction types), so this may not be the most secure 
		if(bids[msg.sender].value > highestBid){
			highestBid = bids[msg.sender].value;
			highestBidder = msg.sender;
		}

		emit BidEvent(msg.sender, bids[msg.sender].value);
		return true;
	}

}