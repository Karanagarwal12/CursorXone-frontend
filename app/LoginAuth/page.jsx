'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';
import './login.scss';

import defaultImage1 from '../../assets/cursor01.png';
import defaultImage2 from '../../assets/cursor03.png';
import defaultImage3 from '../../assets/cursor04.png';
// Add more images if needed

export default function Home() {
  const router = useRouter();
  const { user, setUser } = useUserContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [bio, setBio] = useState('');
  const [socialLinks, setSocialLinks] = useState([{ text: '', link: '' }]);
  const [selectedImagePath, setSelectedImagePath] = useState(null); // State for tracking selected image

  const defaultImages = [defaultImage1, defaultImage2, defaultImage3];

  const handleImageChange = (e) => {
    convertToBase64(e.target.files[0])
      .then((base64) => {
        setImage(base64);
        setSelectedImagePath(null); // Clear selected image when a custom image is uploaded
        setImageError(null);
      })
      .catch(() => {
        setImageError('Failed to convert image to base64');
      });
  };

  const handleDefaultImageSelect = async (imagePath) => {
    try {
      const response = await fetch(imagePath);
      const blob = await response.blob();
      const base64Image = await convertToBase64(blob);
      setImage(base64Image);
      setSelectedImagePath(imagePath); // Set the selected image path
      setImageError(null);
    } catch (error) {
      setImageError('Failed to select image');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (!image) {
      setImageError('Image is required');
      return;
    }

    try {
      const response = await axios.post('http://192.168.112.96:3000/users/auth/signup', {
        name,
        email,
        password,
        image,
        bio,
        socialLinks: JSON.stringify(socialLinks),
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
      const response = await axios.post('http://192.168.112.96:3000/users/auth/login', {
        email,
        password,
      });
      const userDetails = response.data.body;
      setUser(userDetails);
      router.push('/playground');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  useEffect(() => {
    let localUser = localStorage.getItem('userD');
    if (localUser) {
      localUser = JSON.parse(localUser);
      router.push('/playground');
    }
  }, [router]);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSocialLinkChange = (index, key, value) => {
    const updatedLinks = socialLinks.map((link, i) =>
      i === index ? { ...link, [key]: value } : link
    );
    setSocialLinks(updatedLinks);
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { text: '', link: '' }]);
  };

  const removeSocialLink = (index) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  return (
    <div className="login-signup">
      <h2>{isLogin ? 'Login' : 'Signup'}</h2>
      <form onSubmit={isLogin ? handleLogin : handleSignup}>
        {!isLogin && (
          <>
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
            <div>
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
              />
            </div>
            <div>
              <label>Social Links</label>
              <div className="linkss">
                {socialLinks.map((link, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      placeholder="Link text"
                      value={link.text}
                      onChange={(e) => handleSocialLinkChange(index, 'text', e.target.value)}
                    />
                    <input
                      type="url"
                      placeholder="Link URL"
                      value={link.link}
                      onChange={(e) => handleSocialLinkChange(index, 'link', e.target.value)}
                      required
                    />
                    <button type="button" onClick={() => removeSocialLink(index)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addSocialLink}>
                Add Social Link
              </button>
            </div>
          </>
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
              className="showPass"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <button type="submit" className="submitBtn">
          {isLogin ? 'Login' : 'Signup'}
        </button>
        {!isLogin && (
          <div>
            <div>
              <p>Select a default image:</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {defaultImages.map((img, index) => (
                  <img
                    key={index}
                    src={img.src}
                    alt={`Default ${index + 1}`}
                    style={{
                      width: '100px',
                      height: '100px',
                      cursor: 'pointer',
                      border: selectedImagePath === img.src ? '2px solid blue' : '1px solid gray',
                    }}
                    onClick={() => handleDefaultImageSelect(img.src)}
                  />
                ))}
              </div>
            </div>

            <p>Or upload your own image:</p>
            <input type="file" accept="image/*" onChange={handleImageChange} />

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
