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
    dutch_abi = None
    dutch_bytecode = None
    channel_abi = None
    channel_bytecode = None
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

        with open('../bca_react/contracts/DutchAuction.sol') as f:
            dutch_contents = f.read()

        with open('../bca_react/contracts/ChannelAuction.sol') as f:
            channel_contents = f.read()

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
                "DutchAuction.sol": {
                    "content": dutch_contents
                },
                "ChannelAuction.sol": {
                    "content": channel_contents
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

        self.dutch_bytecode = compiled_auctions['contracts'][
            'DutchAuction.sol']['DutchAuction']['evm']['bytecode']['object']
        self.dutch_abi = json.loads(compiled_auctions['contracts']['DutchAuction.sol']
                                    ['DutchAuction']['metadata'])['output']['abi']

        self.channel_bytecode = compiled_auctions['contracts'][
            'ChannelAuction.sol']['ChannelAuction']['evm']['bytecode']['object']
        self.channel_abi = json.loads(compiled_auctions['contracts']['ChannelAuction.sol']
                                      ['ChannelAuction']['metadata'])['output']['abi']

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

    def get_dutch_abi(self):
        return self.dutch_abi

    def get_dutch_bytecode(self):
        return self.dutch_bytecode

    def get_channel_abi(self):
        return self.channel_abi

    def get_channel_bytecode(self):
        return self.channel_bytecode

    def launch_sealed_bid(self, time_limit, owner, min_bid):
        print(
            f"LAUNCH SEALED_BID time:{time_limit}, owner:{owner}, min_bid:{min_bid}")

        SealedBid = self.w3.eth.contract(
            abi=self.sealed_bid_abi, bytecode=self.sealed_bid_bytecode)

        tx_hash = SealedBid.constructor(
            owner, time_limit, min_bid).transact({'from': self.admin_public_key})

        tx_receipt = self.w3.eth.waitForTransactionReceipt(tx_hash)
        return tx_receipt.contractAddress

    def launch_english(self, time_limit, owner, min_bid):
        print(
            f"LAUNCH ENGLISH time:{time_limit}, owner:{owner}, min_bid:{min_bid}")
        English = self.w3.eth.contract(
            abi=self.english_abi, bytecode=self.english_bytecode)

        tx_hash = English.constructor(
            owner, time_limit, min_bid).transact({'from': self.admin_public_key})

        tx_receipt = self.w3.eth.waitForTransactionReceipt(tx_hash)
        return tx_receipt.contractAddress

    def launch_dutch(self, time_limit, owner, min_bid, start_price, rate):
        print(
            f"LAUNCH DUTCH time:{time_limit}, owner:{owner}, min_bid:{min_bid}")
        Dutch = self.w3.eth.contract(
            abi=self.dutch_abi, bytecode=self.dutch_bytecode)

        tx_hash = Dutch.constructor(
            owner, time_limit, start_price, rate, min_bid).transact({'from': self.admin_public_key})

        tx_receipt = self.w3.eth.waitForTransactionReceipt(tx_hash)
        return tx_receipt.contractAddress

    def launch_channel(self, time_limit, owner, min_bid, buy_now_price):
        print(
            f"LAUNCH CHANNEL time:{time_limit}, owner:{owner}, min_bid:{min_bid}")
        Channel = self.w3.eth.contract(
            abi=self.channel_abi, bytecode=self.channel_bytecode)

        tx_hash = Channel.constructor(
            owner, time_limit, min_bid, buy_now_price).transact({'from': self.admin_public_key})

        tx_receipt = self.w3.eth.waitForTransactionReceipt(tx_hash)
        return tx_receipt.contractAddress

    def launch_squeeze(self, time_limit, owner, start_low, start_high, rate):
        print(
            f"LAUNCH SQUEEZE time:{time_limit}, owner:{owner}, start_low:{start_low} start_high:{start_high} rate:{rate}")
        Squeeze = self.w3.eth.contract(
            abi=self.squeeze_abi, bytecode=self.squeeze_bytecode)

        tx_hash = Squeeze.constructor(
            owner, time_limit, start_low, start_high, rate).transact({'from': self.admin_public_key})

        tx_receipt = self.w3.eth.waitForTransactionReceipt(tx_hash)
        return tx_receipt.contractAddress
