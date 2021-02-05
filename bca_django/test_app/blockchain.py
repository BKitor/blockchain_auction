import json
from web3 import Web3
from solc import compile_standard
from django.conf import settings


class BChain():
    auction_abi = None
    auction_bytecod3 = None
    sealed_bid_abi = None
    sealed_bid_bytecode = None
    english_abi = None
    english_bytecode = None
    admin_public_key = None

    def __init__(self):
        self.admin_public_key = settings.ADMIN_ADDR_PUBLIC
        self.w3 = Web3(Web3.HTTPProvider(settings.BLOCKCHAIN_ADDRESS))
        with open('../bca_react/contracts/Auction.sol') as f:
            auction_contents = f.read()

        with open('../bca_react/contracts/SealedBid.sol') as f:
            sealed_bid_contents = f.read()

        with open('../bca_react/contracts/EnglishAuction.sol') as f:
            english_contents = f.read()

        compiled_auctions = compile_standard({
            "language": "Solidity",
            "sources": {
                "Auction.sol": {
                    "content": auction_contents
                },
                "SealedBid.sol": {
                    "content": sealed_bid_contents
                },
                "EnglishAuction.sol": {
                    "content": english_contents
                },
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
        self.auction_bytecode = compiled_auctions['contracts'][
            'Auction.sol']['Auction']['evm']['bytecode']['object']
        self.auction_abi = json.loads(compiled_auctions['contracts']['Auction.sol']
                                      ['Auction']['metadata'])['output']['abi']

        self.sealed_bid_bytecode = compiled_auctions['contracts'][
            'SealedBid.sol']['SealedBid']['evm']['bytecode']['object']
        self.sealed_bid_abi = json.loads(compiled_auctions['contracts']['SealedBid.sol']
                                         ['SealedBid']['metadata'])['output']['abi']

        self.english_bytecode = compiled_auctions['contracts'][
            'EnglishAuction.sol']['EnglishAuction']['evm']['bytecode']['object']
        self.english_abi = json.loads(compiled_auctions['contracts']['EnglishAuction.sol']
                                      ['EnglishAuction']['metadata'])['output']['abi']

    def get_w3(self):
        return self.w3

    def get_sealed_bid_abi(self):
        return self.sealed_bid_abi

    def get_sealed_bid_bytecode(self):
        return self.sealed_bid_bytecode

    def get_english_abi(self):
        return self.english_abi

    def get_english_bytecode(self):
        return self.english_bytecode

    def launch_sealed_bid(self, time_limit, owner, min_bid):
        print(f"LAUNCH SEALED_BID time:{time_limit}, owner:{owner}, min_bid:{min_bid}")

        SealedBid = self.w3.eth.contract(
            abi=self.sealed_bid_abi, bytecode=self.sealed_bid_bytecode)

        tx_hash = SealedBid.constructor(
            owner, time_limit, min_bid).transact({'from': self.admin_public_key})

        tx_receipt = self.w3.eth.waitForTransactionReceipt(tx_hash)
        return tx_receipt.contractAddress

    def launch_english(self, time_limit, owner, min_bid):
        print(f"LAUNCH ENGLISH time:{time_limit}, owner:{owner}, min_bid:{min_bid}")
        English = self.w3.eth.contract(
            abi=self.english_abi, bytecode=self.english_bytecode)

        tx_hash = English.constructor(
            owner, time_limit, min_bid).transact({'from': self.admin_public_key})

        tx_receipt = self.w3.eth.waitForTransactionReceipt(tx_hash)
        return tx_receipt.contractAddress
