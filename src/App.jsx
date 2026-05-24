import React, { useState, useEffect, useRef } from 'react';

const HarvardBlockchainClub = () => {
  const [activePage, setActivePage] = useState('home');
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePos({ 
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, [activePage]);

  // HUBC Logo Component
  const HUBCLogo = ({ height = 55 }) => (
    <img 
      src="/hubc_black (1).png"
      alt="Harvard Undergraduate Blockchain Club"
      style={{ height: height, width: 'auto' }}
    />
  );

  // Parallax Floating Blocks - React to mouse movement
  const ParallaxBlocks = () => (
    <>
      {[
        { left: '3%', top: '15%', size: 60, depth: 0.02, delay: 0 },
        { left: '8%', top: '40%', size: 35, depth: 0.03, delay: 0.5 },
        { left: '5%', top: '65%', size: 50, depth: 0.015, delay: 1 },
        { left: '15%', top: '25%', size: 25, depth: 0.04, delay: 0.3 },
        { left: '20%', top: '55%', size: 40, depth: 0.025, delay: 0.8 },
        { left: '85%', top: '20%', size: 45, depth: 0.02, delay: 0.2 },
        { left: '90%', top: '45%', size: 55, depth: 0.015, delay: 0.6 },
        { left: '88%', top: '70%', size: 30, depth: 0.035, delay: 0.9 },
        { left: '78%', top: '30%', size: 28, depth: 0.03, delay: 0.4 },
        { left: '82%', top: '80%', size: 38, depth: 0.02, delay: 1.1 },
        { left: '25%', top: '80%', size: 22, depth: 0.045, delay: 0.7 },
        { left: '70%', top: '15%', size: 32, depth: 0.025, delay: 0.1 },
      ].map((block, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: block.left,
            top: block.top,
            width: block.size,
            height: block.size,
            border: `1px solid rgba(165, 28, 48, ${0.12 + (i % 3) * 0.08})`,
            background: `linear-gradient(135deg, rgba(165, 28, 48, 0.03) 0%, transparent 100%)`,
            transform: `translate(${mousePos.x * block.depth * 100}px, ${mousePos.y * block.depth * 100}px) rotate(${45 + mousePos.x * 10}deg)`,
            transition: 'transform 0.3s ease-out',
            animation: `float ${8 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${block.delay}s`,
          }}
        />
      ))}
    </>
  );

  // Animated Counter Component
  const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);
    
    useEffect(() => {
      if (!visibleSections['stats-section']) return;
      
      let startTime;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, [visibleSections['stats-section'], end, duration]);
    
    return <span>{count}{suffix}</span>;
  };

  // Navigation
  const Navigation = () => (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      padding: '20px 60px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: scrollY > 50 ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
      backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 1000,
      borderBottom: scrollY > 50 ? '1px solid rgba(165, 28, 48, 0.08)' : 'none',
    }}>
      <div 
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => setActivePage('home')}
      >
        <HUBCLogo height={50} />
      </div>
      
      <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
        {[
          { label: 'About', page: 'home' },
          { label: 'Initiatives', page: 'initiatives' },
          { label: 'Team', page: 'team' },
        ].map((item) => (
          <a
            key={item.label}
            onClick={() => setActivePage(item.page)}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              color: activePage === item.page ? '#A51C30' : '#1a1a1a',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
            }}
          >
            {item.label}
          </a>
        ))}
        <button style={{
          padding: '12px 28px',
          background: '#A51C30',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontFamily: "'Inter', sans-serif",
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}>
          Contact
        </button>
      </div>
    </nav>
  );

  // Interactive Harvard Skyline Component with scroll animation
  const InteractiveHarvardSkyline = () => {
    const [hoveredBuilding, setHoveredBuilding] = useState(null);
    
    // Buildings grow and become more visible as you scroll, but stay anchored at bottom
    const buildingScale = 1 + Math.min(scrollY * 0.0002, 0.05);
    const buildingOpacity = Math.min(0.4 + scrollY * 0.002, 1);
    
    return (
      <svg 
        style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: '50%', 
          transform: `translateX(-50%) scale(${buildingScale})`,
          transformOrigin: 'bottom center',
          opacity: isLoaded ? buildingOpacity : 0,
          transition: 'opacity 0.5s ease-out',
        }} 
        width="1400" 
        height="260" 
        viewBox="0 0 1400 260" 
        fill="none"
      >
        <defs>
          <linearGradient id="groundGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A51C30" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#A51C30" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#A51C30" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        {/* Ground line */}
        <line x1="0" y1="250" x2="1400" y2="250" stroke="url(#groundGlow)" strokeWidth="2" />
        <ellipse cx="700" cy="255" rx="600" ry="12" fill="url(#groundGlow)" opacity="0.3" />
        
        {/* Left Dorm Building - Kirkland */}
        <g 
          style={{ 
            cursor: 'pointer',
            transition: 'all 0.4s ease',
            transform: `translateY(${hoveredBuilding === 'left' ? -8 : 0}px)`,
            filter: hoveredBuilding === 'left' ? 'drop-shadow(0 0 20px rgba(165, 28, 48, 0.4))' : 'none',
          }}
          onMouseEnter={() => setHoveredBuilding('left')}
          onMouseLeave={() => setHoveredBuilding(null)}
        >
          <rect x="50" y="160" width="160" height="100" fill="none" stroke="#A51C30" strokeWidth={hoveredBuilding === 'left' ? 2 : 1.5} />
          <polygon points="50,160 130,115 210,160" fill="none" stroke="#A51C30" strokeWidth={hoveredBuilding === 'left' ? 2 : 1.5} />
          {/* Dormer windows */}
          <rect x="85" y="128" width="18" height="22" fill="none" stroke="#A51C30" strokeWidth="1" opacity="0.7" />
          <rect x="155" y="128" width="18" height="22" fill="none" stroke="#A51C30" strokeWidth="1" opacity="0.7" />
          {/* Windows */}
          {[0,1,2,3].map(i => (
            <g key={`left-win-${i}`}>
              <rect x={65 + i * 35} y="175" width="18" height="28" fill="none" stroke="#A51C30" strokeWidth="1" opacity={hoveredBuilding === 'left' ? 0.9 : 0.5} />
              <rect x={65 + i * 35} y="215" width="18" height="28" fill="none" stroke="#A51C30" strokeWidth="1" opacity={hoveredBuilding === 'left' ? 0.9 : 0.5} />
            </g>
          ))}
          {/* Chimneys */}
          <rect x="70" y="120" width="10" height="35" fill="none" stroke="#A51C30" strokeWidth="1.5" />
          <rect x="180" y="120" width="10" height="35" fill="none" stroke="#A51C30" strokeWidth="1.5" />
          {hoveredBuilding === 'left' && (
            <text x="130" y="268" textAnchor="middle" fill="#A51C30" fontSize="11" fontFamily="Inter" fontWeight="500">Kirkland House</text>
          )}
        </g>
        
        {/* Center Left Building - Adams House style */}
        <g 
          style={{ 
            cursor: 'pointer',
            transition: 'all 0.4s ease',
            transform: `translateY(${hoveredBuilding === 'centerLeft' ? -8 : 0}px)`,
            filter: hoveredBuilding === 'centerLeft' ? 'drop-shadow(0 0 20px rgba(165, 28, 48, 0.4))' : 'none',
          }}
          onMouseEnter={() => setHoveredBuilding('centerLeft')}
          onMouseLeave={() => setHoveredBuilding(null)}
        >
          <rect x="260" y="140" width="180" height="120" fill="none" stroke="#A51C30" strokeWidth={hoveredBuilding === 'centerLeft' ? 2 : 1.5} />
          <polygon points="260,140 350,85 440,140" fill="none" stroke="#A51C30" strokeWidth={hoveredBuilding === 'centerLeft' ? 2 : 1.5} />
          {/* Cupola */}
          <rect x="330" y="55" width="40" height="30" fill="none" stroke="#A51C30" strokeWidth="1.5" />
          <polygon points="330,55 350,35 370,55" fill="none" stroke="#A51C30" strokeWidth="1.5" />
          {/* Windows grid */}
          {[0,1,2,3,4].map(i => (
            <g key={`cl-win-${i}`}>
              <rect x={275 + i * 32} y="155" width="16" height="26" fill="none" stroke="#A51C30" strokeWidth="1" opacity={hoveredBuilding === 'centerLeft' ? 0.9 : 0.5} />
              <rect x={275 + i * 32} y="190" width="16" height="26" fill="none" stroke="#A51C30" strokeWidth="1" opacity={hoveredBuilding === 'centerLeft' ? 0.9 : 0.5} />
              <rect x={275 + i * 32} y="225" width="16" height="26" fill="none" stroke="#A51C30" strokeWidth="1" opacity={hoveredBuilding === 'centerLeft' ? 0.9 : 0.5} />
            </g>
          ))}
          {/* Main entrance */}
          <rect x="335" y="230" width="28" height="30" fill="none" stroke="#A51C30" strokeWidth="1.5" />
          <path d="M335,230 Q349,222 363,230" fill="none" stroke="#A51C30" strokeWidth="1.5" />
          {hoveredBuilding === 'centerLeft' && (
            <text x="350" y="268" textAnchor="middle" fill="#A51C30" fontSize="11" fontFamily="Inter" fontWeight="500">Adams House</text>
          )}
        </g>
        
        {/* LOWELL HOUSE - Center Tower (Main Feature) */}
        <g 
          style={{ 
            cursor: 'pointer',
            transition: 'all 0.4s ease',
            transform: `translateY(${hoveredBuilding === 'lowell' ? -12 : 0}px)`,
            filter: hoveredBuilding === 'lowell' ? 'drop-shadow(0 0 30px rgba(165, 28, 48, 0.5))' : 'drop-shadow(0 0 10px rgba(165, 28, 48, 0.15))',
          }}
          onMouseEnter={() => setHoveredBuilding('lowell')}
          onMouseLeave={() => setHoveredBuilding(null)}
        >
          {/* Main building base */}
          <rect x="500" y="175" width="280" height="85" fill="none" stroke="#A51C30" strokeWidth={hoveredBuilding === 'lowell' ? 2.5 : 2} />
          
          {/* Tower base */}
          <rect x="590" y="105" width="100" height="70" fill="none" stroke="#A51C30" strokeWidth={hoveredBuilding === 'lowell' ? 2.5 : 2} />
          
          {/* Tower middle section */}
          <rect x="605" y="60" width="70" height="45" fill="none" stroke="#A51C30" strokeWidth={hoveredBuilding === 'lowell' ? 2.5 : 2} />
          
          {/* Bell tower / Cupola */}
          <rect x="618" y="30" width="44" height="30" fill="none" stroke="#A51C30" strokeWidth={hoveredBuilding === 'lowell' ? 2.5 : 2} />
          
          {/* Spire top */}
          <polygon points="640,30 618,30 640,5 662,30" fill="none" stroke="#A51C30" strokeWidth={hoveredBuilding === 'lowell' ? 2.5 : 2} />
          
          {/* Clock face */}
          <circle cx="640" cy="45" r="10" fill="none" stroke="#A51C30" strokeWidth="1.5" />
          <line x1="640" y1="45" x2="640" y2="38" stroke="#A51C30" strokeWidth="1.5" />
          <line x1="640" y1="45" x2="645" y2="45" stroke="#A51C30" strokeWidth="1.5" />
          
          {/* Arched windows on tower */}
          {[0,1,2].map(i => (
            <path key={`arch-${i}`} d={`M${615 + i * 22},105 L${615 + i * 22},85 Q${626 + i * 22},77 ${637 + i * 22},85 L${637 + i * 22},105`} 
              fill="none" stroke="#A51C30" strokeWidth="1" opacity={hoveredBuilding === 'lowell' ? 0.9 : 0.6} />
          ))}
          
          {/* Main building windows */}
          {[0,1,2,3,4,5,6,7].map(i => (
            <g key={`lowell-win-${i}`}>
              <rect x={512 + i * 32} y="188" width="18" height="28" fill="none" stroke="#A51C30" strokeWidth="1" opacity={hoveredBuilding === 'lowell' ? 0.9 : 0.5} />
              <rect x={512 + i * 32} y="225" width="18" height="25" fill="none" stroke="#A51C30" strokeWidth="1" opacity={hoveredBuilding === 'lowell' ? 0.9 : 0.5} />
            </g>
          ))}
          
          {/* Grand entrance */}
          <rect x="622" y="225" width="36" height="35" fill="none" stroke="#A51C30" strokeWidth="2" />
          <path d="M622,225 Q640,212 658,225" fill="none" stroke="#A51C30" strokeWidth="2" />
          
          {/* Decorative pediment */}
          <polygon points="590,105 640,72 690,105" fill="none" stroke="#A51C30" strokeWidth="1.5" opacity="0.7" />
          
          {hoveredBuilding === 'lowell' && (
            <text x="640" y="268" textAnchor="middle" fill="#A51C30" fontSize="12" fontFamily="Inter" fontWeight="600">Lowell House</text>
          )}
        </g>
        
        {/* Center Right Building - Eliot House style */}
        <g 
          style={{ 
            cursor: 'pointer',
            transition: 'all 0.4s ease',
            transform: `translateY(${hoveredBuilding === 'centerRight' ? -8 : 0}px)`,
            filter: hoveredBuilding === 'centerRight' ? 'drop-shadow(0 0 20px rgba(165, 28, 48, 0.4))' : 'none',
          }}
          onMouseEnter={() => setHoveredBuilding('centerRight')}
          onMouseLeave={() => setHoveredBuilding(null)}
        >
          <rect x="840" y="150" width="160" height="110" fill="none" stroke="#A51C30" strokeWidth={hoveredBuilding === 'centerRight' ? 2 : 1.5} />
          <polygon points="840,150 920,100 1000,150" fill="none" stroke="#A51C30" strokeWidth={hoveredBuilding === 'centerRight' ? 2 : 1.5} />
          {/* Bell tower */}
          <rect x="900" y="65" width="40" height="35" fill="none" stroke="#A51C30" strokeWidth="1.5" />
          <polygon points="900,65 920,45 940,65" fill="none" stroke="#A51C30" strokeWidth="1.5" />
          {/* Windows */}
          {[0,1,2,3].map(i => (
            <g key={`cr-win-${i}`}>
              <rect x={855 + i * 36} y="165" width="18" height="28" fill="none" stroke="#A51C30" strokeWidth="1" opacity={hoveredBuilding === 'centerRight' ? 0.9 : 0.5} />
              <rect x={855 + i * 36} y="205" width="18" height="28" fill="none" stroke="#A51C30" strokeWidth="1" opacity={hoveredBuilding === 'centerRight' ? 0.9 : 0.5} />
            </g>
          ))}
          {/* Chimneys */}
          <rect x="865" y="110" width="10" height="40" fill="none" stroke="#A51C30" strokeWidth="1.5" />
          <rect x="965" y="110" width="10" height="40" fill="none" stroke="#A51C30" strokeWidth="1.5" />
          {hoveredBuilding === 'centerRight' && (
            <text x="920" y="268" textAnchor="middle" fill="#A51C30" fontSize="11" fontFamily="Inter" fontWeight="500">Eliot House</text>
          )}
        </g>
        
        {/* Right Building - Dunster style */}
        <g 
          style={{ 
            cursor: 'pointer',
            transition: 'all 0.4s ease',
            transform: `translateY(${hoveredBuilding === 'right' ? -8 : 0}px)`,
            filter: hoveredBuilding === 'right' ? 'drop-shadow(0 0 20px rgba(165, 28, 48, 0.4))' : 'none',
          }}
          onMouseEnter={() => setHoveredBuilding('right')}
          onMouseLeave={() => setHoveredBuilding(null)}
        >
          <rect x="1060" y="165" width="150" height="95" fill="none" stroke="#A51C30" strokeWidth={hoveredBuilding === 'right' ? 2 : 1.5} />
          <polygon points="1060,165 1135,118 1210,165" fill="none" stroke="#A51C30" strokeWidth={hoveredBuilding === 'right' ? 2 : 1.5} />
          {/* Dormers */}
          <rect x="1095" y="132" width="16" height="22" fill="none" stroke="#A51C30" strokeWidth="1" opacity="0.7" />
          <rect x="1155" y="132" width="16" height="22" fill="none" stroke="#A51C30" strokeWidth="1" opacity="0.7" />
          {/* Windows */}
          {[0,1,2].map(i => (
            <g key={`right-win-${i}`}>
              <rect x={1075 + i * 42} y="180" width="20" height="28" fill="none" stroke="#A51C30" strokeWidth="1" opacity={hoveredBuilding === 'right' ? 0.9 : 0.5} />
              <rect x={1075 + i * 42} y="218" width="20" height="28" fill="none" stroke="#A51C30" strokeWidth="1" opacity={hoveredBuilding === 'right' ? 0.9 : 0.5} />
            </g>
          ))}
          {/* Chimney */}
          <rect x="1180" y="125" width="10" height="40" fill="none" stroke="#A51C30" strokeWidth="1.5" />
          {hoveredBuilding === 'right' && (
            <text x="1135" y="268" textAnchor="middle" fill="#A51C30" fontSize="11" fontFamily="Inter" fontWeight="500">Dunster House</text>
          )}
        </g>
      </svg>
    );
  };

  // Home Page
  const HomePage = () => (
    <>
      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: '#FAFBFC',
        display: 'flex',
        alignItems: 'flex-start',
        paddingTop: '140px',
      }}>
        <ParallaxBlocks />
        <InteractiveHarvardSkyline />
        
        <div style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 60px',
        }}>
          <div style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <div style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              color: '#A51C30',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}>
              Blockchain at Harvard
            </div>
            
            <h1 style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(52px, 8vw, 100px)',
              fontWeight: 700,
              color: '#1a1a1a',
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              marginBottom: '24px',
            }}>
              Building the<br />
              <span style={{ color: '#A51C30' }}>Future</span>
            </h1>
            
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '18px',
              fontWeight: 400,
              color: 'rgba(26, 26, 26, 0.6)',
              maxWidth: '480px',
              lineHeight: 1.6,
              marginBottom: '40px',
            }}>
              Where the next generation of builders learn, ship, and advance the frontier of decentralized technology.
            </p>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <button 
                onClick={() => setActivePage('initiatives')}
                style={{
                  padding: '16px 32px',
                  background: '#1a1a1a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                Explore <span style={{ fontSize: '18px' }}>→</span>
              </button>
              <button 
                onClick={() => setActivePage('team')}
                style={{
                  padding: '16px 32px',
                  background: 'transparent',
                  color: '#1a1a1a',
                  border: '1.5px solid rgba(26, 26, 26, 0.15)',
                  borderRadius: '8px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '15px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}>
                Meet Team
              </button>
            </div>
            
            {/* Scroll indicator */}
            <div style={{
              marginTop: '80px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
              opacity: scrollY > 50 ? 0 : 0.5,
              transition: 'opacity 0.3s ease',
            }}>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '12px',
                fontWeight: 500,
                color: '#A51C30',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>Scroll to explore</span>
              <div style={{
                width: '1px',
                height: '40px',
                background: 'linear-gradient(to bottom, #A51C30, transparent)',
                animation: 'pulse 2s infinite',
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        id="stats-section"
        data-animate
        style={{
          padding: '80px 60px',
          background: '#fff',
        }}
      >
        <div style={{ 
          maxWidth: '1000px', 
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '60px',
          opacity: visibleSections['stats-section'] ? 1 : 0,
          transform: visibleSections['stats-section'] ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {[
            { value: 150, suffix: '+', label: 'Active Members' },
            { value: 12, suffix: '', label: 'Projects Shipped' },
            //{ value: 50, suffix: 'K+', label: 'In Grants Won' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '64px',
                fontWeight: 700,
                color: '#A51C30',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                marginBottom: '12px',
              }}>
                {stat.value === 50 ? '$' : ''}<AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '15px',
                fontWeight: 500,
                color: 'rgba(26, 26, 26, 0.5)',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section 
        id="about-section"
        data-animate
        style={{
          padding: '80px 60px',
          background: '#FAFBFC',
        }}
      >
        <div style={{ 
          maxWidth: '900px', 
          margin: '0 auto',
          textAlign: 'center',
          opacity: visibleSections['about-section'] ? 1 : 0,
          transform: visibleSections['about-section'] ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
        }}>
          <h2 style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '48px',
            fontWeight: 700,
            color: '#1a1a1a',
            letterSpacing: '-0.03em',
            marginBottom: '32px',
          }}>
            Pioneering Web3<br />at Harvard
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '18px',
            color: 'rgba(26, 26, 26, 0.6)',
            lineHeight: 1.8,
            maxWidth: '700px',
            margin: '0 auto',
          }}>
            We're a community of students passionate about blockchain technology, 
            decentralized systems, and the future of finance. Through workshops, 
            hackathons, and research initiatives, we're pushing the boundaries of 
            what's possible in the Web3 space.
          </p>
        </div>
      </section>
    </>
  );

  // Initiatives Page
  const InitiativesPage = () => (
    <section style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: '#FAFBFC',
      padding: '140px 60px 100px',
    }}>
      <ParallaxBlocks />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div style={{ 
          marginBottom: '80px',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <h1 style={{ 
            fontFamily: "'Inter', sans-serif", 
            fontSize: 'clamp(48px, 7vw, 80px)', 
            fontWeight: 700, 
            color: '#1a1a1a', 
            letterSpacing: '-0.04em', 
            marginBottom: '24px' 
          }}>
            Our Initiatives
          </h1>
          <p style={{ 
            fontFamily: "'Inter', sans-serif", 
            fontSize: '18px', 
            color: 'rgba(26, 26, 26, 0.6)', 
            maxWidth: '550px', 
            lineHeight: 1.7 
          }}>
            From cutting-edge research to hands-on workshops, we're pushing the boundaries of what's possible.
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {[
            { icon: '🤝', title: '2026 Blockchain and AI Summit at Harvard', desc: 'More to Come.', status: 'Active' },
            { icon: '⛓️', title: 'DeFi Research', desc: 'Exploring decentralized finance protocols, yield strategies, and protocol security.', status: 'Active' },
            { icon: '🔐', title: 'Security Lab', desc: 'Training in smart contract security and conducting audits for campus projects.', status: 'Active' },
            { icon: '📚', title: 'Blockchain 101', desc: 'Weekly workshops introducing blockchain fundamentals to the Harvard community.', status: 'Ongoing' },
            { icon: '🤝', title: 'Industry Connect', desc: 'Experimenting with decentralized governance for club decision-making.', status: 'Beta' },
            { icon: '🤝', title: 'HBC25', desc: 'The Harvard Blockchain Event of 2025.', status: 'Past' },
          ].map((item, i) => (
            <div 
              key={i} 
              style={{ 
                padding: '40px', 
                background: '#fff', 
                borderRadius: '16px',
                border: '1px solid rgba(0,0,0,0.06)',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: `${i * 0.1}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '20px' 
              }}>
                <div style={{ fontSize: '40px' }}>{item.icon}</div>
                <span style={{
                  padding: '6px 12px',
                  background: item.status === 'Active' ? 'rgba(34, 197, 94, 0.1)' : item.status === 'Beta' ? 'rgba(165, 28, 48, 0.1)' : 'rgba(0,0,0,0.05)',
                  color: item.status === 'Active' ? '#16a34a' : item.status === 'Beta' ? '#A51C30' : 'rgba(26,26,26,0.5)',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '6px',
                }}>{item.status}</span>
              </div>
              <h3 style={{ 
                fontFamily: "'Inter', sans-serif", 
                fontSize: '22px', 
                fontWeight: 600, 
                color: '#1a1a1a', 
                marginBottom: '12px' 
              }}>{item.title}</h3>
              <p style={{ 
                fontFamily: "'Inter', sans-serif", 
                fontSize: '15px', 
                color: 'rgba(26, 26, 26, 0.6)', 
                lineHeight: 1.7 
              }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Team Page
  const TeamPage = () => (
    <section style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: '#FAFBFC',
      padding: '140px 60px 100px',
    }}>
      <ParallaxBlocks />
      
      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div style={{ 
          marginBottom: '80px',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <h1 style={{ 
            fontFamily: "'Inter', sans-serif", 
            fontSize: 'clamp(48px, 7vw, 80px)', 
            fontWeight: 700, 
            color: '#1a1a1a', 
            letterSpacing: '-0.04em', 
            marginBottom: '24px' 
          }}>
            Our Team
          </h1>
          <p style={{ 
            fontFamily: "'Inter', sans-serif", 
            fontSize: '18px', 
            color: 'rgba(26, 26, 26, 0.6)', 
            maxWidth: '550px', 
            lineHeight: 1.7 
          }}>
            A passionate group of builders, researchers, and innovators.
          </p>
        </div>
        
        {/* Leadership */}
        <div style={{ marginBottom: '80px' }}>
          <h3 style={{ 
            fontFamily: "'Inter', sans-serif", 
            fontSize: '13px', 
            fontWeight: 600, 
            color: '#A51C30', 
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '32px' 
          }}>Leadership</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            {[
              { 
                name: 'Antonia Kolb', role: 'President', year: "'28",
                // Replace with actual image URL
                photo: '/antonia.JPG'
              },
              { 
                name: 'David Parkes', role: 'Faculty Advisor, John A. Paulson Dean of the Harvard John A. Paulson School of Engineering and Applied Sciences',
                photo: '/david copy.jpeg'
              },
              { 
                name: 'Hudson Brown', role: 'Treasurer', year: "'28",
                photo: '/on boat copy.jpg'
              },
              { 
                name: 'Sasha Minsky', role: 'Head of Growth', year: "'28",
                photo: '/sasha copy.jpg'
              },
              { 
                name: 'Tyler Dang', role: 'Operations Director', year: "'28",
                photo: '/tyler copy.jpeg'
              },  
              { 
                name: 'Will Brunner', role: 'Marketing and Communications Director', year: "'28",
                photo: '/will copy.jpeg'
              },
            ].map((member, i) => (
              <div 
                key={i} 
                style={{
                  padding: '32px',
                  background: '#fff',
                  borderRadius: '16px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: isLoaded ? 1 : 0,
                  transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${i * 0.1}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '100px',
                  height: '100px',
                  margin: '0 auto 20px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid rgba(165, 28, 48, 0.1)',
                }}>
                  <img 
                    src={member.photo} 
                    alt={member.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <h4 style={{ 
                  fontFamily: "'Inter', sans-serif", 
                  fontSize: '18px', 
                  fontWeight: 600, 
                  color: '#1a1a1a', 
                  marginBottom: '4px' 
                }}>{member.name}</h4>
                <div style={{ 
                  fontFamily: "'Inter', sans-serif", 
                  fontSize: '14px', 
                  color: '#A51C30' 
                }}>{member.role} <span style={{ color: 'rgba(26,26,26,0.4)' }}>{member.year}</span></div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          padding: '60px',
          background: '#fff',
          borderRadius: '20px',
          border: '1px solid rgba(0,0,0,0.06)',
          textAlign: 'center',
        }}>
          <h3 style={{ 
            fontFamily: "'Inter', sans-serif", 
            fontSize: '28px', 
            fontWeight: 600, 
            color: '#1a1a1a', 
            marginBottom: '16px' 
          }}>Interested in partnering?</h3>
          <p style={{ 
            fontFamily: "'Inter', sans-serif", 
            fontSize: '16px', 
            color: 'rgba(26,26,26,0.6)', 
            marginBottom: '32px' 
          }}>
            We're always looking to collaborate with organizations pushing Web3 forward.
          </p>
          <button style={{
            padding: '16px 40px',
            background: '#A51C30',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontFamily: "'Inter', sans-serif",
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}>
            Get in Touch →
          </button>
        </div>
      </div>
    </section>
  );

  // Footer
  const Footer = () => (
    <footer style={{ 
      padding: '40px 60px', 
      background: '#fff', 
      borderTop: '1px solid rgba(0,0,0,0.06)' 
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <div style={{ 
          fontFamily: "'Inter', sans-serif", 
          fontSize: '14px', 
          color: 'rgba(26,26,26,0.4)' 
        }}>
          © 2026 Harvard Undergraduate Blockchain Club
        </div>
        <div style={{ display: 'flex', gap: '32px' }}>
          {['X', 'Instagram'].map((social) => (
            <a 
              key={social} 
              href="#" 
              style={{ 
                fontFamily: "'Inter', sans-serif", 
                fontSize: '14px', 
                color: 'rgba(26,26,26,0.5)', 
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.target.style.color = '#A51C30'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(26,26,26,0.5)'}
            >{social}</a>
          ))}
        </div>
      </div>
    </footer>
  );

  // Render
  const renderPage = () => {
    switch(activePage) {
      case 'initiatives': return <InitiativesPage />;
      case 'team': return <TeamPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#FAFBFC' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(45deg); }
          50% { transform: translateY(-20px) rotate(50deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.2); }
        }
        
        button:hover { 
          transform: translateY(-2px) !important; 
          box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
        }
        
        ::selection {
          background: rgba(165, 28, 48, 0.2);
        }
      `}</style>
      
      <Navigation />
      {renderPage()}
      <Footer />
    </div>
  );
};

export default HarvardBlockchainClub;
