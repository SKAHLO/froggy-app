// Script to interact with deployed contract
const hre = require("hardhat")

async function main() {
  // Replace with your deployed contract address
  const contractAddress = "0xDfAa1eD2A5C438C86366b87420bB2E1912399ca1"

  const AmphibiNFT = await hre.ethers.getContractFactory("AmphibiNFT")
  const contract = AmphibiNFT.attach(contractAddress)

  // Example: Mint an NFT
  const [signer] = await hre.ethers.getSigners()

  console.log("Minting NFT...")

  const tx = await contract.mintNFT(
    signer.address,
    "Rare Tree Frog #001",
    "A beautiful tree frog captured in its natural habitat",
    "https://your-storage.com/images/frog-001.jpg",
    0, // AnimalType.FROG
    ["habitat", "color", "rarity"],
    ["rainforest", "green", "rare"],
    { value: hre.ethers.utils.parseEther("0.001") },
  )

  await tx.wait()
  console.log("NFT minted! Transaction hash:", tx.hash)

  // Get total supply
  const totalSupply = await contract.getCurrentTokenId()
  console.log("Total NFTs minted:", totalSupply.toString())

  // Get user's NFTs
  const userNFTs = await contract.getUserNFTs(signer.address, 0, 10)
  console.log(
    "User's NFTs:",
    userNFTs.map((id) => id.toString()),
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
