"use client"

import { Key, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowRightLeft, ExternalLink, HelpCircle, Zap } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { Chain, Token } from "@/lib/types"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getSupportedChains } from "@/lib/api/wormhole"
import { toast } from 'react-hot-toast'
import { batchSwap, BatchSwapParam } from "@/lib/api/jupiter"
import { MutableRequestCookiesAdapter } from "next/dist/server/web/spec-extension/adapters/request-cookies"

interface LiquidateCardProp {
  chain: string | null,
  walletAddress: string | null,
  selectedTokens: Token[],
}

export function LiquidateCard({ walletAddress, chain, selectedTokens }: LiquidateCardProp) {
  const [targetToken, setTargetToken] = useState<string>("usdc")
  const [includeDust, setIncludeDust] = useState(true)
  const [bridgeEnabled, setBridgeEnabled] = useState(false)
  const [targetChain, setTargetChain] = useState("ethereum")
  const [isLoading, setIsLoading] = useState(false)
  const [isDestinationExternal, setIsDestinationExternal] = useState(false)
  const [destinationWallet, setDestinationWallet] = useState<string | null>(null)
  const [targetTokensData] = useState([
    {
      name: "usdt",
      mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
    },
    {
      name: "usdc",
      mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
    },
    {
      name: 'pyusdc',
      mint: "EDBM1GyjydH3ohC4q3WgWe1XS8T8bjukPd3aBPjk32GS" 
    }
  ])

  const totalAmount = selectedTokens.reduce((sum, token) => sum + token?.value, 0)
  const fee = totalAmount * 0.1

  const {
    data: supportedChainsData,
    isLoading: isSupportedChainsLoading
  } = useQuery<any>({
    queryKey: ['supported-chains'],
    queryFn: () => getSupportedChains()
  })

  const mutation = useMutation({
    mutationFn: async (swapParam: BatchSwapParam) => {
      return await batchSwap(swapParam)
    }
  });

  const handleLiquidate = async () => {
    setIsLoading(true)

    try {

      if (!walletAddress || !chain) 
        return toast.error('Wallet address or chain not provided')

      if (selectedTokens.length  == 0)
        return toast.error('select tokens to liquidate')

      // get all selected token mints and target mint
      const mints = selectedTokens.map(token => token.mint)
      const targetIndex: any = targetTokensData.findIndex(tt => tt.name == 'usdc')
      
      mutation.mutate({
        walletAddress,
        tokenMints: mints,
        targetMint: targetTokensData[targetIndex].mint,
        slippageBps: 10
      })

      if (mutation?.data == undefined) {
        return toast.error('Could not process liquidation');
      }

      if (mutation?.data != undefined && mutation?.data?.error == "Failed to create batch swap transaction") {
        return toast.error(mutation?.data.error)
      }

    } catch(error) {

    } finally {
      setTimeout(() => setIsLoading(false), 1000)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-secondary">Liquidate Portfolio</CardTitle>
        <CardDescription>Convert all tokens to a single asset</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
      <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="target-token" className="text-white/90">Target Token</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-white/70" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Select the token you want to convert all your assets into</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex gap-x-6 items-center">
            <Select value={targetToken} onValueChange={setTargetToken}>
              <SelectTrigger id="target-token" className="border border-secondary/10 text-secondary">
                <SelectValue placeholder="Select token" className="text-secondary" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usdc">USDC</SelectItem>
                <SelectItem value="sol">PYUSD</SelectItem>
                <SelectItem value="usdt">USDT</SelectItem>
              </SelectContent>
            </Select>
            <div className='flex items-center gap-x-2'>
              <Checkbox 
                checked={isDestinationExternal}
                onCheckedChange={() => setIsDestinationExternal(prev => !prev)}
              />
              <Label className="text-white/90 text-xs">Choose different destination wallet</Label>
            </div>
          </div>
        </div>

        {isDestinationExternal && (
          <div>
            <input 
              type='text' 
              name='desination-wallet'
              value={destinationWallet ?? ''}
              placeholder='solana address'
              className="text-white/90 px-3 focus:outline-0 border border-secondary/90 w-full h-[2.5rem] rounded-md"
              onChange={(e) => setDestinationWallet(e.target.value)}
            />
          </div>
        )}

        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label htmlFor="include-dust">Include Dust Tokens</Label>
            <p className="text-xs text-white/70">Tokens worth less than $1</p>
          </div>
          <Switch id="include-dust" checked={includeDust} onCheckedChange={setIncludeDust} />
        </div>

        <Separator />

        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label htmlFor="bridge-enabled">Bridge to Another Chain</Label>
            <p className="text-xs text-white/70">Send funds cross-chain</p>
          </div>
          <Switch id="bridge-enabled" checked={bridgeEnabled} onCheckedChange={setBridgeEnabled} />
        </div>

        {bridgeEnabled && (
          <div className="space-y-2 pt-2">
            <Label htmlFor="target-chain">Target Chain</Label>
            {isSupportedChainsLoading ? (
              <div>
                span  
              </div>
            ) : (
              <Select value={targetChain} onValueChange={setTargetChain} defaultValue={supportedChainsData[0].name}>
                <SelectTrigger id="target-chain" className="border border-secondary/10 text-secondary">
                  <SelectValue placeholder="Select chain" />
                </SelectTrigger>
                <SelectContent>
                  {supportedChainsData.length > 0 && supportedChainsData.map((chain: Chain) => (
                    <SelectItem key={chain.chainId} value={chain.id}>{chain.name}</SelectItem>  
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        <div className="rounded-lg bg-gray-400/10 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white">Estimated Fee</span>
            <span className="font-medium text-white">${fee.toFixed(3)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white">You Receive</span>
            <span className="font-medium text-white">${totalAmount.toFixed(4)} USDC</span>
          </div>
          {bridgeEnabled && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Bridge Fee</span>
              <span className="font-medium text-white">$0.50</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          onClick={handleLiquidate}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 cursor-pointer"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Liquidate Now
            </span>
          )}
        </Button>

        <div className="flex w-full items-center justify-between text-xs text-white/70">
          <span className="flex items-center gap-1">
            <ArrowRightLeft className="h-3 w-3" />
            Powered by Jupiter
          </span>
          <a href="#" className="flex items-center gap-1 hover:text-gray-500/70">
            View Transaction <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </CardFooter>
    </Card>
  )
}
