# Suatheby's

Welcome to Suatheby's. 
A Cross-chain Auction house built with SUAVE ⚡️🤖 Secret sharing through a Trusted execution environment (TEE)

![Banner](./suathbys.png)


# Imagine
<p align="center"> Buying an NFT on Arbitrum <br>
Using ETH on Polygon </p>

## How it works

1. Seller <br>
1.1 Upload data in confidential storage in TEE kettle
   * Data to be sold could be NFT on any chain, private key, etc.
2. Buyer <br>
2.2 Bid on asset on the desired chain
3. Reveal data to buyer through the off-chain contract viewing function

This is made possible with the unique architecture of Suave kettle running in TEE which brings enhanced privacy (no-one, not even the host OS, can see unencrypted data) and integrity (you can be sure the correct data, and only that data, is stored at all times).

## Running locally

#### Install dependencies

```bash
yarn
```

#### Start the web app. In `packages/app` directory, run

```bash
yarn start
```

This will start the UI at `http://localhost:3000/` where you can paste the email, generate proof and update BTC price.

The UI works against the generated zkeys downloaded from local or AWS you specified and the deployed contract on Sepolia.

## Manual Proof Generation

If you want to generate the proof locally outside browser, follow the instructions below.

### Circuits

Circom circuits are located in `packages/circuits`, the main circuit being [oracle.circom](packages/circuits/oracle.circom). OracleVerifier circuit use [EmailVerifier](https://github.com/zkemail/zk-email-verify/blob/main/packages/circuits/email-verifier.circom) circuit from `@zk-email/circuits`.

The regex circuit required to parse/extract BTC price can be generated using [https://github.com/zkemail/zk-regex](zk-regex) package.

#### » Generate Oracle Regex Circuit

```bash
# CWD = packages/circuits
yarn generate-regex
```

This will generate `components/oracle-regex.circom` using the config in `components/oracle-regex.json`. This `oracle-regex.circom` is imported in `oracle.circom`.

Note that `oracle-regex.circom` is already in repo, so this step is optional.

#### » Build the circuit

```bash
# CWD = packages/circuits
yarn build
```

This will create `oracle.wasm` and other files in `packages/circuits/build` directory.

You can test the circuit using

```bash
# CWD = packages/circuits
yarn test
```

#### » Generating Zkey

You can generate proving and verification keys using

```bash
# CWD = packages/circuits/scripts
ZKEY_ENTROPY=<random-number> ZKEY_BEACON=<random-hex> ts-node dev-setup.ts
```

This will generate `zkey` files, `vkey.json` in `build` directory, and Solidity verifier in `packages/contracts/src/Verifier.sol`.

> Note: We are using a custom fork of `snarkjs` which generated **chunked zkeys**. Chunked zkeys make it easier to use in browser, especially since we have large circuit. You can switch to regular `snarkjs` in `package.json` if you don't want to use chunked zkeys.


For browser use, the script also compresses the chunked zkeys.

**The compressed zkeys, vkey, wasm are copied to /build/artifacts` directory. This directory can be served using a local server or uploaded to S3 for use in the browser.

To upload to S3, the below script can be used.
```bash
python3 upload_to_s3.py --build-dir <project-path>/hedwig/packages/circuits/build --circuit-name oracle
```

There are helper functions in `@zk-email/helpers` package to download and decompress the zkeys in the browser.


#### » Generate Input and Proof

```bash
# CWD = packages/circuits/scripts
ts-node generate-proof.ts --email-file ../tests/emls/test_oracle.eml --ethereum-address <your-eth-address>
```

This will generate input + witness using the given email file and Ethereum address, and prove using the generated zkey.

The script will save `inputs.json`, `input.wtns`, `proof.json`, and `public.json` in `proof` directory.

The script also verify the generated proof are correct. You can use the proof and public inputs to verify in the Solidity verifier as well.

### Contracts

The solidity contracts can be found in `packages/contracts`. The main contract is [SimpleOracle.sol](packages/contracts/src/SimpleOracle.sol).

#### You can build the contracts using

```bash
# CWD = packages/contracts
yarn build  # Assume you have foundry installed
```


#### Deploy contracts

```bash
# CWD = packages/contracts
PRIVATE_KEY=<pk-hex> forge script script/DeployOracle.s.sol:Deploy -vvvv --rpc-url https://rpc2.sepolia.org --broadcast
```

Currently deployed contracts on Sepolia:

```
Deployed SimpleOracle at address:
0x4370da73a076563448CAd69bD11437fa0814713a # Etherum Sepolia
0xB74C6Eaf47ed115Ac175872a35140c5590737D95 # Avalanche
0xB74C6Eaf47ed115Ac175872a35140c5590737D95 # Flare Coston2
0xB74C6Eaf47ed115Ac175872a35140c5590737D95 # Solana neon evm devnet

```

### UI

If you want to update the UI based on your own zkeys and contracts, please make the below changes:

- Set the `VITE_CONTRACT_ADDRESS` in `packages/app/.env`. This is the address of the `SimpleOracle` contract.
- Set `VITE_CIRCUIT_ARTIFACTS_URL` in `packages/app/.env` to the URL of the directory containing circuit artifacts (compressed partial zkeys, wasm, verifier, etc). You can run a local server in `circuits/build/artifacts` directory and use that URL or upload to S3 (or similar) and use that public URL/
