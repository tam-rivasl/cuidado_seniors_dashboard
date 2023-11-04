import Navbar from '../components/Navbar';
import Home from '../components/Home';
import About from '../components/About';
import Team from '../components/Nurses';
import Plans from '../components/Plans';
import Contact from '../components/Contact';

const HomePage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Home />
      <About />
      <Team />
      <Plans />
      <Contact />
    </div>
  );
};

export default HomePage;
