import About from "./_content/About"
import Experience from "./_content/Experience"
import Intro from "./_content/Intro"
import Recommendations from "./_content/Recommendations"

export default async function Home() {
  return (
    <>
      <Intro />
      <Recommendations />
      <Experience />
      <About />
    </>
  )
}
