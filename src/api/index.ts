import fm from "front-matter"
import fs from "fs/promises"
import { marked } from "marked"
import path from "path"
import { cache } from "react"

interface FrontMatterAttributes {
  [key: string]: any;
}

interface FrontMatterContent {
  attributes: FrontMatterAttributes;
  content: string;
  html: string;
}

interface Result {
  [key: string]: FrontMatterContent;
}
export async function api(): Promise<Result> {
  const dataDir = path.join(process.cwd(), "src/api/")
  const files = await fs.readdir(dataDir)

  const result: Result = {}

  for (const file of files) {
    if (path.extname(file) === ".md") {
      const filePath = path.join(dataDir, file)
      const fileContent = await fs.readFile(filePath, "utf8")
      const { attributes, body } = fm<FrontMatterAttributes>(fileContent)
      const fileNameWithoutExt = path.basename(file, ".md")
      const html = await marked(body)

      result[fileNameWithoutExt] = {
        attributes,
        content: body,
        html,
      }
    }
  }
  return result
}

const getApiData = cache(api)

export default getApiData
