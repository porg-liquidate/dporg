import { useAppKitAccount, useAppKitEvents, useAppKitState, useWalletInfo } from '@reown/appkit/react';
import { useClientMounted } from './useClientMount';

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
    const mounted = useClientMounted()

    return {
        state,
        address,
        events,
        mounted,
        walletInfo,
        caipAddress,
        isConnected,
        embeddedWalletInfo
    }
}

export default useWallet