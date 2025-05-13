import { Chain } from "../types";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API + '/api';

export async function getBridgeFees(sourceChain: string, targetChain: string, tokenMint: string) {
    const response = await fetch(`${baseUrl}/wormhole/fees`)
    const data = await response.json()
    return data
}

export async function getSupportedChains() {
    const response = await fetch(`${baseUrl}/wormhole/chains`)
    const data = await response.json()
    return data;
}

export async function wormholeBridgeTransaction() {
    const response = await fetch(`${baseUrl}/wormhole/bridge`, {
         
    })
    const data: Chain[] = await response.json()
    return data;
}