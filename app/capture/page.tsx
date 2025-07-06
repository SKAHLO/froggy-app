"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Camera, Upload, RotateCcw, Check } from "lucide-react"

export default function CapturePage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [animalType, setAnimalType] = useState<"frog" | "iguana" | null>(null)
  const [isUsingCamera, setIsUsingCamera] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsUsingCamera(true)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      if (context) {
        context.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL("image/jpeg")
        setCapturedImage(imageData)

        // Stop camera
        const stream = video.srcObject as MediaStream
        stream?.getTracks().forEach((track) => track.stop())
        setIsUsingCamera(false)
      }
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const resetCapture = () => {
    setCapturedImage(null)
    setAnimalType(null)
    setIsUsingCamera(false)
  }

  const proceedToMint = () => {
    if (capturedImage && animalType) {
      // Store image and animal type in localStorage for the mint page
      localStorage.setItem("capturedImage", capturedImage)
      localStorage.setItem("animalType", animalType)
      window.location.href = "/mint"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Capture Your Amphibian</h1>
            <p className="text-gray-600">Take a photo or upload an image of a frog or iguana to mint as an NFT</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Photo Capture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!capturedImage && !isUsingCamera && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={startCamera} className="h-24 flex-col">
                      <Camera className="h-8 w-8 mb-2" />
                      Take Photo
                    </Button>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="h-24 flex-col">
                      <Upload className="h-8 w-8 mb-2" />
                      Upload Image
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}

              {isUsingCamera && (
                <div className="space-y-4">
                  <div className="relative">
                    <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <div className="flex justify-center space-x-4">
                    <Button onClick={capturePhoto} size="lg">
                      <Camera className="mr-2 h-5 w-5" />
                      Capture
                    </Button>
                    <Button variant="outline" onClick={resetCapture}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {capturedImage && (
                <div className="space-y-4">
                  <div className="relative">
                    <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full rounded-lg" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">What type of animal is this?</h3>
                      <div className="flex space-x-4">
                        <Button
                          variant={animalType === "frog" ? "default" : "outline"}
                          onClick={() => setAnimalType("frog")}
                          className="flex-1"
                        >
                          🐸 Frog
                          {animalType === "frog" && <Check className="ml-2 h-4 w-4" />}
                        </Button>
                        <Button
                          variant={animalType === "iguana" ? "default" : "outline"}
                          onClick={() => setAnimalType("iguana")}
                          className="flex-1"
                        >
                          🦎 Iguana
                          {animalType === "iguana" && <Check className="ml-2 h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button onClick={proceedToMint} disabled={!animalType} className="flex-1">
                        Proceed to Mint NFT
                      </Button>
                      <Button variant="outline" onClick={resetCapture}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Retake
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
