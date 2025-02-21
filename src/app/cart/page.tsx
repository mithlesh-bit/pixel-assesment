"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { isDomainAvailable } from "@/lib/resources";
import { useRouter } from "next/navigation";
import { Trash2, Clipboard, ShoppingCart, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast"; // Import toast

// interface ChallengeProps {
//   numDomainsRequired: number;
// }

interface Domain {
  name: string;
  available: boolean | null;
}

export default function Challenge() {
  const numDomainsRequired = 5; // Default value or fetch from context
  const { cart, removeFromCart, clearCart } = useCart();
  const [updatedCart, setUpdatedCart] = useState<Domain[]>([]);
  const router = useRouter();

  useEffect(() => {
    const updatedDomains = cart.map((item) => {
      const domainName = item.name.toLowerCase();
      const availability = localStorage.getItem(domainName);
      if (availability !== null) {
        return { ...item, available: JSON.parse(availability) };
      }
      return item;
    });
    setUpdatedCart(updatedDomains);
  }, [cart]);

  useEffect(() => {
    const checkAndStoreAvailability = async () => {
      const updatedDomains = await Promise.all(
        cart.map(async (item) => {
          const domainName = item.name.toLowerCase();
          const storedAvailability = localStorage.getItem(domainName);
          if (storedAvailability === null) {
            const available = await isDomainAvailable(domainName);
            localStorage.setItem(domainName, JSON.stringify(available));
            return { ...item, available };
          }
          return { ...item, available: JSON.parse(storedAvailability) };
        })
      );
      setUpdatedCart(updatedDomains);
    };

    if (cart.length > 0) {
      checkAndStoreAvailability();
    }
  }, [cart]);

  const handleRemoveUnavailableDomains = () => {
    const domainsToRemove = updatedCart.filter((domain) => domain.available === false);
    if (domainsToRemove.length === 0) {
      toast("No unavailable domains to remove.", {
        icon: "ℹ️",
        style: {
          background: "#3b82f6",
          color: "#fff",
        },
      });
      return;
    }
    domainsToRemove.forEach((domain) => {
      const domainName = domain.name.toLowerCase();
      localStorage.removeItem(domainName);
      removeFromCart(domainName);
    });
    toast.success("Unavailable domains have been removed.");
  };

  const handleClearCart = () => {
    if (updatedCart.length === 0) {
      toast("The cart is already empty.", {
        icon: "ℹ️",
        style: {
          background: "#3b82f6",
          color: "#fff",
        },
      });
      return;
    }
    setUpdatedCart([]);
    clearCart();
    cart.forEach((item) => {
      const domainName = item.name.toLowerCase();
      localStorage.removeItem(domainName);
    });
    toast.success("The cart has been cleared.");
  };

  const handleCopyToClipboard = () => {
    if (updatedCart.length === 0) {
      toast("The cart is empty. Nothing to copy.", {
        icon: "ℹ️",
        style: {
          background: "#3b82f6",
          color: "#fff",
        },
      });
      return;
    }
    const domainNames = updatedCart.map(item => item.name).join(', ');
    navigator.clipboard.writeText(domainNames)
      .then(() => toast.success("Domains copied to clipboard!"))
      .catch(() => toast.error("Failed to copy domains."));
  };

  const handleKeepBestDomains = () => {
    if (updatedCart.length <= numDomainsRequired) {
      toast(`You already have ${updatedCart.length} domains, which is within the required limit of ${numDomainsRequired}.`, {
        icon: "ℹ️",
        style: {
          background: "#3b82f6",
          color: "#fff",
        },
      });
      return;
    }
    const extensionOrder: { [key: string]: number } = { '.com': 1, '.app': 2, '.xyz': 3 };
    const sortedDomains = [...updatedCart]
      .sort((a, b) => {
        const extA = a.name.split('.').pop();
        const extB = b.name.split('.').pop();
        if (!extA || !extB) return 0;
        const validExtA = `.${extA}`;
        const validExtB = `.${extB}`;
        const orderA = extensionOrder[validExtA as keyof typeof extensionOrder] || 999;
        const orderB = extensionOrder[validExtB as keyof typeof extensionOrder] || 999;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return a.name.length - b.name.length;
      })
      .slice(0, numDomainsRequired);
    setUpdatedCart(sortedDomains);
    toast.success(`Kept the best ${numDomainsRequired} domains.`);
  };

  const handleRemoveDomain = (domainName: string) => {
    const updatedDomains = updatedCart.filter((domain) => domain.name !== domainName);
    setUpdatedCart(updatedDomains);
    localStorage.removeItem(domainName.toLowerCase());
    removeFromCart(domainName);
    toast.success(`Domain "${domainName}" has been removed.`);
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Domain Shopping Cart</h1>
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-white bg-gradient-to-r from-gray-900 to-gray-700 px-4 py-2 rounded hover:opacity-80"
        >
          <ArrowLeft size={20} /> Back to Home
        </button>
      </div>
      
      <p className="mt-2 text-lg">
        You have added <span className="font-bold">{updatedCart.length}</span> out of 
        <span className="font-bold">{numDomainsRequired}</span> domains.
      </p>
      
      <div className="mt-4 flex gap-4 flex-wrap">
        <button onClick={handleRemoveUnavailableDomains} className="flex items-center gap-2 bg-gradient-to-r from-gray-900 to-gray-700 px-4 py-2 rounded hover:opacity-80">
          <Trash2 size={18} /> Remove Unavailable
        </button>
        <button onClick={handleClearCart} className="flex items-center gap-2 bg-gradient-to-r from-gray-900 to-gray-700 px-4 py-2 rounded hover:opacity-80">
          <Trash2 size={18} /> Clear Cart
        </button>
        <button onClick={handleCopyToClipboard} className="flex items-center gap-2 bg-gradient-to-r from-gray-900 to-gray-700 px-4 py-2 rounded hover:opacity-80">
          <Clipboard size={18} /> Copy Domains
        </button>
        <button onClick={handleKeepBestDomains} className="flex items-center gap-2 bg-gradient-to-r from-gray-900 to-gray-700 px-4 py-2 rounded hover:opacity-80">
          <ShoppingCart size={18} /> Keep Best {numDomainsRequired}
        </button>
      </div>
      
      <div className="mt-6 bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold">Cart ({updatedCart.length})</h2>
        <ul>
          {updatedCart.map((item, index) => (
            <li key={index} className="border-b border-gray-700 p-2 flex justify-between items-center">
              <span className={item.available === false ? "text-red-400" : "text-green-400"}>
                {item.name} - {item.available === false ? "Unavailable" : "Available"}
              </span>
              <button onClick={() => handleRemoveDomain(item.name)} className="text-red-500 hover:text-red-700">
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <button
        disabled={updatedCart.length !== numDomainsRequired}
        className={`mt-4 w-full py-2 rounded text-white flex items-center justify-center gap-2 ${updatedCart.length === numDomainsRequired ? "bg-gradient-to-r from-gray-900 to-gray-700 hover:opacity-80" : "bg-gray-500 cursor-not-allowed"}`}
      >
        <ShoppingCart size={20} /> Purchase Domains
      </button>
    </div>
  );
}
