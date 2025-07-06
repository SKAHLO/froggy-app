import NonFungibleToken from 0x631e88ae7f1d7c20
import AmphibiNFT from 0x01cf0e2f2f715450
import MetadataViews from 0x631e88ae7f1d7c20

// This script gets the metadata for a specific NFT

access(all) fun main(account: Address, itemID: UInt64): AmphibiNFT.NFTMetadata? {
    let acct = getAccount(account)
    let collectionRef = acct.getCapability(AmphibiNFT.CollectionPublicPath)
        .borrow<&{AmphibiNFT.AmphibiNFTCollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")

    let nft = collectionRef.borrowAmphibiNFT(id: itemID)
        ?? panic("Could not borrow NFT reference")

    return nft.metadata
}
