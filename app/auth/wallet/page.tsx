"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Wallet, CheckCircle } from "lucide-react"

const wallets = [
  { name: "MetaMask", icon: "🦊", description: "Connect using MetaMask wallet" },
  { name: "OKX Wallet", icon: "⭕", description: "Connect using OKX wallet" },
  { name: "Coinbase Wallet", icon: "🔵", description: "Connect using Coinbase wallet" },
  { name: "WalletConnect", icon: "🔗", description: "Connect using WalletConnect protocol" },
]

export default function WalletAuthPage() {
  const [connecting, setConnecting] = useState<string | null>(null)
  const [connected, setConnected] = useState<string | null>(null)

  const handleWalletConnect = async (walletName: string) => {
    setConnecting(walletName)

    // Simulate wallet connection
    setTimeout(() => {
      setConnecting(null)
      setConnected(walletName)

      // Redirect to profile after successful connection
      setTimeout(() => {
        window.location.href = "/profile"
      }, 1500)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <Wallet className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
            <CardDescription>Choose your preferred wallet to connect to Flow EVM</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {wallets.map((wallet) => (
              <Button
                key={wallet.name}
                variant="outline"
                className="w-full h-16 justify-start bg-transparent"
                onClick={() => handleWalletConnect(wallet.name)}
                disabled={connecting !== null}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{wallet.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold">{wallet.name}</div>
                    <div className="text-sm text-gray-500">{wallet.description}</div>
                  </div>
                  {connecting === wallet.name && (
                    <div className="ml-auto">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                  {connected === wallet.name && (
                    <div className="ml-auto">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  )}
                </div>
              </Button>
            ))}

            {connected && (
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-semibold">Wallet Connected!</p>
                <p className="text-green-600 text-sm">Redirecting to your profile...</p>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link href="/auth">
                <Button variant="link" className="text-sm">
                  Or sign in with email instead
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
