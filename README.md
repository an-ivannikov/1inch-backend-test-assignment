# 1inch Backend test assignment

Create a Nest.js application that allows an arbitrary client to get information from two endpoints:
  - `/gasPrice`
  - `/return/:fromTokenAddress/:toTokenAddress/:amountIn`


## GasPrice
As a client, I wish to receive recent gas price on Ethereum network using `/gasPrice`. The response time should be not more than 50ms. To meet the customer's requirements, you can make any technical decisions.


## UniswapV2
As a client, I wish to receive an estimated output amount by trading source token into destination token with the exact input amount on UniswapV2 by using` /return/:fromTokenAddress/:toTokenAddress/:amountIn`.


## Requirements:
  - You cannot use on-chain functions to get return amount. You can only get state metadata for off-chain calculation (e.g. balances).
  - You need to implement the math on backend side.
  - You can only use ethers or web3 libraries to communicate with blockchain and perform off-chain calculations.


## Resources:
  - You can get Ethereum node endpoint to get an information about gas price and balances from one of these providers (choose any): https://www.infura.io/ , https://www.alchemy.com/, https://www.quicknode.com/.
  - Libraries for convenient communication with blockchain node: https://docs.ethers.org/v5/ or https://web3js.readthedocs.io/en/v1.10.0/.
  - UniswapV2 factory address: 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f.


## Evaluation criteria:
  - Clean code, which is self documented.
  - Code structure, design.
  - Tests, documentation.
  - Your application should works.


During the face to face interview you will have the opportunity to explain your design choices and provide justifications for the parts that you omitted.

**Good luck!**
