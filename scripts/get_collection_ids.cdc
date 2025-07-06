import NonFungibleToken from 0x9a0766d93b6608b7
import AmphibiNFT from 0x01cf0e2f2f715450

// This script returns an array of all the NFT IDs in an account's collection

access(all) fun main(account: Address): [UInt64] {
    let acct = getAccount(account)
    let collectionRef = acct.getCapability(AmphibiNFT.CollectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")
    
    return collectionRef.getIDs()
}
