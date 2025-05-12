"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowRightLeft, ExternalLink, HelpCircle, Zap } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { Token } from "@/lib/types"
// import { useToast } from "@/hooks/use-toast"

interface LiquidateCardProp {
  selectedTokens: Token[],
}

export function LiquidateCard({ selectedTokens }: LiquidateCardProp) {
  const [targetToken, setTargetToken] = useState("usdc")
  const [includeDust, setIncludeDust] = useState(true)
  const [bridgeEnabled, setBridgeEnabled] = useState(false)
  const [targetChain, setTargetChain] = useState("ethereum")
  const [isLoading, setIsLoading] = useState(false)
  const [isDestinationExternal, setIsDestinationExternal] = useState(false)
  const [destinationWallet, setDestinationWallet] = useState<string | null>(null)
//   const { toast } = useToast()

  const handleLiquidate = async () => {
    try {
      setIsLoading(true)

      // Simulate transaction processing
      setTimeout(() => {
        setIsLoading(false)
        // toast({
        //   title: "Liquidation Successful",
        //   description: "All tokens have been converted to USDC",
        //   duration: 5000,
        // })
      }, 2000)

    } catch(error) {

    } finally {
      setIsLoading(false)
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
                <SelectItem value="sol">SOL</SelectItem>
                <SelectItem value="usdt">USDT</SelectItem>
              </SelectContent>
            </Select>
            <div className='flex items-center gap-x-2'>
              <Checkbox 
                checked={isDestinationExternal}
                onCheckedChange={() => setIsDestinationExternal(prev => !prev)}
              />
              <Label className="text-white/90">Choose different destination wallet</Label>
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
            <Select value={targetChain} onValueChange={setTargetChain}>
              <SelectTrigger id="target-chain" className="border border-secondary/10 text-secondary">
                <SelectValue placeholder="Select chain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="arbitrum">Arbitrum</SelectItem>
                <SelectItem value="optimism">Optimism</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="rounded-lg bg-gray-400/10 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white">Estimated Fee</span>
            <span className="font-medium text-white">$0.05</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white">You Receive</span>
            <span className="font-medium text-white">$8.55 USDC</span>
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
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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
