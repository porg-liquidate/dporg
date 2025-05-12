import { publicKey } from "@metaplex-foundation/umi";
import { Connection, PublicKey } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata'
import { fetchAllMintByOwner } from "@metaplex-foundation/mpl-toolbox";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

// fetch all tokens in a wallet
async function fetchWalletAssets(connection: Connection, address: string) {
    const umi = createUmi(connection)
    const assets = fetchAllMintByOwner(umi, publicKey(address))
    return assets
}

async function fetchTokenAssets(connection: Connection, address: string) {
    const assets = await fetchWalletAssets(connection, address)
    const splTokens = []
    for (const asset of assets) {
        if (asset.decimals != 0) {
            splTokens.push(asset)
        }
    }
    return splTokens
}

async function fetchAssetData(connection: Connection, address: string) {
    const umi = createUmi(connection)
    const asset = await fetchDigitalAsset(umi, publicKey(address))
    return asset
}

async function getMetadata(uri: string) {
    try {
        if (uri != undefined) {
            const response = await fetch(uri);
            const data = await response.json();
            return data
        }
    } catch (error) {
        console.log(error, uri)
    }
}

export async function fetchAssetsMetadata(connection: Connection, address: string) {
    const assets = await fetchTokenAssets(connection, address)
    const tokens = [];
    for(const asset of assets) {
        // get user's amount for spl token
        const data =  await fetchAssetData(connection, asset.publicKey)
        const metadata = await getMetadata(data?.metadata?.uri) 
        const tokenAccount = getAssociatedTokenAddressSync(new PublicKey(asset.publicKey), new PublicKey(address))
        const tokenInfo = await connection.getTokenAccountBalance(tokenAccount)
        const tokenPrice = await getTokenPrice(asset.publicKey.toString())
        const percentage = ((tokenPrice?.usdPrice - tokenPrice?.usdPrice24h) / tokenPrice?.usdPrice24h)
        tokens.push({
            decimals: asset.decimals,
            mint: asset.publicKey,
            name: data.metadata.name,
            symbol: data.metadata.symbol,
            image: metadata?.image ?? '',
            balance: tokenInfo.value.uiAmount ?? 0,
            value: tokenPrice?.usdPrice ?? 0,
            percentage: percentage ?? 0.00
        })
    }
    return tokens
}

// fetch token data
export async function getTokenPrice(mint: string) {
    try {
        const response = await fetch(
            `https://solana-gateway.moralis.io/token/mainnet/${mint}/price`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-API-KEY': process.env.NEXT_PUBLIC_MORALIS_API as string
                }
            })
        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
    }
}