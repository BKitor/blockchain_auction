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
}