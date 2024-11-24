import React, { useState } from 'react';
import { Header } from './components/Header';
import { Map } from './components/Map';
import { StationData } from './components/StationData';
import { LoginForm } from './components/LoginForm';
import { stations } from './data/stationData';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedStation, setSelectedStation] = useState(stations[0]);

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
      <Header />
      <main className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Map 
          stations={stations} 
          selectedStation={selectedStation}
          onStationSelect={setSelectedStation} 
        />
        <StationData selectedStation={selectedStation} />
      </main>
    </div>
  );
}

export default App;