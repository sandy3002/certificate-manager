import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreateCertificate from './components/CreateCertificate';
import ViewCertificates from './components/ViewCertificates';


// import axios from 'axios';
// import React, { useState } from 'react';







function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-certificate" element={<CreateCertificate />} />
        <Route path="/view-certificates" element={<ViewCertificates />} />
      </Routes>
    </Router>
  );
}

export default App;