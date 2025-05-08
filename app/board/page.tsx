'use client'
import { Suspense, useCallback, useEffect } from "react"
import { DashboardHeader } from "../_components/dashboard/dashboard-header"
import { DashboardSkeleton } from "../_components/dashboard/dashboard-skeleton"
import { LiquidateCard } from "../_components/dashboard/liquidate-card"
import { PortfolioOverview } from "../_components/dashboard/portfolio-overview"
import useWallet from "@/hooks/useWallet"
import useConnection from "@/hooks/useConnection"
import { PublicKey } from "@solana/web3.js"
import { fetchTokenAssets } from "@/lib/tokens"

export default function DashboardPage() {
  const { address, walletInfo, mounted } = useWallet()
  const connection = useConnection()
  const walletAddress = new PublicKey('C1TgFLpvL7RhDsGA2Y99XVG5sxNVXDBwyr2tVrCsy161')

  // const walletAssets = useCallback(() => {
  //   if (walletAddress) {
  //     (async () => {
  //       const assets = await fetchTokenAssets(
  //         connection, 
  //         walletAddress
  //       );
  //       console.log(assets)
  //     })()
  //   }
  // }, [walletAddress])

  // useEffect(() => {
  //   if (mounted) {
  //     console.log('address', address)
  //   }
  //   walletAssets()
  // }, [mounted, walletAssets])

  return (
    <main className="flex min-h-screen flex-col bg-black p-4">
      <DashboardHeader />

      <div className="container py-6">
        <h1 className="mb-6 text-3xl font-bold text-white">Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Suspense fallback={<DashboardSkeleton />}>
              <PortfolioOverview />
            </Suspense>
          </div>

          <div>
            <LiquidateCard />
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
