'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  // const handleLogin = async () => {
  //   try {
  //     const response = await axios.post('http://localhost:8000/user/login', { email, password }, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     if (response.data.access_token) {
  //       console.log('Login successful');
  //       localStorage.setItem('access_token', response.data.access_token);
  //       router.push('/story');
  //     }
  //   } catch (error) {
  //     console.error('Login failed', error);
  //     // setError('Login failed. Please check your credentials.');
  //   }
  // };

  const handleLogin = async () => {
    try {
        const response = await axios.post('http://localhost:8000/user/login', { email, password }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.data.access_token) {
            console.log('Login successful');
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('user_id', response.data.user_id); // Store user_id
            router.push('/dashboard'); //change to dashboard
        }
    } catch (error) {
        console.error('Login failed', error);
    }
};

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="w-1/2 p-10 flex flex-col justify-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome back!</h1>
        {error && <div className="text-red-500 mb-4 p-3 rounded-md bg-red-100 border border-red-300">{error}</div>}
        <div className="space-y-4">
          <div className="relative">
            <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-shadow duration-300 ease-in-out"
            />
          </div>
          <div className="relative">
            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-shadow duration-300 ease-in-out"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <button
            onClick={handleLogin}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-semibold transition-colors duration-300 ease-in-out"
          >
            Login
          </button>
        </div>
        <div className="mt-4">
          <button className="w-full py-2 px-4 bg-white border rounded-md shadow-sm flex items-center justify-center space-x-2 transition-shadow duration-300 ease-in-out hover:shadow-md">
            <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.952 4 4 12.952 4 24s8.952 20 20 20c11.048 0 20-8.952 20-20c0-1.305-.162-2.564-.45-3.75z" fill="#EA4335" />
              <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" fill="#FBBC05" />
              <path d="M24 44c6.627 0 12-5.373 12-12s-5.373-12-12-12c-3.059 0-5.842 1.154-7.961 3.039l-6.571-4.819C13.345 30.892 18.651 34 24 34c4.691 0 8.773-2.312 10.913-5.828l5.358 5.358C35.052 43.16 29.734 44 24 44z" fill="#4285F4" />
              <path d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571c.001.001.002.002.002.003l6.395 4.71c.001 0 .001 0 .002 0c1.022-1.007 1.99-2.2112.898-3.565c2.965-2.892 4.615-6.615 4.615-10.718z" fill="#34A853" />
            </svg>
            <span>Sign up with Google</span>
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm">
            Don't have an account? <a href="/signup" className="text-indigo-600 hover:underline">Register here</a>
          </p>
        </div>
      </div>
      <div className="w-1/2 bg-cover bg-center relative" style={{ backgroundImage: "url('/login-bg.png')" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 opacity-20"></div>
      </div>
    </div>
  );
};

export default LoginPage;