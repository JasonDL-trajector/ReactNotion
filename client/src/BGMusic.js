import React from 'react';
import ReactPlayer from 'react-player';
import bgMusic from './assets/2.mp3';

const BGMusic = () => {
  return (
    <div>
      <ReactPlayer
        url={bgMusic}
        playing={true} 
        loop={true} 
        volume={0.1}
        width="0" 
        height="0"
        preload="auto"
      />
    </div>
  );
};

export default BGMusic;

