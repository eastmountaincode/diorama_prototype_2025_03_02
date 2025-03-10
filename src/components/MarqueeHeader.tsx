import React from 'react';
import Marquee from 'react-fast-marquee';
import './MarqueeHeader.css';

const MarqueeHeader: React.FC = () => {
  return (
    <header className="w-full h-12 bg-black flex items-center overflow-hidden">
      <Marquee 
        pauseOnHover={false}
        pauseOnClick={false}
        speed={50}
        gradient={false}
        direction="left"
        className="w-full"
      >
        <span className="ticker-text">
          Stream 'Diorama' on spotify and apple music &nbsp;&nbsp;&nbsp;
        </span>
        <span className="ticker-text">
          Stream 'Diorama' on spotify and apple music &nbsp;&nbsp;&nbsp;
        </span>
        <span className="ticker-text">
          legalize sensory data now &nbsp;&nbsp;&nbsp;
        </span>
        <span className="ticker-text">
          Stream 'Diorama' on spotify and apple music &nbsp;&nbsp;&nbsp;
        </span>
        <span className="ticker-text">
          I cannot remember the names of the people I claim love &nbsp;&nbsp;&nbsp;
        </span>
        <span className="ticker-text">
          Stream 'Diorama' on spotify and apple music &nbsp;&nbsp;&nbsp;
        </span>
        <span className="ticker-text">
          we are mostly water &nbsp;&nbsp;&nbsp;
        </span>
        <span className="ticker-text">
          Stream 'Diorama' on spotify and apple music &nbsp;&nbsp;&nbsp;
        </span>
        <span className="ticker-text">
          manufactured consent comes as no surprise &nbsp;&nbsp;&nbsp;
        </span>
      </Marquee>
    </header>
  );
};

export default MarqueeHeader;
