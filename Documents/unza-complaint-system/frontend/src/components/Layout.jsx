import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <main className="card">{children}</main>
      </div>
    </div>
  );
};

export default Layout;


