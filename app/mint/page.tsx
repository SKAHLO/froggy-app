"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sparkles, CheckCircle, Loader2 } from "lucide-react"

export default function MintPage() {
  const [imageData, setImageData] = useState<string | null>(null)
  const [animalType, setAnimalType] = useState<string | null>(null)
  const [nftName, setNftName] = useState("")
  const [description, setDescription] = useState("")
  const [isMinting, setIsMinting] = useState(false)
  const [mintSuccess, setMintSuccess] = useState(false)
  const [txHash, setTxHash] = useState("")

  useEffect(() => {
    // Get captured image data from localStorage
    const storedImage = localStorage.getItem("capturedImage")
    const storedAnimalType = localStorage.getItem("animalType")

    if (storedImage && storedAnimalType) {
      setImageData(storedImage)
      setAnimalType(storedAnimalType)
      setNftName(`${storedAnimalType.charAt(0).toUpperCase() + storedAnimalType.slice(1)} #${Date.now()}`)
    }
  }, [])

  const handleMint = async () => {
    if (!imageData || !nftName) return

    setIsMinting(true)

    // Simulate NFT minting process
    setTimeout(() => {
      setTxHash(`0x${Math.random().toString(16).substr(2, 64)}`)
      setMintSuccess(true)
      setIsMinting(false)

      // Clear localStorage
      localStorage.removeItem("capturedImage")
      localStorage.removeItem("animalType")
    }, 3000)
  }

  if (mintSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">NFT Minted Successfully!</h2>
            <p className="text-gray-600 mb-4">Your {animalType} NFT has been minted on Flow EVM</p>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600 mb-1">Transaction Hash:</p>
              <p className="text-xs font-mono break-all">{txHash}</p>
            </div>

            <div className="space-y-3">
              <Link href="/profile">
                <Button className="w-full">View in Profile</Button>
              </Link>
              <Link href="/capture">
                <Button variant="outline" className="w-full bg-transparent">
                  Mint Another NFT
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/capture">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Capture
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Mint Your NFT</h1>
            <p className="text-gray-600">Add details to your NFT before minting on Flow EVM blockchain</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>NFT Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {imageData && (
                  <div className="space-y-4">
                    <img src={imageData || "/placeholder.svg"} alt="NFT Preview" className="w-full rounded-lg" />
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {animalType === "frog" ? "🐸" : "🦎"} {animalType?.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">Flow EVM</Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mint Form */}
            <Card>
              <CardHeader>
                <CardTitle>NFT Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">NFT Name</Label>
                  <Input
                    id="name"
                    value={nftName}
                    onChange={(e) => setNftName(e.target.value)}
                    placeholder="Enter NFT name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your NFT..."
                    rows={4}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Minting Details</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>• Blockchain: Flow EVM</p>
                    <p>• Gas Fee: ~0.001 FLOW</p>
                    <p>• Standard: ERC-721</p>
                  </div>
                </div>

                <Button onClick={handleMint} disabled={!nftName || isMinting} className="w-full">
                  {isMinting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Minting NFT...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Mint NFT
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
