const Auction = artifacts.require("./Auction.sol");
const English = artifacts.require("./EnglishAuction.sol")
const { time } = require('@openzeppelin/test-helpers');
const { assert } = require('chai');

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('English', (accounts)=> {
	let auction, english

	before(async () => {
		auction = await Auction.new()
		english = await English.new(accounts[0], 1, 75)
	})

	describe('Auction Deployment', async () => {
		it('has an owner', async () => {
			const owner_address = await english.get_owner()
			assert.equal(owner_address.toString(), accounts[0])
		})
	})

	describe('During Auction Functionality', async () => {
		it('can be bid on', async () => {
			await english.bid({ from: accounts[1], value: 100 })
			const bid = await english.get_bid({ from: accounts[1] })
			assert.equal(bid, 100)
		})
		it('does not allow bids below current max bid', async () => {
			await english.bid({ from: accounts[2], value: 80 }).should.be.rejected;
		})
		it('allows for max bid to be outbid', async () => {
            await english.bid({ from: accounts[3], value: 150})
            const bid = await english.get_bid({ from: accounts[3] })
            assert.equal(bid, 150)
		})
		it('does not allow withdrawals from auction in progress', async () => {
			await english.withdraw({ from: accounts[1] }).should.be.rejected;
		})
		it('cannot be destructed while in progress', async () => {
			await english.destruct_auction({from: accounts[0]}).should.be.rejected;
		})
	})

	describe('Post Auction Fucntionality', async () => {
		it('can no longer be bid on', async () => {
			await time.increase(100);
			await english.bid({ from: accounts[1], value: 100 }).should.be.rejected;
		})
		it('can identify winning bid', async () => {
			const highest_bidder = await english.get_highest_bidder({ from: accounts[0] });
			assert.equal(highest_bidder, accounts[3]);
		})
		it('allows users to withdraw', async () => {
			await english.withdraw({from: accounts[1]})
			const bid = await english.get_bid({ from: accounts[1] })
			assert.equal(bid, 0)
		})
		it('does not allow winner to withdraw', async () => {
			await english.withdraw({from: accounts[1]}).should.be.rejected;
		})
		it('cannot be destroyed by non-owner', async () => {
			await english.destruct_auction({from: accounts[1]}).should.be.rejected;
		})
		//it('can be destroyed by owner', async () => {
		//	await english.destruct_auction({from: accounts[0]})
		//})
	})
})