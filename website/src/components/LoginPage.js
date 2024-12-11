import React, { useState } from 'react';
import { auth } from '../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { fetchUserRole } from '../firebase/firebase';
import '../css/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
 
  


  const handleLogin = async (event) => {
    event.preventDefault();
    setError('Click again to confirm authorization.');
    
    // TODO: Improve error message efficiency. 
    const fetchedUserRole = await fetchUserRole(email);
    setUserRole(fetchedUserRole);

    for (var i = 0; i < 2; i++) {
    try {
      await signInWithEmailAndPassword(auth, email, password);

     if (userRole === 'staff') {
      setError('');
      navigate('/admin'); // Redirect to admin page on successful login
     }
     if (userRole === 'guardian') { 
      setError('User must be an authorized staff member.');
    }
    } catch (error) {
      setError('Failed to log in. Incorrect Username or Password.');
      console.error('Login error:', error);
    }
  }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Log In</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
