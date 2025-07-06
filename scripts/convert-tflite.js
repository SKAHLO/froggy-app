/**
 * Script to convert TensorFlow Lite model to TensorFlow.js format
 * Run this script to convert your .tflite model for use with the backend
 */

const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

const TFLITE_MODEL_PATH = "./models/amphibian_detector.tflite"
const OUTPUT_DIR = "./models/converted"

async function convertModel() {
  try {
    console.log("🔄 Converting TensorFlow Lite model to TensorFlow.js format...")

    // Check if TFLite model exists
    if (!fs.existsSync(TFLITE_MODEL_PATH)) {
      console.error("❌ TFLite model not found at:", TFLITE_MODEL_PATH)
      console.log("📝 Please place your amphibian_detector.tflite file in the models directory")
      return
    }

    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true })
    }

    // Convert using tensorflowjs_converter
    const command = `tensorflowjs_converter --input_format=tf_lite --output_format=tfjs_layers_model ${TFLITE_MODEL_PATH} ${OUTPUT_DIR}`

    console.log("🚀 Running conversion command...")
    console.log(command)

    execSync(command, { stdio: "inherit" })

    console.log("✅ Model conversion completed!")
    console.log("📁 Converted model saved to:", OUTPUT_DIR)
    console.log("🔧 Update your server.js to load from:", path.join(OUTPUT_DIR, "model.json"))
  } catch (error) {
    console.error("❌ Error converting model:", error.message)
    console.log("\n📋 To install tensorflowjs_converter:")
    console.log("pip install tensorflowjs")
    console.log("\n📖 Or use the online converter:")
    console.log("https://www.tensorflow.org/js/guide/conversion")
  }
}

convertModel()
