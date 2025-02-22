'use client'


import axios from "axios";
import { useState } from "react";

export default function Subscription() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    const res = await axios.post("http://localhost:8000/payment/mock_payment");
    alert(res.data.message);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl">Upgrade to Premium</h1>
      <p className="text-lg">Access all the advanced AI storytelling features</p>
      <button
        className="bg-green-500 text-white px-6 py-3"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? "Processing..." : "Upgrade Now"}
      </button>
    </div>
  );
}
