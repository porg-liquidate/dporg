import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, GetProgramAccountsFilter, PublicKey } from "@solana/web3.js";

export async function fetchTokenAssets(connection: Connection, address: PublicKey) {
    try {
        const tokens = [];
        const filters: GetProgramAccountsFilter[] = [
            { dataSize: 165 },
            {
              memcmp: {
                offset: 32,
                bytes: address.toBase58(),
              }            
            }
        ];

        const legacyTokenAccounts = await connection.getParsedProgramAccounts(
            TOKEN_PROGRAM_ID,
            {filters: filters}
        );

        const token2022Accounts = await connection.getParsedProgramAccounts(
            TOKEN_2022_PROGRAM_ID,
            {filters: filters}
        );
        
        console.log('token assets')
        return {legacyTokenAccounts, token2022Accounts}
        // tokens = [...legacyTokenAccounts, ...token2022Accounts]
    } catch(error) {
        console.log(error)
        return []
    }
}