import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Wallet, User, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">AmphibiNFT</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/wallet">
              <Button>Connect Wallet</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Mint Your <span className="text-green-600">Frog</span> & <span className="text-blue-600">Iguana</span> NFTs
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Capture amazing photos of frogs and iguanas, then mint them as unique NFTs on the Flow EVM blockchain. Build
            your collection and showcase your amphibian photography skills!
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/capture">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Camera className="mr-2 h-5 w-5" />
                Start Capturing
              </Button>
            </Link>
            <Link href="/auth/wallet">
              <Button size="lg" variant="outline">
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Camera className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Capture & Upload</CardTitle>
              <CardDescription>
                Take photos directly in the app or upload existing images of frogs and iguanas
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Sparkles className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Mint as NFTs</CardTitle>
              <CardDescription>
                Transform your photos into unique NFTs on the Flow EVM blockchain with just a few clicks
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <User className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Manage Collection</CardTitle>
              <CardDescription>
                View and manage your NFT collection in your personalized profile dashboard
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Sample NFTs */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured NFTs</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-green-200 to-blue-200 flex items-center justify-center">
                  <span className="text-4xl">{i % 2 === 0 ? "🐸" : "🦎"}</span>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">
                    {i % 2 === 0 ? "Rare Frog" : "Epic Iguana"} #{i}
                  </h3>
                  <p className="text-sm text-gray-600">0.5 FLOW</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
