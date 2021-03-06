const Auction = artifacts.require("./Auction.sol");
const SealedBid = artifacts.require("./SealedBid.sol")
const Channel = artifacts.require("./ChannelAuction.sol")
const { time } = require('@openzeppelin/test-helpers');
const { assert } = require('chai');

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('SealedBid', (accounts) => {
	let auction, sealedBid

	before(async () => {
		auction = await Auction.new()
		sealedBid = await SealedBid.new(accounts[0], 1, 75)
	})

	describe('Auction Deployment', async () => {
		it('has an owner', async () => {
			const owner_address = await sealedBid.get_owner()
			assert.equal(owner_address.toString(), accounts[0])
		})
	})

	describe('During Auction Functionality', async () => {
		it('can be bid on', async () => {
			await sealedBid.bid({ from: accounts[1], value: 100 })
			const bid = await sealedBid.get_bid({ from: accounts[1] })
			assert.equal(bid, 100)
		})
		it('allows bids below current max bid', async () => {
			await sealedBid.bid({ from: accounts[2], value: 80 })
			const bid = await sealedBid.get_bid({ from: accounts[2] })
			assert.equal(bid, 80)
		})
		it('does not allow insufficient bids', async () => {
			await sealedBid.bid({ from: accounts[3], value: 50}).should.be.rejected;
		})
		it('does not allow withdrawals from auction in progress', async () => {
			await sealedBid.withdraw({ from: accounts[1] }).should.be.rejected;
		})
		it('cannot be destructed while in progress', async () => {
			await sealedBid.destruct_auction({from: accounts[0]}).should.be.rejected;
		})
	})

	describe('Post Auction Fucntionality', async () => {
		it('can no longer be bid on', async () => {
			await time.increase(100);
			await sealedBid.bid({ from: accounts[1], value: 100 }).should.be.rejected;
		})
		it('can identify winning bid', async () => {
			const highest_bidder = await sealedBid.get_highest_bidder({ from: accounts[0] });
			assert.equal(highest_bidder, accounts[1]);
		})
		it('allows users to withdraw', async () => {
			await sealedBid.withdraw({from: accounts[2]})
			const withdrawn = await sealedBid.get_withdrawn({ from: accounts[2] })
			assert.equal(withdrawn, true)
		})
		it('does not allow winner to withdraw', async () => {
			await sealedBid.withdraw({from: accounts[1]}).should.be.rejected;
		})
		it('cannot be destroyed by non-owner', async () => {
			await sealedBid.destruct_auction({from: accounts[1]}).should.be.rejected;
		})
		//it('can be destroyed by owner', async () => {
		//	await sealedBid.destruct_auction({from: accounts[0]})
		//})
	})
})