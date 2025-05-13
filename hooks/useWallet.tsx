import { useAppKitAccount, useAppKitEvents, useAppKitProvider, useAppKitState, useWalletInfo } from '@reown/appkit/react';
import { useClientMounted } from './useClientMount';
import { useAppKitConnection, type Provider as SolanaProvider } from "@reown/appkit-adapter-solana/react"
import type { Provider as EthereumProvider } from "@reown/appkit/react"

const useWallet = () => {
    const state = useAppKitState();
    const events = useAppKitEvents();
    const walletInfo = useWalletInfo();
    const {
        address, 
        caipAddress, 
        isConnected, 
        embeddedWalletInfo
    } = useAppKitAccount();
    const { connection } = useAppKitConnection()
    const { walletProvider: solanaWalletProvider } = useAppKitProvider<SolanaProvider>("solana");
    const { walletProvider: ethereumWalletProvider } = useAppKitProvider<EthereumProvider>("eip155");
    const mounted = useClientMounted()

    return {
        state,
        address,
        events,
        mounted,
        walletInfo,
        connection,
        caipAddress,
        isConnected,
        embeddedWalletInfo,
        solanaWalletProvider,
        ethereumWalletProvider,
    }
}

export default useWallet