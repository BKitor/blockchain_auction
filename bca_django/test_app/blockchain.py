import json
from web3 import Web3
from solc import compile_standard
from django.conf import settings

sealed_bid_bytecode = None
auction_bid_bytecode = None
auction_abi = None
sealed_bid_abi = None

w3 = None

def init_blockchain():
    w3 = Web3(Web3.HTTPProvider(settings.BLOCKCHAIN_ADDRESS))

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
    auction_bytecode = compiled_auctions['contracts']['Auction.sol']['Auction']['evm']['bytecode']['object']
    auction_abi = json.loads(compiled_auctions['contracts']['Auction.sol']
                     ['Auction']['metadata'])['output']['abi']

    sealed_bid_bytecode = compiled_auctions['contracts']['SealedBid.sol']['SealedBid']['evm']['bytecode']['object']
    sealed_bid_abi = json.loads(compiled_auctions['contracts']['SealedBid.sol']
                     ['SealedBid']['metadata'])['output']['abi']
