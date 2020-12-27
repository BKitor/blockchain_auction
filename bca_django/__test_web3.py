import json
from web3 import Web3
from solc import compile_standard

w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))

with open('../bca_solidity/contracts/Auction.sol') as f:
    auction_contents = f.read()

with open('../bca_solidity/contracts/SealedBid.sol') as f:
    sealed_bid_contents = f.read()

compiled_auctions = compile_standard({
    "language": "Solidity",
    "sources": {
        "Auction.sol": {
            "content": auction_contents
        },
        "SealedBid.sol": {
            "content": sealed_bid_contents
        }
    },
    "settings":
    {
        "outputSelection": {
            "*": {
                "*": [
                    "metadata", "evm.bytecode", "evm.bytecode.sourceMap"
                ]
            }
        }
    }
})


bytecode = compiled_auctions['contracts']['SealedBid.sol']['SealedBid']['evm']['bytecode']['object']

abi = json.loads(compiled_auctions['contracts']['SealedBid.sol']
                 ['SealedBid']['metadata'])['output']['abi']

SealedBid = w3.eth.contract(abi=abi, bytecode=bytecode)


# constructor (uint _biddingTime, address payable _owner, uint _minBid) public {
time_limit = 100
min_bid = 75
user_0 = '0x66121A6CDf74382F51c3cefFD9F38481Bbb7A537'
user_1 = '0xc4a303306C720Ff572297642535445Bc3095A7fE'

tx_hash = SealedBid.constructor(
    time_limit, user_1, min_bid).transact({'from': user_0})


tx_receipt = w3.eth.waitForTransactionReceipt(tx_hash)

bid_sealed_bid = w3.eth.contract(address=tx_receipt.contractAddress, abi=abi)

print(bid_sealed_bid.functions.get_owner().call())
