import React from 'react';
import { Student } from '../../types';

interface HeaderProps {
  user: Student;
  onLogout: () => void;
  onBack?: () => void;
  showBack: boolean;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onBack, showBack }) => {
  return (
    <header>
      {showBack && <button onClick={onBack}>Back</button>}
      <span>Welcome, {user.name}</span>
      <button onClick={onLogout}>Logout</button>
    </header>
  );
};

export default Header;