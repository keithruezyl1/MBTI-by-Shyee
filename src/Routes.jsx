import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import StartPage from './pages/StartPage';
import MBTITest from './pages/MBTITest';
import MBTIResult from './pages/MBTIResult';
import HomePage from './pages/HomePage';

const pageTransition = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.98
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1
  },
  exit: { 
    opacity: 0, 
    y: -20,
    scale: 0.98
  },
  transition: { 
    duration: 0.4,
    ease: "easeInOut"
  }
};

const AnimatedRoute = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/setup" element={
        <AnimatedRoute>
          <StartPage />
        </AnimatedRoute>
      } />
      <Route path="/test" element={
        <AnimatedRoute>
          <MBTITest />
        </AnimatedRoute>
      } />
      <Route path="/result" element={
        <AnimatedRoute>
          <MBTIResult />
        </AnimatedRoute>
      } />
      <Route path="/home" element={
        <AnimatedRoute>
          <HomePage />
        </AnimatedRoute>
      } />
      <Route path="/" element={<Navigate to="/setup" replace />} />
      <Route path="*" element={<Navigate to="/setup" replace />} />
    </Routes>
  );
};

const AppRoutesWrapper = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default AppRoutesWrapper; 