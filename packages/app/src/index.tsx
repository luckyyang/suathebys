import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { WagmiConfig, createConfig } from "wagmi";
import { createPublicClient, http } from 'viem'
import { sepolia } from "wagmi/chains";
import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { type Chain } from "viem";

export const suave = {
  id: 16813125,
  name: "Suave",
  nativeCurrency: { name: "Suave ETH", symbol: "SuaveETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.rigil.suave.flashbots.net"] },
  },
  blockExplorers: {
    default: {
      name: "rigil",
      url: "https://explorer.rigil.suave.flashbots.net/",
    },
  },
  contracts: {},
} as const satisfies Chain;


const { connectors } = getDefaultWallets({
  appName: "Hedwig - Email Oracle",
  chains: [suave],
  projectId: "b68298f4e6597f970ac06be1aea7998d",
});

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: suave,
    transport: http(),
  }),
  connectors: connectors,
});

ReactDOM.render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={[suave]} theme={lightTheme()}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
  document.getElementById("root")
);
