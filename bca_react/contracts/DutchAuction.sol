pragma solidity ^0.7.5;

import "./Auction.sol";

contract DutchAuction is Auction{

	//DutchAuction will need additional parameters like the rate at which the price is lowered 
	//How much is the value being decremented by and how often is the decrement taking place
	
	uint256 public current_price;

	constructor (uint _biddingTime, address payable _owner, string memory _itemName, uint _startBid) public {
		auction_owner = _owner;
		auction_start = block.timestamp; 
		auction_end = auction_start + _biddingTime * 1 minutes;
		STATE = auction_state.STARTED;
		auction_item.item_name = _itemName;
		minimum_price = 0;
		current_price = _startBid;
	}

	function bid() public payable ongoing_auction override returns (bool) {
		//Functionality to come
	}

}