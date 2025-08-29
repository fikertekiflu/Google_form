import React, { useState } from 'react';
import FormBuilder from './components/FormBuilder/FormBuilder';
import LandingPage from './components/LandingPage';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'builder'>('landing');

  const handleStartNewForm = () => {
    setCurrentView('builder');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  return (
    <div className="App w-full h-full">
      {currentView === 'landing' ? (
        <LandingPage onStartNewForm={handleStartNewForm} />
      ) : (
        <FormBuilder onBackToLanding={handleBackToLanding} />
      )}
    </div>
  );
}

export default App;
