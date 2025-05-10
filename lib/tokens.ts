import { Connection, PublicKey } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { fetchAllMintByOwner } from "@metaplex-foundation/mpl-toolbox"

export async function fetchAssets(connection: Connection, address: PublicKey) {
    const umi = createUmi(connection);
    const assets = fetchAllMintByOwner(umi, new PublicKey(address));
    return assets
}