"use client"
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Domain } from "../types/domain";

interface CartContextType {
  cart: Domain[];
  addToCart: (domain: Domain) => void;
  removeFromCart: (domainName: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Domain[]>([]);

  const addToCart = (domain: Domain) => {
    setCart((prevCart) => [...prevCart, domain]);
  };

  const removeFromCart = (domainName: string) => {
    setCart((prevCart) => prevCart.filter((domain) => domain.name !== domainName));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
