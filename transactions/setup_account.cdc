import NonFungibleToken from 0x631e88ae7f1d7c20
import AmphibiNFT from 0x01cf0e2f2f715450

// This transaction configures an account to hold AmphibiNFTs

transaction {
    prepare(signer: AuthAccount) {
        // if the account doesn't already have a collection
        if signer.borrow<&AmphibiNFT.Collection>(from: AmphibiNFT.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- AmphibiNFT.createEmptyCollection()
            
            // save it to the account
            signer.save(<-collection, to: AmphibiNFT.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&{NonFungibleToken.CollectionPublic, AmphibiNFT.AmphibiNFTCollectionPublic}>(
                AmphibiNFT.CollectionPublicPath,
                target: AmphibiNFT.CollectionStoragePath
            )
        }
    }
}
