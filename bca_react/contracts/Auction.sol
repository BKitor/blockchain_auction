pragma solidity ^0.7.5;                //declares compiler version 

contract Auction{                       //defines a contract with name Auction
    //State variable declarations, similar to global variables in other languages 
    address payable internal auctionOwner;     //Auction owner's address, where winning bid will be sent
    uint256 public auctionStart;       //Start and end epoch times for auction
    uint256 public auctionEnd;
    uint256 internal highestBid;          //Highest bid amount in wei
    address payable internal highestBidder;       //Ethereum address of highest bidder
    uint256 public minPrice;      //Min. bid for auctions other than Dutch
    bool ongoingAuction;
    
    address[] bidders;                  //Dynamic array storing bidders addresses
    mapping(address=>uint) internal bids; //Mapping that maps address of bidder with their bid
    
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
        return bids[msg.sender];
    }
    
    function get_num_bidders() public view only_owner returns(uint256) {
        return bidders.length;
    }

    function get_highest_bidder() public view only_owner returns(address payable) {
        return highestBidder;
    }

    function withdraw() public returns (bool) {
        require(block.timestamp > auctionEnd, "Auction still open. Cannot withdraw.");
        require(msg.sender != highestBidder, "You won, you cannot withdraw funds.");
        
        uint amount; 
        if(msg.sender == auctionOwner){
            require(bids[highestBidder] > 0, "You have already withdrawn winnings.");
            amount = highestBid;
            bids[highestBidder] = 0;
        } else {
            require(bids[msg.sender] > 0, "You have no bid to withdraw.");
            amount = bids[msg.sender];
            bids[msg.sender] = 0;
        }

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed.");
        
        emit WithdrawalEvent(msg.sender, amount);
        return true;
    }

    function destruct_auction() external only_owner returns (bool) {
        require(block.timestamp > auctionEnd, "Auction still open. Cannot destruct.");
        for (uint i = 0; i < bidders.length; i++){
            require(bids[bidders[i]] == 0, "All bids have not been withdrawn yet.");
        }
        selfdestruct(auctionOwner); //will be admin eventually
        return true;
    }

    function bid() public payable virtual ongoing_auction returns (bool) {}
    
    event BidEvent(address indexed bidder, uint256 bid);
    event WithdrawalEvent(address withdrawer, uint256 amount);
    
}
