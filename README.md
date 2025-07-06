# AmphibiNFT Flow Smart Contract

A Cadence smart contract for minting frog and iguana NFTs on the Flow blockchain.

## Features

- **NFT Standard Compliance**: Implements Flow's NonFungibleToken standard
- **Metadata Support**: Full MetadataViews integration for rich NFT metadata
- **Animal Types**: Support for both frog and iguana NFTs
- **Royalties**: Built-in 2.5% creator royalties
- **Extensible Attributes**: Custom attributes for each NFT
- **Access Control**: Secure minting with admin controls

## Contract Structure

### Resources

- **NFT**: The main NFT resource containing metadata and views
- **Collection**: Manages owned NFTs for each account
- **NFTMinter**: Admin resource for minting new NFTs

### Key Functions

- `mintNFT()`: Mint a new NFT with specified metadata
- `createEmptyCollection()`: Create a new NFT collection
- `getTotalSupply()`: Get the total number of minted NFTs

## Deployment

### Prerequisites

1. Install Flow CLI: https://developers.flow.com/tools/flow-cli/install
2. Create a Flow testnet account
3. Fund your account with testnet FLOW tokens

### Deploy to Testnet

1. Update `flow.json` with your testnet account details
2. Deploy the contract:
   \`\`\`bash
   flow accounts add-contract AmphibiNFT ./contracts/AmphibiNFT.cdc --network testnet
   \`\`\`

### Setup Account

Before minting, accounts need to be configured:
\`\`\`bash
flow transactions send ./transactions/setup_account.cdc --network testnet
\`\`\`

### Mint NFT

\`\`\`bash
flow transactions send ./transactions/mint_nft.cdc \
  --arg Address:0x01cf0e2f2f715450 \
  --arg String:"Rare Tree Frog #001" \
  --arg String:"A beautiful tree frog captured in its natural habitat" \
  --arg String:"https://your-storage.com/images/frog-001.jpg" \
  --arg UInt8:0 \
  --arg '{String:String}:{"habitat":"rainforest","color":"green","rarity":"rare"}' \
  --network testnet
\`\`\`

## Scripts

### Get Collection IDs
\`\`\`bash
flow scripts execute ./scripts/get_collection_ids.cdc 0x01cf0e2f2f715450 --network testnet
\`\`\`

### Get NFT Metadata
\`\`\`bash
flow scripts execute ./scripts/get_nft_metadata.cdc 0x01cf0e2f2f715450 1 --network testnet
\`\`\`

### Get Total Supply
\`\`\`bash
flow scripts execute ./scripts/get_total_supply.cdc --network testnet
\`\`\`

## Integration with Frontend

The contract is designed to work with the React frontend. Key integration points:

1. **Account Setup**: Call `setup_account.cdc` when users connect wallets
2. **Minting**: Use `mint_nft.cdc` with image URLs and metadata from the frontend
3. **Collection Display**: Use scripts to fetch user's NFTs for profile display
4. **Metadata**: Rich metadata support for displaying NFT details

## Contract Addresses

- **Testnet**: Update after deployment
- **Mainnet**: TBD

## Security Considerations

- Only accounts with the NFTMinter resource can mint NFTs
- Collections are owned by individual accounts
- Metadata is immutable once minted
- Royalties are enforced at the contract level

## Testing

Use the Flow emulator for local testing:
\`\`\`bash
flow emulator start
flow project deploy --network emulator
\`\`\`

## Support

For issues or questions about the smart contract, please refer to:
- Flow Documentation: https://developers.flow.com
- Flow Discord: https://discord.gg/flow
