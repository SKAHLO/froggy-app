import AmphibiNFT from 0xf8d6e0586b0a20c7

// This script returns the total number of AmphibiNFTs that have been minted

access(all) fun main(): UInt64 {
    return AmphibiNFT.getTotalSupply()
}
