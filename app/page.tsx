import About from "@/components/about";
import Hero from "@/components/hero";
import Projects from "@/components/projects";
import Journey from "@/components/journey";

export default function Home() {
  return (
    <div className="space-y-10 sm:space-y-16">
      <Hero />
      <About />
      <Journey />
      <Projects />
    </div>
  );
}
