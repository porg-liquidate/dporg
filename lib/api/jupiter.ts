const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API;

export type BatchSwapParam = {
    walletAddress: string,
    tokenMints: string[],
    targetMint: string,
    slippageBps?: number
}

export async function batchSwap(request: BatchSwapParam) {
    const response = await fetch(`${baseUrl}/api/liquidate`, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
        }
    })
    return await response.json() 
}