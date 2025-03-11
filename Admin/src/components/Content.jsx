import React from 'react';

const Content = ({ activeContent }) => {
  return (
    <div className="content">
      <div className={`content-item ${activeContent === 'dashboard' ? 'active' : ''}`}>
        <h2>Dashboard Content</h2>
        <p>This is the content for the Dashboard section.</p>
      </div>
      <div className={`content-item ${activeContent === 'viewers' ? 'active' : ''}`}>
        <h2>Viewers Content</h2>
        <p>This is the content for the Viewers section.</p>
      </div>
      <div className={`content-item ${activeContent === 'agenda' ? 'active' : ''}`}>
        <h2>Agenda Content</h2>
        <p>This is the content for the Agenda section.</p>
      </div>
      <div className={`content-item ${activeContent === 'revenue' ? 'active' : ''}`}>
        <h2>Revenue Content</h2>
        <p>This is the content for the Revenue section.</p>
      </div>
      <div className={`content-item ${activeContent === 'articles' ? 'active' : ''}`}>
        <h2>Articles Content</h2>
        <p>This is the content for the Articles section.</p>
      </div>
      <div className={`content-item ${activeContent === 'settings' ? 'active' : ''}`}>
        <h2>Settings Content</h2>
        <p>This is the content for the Settings section.</p>
      </div>
      <div className={`content-item ${activeContent === 'faq' ? 'active' : ''}`}>
        <h2>FAQ Content</h2>
        <p>This is the content for the FAQ section.</p>
      </div>
      <div className={`content-item ${activeContent === 'logout' ? 'active' : ''}`}>
        <h2>Logout Content</h2>
        <p>This is the content for the Logout section.</p>
      </div>
    </div>
  );
};

export default Content;
