import {
  EvmPlatform,
  getEvmSignerForKey,
} from "@wormhole-foundation/connect-sdk-evm";
import {
  CircleTransfer,
  Wormhole,
  amount,
} from "@wormhole-foundation/connect-sdk";
import { Wallet } from "ethers";
import "@wormhole-foundation/connect-sdk-evm-cctp";
import dotenv from "dotenv";

dotenv.config();

const userWallet = new Wallet(process.env.PRIVATE_KEY || "YOUR PRIVATE KEY");

const wh = new Wormhole("Testnet", [EvmPlatform]);

const senderChain = "BaseSepolia";
const receiverChain = "ArbitrumSepolia";

const sourceChain = wh.getChain(senderChain);
const destinationChain = wh.getChain(receiverChain);

const amt = amount.units(amount.parse("0.3", 6)); // amount and decimals

const automatic = true;

const srcChainAddress = Wormhole.chainAddress(senderChain, userWallet.address);
const dstChainAddress = Wormhole.chainAddress(
  receiverChain,
  userWallet.address
);

const xfer = await wh.circleTransfer(
  amt,
  srcChainAddress,
  dstChainAddress,
  automatic
);

console.log("Starting Transfer");

const quote = await CircleTransfer.quoteTransfer(
  sourceChain,
  destinationChain,
  xfer.transfer
);
console.log("Quote", quote.relayFee);

const signer = await getEvmSignerForKey(
  await sourceChain.getRpc(),
  userWallet.privateKey
);

console.log("Wallet", userWallet.address);

const srcTxids = await xfer.initiateTransfer(signer);
console.log(`Started Transfer: `, srcTxids);
