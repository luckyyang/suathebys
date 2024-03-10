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


const { connectors } = getDefaultWallets({
  appName: "Hedwig - Email Oracle",
  chains: [sepolia],
  projectId: "b68298f4e6597f970ac06be1aea7998d",
});

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: sepolia,
    transport: http()
  }),
  connectors: connectors,
})


ReactDOM.render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={[sepolia]} theme={lightTheme()}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
  document.getElementById("root")
);
