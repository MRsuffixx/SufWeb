import { Navbar } from "~/components/layout/Navbar";
import { Hero } from "~/components/sections/Hero";
import { About } from "~/components/sections/About";
import { Skills } from "~/components/sections/Skills";
import { Portfolio } from "~/components/sections/Portfolio";
import { Contact } from "~/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} aria-label="Portfolio main content">
        <Hero />
        <About />
        <Skills />
        <Portfolio />
        <Contact />
      </main>
    </>
  );
}
