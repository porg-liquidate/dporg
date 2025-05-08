"use client"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, InfoIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

type Token = {
  name: string,
  symbol: string,
  value: number,
  balance: number
}

// Sample portfolio data
const portfolioData = {
  totalValue: 8.6,
  tokens: [
    { symbol: "SOL", name: "Solana", balance: 0.5, value: 10.0, percentage: 58.14, icon: "🟣" },
    { symbol: "USDT", name: "Tether", balance: 2.0, value: 2.0, percentage: 23.26, icon: "🟢" },
    { symbol: "RAY", name: "Raydium", balance: 0.5, value: 1.0, percentage: 11.63, icon: "🔵" },
    { symbol: "DUST", name: "Dust Protocol", balance: 10, value: 0.5, percentage: 5.81, icon: "🟠" },
    { symbol: "TINY", name: "Tiny Token", balance: 0.1, value: 0.1, percentage: 1.16, icon: "🟡" },
  ],
}

export function PortfolioOverview() {
  const [view, setView] = useState("all")
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedTokens, setselectedTokens] = useState<Token[]>([]);

  // Filter tokens based on view
  const filteredTokens =
    view === "dust" ? portfolioData.tokens.filter((token) => token.value < 1.0) : portfolioData.tokens

  const dustValue = portfolioData.tokens
    .filter((token) => token.value < 1.0)
    .reduce((sum, token) => sum + token.value, 0)

  useEffect(() => {
    setIsAllSelected(
        filteredTokens.length > 0 && selectedTokens.length === filteredTokens.length
      );
  }, [selectedTokens]);

  function handleSelectChange(checked: string | boolean, token: Token) {
    console.log(token)
    if (checked) {
      setselectedTokens(prev => [ ...prev, token ])
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

  const isTokenSelected = (name: string) => {
    if (Array.isArray(selectedTokens)) {
      return selectedTokens.some(token => token.name == name)
    }
    return false
  };

  console.log(isAllSelected)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-secondary">Portfolio Overview</CardTitle>
            <CardDescription>Your current token balances</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white/70">${portfolioData.totalValue.toFixed(2)}</p>
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
          {filteredTokens.map((token) => (
            <div key={token.symbol} className="space-y-2 border-b border-white/10 pb-4 last:border-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <span>{token.icon}</span>
                  </div>
                  <div>
                    <p className="font-medium text-secondary">{token.name}</p>
                    <p className="text-xs text-white/70">
                      {token.balance} {token.symbol}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-x-3">
                  <div className="text-right">
                    <p className="font-medium text-secondary">${token.value.toFixed(2)}</p>
                    <p className="text-xs text-white/70">{token.percentage.toFixed(1)}%</p>
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
