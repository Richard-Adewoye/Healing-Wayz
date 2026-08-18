import HeroSection from './components/HeroSection';
import SectionTwo from './components/SectionTwo';
import SectionThree from './components/SectionThree';
import SectionFour from './components/SectionFour';
import SectionFive from './components/SectionFive';
import SectionSix from './components/SectionSix';
import SectionSeven from './components/SectionSeven';
import SectionEight from './components/SectionEight';
import SectionNine from './components/SectionNine';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <SectionTwo />
      <SectionThree />
      <SectionFour />
      <SectionFive />
      <SectionSix />
      <SectionSeven />
      <SectionEight />
      <SectionNine />
      <Footer />
    </main>
  );
}