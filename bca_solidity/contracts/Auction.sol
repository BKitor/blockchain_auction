pragma solidity ^0.5.16;                //declares compiler version 

contract Auction{                       //defines a contract with name Auction
    //State variable declarations, similar to global variables in other languages 
    address payable internal auction_owner;     //Auction owner's address, where winning bid will be sent
    uint256 public auction_start;       //Start and end epoch times for auction
    uint256 public auction_end;
    uint256 public highestBid;          //Highest bid amount in wei
    address public highestBidder;       //Ethereum address of highest bidder
    uint256 public minimum_price;      //Min. bid for auctions other than Dutch

    enum auction_state{                 //Enum representing auction state
        CANCELLED, STARTED
    }
    
    struct item{
        string item_name;
    }
    
    item public auction_item; 
    address[] bidders;                  //Dynamic array storing bidders addresses
    mapping(address=>uint) public bids; //Mapping that maps address of bidder with their bid
    auction_state public STATE;         //Represents auction state, open or closed (cancelled)
    
    modifier ongoing_auction(){
        require(now<=auction_end);
        _;
    }
    
    modifier only_owner(){
        require(msg.sender == auction_owner);
        _;
    }
    
    function get_owner() public view returns(address payable) {
        return auction_owner;
    }
    
    function get_num_bidders() public only_owner returns(uint256) {
        return bidders.length;
    }

    function withdraw() public returns (bool) {
        require(now > auction_end, "Auction still open. Cannot withdraw.");
        require(bids[msg.sender] > 0, "You have no bid to withdraw.");
        uint amount = bids[msg.sender];
        bids[msg.sender] = 0;
        msg.sender.transfer(amount);
        emit WithdrawalEvent(msg.sender, amount);
        return true;
    }

    function destruct_auction() external only_owner returns (bool) {
        require(now > auction_end, "Auction still open. Cannot destruct.");
        for (uint i = 0; i < bidders.length; i++){
            assert(bids[bidders[i]] == 0);
        }
        //selfdestruct removes the contract code from the blockchain and sends
        //all remaining ether to the specified address. This is cheaper than 
        //just sending the funds and leaving the contract as it actually costs 
        //negative gas somehow. 
        selfdestruct(auction_owner);
        return true;
    }

    function bid() public payable ongoing_auction returns (bool) {}
    
    event BidEvent(address indexed highestBidder, uint256 highestBid);
    event WithdrawalEvent(address withdrawer, uint256 amount);
    
}
