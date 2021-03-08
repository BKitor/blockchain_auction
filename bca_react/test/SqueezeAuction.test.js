const Auction = artifacts.require("./Auction.sol");
const Squeeze = artifacts.require("./SqueezeAuction.sol")
const { time } = require('@openzeppelin/test-helpers');
const { assert } = require('chai');

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Squeeze', (accounts)=> {
	let auction, squeeze_bid, squeeze_buy, squeeze_nobid

	before(async () => {
        //auction = await Auction.new()
        
        //creating 3 seperate instances of contract to test what happens to a contract that a bidder wins, a buyer wins, and also a contract that expires
        squeeze_bid = await Squeeze.new(accounts[0], 1, 75, 1000, 1)
        squeeze_buy = await Squeeze.new(accounts[0], 1, 75, 1000, 1)
        squeeze_nobid = await Squeeze.new(accounts[0], 1, 75, 1000, 1)
	})

	describe('Auction Deployment', async () => {
		it('has an owner', async () => {
            const owner_address_bid = await squeeze_bid.get_owner()
            assert.equal(owner_address_bid.toString(), accounts[0])
		})
	})

	describe('During Auction Functionality', async () => {

        it('can be bid on', async () => {
            await squeeze_bid.bid({from: accounts[3], value: 100})
            await squeeze_buy.bid({from: accounts[3], value: 100})
        })
        it('does not allow bids below current bid', async () => {
            await squeeze_bid.bid({ from: accounts[2], value: 10 }).should.be.rejected;
        })
        it('allows bids above highest bid', async () => {
            await squeeze_bid.bid({ from: accounts[1], value: 200 })
		})
		it('does not allow withdrawals while in progress', async () => {
            await squeeze_bid.withdraw({ from: accounts[1] }).should.be.rejected;
		})
		it('cannot be destructed while in progress', async () => {
			await squeeze_bid.destruct_auction({from: accounts[0]}).should.be.rejected;
        })
        it('can be won via high bid', async () => {
            await time.increase(0.1);
			await squeeze_buy.bid_high({from: accounts[1], value: 99900})
        })
	})

	describe('Post Auction Fucntionality', async () => {
		it('auction ended via bid can no longer be bid on', async () => {
            await time.increase(100);
			await squeeze_bid.bid({ from: accounts[3], value: 100 }).should.be.rejected;
        })
        it('auction ended via time can no longer be bid on', async () => {
			await time.increase(100);
			await squeeze_nobid.bid({ from: accounts[1], value: 100 }).should.be.rejected;
        })
        it('auction ended via high_bid can no longer be bid on', async () => {
			await squeeze_buy.bid({ from: accounts[1], value: 100 }).should.be.rejected;
		})
		it('auction ended via bid can identify winning bid', async () => {
			const highest_bidder = await squeeze_bid.get_highest_bidder({ from: accounts[0] });
			assert.equal(highest_bidder, accounts[1]);
        })
        it('auction ended via high_bid can identify buyer', async () => {
			const highest_bidder = await squeeze_buy.get_highest_bidder({ from: accounts[0] });
			assert.equal(highest_bidder, accounts[1]);
		})
		it('does not allow winners to withdraw', async () => {
            await squeeze_bid.withdraw({from: accounts[1]}).should.be.rejected;
            await squeeze_buy.withdraw({from: accounts[1]}).should.be.rejected;
        })
        it('allows bidder who did not win to withdraw', async () => {
            await squeeze_bid.withdraw({from: accounts[3]})
            await squeeze_buy.withdraw({from: accounts[3]})
		})
		it('cannot be destroyed by non-owner', async () => {
			await squeeze_bid.destruct_auction({from: accounts[1]}).should.be.rejected;
		})
		it('can award winnings to owner', async () => {
            await squeeze_bid.withdraw({from: accounts[0]})
            await squeeze_buy.withdraw({from: accounts[0]})
		})
		it('prevents owner from withdrawing again', async () => {
            await squeeze_bid.withdraw({from: accounts[0]}).should.be.rejected;
            await squeeze_buy.withdraw({from: accounts[0]}).should.be.rejected;
		})
		it('can be destroyed by owner', async () => {
            await squeeze_bid.destruct_auction({from: accounts[0]})
            await squeeze_buy.destruct_auction({from: accounts[0]})
            await squeeze_nobid.destruct_auction({from: accounts[0]})
		})
	})
})