const sharp = require("sharp")
const tf = require("@tensorflow/tfjs-node")

/**
 * Image processing utilities for ML model input
 */

class ImageProcessor {
  constructor(targetWidth = 224, targetHeight = 224) {
    this.targetWidth = targetWidth
    this.targetHeight = targetHeight
  }

  /**
   * Preprocess image for model input
   */
  async preprocessImage(imagePath) {
    try {
      // Read and resize image
      const imageBuffer = await sharp(imagePath)
        .resize(this.targetWidth, this.targetHeight)
        .removeAlpha()
        .raw()
        .toBuffer()

      // Convert to tensor
      const tensor = tf.tensor3d(new Uint8Array(imageBuffer), [this.targetHeight, this.targetWidth, 3])

      // Normalize pixel values (0-255 to 0-1)
      const normalized = tensor.div(255.0)

      // Add batch dimension
      const batched = normalized.expandDims(0)

      // Clean up intermediate tensor
      tensor.dispose()
      normalized.dispose()

      return batched
    } catch (error) {
      console.error("Error preprocessing image:", error)
      throw error
    }
  }

  /**
   * Postprocess model output
   */
  postprocessPrediction(prediction, classNames = ["frog", "iguana"]) {
    try {
      const probabilities = prediction.dataSync()

      // Find the class with highest probability
      let maxIndex = 0
      let maxProb = probabilities[0]

      for (let i = 1; i < probabilities.length; i++) {
        if (probabilities[i] > maxProb) {
          maxProb = probabilities[i]
          maxIndex = i
        }
      }

      const result = {
        predictedClass: classNames[maxIndex],
        confidence: maxProb,
        probabilities: {},
      }

      // Add all class probabilities
      classNames.forEach((className, index) => {
        result.probabilities[className] = probabilities[index]
      })

      return result
    } catch (error) {
      console.error("Error postprocessing prediction:", error)
      throw error
    }
  }

  /**
   * Get image metadata
   */
  async getImageMetadata(imagePath) {
    try {
      const metadata = await sharp(imagePath).metadata()
      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: metadata.size,
        hasAlpha: metadata.hasAlpha,
        channels: metadata.channels,
      }
    } catch (error) {
      console.error("Error getting image metadata:", error)
      throw error
    }
  }

  /**
   * Validate image format
   */
  isValidImageFormat(mimetype) {
    const validFormats = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    return validFormats.includes(mimetype)
  }
}

module.exports = ImageProcessor
