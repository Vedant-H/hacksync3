'use client'

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Profile() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }

    const fetchUser = async () => {
      const res = await axios.get("http://localhost:8000/user/login", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    };

    fetchUser();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      {user ? (
        <>
          {/* <h2 className="text-2xl">Hello, {user.username}!</h2>
          <p className="text-xl">{user.email}</p> */}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
