const Auction = artifacts.require("./Auction.sol");
const SealedBid = artifacts.require("./SealedBid.sol")

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('SealedBid', (accounts) => {
	let auction, sealedBid

	before(async () => {
		auction = await Auction.new()
		sealedBid = await SealedBid.new(1, accounts[0], 75)
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
			assert.equal(bid, '100')
		})
		it('does not allow insufficient bids', async () => {
			await sealedBid.bid({ from: accounts[2], value: 50}).should.be.rejected;
		})
		it('does not allow withdrawals from auction in progress', async () => {
			await sealedBid.withdraw({ from: accounts[2] }).should.be.rejected;
		})
	})

	describe('Auction Security', async () => {
		it('prevents access to other users bid information', async () => {

		})
		it('prevents access to max. bid information', async () => {

		})
	})

	describe('Post Auction Fucntionality', async () => {
		it('can identify winning bid', async () => {

		})
		it('allows users to withdraw', async () => {

		})
		it('can be destroyed', async () => {
			
		})
	})
})