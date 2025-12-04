import React, { useState, useEffect } from 'react';
import { INITIAL_HABITS } from './constants';
import { Habit, User } from './types';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);

  // Check for existing session (mock)
  useEffect(() => {
    const savedUser = localStorage.getItem('focusflow_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (name: string, email: string) => {
    const newUser = { name, email };
    setUser(newUser);
    localStorage.setItem('focusflow_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('focusflow_user');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Dashboard 
      user={user} 
      onLogout={handleLogout} 
      habits={habits}
      setHabits={setHabits}
    />
  );
};

export default App;