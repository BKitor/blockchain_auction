const Auction = artifacts.require("./Auction.sol");
const Dutch = artifacts.require("./DutchAuction.sol")
const { time } = require('@openzeppelin/test-helpers');
const { assert } = require('chai');

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Dutch', (accounts)=> {
	let auction, dutch_bid, dutch_nobid

	before(async () => {
        auction = await Auction.new()
        
        //creating 2 seperate instances of dutch contract to test what happens to a contract that a bidder wins and also a contract that expires
        dutch_bid = await Dutch.new(accounts[0], 1, 75, 1, 10)
        dutch_nobid = await Dutch.new(accounts[0], 1, 75, 1, 10)
	})

	describe('Auction Deployment', async () => {
		it('has an owner', async () => {
            const owner_address_bid = await dutch_bid.get_owner()
            const owner_address_nobid = await dutch_nobid.get_owner()
            assert.equal(owner_address_bid.toString(), accounts[0])
            assert.equal(owner_address_nobid.toString(), accounts[0])
		})
	})

	describe('During Auction Functionality', async () => {

        //Dutch auction is an auction where price starts high and is gradually lowered until any bidder is willing to pay the amount 

		it('does not allow bids below current price', async () => {
            //Bids below current price option should be rejected (current price option is a function of start price, rate, and time since open)
            
            await dutch_bid.bid({ from: accounts[2], value: 10 }).should.be.rejected;
		})
		it('does not allow withdrawals', async () => {
            await dutch_bid.withdraw({ from: accounts[1] }).should.be.rejected;
		})
		it('cannot be destructed while in progress', async () => {
			await dutch_bid.destruct_auction({from: accounts[0]}).should.be.rejected;
        })
        it('can be won via bid', async () => {
			//Have to figure out rate stuff here, setting way higher than rate to guarrantee succesful bid for testing
			//Should be testing "can be won via bidding EXACTLY at the current price"
			await dutch_bid.bid({from: accounts[1], value: 100000})
        })
	})

	describe('Post Auction Fucntionality', async () => {
		it('auction ended via bid can no longer be bid on', async () => {
			await dutch_bid.bid({ from: accounts[3], value: 100 }).should.be.rejected;
        })
        it('auction ended via time can no longer be bid on', async () => {
			await time.increase(100);
			await dutch_nobid.bid({ from: accounts[1], value: 100 }).should.be.rejected;
		})
		it('auction ended via bid can identify winning bid', async () => {
			const highest_bidder = await dutch_bid.get_highest_bidder({ from: accounts[0] });
			assert.equal(highest_bidder, accounts[1]);
		})
		it('does not allow users to withdraw', async () => {
			await dutch_bid.withdraw({from: accounts[1]}).should.be.rejected;
		})
		it('cannot be destroyed by non-owner', async () => {
			await dutch_bid.destruct_auction({from: accounts[1]}).should.be.rejected;
		})
		it('can award winnings to winner', async () => {
			await dutch_bid.withdraw({from: accounts[0]})
		})
		it('can be destroyed by owner', async () => {
			await dutch_bid.destruct_auction({from: accounts[0]})
		})
	})
})