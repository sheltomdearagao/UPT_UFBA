import React, { useState } from 'react';
import { Student } from '../../types';

interface LoginProps {
  students: Student[];
  onLogin: (user: Student) => void;
}

const Login: React.FC<LoginProps> = ({ students, onLogin }) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        const user = students.find(s => s.login === login && s.password === password);
        if (user) {
            onLogin(user);
        } else {
            alert('Invalid credentials');
        }
    };

  return (
    <div>
      <h1>Login</h1>
      <input type="text" placeholder="CPF" value={login} onChange={e => setLogin(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;