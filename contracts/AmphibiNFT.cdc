import "NonFungibleToken" 
import "MetadataViews" 

access(all) contract AmphibiNFT: NonFungibleToken {

    // Events
    access(all) event ContractInitialized()
    access(all) event Withdraw(id: UInt64, from: Address?)
    access(all) event Deposit(id: UInt64, to: Address?)
    access(all) event Minted(id: UInt64, recipient: Address, animalType: String, name: String)

    // Named Paths
    access(all) let CollectionStoragePath: StoragePath
    access(all) let CollectionPublicPath: PublicPath
    access(all) let MinterStoragePath: StoragePath

    // The total number of AmphibiNFTs that have been minted
    access(all) var totalSupply: UInt64

    // Animal types enum
    access(all) enum AnimalType: UInt8 {
        access(all) case frog
        access(all) case iguana
    }

    // NFT Metadata struct
    access(all) struct NFTMetadata {
        access(all) let id: UInt64
        access(all) let name: String
        access(all) let description: String
        access(all) let image: String
        access(all) let animalType: AnimalType
        access(all) let attributes: {String: String}
        access(all) let mintedAt: UFix64
        access(all) let minter: Address

        init(
            id: UInt64,
            name: String,
            description: String,
            image: String,
            animalType: AnimalType,
            attributes: {String: String},
            minter: Address
        ) {
            self.id = id
            self.name = name
            self.description = description
            self.image = image
            self.animalType = animalType
            self.attributes = attributes
            self.mintedAt = getCurrentBlock().timestamp
            self.minter = minter
        }
    }

    // NFT Resource
    access(all) resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {
        access(all) let id: UInt64
        access(all) let metadata: NFTMetadata

        init(
            id: UInt64,
            name: String,
            description: String,
            image: String,
            animalType: AnimalType,
            attributes: {String: String},
            minter: Address
        ) {
            self.id = id
            self.metadata = NFTMetadata(
                id: id,
                name: name,
                description: description,
                image: image,
                animalType: animalType,
                attributes: attributes,
                minter: minter
            )
        }

        access(all) fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>(),
                Type<MetadataViews.Royalties>(),
                Type<MetadataViews.Editions>(),
                Type<MetadataViews.ExternalURL>(),
                Type<MetadataViews.NFTCollectionData>(),
                Type<MetadataViews.NFTCollectionDisplay>(),
                Type<MetadataViews.Serial>(),
                Type<MetadataViews.Traits>()
            ]
        }

        access(all) fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: self.metadata.name,
                        description: self.metadata.description,
                        thumbnail: MetadataViews.HTTPFile(
                            url: self.metadata.image
                        )
                    )
                case Type<MetadataViews.Editions>():
                    let editionInfo = MetadataViews.EditionInfo(name: "AmphibiNFT Edition", number: self.id, max: nil)
                    let editionList: [MetadataViews.EditionInfo] = [editionInfo]
                    return MetadataViews.Editions(
                        editionList
                    )
                case Type<MetadataViews.Serial>():
                    return MetadataViews.Serial(
                        self.id
                    )
                case Type<MetadataViews.Royalties>():
                    return MetadataViews.Royalties([
                        MetadataViews.Royalty(
                            receiver: getAccount(0x01cf0e2f2f715450).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver),
                            cut: 0.025, // 2.5% royalty
                            description: "Creator Royalty"
                        )
                    ])
                case Type<MetadataViews.ExternalURL>():
                    return MetadataViews.ExternalURL("https://amphibinft.com/nft/".concat(self.id.toString()))
                case Type<MetadataViews.NFTCollectionData>():
                    return MetadataViews.NFTCollectionData(
                        storagePath: AmphibiNFT.CollectionStoragePath,
                        publicPath: AmphibiNFT.CollectionPublicPath,
                        providerPath: /private/AmphibiNFTCollectionProvider,
                        publicCollection: Type<&AmphibiNFT.Collection{AmphibiNFT.AmphibiNFTCollectionPublic}>(),
                        publicLinkedType: Type<&AmphibiNFT.Collection{AmphibiNFT.AmphibiNFTCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(),
                        providerLinkedType: Type<&AmphibiNFT.Collection{AmphibiNFT.AmphibiNFTCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,MetadataViews.ResolverCollection}>(),
                        createEmptyCollectionFunction: (fun (): @NonFungibleToken.Collection {
                            return <-AmphibiNFT.createEmptyCollection()
                        })
                    )
                case Type<MetadataViews.NFTCollectionDisplay>():
                    let media = MetadataViews.Media(
                        file: MetadataViews.HTTPFile(
                            url: "https://amphibinft.com/logo.png"
                        ),
                        mediaType: "image/png"
                    )
                    return MetadataViews.NFTCollectionDisplay(
                        name: "AmphibiNFT Collection",
                        description: "A collection of unique frog and iguana NFTs captured by nature photographers",
                        externalURL: MetadataViews.ExternalURL("https://amphibinft.com"),
                        squareImage: media,
                        bannerImage: media,
                        socials: {
                            "twitter": MetadataViews.ExternalURL("https://twitter.com/amphibinft")
                        }
                    )
                case Type<MetadataViews.Traits>():
                    let traits: [MetadataViews.Trait] = []
                    
                    traits.append(MetadataViews.Trait(
                        name: "Animal Type",
                        value: self.metadata.animalType == AnimalType.frog ? "Frog" : "Iguana",
                        displayType: "String",
                        rarity: nil
                    ))
                    
                    for key in self.metadata.attributes.keys {
                        traits.append(MetadataViews.Trait(
                            name: key,
                            value: self.metadata.attributes[key]!,
                            displayType: "String",
                            rarity: nil
                        ))
                    }
                    
                    return MetadataViews.Traits(traits)
            }
            return nil
        }
    }

    // Collection Interfaces
    pub resource interface AmphibiNFTCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowAmphibiNFT(id: UInt64): &AmphibiNFT.NFT? {
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow AmphibiNFT reference: the ID of the returned reference is incorrect"
            }
        }
    }

    // Collection Resource
    pub resource Collection: AmphibiNFTCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection {
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init () {
            self.ownedNFTs <- {}
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @AmphibiNFT.NFT

            let id: UInt64 = token.id

            let oldToken <- self.ownedNFTs[id] <- token

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        pub fun borrowAmphibiNFT(id: UInt64): &AmphibiNFT.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
                return ref as! &AmphibiNFT.NFT
            }

            return nil
        }

        pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
            let nft = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            let amphibiNFT = nft as! &AmphibiNFT.NFT
            return amphibiNFT as &AnyResource{MetadataViews.Resolver}
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    // Public function to create empty collection
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    // Minter Resource
    pub resource NFTMinter {
        pub fun mintNFT(
            recipient: &{NonFungibleToken.CollectionPublic},
            name: String,
            description: String,
            image: String,
            animalType: AnimalType,
            attributes: {String: String}
        ): UInt64 {
            let metadata = NFTMetadata(
                id: AmphibiNFT.totalSupply,
                name: name,
                description: description,
                image: image,
                animalType: animalType,
                attributes: attributes,
                minter: recipient.owner!.address
            )

            var newNFT <- create NFT(
                id: AmphibiNFT.totalSupply,
                name: name,
                description: description,
                image: image,
                animalType: animalType,
                attributes: attributes,
                minter: recipient.owner!.address
            )

            let mintedID = newNFT.id

            recipient.deposit(token: <-newNFT)

            emit Minted(
                id: mintedID,
                recipient: recipient.owner!.address,
                animalType: animalType == AnimalType.frog ? "frog" : "iguana",
                name: name
            )

            AmphibiNFT.totalSupply = AmphibiNFT.totalSupply + UInt64(1)

            return mintedID
        }
    }

    // Get NFT metadata by ID
    pub fun getNFTMetadata(id: UInt64): NFTMetadata? {
        // This would typically query from a mapping, but for simplicity
        // we'll return nil here. In a production contract, you'd store
        // metadata in a mapping for easy retrieval
        return nil
    }

    // Get total supply of minted NFTs
    pub fun getTotalSupply(): UInt64 {
        return AmphibiNFT.totalSupply
    }

    init() {
        // Initialize the total supply
        self.totalSupply = 0

        // Set the named paths
        self.CollectionStoragePath = /storage/AmphibiNFTCollection
        self.CollectionPublicPath = /public/AmphibiNFTCollection
        self.MinterStoragePath = /storage/AmphibiNFTMinter

        // Create a Collection resource and save it to storage
        let collection <- create Collection()
        self.account.save(<-collection, to: self.CollectionStoragePath)

        // Create a public capability for the collection
        self.account.link<&AmphibiNFT.Collection{NonFungibleToken.CollectionPublic, AmphibiNFT.AmphibiNFTCollectionPublic, MetadataViews.ResolverCollection}>(
            self.CollectionPublicPath,
            target: self.CollectionStoragePath
        )

        // Create a Minter resource and save it to storage
        let minter <- create NFTMinter()
        self.account.save(<-minter, to: self.MinterStoragePath)

        emit ContractInitialized()
    }
}
