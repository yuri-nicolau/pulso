import { About } from "./components/sections/About";
import { ContactForm } from "./components/sections/ContactForm";
import { Features } from "./components/sections/Features";
import { Footer } from "./components/sections/Footer";
import { Gallery } from "./components/sections/Gallery";
import { Header } from "./components/sections/Header";
import { Hero } from "./components/sections/Hero";
import { ServicesMarquee } from "./components/sections/ServicesMarquee";
import { Spaces } from "./components/sections/Spaces";
import { Testimonials } from "./components/sections/Testimonials";

function App() {
  return (
    <main className="overflow-x-hidden bg-white">
      <Header />
      <Hero />
      <ServicesMarquee />

      <div className="flex flex-col gap-32 py-32 sm:gap-40 sm:py-40">
        <About />
        <Spaces />
        <Features />
        <Gallery />
        <Testimonials />
        <ContactForm />
      </div>

      <div className="mt-32 sm:mt-40">
        <Footer />
      </div>
    </main>
  );
}

export default App;
