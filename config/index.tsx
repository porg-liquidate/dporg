import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { cookieStorage, createStorage } from 'wagmi'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { mainnet, arbitrum, solana, solanaDevnet, solanaTestnet } from '@reown/appkit/networks'

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "4254ccc8465a9635e552cf5ab7b4e2d5"
if (!projectId) {
    throw new Error("Project Id is not defined")
} 

export const networks = [mainnet, arbitrum, solana, solanaDevnet, solanaTestnet] as [AppKitNetwork, ...AppKitNetwork[]]

export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
      storage: cookieStorage
    }),
    ssr: true,
    projectId,
    networks
  })

  export const solanaWeb3JsAdapter = new SolanaAdapter()
export const config = wagmiAdapter.wagmiConfig

// {
//   wallets: [
//         new PhantomWalletAdapter(), 
//         new SolflareWalletAdapter()
//     ]
// }