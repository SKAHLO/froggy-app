"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, Plus, ExternalLink, Copy } from "lucide-react"

// Mock NFT data
const mockNFTs = [
  {
    id: 1,
    name: "Rare Tree Frog #001",
    image: "/placeholder.svg?height=300&width=300",
    type: "frog",
    mintDate: "2024-01-15",
    txHash: "0x1234...5678",
  },
  {
    id: 2,
    name: "Green Iguana #002",
    image: "/placeholder.svg?height=300&width=300",
    type: "iguana",
    mintDate: "2024-01-14",
    txHash: "0x2345...6789",
  },
  {
    id: 3,
    name: "Poison Dart Frog #003",
    image: "/placeholder.svg?height=300&width=300",
    type: "frog",
    mintDate: "2024-01-13",
    txHash: "0x3456...7890",
  },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("nfts")

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            AmphibiNFT
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/capture">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Mint New NFT
              </Button>
            </Link>
            <Link href="/profile/settings">
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900">John Doe</h1>
                  <p className="text-gray-600 mb-2">@johndoe_nft</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Wallet: 0x1234...5678</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard("0x1234567890abcdef")}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{mockNFTs.length}</div>
                  <div className="text-sm text-gray-600">NFTs Owned</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="nfts">My NFTs</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="nfts" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockNFTs.map((nft) => (
                <Card key={nft.id} className="overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-green-200 to-blue-200 flex items-center justify-center">
                    <span className="text-6xl">{nft.type === "frog" ? "🐸" : "🦎"}</span>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{nft.name}</h3>
                      <Badge variant="secondary">{nft.type === "frog" ? "🐸" : "🦎"}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Minted on {new Date(nft.mintDate).toLocaleDateString()}
                    </p>
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(nft.txHash)}>
                        <Copy className="mr-1 h-3 w-3" />
                        TX Hash
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockNFTs.map((nft) => (
                    <div key={nft.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="text-2xl">{nft.type === "frog" ? "🐸" : "🦎"}</div>
                      <div className="flex-1">
                        <p className="font-semibold">Minted {nft.name}</p>
                        <p className="text-sm text-gray-600">{nft.mintDate}</p>
                      </div>
                      <Badge variant="outline">Mint</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {mockNFTs.filter((nft) => nft.type === "frog").length}
                    </div>
                    <div className="text-sm text-gray-600">Frog NFTs</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {mockNFTs.filter((nft) => nft.type === "iguana").length}
                    </div>
                    <div className="text-sm text-gray-600">Iguana NFTs</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">7</div>
                    <div className="text-sm text-gray-600">Days Active</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">0.003</div>
                    <div className="text-sm text-gray-600">FLOW Spent</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
