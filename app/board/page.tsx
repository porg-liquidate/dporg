'use client'
import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import { DashboardHeader } from "../_components/dashboard/dashboard-header"
import { DashboardSkeleton } from "../_components/dashboard/dashboard-skeleton"
import { LiquidateCard } from "../_components/dashboard/liquidate-card"
import { PortfolioOverview } from "../_components/dashboard/portfolio-overview"
import { fetchTokenAssetsMetadata } from "@/lib/tokens"
import { Connection } from "@solana/web3.js"
import useWallet from "@/hooks/useWallet"
import { Token } from "@/lib/types"

export default function DashboardPage() {
  const [chain, setChain] = useState<string | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [portfolioTokens, setPortfolioTokens] = useState<Token[]>([])
  const [selectedTokens, setSelectedTokens] = useState<Token[]>([]);

  const {address: walletAddress, state, mounted} = useWallet()
  const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_RPC as string);
  
  useMemo(() => {
    if (state && mounted) {
      setAddress(walletAddress as string)
      setChain(state.activeChain as string)
    }
  }, [mounted, walletAddress, state])
  
  // fetch tokens for connected chains
  const fetchTokens = useCallback(() => {
    (async () => {
      console.log(chain, address)
      if (chain == null || address == null) return
      if (chain == "solana") {
        const assets = await fetchTokenAssetsMetadata(connection, address)
        setPortfolioTokens(assets)
      } else if (chain == "ethereum") {

      }
    })()
  }, [chain, address])
  
  useEffect(() => {
    fetchTokens()
  }, [fetchTokens])

  const isTokenSelected = (mint: string) => {
    if (Array.isArray(selectedTokens)) {
      return selectedTokens.some(token => token.mint == mint)
    }
    return false
  };

  useEffect(() => {
    if (portfolioTokens.length == 0) {
      setSelectedTokens([])
    }
  }, [portfolioTokens])

  function handleSelectChange(checked: string | boolean, token: Token) {
    if (checked) {
      setSelectedTokens(prev => {
        return prev.some(t => t.mint == token.mint) 
          ? prev 
          : [...prev, token] 
      })
    } else {
      setSelectedTokens(prev => {
        if (prev.some(data => data.mint == token.mint)) {
          return prev.filter(t => t.mint != token.mint)
        } else {
          return [...prev, token]
        }
      })
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-black p-4">
      <DashboardHeader />

      <div className="container py-6">
        <h1 className="mb-6 text-3xl font-bold text-white">Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Suspense fallback={<DashboardSkeleton />}>
              <PortfolioOverview
                chain={chain}
                address={address}
                portfolioTokens={portfolioTokens}
                selectedTokens={selectedTokens}
                isTokenSelected={isTokenSelected}
                handleSelectChange={handleSelectChange}
                setSelectedTokens={setSelectedTokens}
              />
            </Suspense>
          </div>

          <div>
            <LiquidateCard 
              chain={chain}
              selectedTokens={selectedTokens}
            />
          </div>
        </div>

        {/* <div className="mt-6">
          <Suspense fallback={<DashboardSkeleton />}>
            <TransactionHistory />
          </Suspense>
        </div> */}
      </div>
    </main>
  )
}
