import {
	TokenStandard,
	createFungible,
	createV1,
	mintV1,
	mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata'
import {
	generateSigner,
	keypairIdentity,
	percentAmount,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { userKeypair } from './helpers'

const umi = createUmi('https://api.devnet.solana.com')

const keypair = umi.eddsa.createKeypairFromSecretKey(userKeypair.secretKey)
umi.use(keypairIdentity(keypair)).use(mplTokenMetadata())

const metadata = {
	name: 'Sol Way',
	symbol: 'SOLW',
	uri: 'https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json',
}

const mint = generateSigner(umi)

console.log(mint)

// async function createMetadataDetails() {
// 	await createV1(umi, {
// 		mint,
// 		authority: umi.identity,
// 		name: metadata.name,
// 		symbol: metadata.symbol,
// 		uri: metadata.uri,
// 		sellerFeeBasisPoints: percentAmount(0),
// 		decimals: 9,
// 		tokenStandard: TokenStandard.Fungible,
// 	}).sendAndConfirm(umi)
// }

async function mintToken() {
	try {
		let result = await mintV1(umi, {
			mint: mint.publicKey,
			authority: umi.identity,
			amount: 10_000000,
			tokenOwner: umi.identity.publicKey,
			tokenStandard: TokenStandard.Fungible,
		}).sendAndConfirm(umi)
		console.log('result', result)
	} catch (error) {
		console.error('error minting the tokens', error)
	}
}

async function createToken() {
	try {
		await createFungible(umi, {
			mint,
			authority: umi.identity,
			name: metadata.name,
			symbol: metadata.symbol,
			uri: metadata.uri,
			sellerFeeBasisPoints: percentAmount(0),
			decimals: 9,
		}).sendAndConfirm(umi)
		console.log(
			`success \ntx: https://explorer.solana.com/address/${mint.publicKey}?cluster=devnet`
		)
	} catch (error) {
		console.error('error creating the tokens', error)
	}
}

mintToken()
createToken()
