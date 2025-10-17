import { marked } from "marked"

function convertNewLinesToHTML(inputString: string) {
  // Use marked to parse markdown and convert newlines to proper HTML
  const htmlString = marked(inputString, {
    breaks: true, // Convert newlines to <br> tags
    gfm: true, // Enable GitHub Flavored Markdown
  }) as string

  return htmlString
}
export default convertNewLinesToHTML
