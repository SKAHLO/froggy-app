const fcl = require("@onflow/fcl")
const fs = require("fs")

// Configure FCL for testnet
fcl.config({
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
})

async function mintExampleNFT() {
  try {
    // Read the mint transaction
    const mintTransaction = fs.readFileSync("./transactions/mint_nft.cdc", "utf8")

    console.log("Example NFT minting parameters:")

    const exampleParams = {
      recipient: "0x01cf0e2f2f715450", // Replace with actual recipient address
      name: "Rare Tree Frog #001",
      description: "A beautiful tree frog captured in its natural habitat",
      image: "https://your-storage.com/images/frog-001.jpg",
      animalType: 0, // 0 for frog, 1 for iguana
      attributes: {
        habitat: "rainforest",
        color: "green",
        rarity: "rare",
        photographer: "John Doe",
      },
    }

    console.log("Transaction code loaded, length:", mintTransaction.length)
    console.log("Example parameters:", JSON.stringify(exampleParams, null, 2))

    console.log("\nTo mint an NFT:")
    console.log("1. Ensure the recipient account is set up with setup_account.cdc")
    console.log("2. Use Flow CLI to send the mint transaction")
    console.log("3. Example command:")
    console.log(`flow transactions send ./transactions/mint_nft.cdc \\
      --arg Address:${exampleParams.recipient} \\
      --arg String:"${exampleParams.name}" \\
      --arg String:"${exampleParams.description}" \\
      --arg String:"${exampleParams.image}" \\
      --arg UInt8:${exampleParams.animalType} \\
      --arg '{String:String}:${JSON.stringify(exampleParams.attributes)}' \\
      --network testnet`)
  } catch (error) {
    console.error("Error preparing mint example:", error)
  }
}

mintExampleNFT()
