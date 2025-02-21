"use client";
import React, { useState } from "react";

interface DomainInputProps {
  onAddDomain: (domain: string) => void;
}

export default function DomainInput({ onAddDomain }: DomainInputProps) {
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");

  const isValidDomain = (domain: string): boolean => {
    const domainRegex = /^[a-zA-Z0-9-]+\.((com)|(xyz)|(app))$/;
    return domainRegex.test(domain.toLowerCase());
  };

  const handleAddDomain = () => {
    if (!domain.trim()) {
      setError("Domain cannot be empty.");
      return;
    }

    if (!isValidDomain(domain)) {
      setError("Invalid domain. Only .com, .xyz, and .app are allowed.");
      return;
    }

    setError("");
    onAddDomain(domain.trim().toLowerCase()); // Send domain to the parent
    setDomain(""); // Clear input
  };

  return (
    <div className="relative z-10 bg-white bg-opacity-20 p-4 rounded-lg shadow-lg backdrop-blur-md flex flex-col items-center">
      <input
        type="text"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        placeholder="Enter domain (example.com)"
        className="p-2 border rounded w-64 text-black"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <button
        onClick={handleAddDomain}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add to Cart
      </button>
    </div>
  );
}
