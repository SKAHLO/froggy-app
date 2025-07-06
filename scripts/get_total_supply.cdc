import AmphibiNFT from 0x01cf0e2f2f715450

// This script returns the total number of AmphibiNFTs that have been minted

access(all) fun main(): UInt64 {
    return AmphibiNFT.getTotalSupply()
}
