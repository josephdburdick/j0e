const sharp = require("sharp")
const fs = require("fs")
const path = require("path")

const sizes = [48, 72, 96, 128, 192, 384, 512, 1024]
const inputFile = path.join(
  __dirname,
  "../public/assets/images/logo--solid.svg",
)
const outputDir = path.join(__dirname, "../public/img/icons/favicon")

async function generateIcons() {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  for (const size of sizes) {
    // Generate maskable icon (with padding for safe area)
    const paddedSize = Math.floor(size * 0.8) // 80% of the size for safe area
    const padding = Math.floor((size - paddedSize) / 2)

    await sharp(inputFile)
      .resize(paddedSize, paddedSize)
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .webp({ quality: 90 })
      .toFile(path.join(outputDir, `maskable_icon_x${size}.webp`))

    console.log(`Generated ${size}x${size} maskable icon`)
  }

  // Generate the main 1024x1024 maskable icon
  const mainSize = 1024
  const mainPaddedSize = Math.floor(mainSize * 0.8)
  const mainPadding = Math.floor((mainSize - mainPaddedSize) / 2)

  await sharp(inputFile)
    .resize(mainPaddedSize, mainPaddedSize)
    .extend({
      top: mainPadding,
      bottom: mainPadding,
      left: mainPadding,
      right: mainPadding,
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .webp({ quality: 90 })
    .toFile(path.join(outputDir, "maskable_icon.webp"))

  console.log("Generated main 1024x1024 maskable icon")
}

generateIcons().catch(console.error)
