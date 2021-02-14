pragma solidity ^0.7.5;

import "./Auction.sol";

contract EnglishAuction is Auction{

	constructor (address payable _owner, uint _biddingTime, uint _minBid) public {
		auctionOwner = _owner;
		auctionStart = block.timestamp; 
		auctionEnd = auctionStart + _biddingTime * 1 minutes;
		minPrice = _minBid;
        ongoingAuction = true;
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
}