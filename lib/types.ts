export type Token = {
  name: string,
  symbol: string,
  value: number,
  balance: number,
  image: string,
  mint: string,
  decimals: number,
  percentage: number,
}

export type Chain = {
  id: string,
  name: string,
  chainId: number,
  logo: string
}