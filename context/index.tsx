'use client'
import { networks, projectId, wagmiAdapter, solanaWeb3JsAdapter } from '@/config'
import { createAppKit } from '@reown/appkit/react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const metadata = {
  name: 'porg',
  description: 'AppKit Example',
  url: 'http://localhost:3000/board', // origin must match your domain & subdomain
  icons: ['https://assets.reown.com/reown-profile-pic.png']
}

export const modal = createAppKit({
    adapters: [solanaWeb3JsAdapter],
    networks: networks,
    metadata: metadata,
    projectId,
    features: {
      analytics: true // Optional - defaults to your Cloud configuration
    }
})

function ContextProvider({ children, cookies }: { children: React.ReactNode, cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
    )
}

export default ContextProvider