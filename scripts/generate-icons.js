const sharp = require("sharp")
const fs = require("fs")
const path = require("path")

const sizes = [192, 512]
const inputFile = path.join(
  __dirname,
  "../public/assets/images/logo--solid.svg",
)
const outputDir = path.join(__dirname, "../public")

async function generateIcons() {
  for (const size of sizes) {
    await sharp(inputFile)
      .resize(size, size)
      .png()
      .toFile(path.join(outputDir, `icon-${size}x${size}.png`))

    console.log(`Generated ${size}x${size} icon`)
  }
}

generateIcons().catch(console.error)
