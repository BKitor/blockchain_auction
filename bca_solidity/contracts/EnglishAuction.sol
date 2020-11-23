pragma solidity ^0.7.5;

import "./Auction.sol";

contract EnglishAuction is Auction{

	constructor (uint _biddingTime, address payable _owner, string memory _itemName, uint _minBid) public {
		auction_owner = _owner;
		auction_start = block.timestamp; 
		auction_end = auction_start + _biddingTime * 1 minutes;
		STATE = auction_state.STARTED;
		auction_item.item_name = _itemName;
		minimum_price = _minBid;
	}

    function bid() public payable ongoing_auction override returns (bool) {
        require(bids[msg.sender] + msg.value > highestBid, "Bid too low.");
        require(block.timestamp < auction_end, "Auction ended.");
        highestBidder = msg.sender; 
        highestBid = bids[msg.sender] + msg.value; 
        bidders.push(msg.sender);
        bids[msg.sender] = bids[msg.sender] + msg.value;
        emit BidEvent(highestBidder, highestBid);
        return true; 
    }
}