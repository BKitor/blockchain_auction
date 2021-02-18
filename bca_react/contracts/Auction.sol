// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;                //declares compiler version 

contract Auction{                       //defines a contract with name Auction
    //State variable declarations, similar to global variables in other languages 
    struct Bid {
        uint256 value;
        bool withdrawn;
    }

    address payable internal auctionOwner;     //Auction owner's address, where winning bid will be sent
    uint256 public auctionStart;       //Start and end epoch times for auction
    uint256 public auctionEnd;
    uint256 internal highestBid;          //Highest bid amount in wei
    address payable internal highestBidder;       //Ethereum address of highest bidder
    uint256 public minPrice;      //Min. bid for auctions other than Dutch
    bool public ongoingAuction;
    
    address[] bidders;                  //Dynamic array storing bidders addresses
    mapping(address=>Bid) internal bids; //Mapping that maps address of bidder with their bid
    
    modifier ongoing_auction(){
        require(ongoingAuction, "Auction has ended.");
        require(block.timestamp < auctionEnd, "Auction has ended.");
        _;
    }
    
    modifier only_owner(){
        require(msg.sender == auctionOwner);
        _;
    }

    modifier admin(){
        require(msg.sender == msg.sender); //WHEN WE HAVE AN ADMIN ACCOUNT WE WILL PUT THE ADDRESS HERE
        _;
    }
    
    //function payable (){
    //    revert();
    //}

    function get_owner() public view returns(address payable) {
        return auctionOwner;
    }

    function get_bid() public view returns(uint){
        return bids[msg.sender].value;
    }

    function get_withdrawn() public view returns(bool){
        return bids[msg.sender].withdrawn;
    }
    
    function get_num_bidders() public view only_owner returns(uint256) {
        return bidders.length;
    }

    function get_highest_bidder() public view only_owner returns(address payable) {
        return highestBidder;
    }

    function withdraw() public returns (bool) {
        require(block.timestamp > auctionEnd || !ongoingAuction, "Auction still open. Cannot withdraw.");
        require(msg.sender != highestBidder, "You won, you cannot withdraw funds.");
        require(bids[highestBidder].withdrawn == false || msg.sender != auctionOwner, "You have already withdrawn winnings.");
        require(bids[msg.sender].withdrawn == false || msg.sender == auctionOwner, "You have no bid to withdraw.");
        
        uint amount; 
        if(msg.sender == auctionOwner){
            amount = bids[highestBidder].value;
            bids[highestBidder].withdrawn = true;
        } else {
            amount = bids[msg.sender].value;
            bids[msg.sender].withdrawn = true;
        }

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed.");
        
        emit WithdrawalEvent(msg.sender, amount);
        return true;
    }

    function destruct_auction() external only_owner returns (bool) {
        require(block.timestamp > auctionEnd, "Auction still open. Cannot destruct.");
        for (uint i = 0; i < bidders.length; i++){
            require(bids[bidders[i]].withdrawn == true, "All bids have not been withdrawn yet.");
        }
        selfdestruct(auctionOwner); //will be admin eventually
        return true;
    }

    function bid() external payable virtual ongoing_auction returns (bool) {}
    
    event BidEvent(address indexed bidder, uint256 bid);
    event WithdrawalEvent(address withdrawer, uint256 amount);
}
