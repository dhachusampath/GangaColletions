import React from 'react';
import './Loader.css';
import LoaderVideo from "../../assets/loader-video.webm"
const Loader = () => {
  return (
    <div className="loader-container">
      <video autoPlay loop muted className="loader-video">
        <source src={LoaderVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Loader;
