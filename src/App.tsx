import { Footer } from '@/components/chrome/Footer'
import { Navbar } from '@/components/chrome/Navbar'
import { ScrollProgress } from '@/components/chrome/ScrollProgress'
import { AgentWorkflow } from '@/components/sections/AgentWorkflow'
import { Faq } from '@/components/sections/Faq'
import { Features } from '@/components/sections/Features'
import { FinalCta } from '@/components/sections/FinalCta'
import { Hero } from '@/components/sections/Hero'
import { Marquee } from '@/components/sections/Marquee'
import { Pricing } from '@/components/sections/Pricing'
import { Problem } from '@/components/sections/Problem'
import { ProductExperience } from '@/components/sections/ProductExperience'
import { SocialProof } from '@/components/sections/SocialProof'
import { Testimonials } from '@/components/sections/Testimonials'
import { Workflow } from '@/components/sections/Workflow'
import { Login } from '@/pages/Login'
import { useRoute, useRouteFocus, useRouteTitle } from '@/lib/router'

/**
 * Page composition.
 *
 * The order is the argument: what it is → who trusts it → why the status quo
 * hurts → what it does → proof it is real → the agent claim → how it fits a
 * week → social proof → price → objections → ask.
 *
 * `Marquee` sits between the bento grid and the product window on purpose. The
 * page needs one moment between those two dense blocks that is not a bordered
 * box, or the middle third reads as a single undifferentiated wall.
 */
export default function App() {
  const path = useRoute()
  useRouteFocus(path)
  useRouteTitle(path)

  // Two routes, so a switch is the whole router. `/login` is a page in its own
  // right rather than a dialog over the pitch — see src/pages/Login.tsx.
  if (path === '/login') return <Login />

  return (
    <>
      <ScrollProgress />
      <Navbar />

      <main>
        <Hero />
        <SocialProof />
        <Problem />
        <Features />
        <Marquee />
        <ProductExperience />
        <AgentWorkflow />
        <Workflow />
        <Testimonials />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
    </>
  )
}
