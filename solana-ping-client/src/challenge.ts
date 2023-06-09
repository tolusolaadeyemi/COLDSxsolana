import * as web3 from '@solana/web3.js'
import Dotenv from 'dotenv'
Dotenv.config()

async function main() {
    const payer = initializeKeypair()
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
    await connection.requestAirdrop(payer.publicKey, web3.LAMPORTS_PER_SOL*1)
    await transferSol(connection, 0.1*web3.LAMPORTS_PER_SOL, web3.Keypair.generate().publicKey, payer)
}

async function transferSol(connection: web3.Connection, amount: number, to: web3.PublicKey, sender: web3.Keypair) {
    const transaction = new web3.Transaction()

    const instruction = web3.SystemProgram.transfer(
        {
            //TransferParams
            fromPubkey: sender.publicKey,
            toPubkey: to, 
            lamports: amount,
        }
    )

    transaction.add(instruction)

    const signature = await web3.sendAndConfirmTransaction(connection, transaction, [sender])
    console.log(signature);
}

function initializeKeypair(): web3.Keypair {
    const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[]
    const secretKey = Uint8Array.from(secret)
    const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey)
    return keypairFromSecretKey
}

main().then(() => {
    console.log("Finished successfully")
}).catch((error) => {
    console.error(error);
})