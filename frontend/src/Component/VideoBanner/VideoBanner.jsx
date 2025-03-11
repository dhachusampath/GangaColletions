import React from 'react';
import './VideoBanner.css';

const VideoBanner = () => {
  return (
    <div className="video-banner">
      {/* Desktop/Tablet View */}
      <div className="video-container desktop">
        <video className="video" autoPlay loop muted>
          <source
            src="https://videos.pexels.com/video-files/4004214/4004214-hd_1920_1080_25fps.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Mobile View */}
      <div className="video-container mobile">
        <video className="video" autoPlay loop muted>
          <source
            src="https://videos.pexels.com/video-files/4004214/4004214-hd_1920_1080_25fps.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoBanner;
