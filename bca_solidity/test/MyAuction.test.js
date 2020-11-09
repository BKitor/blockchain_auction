const Auction = artifacts.require("./Auction.sol");
const MyAuction = artifacts.require("./MyAuction.sol")

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('MyAuction', (accounts) => {
	let auction, myAuction

	before(async () => {
		auction = await Auction.new()
		myAuction = await MyAuction.new(1, accounts[0],'test item')
	})

	describe('Auction Deployment', async () => {
		it('has an owner', async () => {
			const owner_address = await myAuction.get_owner()
			assert.equal(owner_address.toString(), accounts[0])
		})
	})

	describe('Auction Functionality', async () => {
		it('can be bid on', async () => {
			const bid = await myAuction.bid({ from: accounts[1], value: 200 })
			const max_bid = await myAuction.highestBid()
			const highestBidder = await myAuction.highestBidder()
			assert.equal(max_bid.toString(), '100')
			assert.equal(highestBidder.toString(), accounts[1])
		})
		it('does not allow insufficient bids', async () => {
			await myAuction.bid({ from: accounts[2], value: 50}).should.be.rejected;
		})
	})
})