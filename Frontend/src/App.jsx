import React, { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

const App = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <>
      {isRegistering ? (
        <RegisterPage switchToLogin={() => setIsRegistering(false)} />
      ) : (
        <LoginPage switchToRegister={() => setIsRegistering(true)} />
      )}
    </>
  );
};

export default App;
