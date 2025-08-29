import React, { useState } from 'react';
import FormBuilder from './components/FormBuilder/FormBuilder';
import LandingPage from './components/LandingPage';
import MenuPage from './components/MenuPage';
import ProfilePage from './components/ProfilePage';
import TemplateGalleryPage from './components/TemplateGalleryPage';
import './App.css';

type ViewType = 'landing' | 'builder' | 'menu' | 'profile' | 'templates';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('landing');

  const handleStartNewForm = () => {
    setCurrentView('builder');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleNavigate = (page: string) => {
    switch (page) {
      case 'menu':
        setCurrentView('menu');
        break;
      case 'profile':
        setCurrentView('profile');
        break;
      case 'templates':
        setCurrentView('templates');
        break;
      case 'create':
        setCurrentView('builder');
        break;
      case 'forms':
      case 'shared':
      case 'starred':
      case 'trash':
      case 'analytics':
      case 'import':
      case 'export':
        // For now, show an alert for these pages
        alert(`${page.charAt(0).toUpperCase() + page.slice(1)} functionality will be implemented here!`);
        break;
      default:
        console.log('Navigating to:', page);
    }
  };

  const handleUseTemplate = (template: any) => {
    console.log('Using template:', template);
    setCurrentView('builder');
    // Here you would typically pass the template data to the FormBuilder
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingPage 
            onStartNewForm={handleStartNewForm}
            onMenuClick={() => setCurrentView('menu')}
            onProfileClick={() => setCurrentView('profile')}
            onTemplateGalleryClick={() => setCurrentView('templates')}
          />
        );
      case 'builder':
        return <FormBuilder onBackToLanding={handleBackToLanding} />;
      case 'menu':
        return (
          <MenuPage 
            onBack={handleBackToLanding}
            onNavigate={handleNavigate}
          />
        );
      case 'profile':
        return (
          <ProfilePage 
            onBack={handleBackToLanding}
          />
        );
      case 'templates':
        return (
          <TemplateGalleryPage 
            onBack={handleBackToLanding}
            onUseTemplate={handleUseTemplate}
          />
        );
      default:
        return (
          <LandingPage 
            onStartNewForm={handleStartNewForm}
            onMenuClick={() => setCurrentView('menu')}
            onProfileClick={() => setCurrentView('profile')}
            onTemplateGalleryClick={() => setCurrentView('templates')}
          />
        );
    }
  };

  return (
    <div className="App w-full h-full">
      {renderCurrentView()}
    </div>
  );
}

export default App;
