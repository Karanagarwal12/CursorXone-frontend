'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import './login.scss';

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://103.127.29.124:3000/users/auth/signup', {
        name,
        email,
        password,
      });
      alert('User signed up successfully');
      setIsLogin(true); // Switch to login after successful signup
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://103.127.29.124:3000/users/auth/login', {
        email,
        password,
      });
      router.push(`/playground/?username=${response.data.body.name}`);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="login-signup">
      <h2>{isLogin ? 'Login' : 'Signup'}</h2>
      <form onSubmit={isLogin ? handleLogin : handleSignup}>
        {!isLogin && (
          <div>
            <label htmlFor="name">Username</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ marginLeft: '8px' }}
              className='showPass'
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <button type="submit" className='submitBtn'>{isLogin ? 'Login' : 'Signup'}</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Signup' : 'Login'}
        </button>
      </p>
    </div>
  );
}
