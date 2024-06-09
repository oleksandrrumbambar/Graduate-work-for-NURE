import React from 'react';

const BackgroundVideo = ({ children }) => {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <video
        autoPlay
        loop
        muted
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'translate(-50%, -50%)',
          zIndex: -1,
        }}
      >
        <source src="https://cdn.pixabay.com/video/2020/06/19/42543-432086872_large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div style={{ position: 'relative', zIndex: 1, height: '100%', width: '100%' }}>
        {children}
      </div>
      {/* Add a pseudo-element for the dimming effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.8)', // Semi-transparent black
          zIndex: 0,
        }}
      />
    </div>
  );
};

export default BackgroundVideo;