const Auction = artifacts.require("./Auction.sol");
const SealedBid = artifacts.require("./SealedBid.sol");
const DutchAuction = artifacts.require("./SealedBid.sol");
const EnglishAuction = artifacts.require("./SealedBid.sol");
const ChannelAuction = artifacts.require("./SealedBid.sol");

//I don't think that this file is actually needed
//I assume the deploy functions will be called somewhere on the JS/React side
module.exports = function(deployer, network, accounts) {
  deployer.deploy(Auction);
  deployer.deploy(SealedBid, 1, accounts[0], 0)
};
