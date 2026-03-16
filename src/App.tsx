import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, BookOpen, Clock, Globe } from 'lucide-react';

// Clarity integration
const initClarity = () => {
  const projectId = 'vwf2l0i0wu';
  // @ts-ignore
  (function (c, l, a, r, i, t, y) {
    // @ts-ignore
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
    // @ts-ignore
    t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
    // @ts-ignore
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", projectId);
};
// This tells TypeScript that 'clarity' is a valid function on the window object
declare global {
  interface Window {
    clarity: (action: string, name: string, value?: string) => void;
  }
}
// Track events in Clarity
const trackClarityEvent = (eventName: string, eventValue: string) => {
  // @ts-ignore
  if (window.clarity) {
    // @ts-ignore
    window.clarity("set", eventName, eventValue);
  }
};

const scientists = [
  {
    id: 1,
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Tesla_circa_1890.jpeg',
    name: 'Nikola Tesla',
    field: 'Electrical Engineering',
    century: '19th/20th Century',
    primaryInvention: 'Alternating Current (AC) & Tesla Coil',
    inventionDescription: 'Developed the alternating current electricity supply system, including the AC motor and the high-voltage resonant transformer known as the Tesla coil.',
    year: '1887 / 1891',
    impact: 'Standardized the global electrical grid, electrifying the modern world and laying the groundwork for wireless technologies.'
  },
  {
    id: 2,
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Marie_Curie_c._1920s.jpg',
    name: 'Marie Curie',
    field: 'Physics / Chemistry',
    century: '19th/20th Century',
    primaryInvention: 'Discovery of Radium & Polonium (Radioactivity)',
    inventionDescription: 'Pioneering research on radioactivity, leading to the discovery of two new elements, polonium and radium, and the development of techniques for isolating radioactive isotopes.',
    year: '1898',
    impact: 'Fundamentally changed physics and chemistry, and led directly to the development of X-ray machines and radiation therapy for treating cancer.'
  },
  {
    id: 3,
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/39/GodfreyKneller-IsaacNewton-1689.jpg',
    name: 'Isaac Newton',
    field: 'Physics',
    century: '17th Century',
    primaryInvention: 'Laws of Motion & Universal Gravitation',
    inventionDescription: 'Formulated the three laws of motion and the law of universal gravitation, effectively uniting the heavens and the earth under a single set of mathematical principles.',
    year: '1687',
    impact: 'Provided the foundation for classical mechanics, enabling the industrial revolution, modern engineering, and space exploration.'
  },
  {
    id: 4,
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Einstein_1921_by_F_Schmutzer_-_restoration.jpg',
    name: 'Albert Einstein',
    field: 'Theoretical Physics',
    century: '20th Century',
    primaryInvention: 'Theory of Relativity (E=mc²)',
    inventionDescription: 'A fundamental theory in physics that describes the relationship between space, time, and gravity, demonstrating that mass and energy are interchangeable.',
    year: '1905 / 1915',
    impact: 'Revolutionized our understanding of the universe, paved the way for modern astrophysics, nuclear energy, and even the GPS technology we rely on daily.'
  },
  {
    id: 5,
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Thomas_Edison2.jpg',
    name: 'Thomas Edison',
    field: 'Engineering',
    century: '19th/20th Century',
    primaryInvention: 'Incandescent Light Bulb & Motion Picture Camera',
    inventionDescription: 'Developed many devices in fields such as electric power generation, mass communication, sound recording, and motion pictures, most notably the practical incandescent light bulb.',
    year: '1879 / 1891',
    impact: 'Ushered in the era of electrical power distribution, sound recording, and modern cinema, fundamentally transforming human life.'
  },
  {
    id: 6,
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Alexander-fleming.jpg/500px-Alexander-fleming.jpg',
    name: 'Alexander Fleming',
    field: 'Medicine',
    century: '20th Century',
    primaryInvention: 'Penicillin (First Antibiotic)',
    inventionDescription: 'Discovered benzylpenicillin (Penicillin G) from the mould Penicillium rubens in 1928, marking the dawn of the antibiotic age.',
    year: '1928',
    impact: 'Revolutionized modern medicine by saving millions of lives from previously fatal bacterial infections and making modern complex surgeries possible.'
  },
  {
    id: 7,
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Justus_Sustermans_-_Portrait_of_Galileo_Galilei%2C_1636.jpg',
    name: 'Galileo Galilei',
    field: 'Astronomy',
    century: '17th Century',
    primaryInvention: 'Improved Telescope & Law of Falling Bodies',
    inventionDescription: 'Dramatically improved the telescope, observing Jupiter\'s moons and sunspots, and formulated the law of falling bodies, challenging Aristotelian physics.',
    year: '1609 / 1638',
    impact: 'Overthrew the geocentric view of the universe, establishing the scientific method and permanently altering humanity\'s place in the cosmos.'
  },
  {
    id: 8,
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Charles_Darwin_seated_crop.jpg',
    name: 'Charles Darwin',
    field: 'Biology',
    century: '19th Century',
    primaryInvention: 'Theory of Evolution by Natural Selection',
    inventionDescription: 'Proposed that all species of life have descended over time from common ancestors, pushed forward by the mechanism he called natural selection.',
    year: '1859',
    impact: 'Provided the unifying foundational concept of all biological sciences, fundamentally changing our understanding of life on Earth.'
  },
  {
    id: 9,
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Ada_Lovelace_portrait.jpg',
    name: 'Ada Lovelace',
    field: 'Computer Science',
    century: '19th Century',
    primaryInvention: 'First Computer Algorithm',
    inventionDescription: 'Wrote the first algorithm designed to be carried out by a machine (Charles Babbage\'s Analytical Engine), recognizing that computers could do more than just crunch numbers.',
    year: '1843',
    impact: 'Laid the conceptual groundwork for modern programming, foreseeing the potential of computing technology a full century before the first computer was built.'
  },
  {
    id: 10,
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Louis_Pasteur%2C_foto_av_Paul_Nadar%2C_Crisco_edit.jpg',
    name: 'Louis Pasteur',
    field: 'Microbiology',
    century: '19th Century',
    primaryInvention: 'Pasteurization & Rabies Vaccine',
    inventionDescription: 'Discovered the principles of vaccination, microbial fermentation, and pasteurization, proving that microorganisms cause disease.',
    year: '1864 / 1885',
    impact: 'Virtually eliminated many fatal diseases through vaccination, secured the safety of the food and beverage industry, and founded modern microbiology.'
  }
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScientist, setSelectedScientist] = useState<null | typeof scientists[0]>(null);
  const [visitorIp, setVisitorIp] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        setVisitorIp(data.ip);
        // This sends the IP to your Clarity Dashboard under "Custom Tags"
        if (window.clarity) {
          window.clarity("set", "Raw_IP", data.ip);
        }
        // OPTIONAL: Log it to your own console or a hidden endpoint
        console.log("Logged IP:", data.ip);
      })
      .catch(error => console.error('Error fetching IP:', error));
  }, []);

  useEffect(() => {
    initClarity();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 2) {
      trackClarityEvent("Search", value);
    }
  };

  const openModal = (sci: typeof scientists[0]) => {
    setSelectedScientist(sci);
    trackClarityEvent("Viewed_Invention", sci.primaryInvention);
    trackClarityEvent("Viewed_Scientist", sci.name);
  };

  const filteredScientists = useMemo(() => {
    return scientists.filter(sci =>
      sci.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sci.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sci.century.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sci.primaryInvention.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] selection:bg-white selection:text-black font-sans antialiased">
      <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold tracking-tighter uppercase cursor-default">Greatest Inventions Gallery</h1>
            <p className="text-sm text-white/40 tracking-[0.2em] uppercase mt-1">Museum Digital Archive</p>
          </div>
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-white transition-colors" />
            <input
              type="text"
              placeholder="Search by name, century, field..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all text-xs uppercase tracking-widest placeholder:text-white/30"
              value={searchTerm}
              onChange={handleSearch}
              data-clarity-mask="true"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
        <motion.div layout className="masonry-grid">
          <AnimatePresence>
            {filteredScientists.map((sci) => (
              <motion.div
                key={sci.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="masonry-item relative group overflow-hidden cursor-pointer bg-[#111] border border-white/5"
                onClick={() => openModal(sci)}
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-[#1a1a1a]">
                  <img
                    src={sci.url}
                    alt={sci.name}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-105 filter grayscale-[80%] group-hover:grayscale-0"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col justify-end">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">{sci.field}</span>
                        <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                        <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">{sci.century}</span>
                      </div>
                      <h2 className="text-3xl font-light tracking-tight mb-2 text-white">{sci.name}</h2>

                      <div className="h-px w-8 bg-white/20 my-4 group-hover:w-full transition-all duration-700 ease-[0.16,1,0.3,1]"></div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        <p className="text-xs uppercase tracking-[0.15em] text-white/40 mb-1">Quick View</p>
                        <p className="text-sm font-medium text-white/90">{sci.primaryInvention}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredScientists.length === 0 && (
          <div className="text-center py-32 flex flex-col items-center justify-center opacity-50">
            <Search className="w-12 h-12 mb-6" />
            <p className="uppercase tracking-[0.3em] text-sm">No archives found.</p>
          </div>
        )}
      </main>

      <AnimatePresence>
        {selectedScientist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-black/98 backdrop-blur-xl overflow-y-auto"
            onClick={() => setSelectedScientist(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-6 right-6 p-4 bg-white/5 hover:bg-white hover:text-black rounded-full transition-all z-50 mix-blend-difference"
              onClick={(e) => { e.stopPropagation(); setSelectedScientist(null); }}
            >
              <X className="w-6 h-6" />
            </motion.button>

            <motion.div
              layoutId={`img-${selectedScientist.id}`}
              className="relative max-w-6xl w-full flex flex-col lg:flex-row bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden my-auto mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="lg:w-2/5 flex flex-col border-b lg:border-b-0 lg:border-r border-white/10 relative overflow-hidden bg-[#111]">
                {/* Fixed Image Container */}
                <div className="relative w-full aspect-[3/4] lg:h-full lg:absolute lg:inset-0 bg-black">
                  <img
                    src={selectedScientist.url}
                    alt={selectedScientist.name}
                    className="w-full h-full object-contain sm:object-cover filter grayscale-[40%] hover:grayscale-0 transition-all duration-700 mx-auto"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent lg:from-[#0a0a0a] lg:via-[#0a0a0a]/40" />
                </div>

                {/* Superimposed Content */}
                <div className="relative z-10 p-8 lg:p-12 flex flex-col justify-end h-full">
                  <div className="space-y-2 mt-auto">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">Archive Record /// {selectedScientist.id.toString().padStart(4, '0')}</p>
                    <h3 className="text-5xl lg:text-7xl font-light tracking-tighter uppercase leading-none text-white">{selectedScientist.name}</h3>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">Field of Science</p>
                      <p className="text-sm font-medium tracking-wide text-white/90">{selectedScientist.field}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">Era</p>
                      <p className="text-sm font-medium tracking-wide text-white/90">{selectedScientist.century}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-3/5 p-8 lg:p-16 flex flex-col justify-center bg-[#050505] relative z-10">
                <div className="mb-4 inline-flex items-center px-3 py-1 bg-white/5 border border-white/10 rounded-sm w-fit">
                  <Clock className="w-4 h-4 mr-2 text-white/60" />
                  <span className="text-xs font-mono tracking-widest text-white/80">YEAR OF BREAKTHROUGH: {selectedScientist.year}</span>
                </div>

                <h4 className="text-3xl lg:text-4xl font-medium tracking-tight mb-8 text-white">{selectedScientist.primaryInvention}</h4>

                <div className="space-y-10">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <BookOpen className="w-5 h-5 text-white/40" />
                      <h5 className="text-xs uppercase tracking-[0.2em] text-white/40">The Discovery</h5>
                    </div>
                    <p className="text-lg leading-relaxed text-white/80 font-light pl-8 border-l border-white/10">{selectedScientist.inventionDescription}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Globe className="w-5 h-5 text-white/40" />
                      <h5 className="text-xs uppercase tracking-[0.2em] text-white/40">Modern Impact</h5>
                    </div>
                    <p className="text-lg leading-relaxed text-white/80 font-light pl-8 border-l border-white/10">{selectedScientist.impact}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-0 w-full bg-[#050505]/90 backdrop-blur-md border-t border-white/10 py-2 px-4 flex justify-end z-40 pointer-events-none">
        <div className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
          Visitor Metadata: {visitorIp ? `IP-${visitorIp}` : 'Acquiring...'}
        </div>
      </footer>
    </div>
  );
}
