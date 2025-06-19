import React from 'react';
import './App.css';
import MainContainer from './MainContainer';

// PUBLIC_INTERFACE
/**
 * The root App component simply renders the MainContainer for the Tic Tac Toe game.
 */
function App() {
  return (
    <div className="app" style={{ minHeight: '100vh', background: '#fff' }}>
      <MainContainer />
    </div>
  );
}

export default App;