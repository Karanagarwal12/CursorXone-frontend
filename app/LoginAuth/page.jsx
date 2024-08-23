'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import './login.scss';
// Importing images from the assets folder
import defaultImage1 from '../../assets/cursor01.png';
// import defaultImage2 from '../public/assets/default2.png';
// import defaultImage3 from '../public/assets/default3.png';

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState(null);

  const defaultImages = [defaultImage1];

  
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setImageError(null);
  };

  const handleDefaultImageSelect = (imagePath) => {
    setImage(imagePath);
    setImageError(null);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (!image) {
      setImageError('Image is required');
      return;
    }

    try {
      let base64Image = '';

      // Check if the image is a string (default image) or a File object (uploaded image)
      if (typeof image === 'string') {
        base64Image = await fetch(image)
          .then((res) => res.blob())
          .then((blob) => convertToBase64(blob));
      } else {
        base64Image = await convertToBase64(image);
      }

      const response = await axios.post('http://172.70.101.255:3000/users/auth/signup', {
        name,
        email,
        password,
        image: base64Image,
      });

      alert('User signed up successfully');
      setIsLogin(true);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://172.70.101.255:3000/users/auth/login', {
        email,
        password,
      });
      console.log(response);
      router.push(`/playground/?username=${response.data.body.name}`);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
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
        {!isLogin && (
          <div>
            <div>
              <p>Select a default image:</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {defaultImages.map((img, index) => (
                  <img
                    key={index}
                    src={img.src} // Use the src of imported images
                    alt={`Default ${index + 1}`}
                    style={{
                      width: '100px',
                      height: '100px',
                      cursor: 'pointer',
                      border: image === img.src ? '2px solid blue' : '1px solid gray',
                    }}
                    onClick={() => handleDefaultImageSelect(img.src)}
                  />
                ))}
              </div>
            </div>

            <p>Or upload your own image:</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            {imageError && <p style={{ color: 'red' }}>{imageError}</p>}
          </div>
        )}
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
