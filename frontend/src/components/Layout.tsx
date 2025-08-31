import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const imageUrl = '/right-column.png'; // Path to the provided image

  return (
    <div className="main-container-wrapper">
      <div className="content-container">
        <div className="left-column">
          <div className="auth-card">
            {children}
          </div>
        </div>
        <div className="right-column" style={{ backgroundImage: `url(${imageUrl})` }}>
        </div>
      </div>
    </div>
  );
};

export default Layout;