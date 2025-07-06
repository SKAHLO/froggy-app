const express = require("express")
const cors = require("cors")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const tf = require("@tensorflow/tfjs-node")
const sharp = require("sharp")
const { v4: uuidv4 } = require("uuid")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use("/uploads", express.static("uploads"))

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error("Only image files are allowed!"))
    }
  },
})

// Global variable to store the loaded model
let model = null

// Load TensorFlow Lite model
async function loadModel() {
  try {
    const modelPath = path.join(__dirname, "models", "amphibian_detector.tflite")

    if (!fs.existsSync(modelPath)) {
      console.warn("TFLite model not found. Please place your model at:", modelPath)
      return null
    }

    // For TFLite models, we'll use a different approach
    // Since tfjs-node doesn't directly support .tflite, we'll assume you have a converted model
    // or we'll provide a fallback implementation

    console.log(
      "Model loading functionality ready. Please ensure your TFLite model is converted to TensorFlow.js format.",
    )
    console.log("Expected model path:", modelPath)

    return null // Will be replaced with actual model loading
  } catch (error) {
    console.error("Error loading model:", error)
    return null
  }
}

// Preprocess image for model prediction
async function preprocessImage(imagePath) {
  try {
    // Resize image to model input size (adjust dimensions as needed)
    const imageBuffer = await sharp(imagePath)
      .resize(224, 224) // Common input size, adjust based on your model
      .removeAlpha()
      .raw()
      .toBuffer()

    // Convert to tensor
    const tensor = tf.tensor3d(new Uint8Array(imageBuffer), [224, 224, 3])

    // Normalize pixel values (0-255 to 0-1)
    const normalized = tensor.div(255.0)

    // Add batch dimension
    const batched = normalized.expandDims(0)

    return batched
  } catch (error) {
    console.error("Error preprocessing image:", error)
    throw error
  }
}

// Predict animal type using the model
async function predictAnimalType(imagePath) {
  try {
    if (!model) {
      // Fallback: Simple mock prediction for development
      // In production, this would use your actual TFLite model
      console.log("Using mock prediction - replace with actual model inference")

      // Mock prediction based on filename or random for demo
      const random = Math.random()
      return {
        animalType: random > 0.5 ? "frog" : "iguana",
        confidence: 0.85 + Math.random() * 0.15, // Mock confidence 85-100%
        predictions: {
          frog: random > 0.5 ? 0.85 + Math.random() * 0.15 : Math.random() * 0.4,
          iguana: random <= 0.5 ? 0.85 + Math.random() * 0.15 : Math.random() * 0.4,
        },
      }
    }

    // Actual model prediction (implement when model is available)
    const preprocessed = await preprocessImage(imagePath)
    const prediction = model.predict(preprocessed)
    const probabilities = await prediction.data()

    // Assuming binary classification: [frog_prob, iguana_prob]
    const frogProb = probabilities[0]
    const iguanaProb = probabilities[1]

    const animalType = frogProb > iguanaProb ? "frog" : "iguana"
    const confidence = Math.max(frogProb, iguanaProb)

    // Clean up tensors
    preprocessed.dispose()
    prediction.dispose()

    return {
      animalType,
      confidence,
      predictions: {
        frog: frogProb,
        iguana: iguanaProb,
      },
    }
  } catch (error) {
    console.error("Error predicting animal type:", error)
    throw error
  }
}

// Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    modelLoaded: model !== null,
  })
})

// Upload and analyze image
app.post("/api/analyze-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" })
    }

    const imagePath = req.file.path
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`

    // Predict animal type
    const prediction = await predictAnimalType(imagePath)

    // Get image metadata
    const imageMetadata = await sharp(imagePath).metadata()

    const response = {
      success: true,
      imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      dimensions: {
        width: imageMetadata.width,
        height: imageMetadata.height,
      },
      prediction: {
        animalType: prediction.animalType,
        confidence: Math.round(prediction.confidence * 100) / 100,
        predictions: {
          frog: Math.round(prediction.predictions.frog * 100) / 100,
          iguana: Math.round(prediction.predictions.iguana * 100) / 100,
        },
      },
      timestamp: new Date().toISOString(),
    }

    res.json(response)
  } catch (error) {
    console.error("Error analyzing image:", error)
    res.status(500).json({
      error: "Failed to analyze image",
      message: error.message,
    })
  }
})

// Analyze image from base64 data
app.post("/api/analyze-base64", async (req, res) => {
  try {
    const { imageData, filename } = req.body

    if (!imageData) {
      return res.status(400).json({ error: "No image data provided" })
    }

    // Remove data URL prefix if present
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, "")

    // Generate unique filename
    const uniqueFilename = `${uuidv4()}-${Date.now()}.jpg`
    const imagePath = path.join(uploadsDir, uniqueFilename)

    // Save base64 image to file
    fs.writeFileSync(imagePath, base64Data, "base64")

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${uniqueFilename}`

    // Predict animal type
    const prediction = await predictAnimalType(imagePath)

    // Get image metadata
    const imageMetadata = await sharp(imagePath).metadata()

    const response = {
      success: true,
      imageUrl,
      filename: uniqueFilename,
      originalName: filename || "captured-image.jpg",
      dimensions: {
        width: imageMetadata.width,
        height: imageMetadata.height,
      },
      prediction: {
        animalType: prediction.animalType,
        confidence: Math.round(prediction.confidence * 100) / 100,
        predictions: {
          frog: Math.round(prediction.predictions.frog * 100) / 100,
          iguana: Math.round(prediction.predictions.iguana * 100) / 100,
        },
      },
      timestamp: new Date().toISOString(),
    }

    res.json(response)
  } catch (error) {
    console.error("Error analyzing base64 image:", error)
    res.status(500).json({
      error: "Failed to analyze image",
      message: error.message,
    })
  }
})

// Get image by filename
app.get("/api/image/:filename", (req, res) => {
  const filename = req.params.filename
  const imagePath = path.join(uploadsDir, filename)

  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ error: "Image not found" })
  }

  res.sendFile(imagePath)
})

// Delete image
app.delete("/api/image/:filename", (req, res) => {
  try {
    const filename = req.params.filename
    const imagePath = path.join(uploadsDir, filename)

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: "Image not found" })
    }

    fs.unlinkSync(imagePath)
    res.json({ success: true, message: "Image deleted successfully" })
  } catch (error) {
    console.error("Error deleting image:", error)
    res.status(500).json({
      error: "Failed to delete image",
      message: error.message,
    })
  }
})

// Get model info
app.get("/api/model-info", (req, res) => {
  res.json({
    modelLoaded: model !== null,
    modelPath: path.join(__dirname, "models", "amphibian_detector.tflite"),
    supportedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
    maxFileSize: "10MB",
    inputSize: "224x224",
    classes: ["frog", "iguana"],
  })
})

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large. Maximum size is 10MB." })
    }
  }

  console.error("Unhandled error:", error)
  res.status(500).json({ error: "Internal server error" })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Initialize server
async function startServer() {
  try {
    // Load the ML model
    console.log("Loading TensorFlow Lite model...")
    model = await loadModel()

    if (model) {
      console.log("Model loaded successfully!")
    } else {
      console.log("Running without model (using mock predictions)")
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📁 Upload directory: ${uploadsDir}`)
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
