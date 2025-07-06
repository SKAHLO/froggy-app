// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title AmphibiNFT
 * @dev ERC721 contract for minting frog and iguana NFTs
 */
contract AmphibiNFT is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable, ReentrancyGuard {
    using Strings for uint256;

    // Token ID counter
    uint256 private _tokenIdCounter;

    // Animal types
    enum AnimalType { FROG, IGUANA }

    // NFT metadata structure
    struct NFTMetadata {
        uint256 tokenId;
        string name;
        string description;
        string imageUrl;
        AnimalType animalType;
        address minter;
        uint256 mintedAt;
        mapping(string => string) attributes;
        string[] attributeKeys;
    }

    // Mapping from token ID to metadata
    mapping(uint256 => NFTMetadata) private _tokenMetadata;

    // Mapping to track user's NFTs by animal type
    mapping(address => uint256[]) private _userFrogNFTs;
    mapping(address => uint256[]) private _userIguanaNFTs;

    // Events
    event NFTMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        string name,
        AnimalType animalType,
        string imageUrl
    );

    event MetadataUpdated(uint256 indexed tokenId, string newTokenURI);

    // Minting fee (0.001 ETH)
    uint256 public mintingFee = 0.001 ether;

    // Maximum supply
    uint256 public constant MAX_SUPPLY = 10000;

    constructor(address initialOwner) ERC721("AmphibiNFT", "AMPHI") Ownable(initialOwner) {}

    /**
     * @dev Mint a new NFT
     * @param recipient Address to receive the NFT
     * @param name Name of the NFT
     * @param description Description of the NFT
     * @param imageUrl URL of the NFT image
     * @param animalType Type of animal (0 for frog, 1 for iguana)
     * @param attributeKeys Array of attribute keys
     * @param attributeValues Array of attribute values
     */
    function mintNFT(
        address recipient,
        string memory name,
        string memory description,
        string memory imageUrl,
        AnimalType animalType,
        string[] memory attributeKeys,
        string[] memory attributeValues
    ) public payable nonReentrant returns (uint256) {
        require(msg.value >= mintingFee, "Insufficient minting fee");
        require(recipient != address(0), "Invalid recipient address");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(imageUrl).length > 0, "Image URL cannot be empty");
        require(attributeKeys.length == attributeValues.length, "Attribute arrays length mismatch");
        require(_tokenIdCounter < MAX_SUPPLY, "Maximum supply reached");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        // Mint the NFT
        _safeMint(recipient, tokenId);

        // Store metadata
        NFTMetadata storage metadata = _tokenMetadata[tokenId];
        metadata.tokenId = tokenId;
        metadata.name = name;
        metadata.description = description;
        metadata.imageUrl = imageUrl;
        metadata.animalType = animalType;
        metadata.minter = msg.sender;
        metadata.mintedAt = block.timestamp;
        metadata.attributeKeys = attributeKeys;

        // Store attributes
        for (uint256 i = 0; i < attributeKeys.length; i++) {
            metadata.attributes[attributeKeys[i]] = attributeValues[i];
        }

        // Track user's NFTs by type
        if (animalType == AnimalType.FROG) {
            _userFrogNFTs[recipient].push(tokenId);
        } else {
            _userIguanaNFTs[recipient].push(tokenId);
        }

        // Create token URI
        string memory tokenURI = _createTokenURI(tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit NFTMinted(tokenId, recipient, name, animalType, imageUrl);

        return tokenId;
    }

    /**
     * @dev Get NFT metadata
     */
    function getNFTMetadata(uint256 tokenId) public view returns (
        string memory name,
        string memory description,
        string memory imageUrl,
        AnimalType animalType,
        address minter,
        uint256 mintedAt,
        string[] memory attributeKeys
    ) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        NFTMetadata storage metadata = _tokenMetadata[tokenId];
        return (
            metadata.name,
            metadata.description,
            metadata.imageUrl,
            metadata.animalType,
            metadata.minter,
            metadata.mintedAt,
            metadata.attributeKeys
        );
    }

    /**
     * @dev Get NFT attribute value
     */
    function getNFTAttribute(uint256 tokenId, string memory key) public view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _tokenMetadata[tokenId].attributes[key];
    }

    /**
     * @dev Get user's frog NFTs
     */
    function getUserFrogNFTs(address user) public view returns (uint256[] memory) {
        return _userFrogNFTs[user];
    }

    /**
     * @dev Get user's iguana NFTs
     */
    function getUserIguanaNFTs(address user) public view returns (uint256[] memory) {
        return _userIguanaNFTs[user];
    }

    /**
     * @dev Get total NFTs by animal type
     */
    function getTotalByAnimalType(AnimalType animalType) public view returns (uint256) {
        uint256 count = 0;
        
        for (uint256 i = 0; i < _tokenIdCounter; i++) {
            if (_ownerOf(i) != address(0) && _tokenMetadata[i].animalType == animalType) {
                count++;
            }
        }
        
        return count;
    }

    /**
     * @dev Get user's total NFT count
     */
    function getUserNFTCount(address user) public view returns (uint256) {
        return balanceOf(user);
    }

    /**
     * @dev Get user's NFTs with pagination
     */
    function getUserNFTs(address user, uint256 offset, uint256 limit) 
        public view returns (uint256[] memory tokenIds) {
        uint256 balance = balanceOf(user);
        require(offset < balance, "Offset exceeds balance");
        
        uint256 length = limit;
        if (offset + limit > balance) {
            length = balance - offset;
        }
        
        tokenIds = new uint256[](length);
        for (uint256 i = 0; i < length; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(user, offset + i);
        }
        
        return tokenIds;
    }

    /**
     * @dev Create JSON metadata URI for token
     */
    function _createTokenURI(uint256 tokenId) internal view returns (string memory) {
        NFTMetadata storage metadata = _tokenMetadata[tokenId];
        
        string memory animalTypeStr = metadata.animalType == AnimalType.FROG ? "Frog" : "Iguana";
        
        // Build attributes JSON
        string memory attributesJson = "[";
        for (uint256 i = 0; i < metadata.attributeKeys.length; i++) {
            if (i > 0) {
                attributesJson = string(abi.encodePacked(attributesJson, ","));
            }
            attributesJson = string(abi.encodePacked(
                attributesJson,
                '{"trait_type":"',
                metadata.attributeKeys[i],
                '","value":"',
                metadata.attributes[metadata.attributeKeys[i]],
                '"}'
            ));
        }
        
        // Add animal type attribute
        if (metadata.attributeKeys.length > 0) {
            attributesJson = string(abi.encodePacked(attributesJson, ","));
        }
        attributesJson = string(abi.encodePacked(
            attributesJson,
            '{"trait_type":"Animal Type","value":"',
            animalTypeStr,
            '"}'
        ));
        
        attributesJson = string(abi.encodePacked(attributesJson, "]"));

        // Create full JSON metadata
        string memory json = string(abi.encodePacked(
            '{"name":"',
            metadata.name,
            '","description":"',
            metadata.description,
            '","image":"',
            metadata.imageUrl,
            '","attributes":',
            attributesJson,
            ',"external_url":"https://amphibinft.com/nft/',
            tokenId.toString(),
            '"}'
        ));

        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(bytes(json))
        ));
    }

    /**
     * @dev Set minting fee (only owner)
     */
    function setMintingFee(uint256 _fee) public onlyOwner {
        mintingFee = _fee;
    }

    /**
     * @dev Withdraw contract balance (only owner)
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Get current token ID counter
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter;
    }

    // Required overrides for OpenZeppelin v5.0.0
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}