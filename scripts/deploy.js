const fcl = require("@onflow/fcl")
const fs = require("fs")

// Configure FCL for testnet
fcl.config({
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
})

async function deployContract() {
  try {
    // Read the contract code
    const contractCode = fs.readFileSync("./contracts/AmphibiNFT.cdc", "utf8")

    console.log("Deploying AmphibiNFT contract to Flow testnet...")

    // This is a simplified deployment script
    // In practice, you would use Flow CLI or a more sophisticated deployment tool
    console.log("Contract code prepared for deployment:")
    console.log("Contract length:", contractCode.length, "characters")
    console.log("\nTo deploy this contract:")
    console.log("1. Use Flow CLI: flow accounts add-contract AmphibiNFT ./contracts/AmphibiNFT.cdc --network testnet")
    console.log("2. Or use the Flow Developer Playground")
    console.log("3. Make sure you have testnet FLOW tokens for deployment")
  } catch (error) {
    console.error("Error preparing deployment:", error)
  }
}

deployContract()
