'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");  // Renamed 'username' to 'email'
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // Sending email and password in the request body
      const response = await axios.post("http://localhost:8000/user/login", { email, password }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      // Assuming the response contains the access token
      if (response.data.access_token) {
        console.log("Login successful");
        // Store the token in localStorage or cookies (for future authenticated requests)
        localStorage.setItem("access_token", response.data.access_token);
        // Navigate to dashboard or next page
        router.push("/story");
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };
  

  return (
    <div>
      <input
        type="email"  // Use 'email' type for validation
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
