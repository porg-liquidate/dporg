const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_API}/api/jupiter/`;

export type BatchSwapParam = {
    walletAddress: string,
    tokenMints: string[],
    targetMint: string,
    slippageBps?: number
}

export async function batchSwap(request: BatchSwapParam) {
    const response = await fetch(`${baseUrl}/batch-swap`, {
        method: 'POST',
        body: JSON.stringify({
            tokenMints: request.tokenMints,
            walletAddress: request.walletAddress,
            targetMint: request.targetMint,
            slippageBps: request.slippageBps
        }),
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
        }
    })
    return await response.json() 
}