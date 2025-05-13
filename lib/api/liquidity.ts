const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API;

type LiquidityOption = {
    targetToken: string
}

type BridgeOptions = {
    recipientAddress: string
}

export async function createLiquidationTransaction() {
    const response = await fetch(`${baseUrl}/api/liquidate`)
    return await response.json()   
}

export async function createLiquidityWithBridgeTransaction(
    address: string, 
    options: LiquidityOption, 
    bridgeOptions: BridgeOptions,
) {
    try {
        const response = await fetch(`${baseUrl}/api/with-bridge`, {
            method: 'POST',
            body: JSON.stringify({
                walletAddress: address,
                options,
                bridgeOptions
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        return data;
    } catch (error) {
        console.log(error)
    }
}