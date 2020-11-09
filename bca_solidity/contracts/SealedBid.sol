pragma solidity ^0.5.16;

import "./Auction.sol";

contract SealedBid is Auction{

	constructor (uint _biddingTime, address payable _owner, string memory _itemName, uint _minBid) public {
		auction_owner = _owner;
		auction_start = now; 
		auction_end = auction_start + _biddingTime * 1 minutes;
		STATE = auction_state.STARTED;
		auction_item.item_name = _itemName;
		minimum_price = _minBid;
	}

	function bid() public payable ongoing_auction returns (bool) {
		require(now < auction_end, "Auction Ended");
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

}