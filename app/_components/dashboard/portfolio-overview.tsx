"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { InfoIcon, Wallet2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import useWallet from "@/hooks/useWallet"
import { fetchAssetsMetadata } from "@/lib/tokens"
import { Connection } from "@solana/web3.js"

type Token = {
  name: string,
  symbol: string,
  value: number,
  balance: number,
  image: string,
  mint: string,
  decimals: number,
  percentage: number,
}

export function PortfolioOverview() {
  const [view, setView] = useState("all")
  const [chain, setChain] = useState<string | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [selectedTokens, setselectedTokens] = useState<Token[]>([]);
  const [portfolioTokens, setPortfolioTokens] = useState<Token[]>([])

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
      if (chain == null || address == null) return
      if (chain == "solana") {
        const assets = await fetchAssetsMetadata(connection, "6wRCEa63ksmFY4T6MVpQ7qKEe7fJATPyA2y12rnJTo1B")
        setPortfolioTokens(assets)
      } else if (chain == "ethereum") {

      }
    })()
  }, [chain, address])

  useEffect(() => {
    fetchTokens()
  }, [fetchTokens])

  // Filter tokens based on view
  const filteredTokens =
    view === "dust" ? portfolioTokens.filter((token) => token.value < 1.0) : portfolioTokens

  const dustValue = portfolioTokens
    .filter((token) => token.value < 1.0)
    .reduce((sum, token) => sum + token.value, 0)

  let isAllSelected = filteredTokens.length > 0 && 
    selectedTokens.length === filteredTokens.length

  const handleSelectAllChange = useCallback((checked: 
    boolean) => {
      if (checked) {
        filteredTokens.map((token) => {
          handleSelectChange(checked, token)
        });
      } else {
        setselectedTokens([])
      }
  }, [filteredTokens])

  useEffect(() => {
    if (view == "dust") {
      setselectedTokens(prev => prev.filter((token) => token.value < 1.0))
      isAllSelected = filteredTokens.length == selectedTokens.length
    }
  }, [view])

  function handleSelectChange(checked: string | boolean, token: Token) {
    if (checked) {
      setselectedTokens(prev => { 
        return prev.some(t => t.name == token.name) 
          ? prev 
          : [...prev, token] 
        })
    } else {
      setselectedTokens(prev => {
        if (prev.some(data => data.name == token.name)) {
          return prev.filter(t => t.name != token.name)
        } else {
          return [...prev, token]
        }
      })
    }
  }

  const isTokenSelected = (name: string) => {
    if (Array.isArray(selectedTokens)) {
      return selectedTokens.some(token => token.name == name)
    }
    return false
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-secondary">Portfolio Overview</CardTitle>
            <CardDescription>Your current token balances</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white/70">$87.9</p>
            <p className="text-sm text-white/70">Total Value</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center py-4">
          <Tabs defaultValue="all" className="mb-4">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setView("all")}>
                All Tokens
              </TabsTrigger>
              <TabsTrigger value="dust" onClick={() => setView("dust")}>
                Dust{" "}
                <Badge variant="outline" className="ml-1">
                  ${dustValue.toFixed(2)}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-x-2">
            <label
                htmlFor="select-all"
                className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white/70"
            >
                Select All
            </label>
            <Checkbox 
              checked={isAllSelected}
              onCheckedChange={handleSelectAllChange}
              className="cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-4">
          {!chain || !address ? (
            <div className='py-12 flex flex-col items-center gap-y-3'>
              <Wallet2 className='stroke-white/70 w-12 h-12' />
              <h3 className='text-white/90 text-center'>Connect wallet to get started</h3>
            </div>
          ): (
            <>
              {filteredTokens.map((token) => (
                <div key={token.symbol} className="space-y-2 border-b border-white/10 pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <img src={token.image} className='rounded-full w-5 h-5 object-cover' />
                      </div>
                      <div>
                        <p className="font-medium text-secondary">{token.name}</p>
                        <p className="text-xs text-white/70">
                          {token.balance.toLocaleString()} {token.symbol}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <div className="text-right">
                        <p className="font-medium text-secondary">${token.value.toFixed(5)}</p>
                        <p className="text-xs text-white/70">{token.percentage.toFixed(3)}%</p>
                      </div>
                      <div>
                        <Checkbox 
                          checked={isTokenSelected(token.name)}
                          onCheckedChange={(checked) => handleSelectChange(checked, token)}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                  {/* <Progress value={token.percentage} className="h-1.5 border border-white/10" /> */}
                </div>
              ))}
            </>
          )}
        </div>

        {view === "dust" && filteredTokens.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <InfoIcon className="mb-2 h-10 w-10 text-white/70" />
            <p className="text-white/70">Dust not Found!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
