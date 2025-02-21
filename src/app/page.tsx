"use client";
import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { isDomainAvailable, validateDomain } from "@/lib/resources"; // Import domain validation and availability functions

export default function LandingPage() {
  const { cart, addToCart } = useCart(); // Access addToCart function
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
    setError(""); // Reset error when input changes
  };

  const handleAddDomain = async (): Promise<void> => {
    const normalizedDomain = domain.toLowerCase(); // Convert domain to lowercase before processing
  
    // Step 1: Domain validation (extension check)
    if (!validateDomain(normalizedDomain)) {
      setError("Only .com, .app, and .xyz domains are allowed.");
      return;
    }
  
    // Step 2: Duplicate check
    const isDuplicate = cart.some((item) => item.name.toLowerCase() === normalizedDomain); // Normalize domain name before checking
    if (isDuplicate) {
      setError("This domain is already in your cart.");
      return;
    }
  
    // Step 3: Check availability and store in localStorage
    const available = await isDomainAvailable(normalizedDomain); // Check domain availability
  
    // Save availability in localStorage
    localStorage.setItem(normalizedDomain, JSON.stringify(available));
  
    // Add domain to the cart with its availability
    addToCart({ name: normalizedDomain, available });
  
    // Show popup message
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  
    // Clear domain input
    setDomain("");
  };

  return (
    <div className="relative h-screen w-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://res.cloudinary.com/dlvlp1xm5/image/upload/v1691922777/samples/animals/three-dogs.jpg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="brightness-50"
        />
      </div>

      {/* Pop-up Notification */}
      {showPopup && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
          Domain added to cart!
        </div>
      )}

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center h-full text-white px-6">
        
        {/* Moving Title at Top Left */}
        <div className="absolute top-6 left-6">
          <h1 className="text-4xl font-extrabold text-white relative inline-block group">
            DOMAIN-HUNT
            <span className="absolute left-0 bottom-0 w-0 h-1 bg-white transition-all duration-500 group-hover:w-full"></span>
          </h1>
        </div>

        {/* Cart Icon */}
        <div className="absolute top-6 right-6">
          <Link href="/cart" className="relative">
            <ShoppingCart size={32} className="text-gray-300 hover:text-white" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold mb-4 text-center">Find Your Perfect Domain</h1>
        <p className="text-lg text-gray-300 mb-6 text-center">Search and add domains easily</p>

        {/* Domain Input */}
        <div className="flex items-center w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md p-3 rounded-lg shadow-lg border border-white/20">
          <input
            type="text"
            placeholder="Enter domain (example.com)"
            value={domain}
            onChange={handleInputChange}
            className="flex-1 bg-transparent text-white placeholder-gray-300 outline-none px-2 text-lg"
          />
          <button
            onClick={handleAddDomain}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2 rounded-lg text-white font-semibold shadow-md hover:opacity-90 transition-all duration-300"
          >
            Add
          </button>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
