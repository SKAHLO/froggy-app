import NonFungibleToken from 0x631e88ae7f1d7c20
import AmphibiNFT from 0x01cf0e2f2f715450

// This transaction mints a new AmphibiNFT and deposits it into the recipient's collection

transaction(
    recipient: Address,
    name: String,
    description: String,
    image: String,
    animalType: UInt8,
    attributes: {String: String}
) {
    let minter: &AmphibiNFT.NFTMinter
    let recipientCollectionRef: &{NonFungibleToken.CollectionPublic}

    prepare(signer: AuthAccount) {
        // Get a reference to the NFTMinter resource in the account's storage
        self.minter = signer.borrow<&AmphibiNFT.NFTMinter>(from: AmphibiNFT.MinterStoragePath)
            ?? panic("Could not borrow a reference to the NFT minter")

        // Get the recipient's public account object
        let recipientAccount = getAccount(recipient)

        // Borrow the recipient's public NFT collection reference
        self.recipientCollectionRef = recipientAccount
            .getCapability(AmphibiNFT.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")
    }

    execute {
        // Convert animalType UInt8 to AnimalType enum
        let animalTypeEnum = animalType == 0 ? AmphibiNFT.AnimalType.frog : AmphibiNFT.AnimalType.iguana

        // Mint the NFT and deposit it to the recipient's collection
        let mintedID = self.minter.mintNFT(
            recipient: self.recipientCollectionRef,
            name: name,
            description: description,
            image: image,
            animalType: animalTypeEnum,
            attributes: attributes
        )

        log("Minted AmphibiNFT with ID: ".concat(mintedID.toString()))
    }
}
