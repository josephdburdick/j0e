const fs = require("fs")
const path = require("path")
const sharp = require("sharp")
const { parse } = require("svg-parser")

async function getDimensions(filePath) {
  const ext = path.extname(filePath).toLowerCase()

  if ([".svg"].includes(ext)) {
    const content = fs.readFileSync(filePath, "utf8")
    const parsed = parse(content)
    const svg = parsed.children[0]
    const viewBox = svg.properties.viewBox
    if (viewBox) {
      const [, , width, height] = viewBox.split(" ").map(Number)
      return { width, height }
    }
    const width = parseInt(svg.properties.width) || 200
    const height = parseInt(svg.properties.height) || 200
    return { width, height }
  }

  if ([".png", ".jpg", ".jpeg", ".webp"].includes(ext)) {
    const metadata = await sharp(filePath).metadata()
    return {
      width: metadata.width,
      height: metadata.height,
    }
  }

  return null
}

async function processLogos() {
  const logoDir = path.join(process.cwd(), "public/assets/images/logos")
  const files = fs.readdirSync(logoDir).filter((file) => !file.startsWith("."))

  const results = {}

  for (const file of files) {
    const filePath = path.join(logoDir, file)
    try {
      const dimensions = await getDimensions(filePath)
      if (dimensions) {
        results[file] = {
          src: `\${basePath}/assets/images/logos/${file}`,
          ...dimensions,
        }
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error)
    }
  }

  console.log(JSON.stringify(results, null, 2))
}

processLogos()
