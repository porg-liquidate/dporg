'use client'
import { Connection, PublicKey } from '@solana/web3.js';

const useConnection = () => {
    const rpc = process.env.NEXT_PUBLIC_HELIUS_RPC
    const connection = new Connection(rpc as string, "confirmed");
    return connection
}

export default useConnection