// Keeps the previous snapshot when npm is unreachable, so a flaky registry never fails a deploy.
import fm from "front-matter"
import fs from "fs/promises"
import path from "path"

const PROJECTS_FILE = path.join(process.cwd(), "src/api/projects.md")
const OUT_FILE = path.join(process.cwd(), "src/data/npm-downloads.json")
const WEEKS = 12

const isoDay = (date) => date.toISOString().slice(0, 10)

async function packageNames() {
  const { attributes } = fm(await fs.readFile(PROJECTS_FILE, "utf8"))
  return attributes.projects
    .filter((project) => project.npm)
    .map((project) => project.npm)
}

async function fetchPackage(name, start, end) {
  const url = `https://api.npmjs.org/downloads/range/${start}:${end}/${name}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`)
  const { downloads } = await response.json()
  const daily = downloads.map((day) => day.downloads)
  const weekly = []
  for (
    let end = daily.length;
    end - 7 >= 0 && weekly.length < WEEKS;
    end -= 7
  ) {
    weekly.unshift(daily.slice(end - 7, end).reduce((a, b) => a + b, 0))
  }
  const lastMonth = daily.slice(-30).reduce((a, b) => a + b, 0)
  return { name, lastWeek: weekly.at(-1) ?? 0, lastMonth, weekly }
}

async function main() {
  // npm's range data lags about a day, so end the window yesterday.
  const end = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const start = new Date(end.getTime() - (WEEKS * 7 - 1) * 24 * 60 * 60 * 1000)

  try {
    const names = await packageNames()
    const packages = await Promise.all(
      names.map((name) => fetchPackage(name, isoDay(start), isoDay(end))),
    )
    const snapshot = {
      fetchedAt: new Date().toISOString(),
      through: isoDay(end),
      packages,
    }
    await fs.writeFile(OUT_FILE, JSON.stringify(snapshot, null, 2) + "\n")
    console.log(
      `npm downloads: ${packages.map((p) => `${p.name} ${p.lastWeek}/wk`).join(", ")}`,
    )
  } catch (error) {
    try {
      await fs.access(OUT_FILE)
      console.warn(
        `npm downloads fetch failed, keeping stale snapshot: ${error.message}`,
      )
    } catch {
      throw error
    }
  }
}

main()
