"use client"
// src/components/Challenge.tsx
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { isDomainAvailable, validateDomain } from "../lib/resources";
import { Domain } from "../types/domain";
import { Button, Input, VStack, Text, Box, HStack } from "@chakra-ui/react";

interface ChallengeProps {
  numDomainsRequired: number;
}

export const Challenge: React.FC<ChallengeProps> = ({ numDomainsRequired }) => {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
    setError("");
  };

  const handleAddDomain = async () => {
    if (!domain) {
      setError("Please enter a domain name.");
      return;
    }

    if (!validateDomain(domain)) {
      setError("Invalid domain. Please enter a valid .com, .app, or .xyz domain.");
      return;
    }

    const domainName = domain.toLowerCase();

    // Check if domain is already in the cart
    if (cart.some((d) => d.name === domainName)) {
      setError("Domain is already in the cart.");
      return;
    }

    const available = await isDomainAvailable(domainName);
    addToCart({ name: domainName, available });

    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);

    setDomain("");
  };

  const handleClearCart = () => clearCart();

  const handleRemoveUnavailable = () => {
    const availableDomains = cart.filter((domain) => domain.available);
    availableDomains.forEach((domain) => removeFromCart(domain.name));
  };

  const handleKeepBestDomains = () => {
    // Clone the cart to avoid mutating the original array
    const sortedDomains = [...cart]
      .sort((a, b) => {
        const order = ["com", "app", "xyz"];
        
        // Ensure aDomain and bDomain are never undefined, defaulting to an empty string if undefined
        const aDomain = a.name.split(".").pop() || ""; // Default to "" if undefined
        const bDomain = b.name.split(".").pop() || ""; // Default to "" if undefined
  
        // Sort by TLD priority
        const tldComparison = order.indexOf(aDomain) - order.indexOf(bDomain);
        if (tldComparison !== 0) {
          return tldComparison;
        }
  
        // If TLD is the same, sort by domain name length
        return a.name.length - b.name.length;
      })
      .slice(0, numDomainsRequired); // Take only the best domains based on number required
  
    // Remove all domains from cart first
    cart.forEach((domain) => removeFromCart(domain.name));
  
    // Add the best domains back into the cart
    sortedDomains.forEach((domain) => addToCart(domain));
  };
  
  const handleCopyToClipboard = () => {
    // Join domain names with commas
    const domainNames = cart.map((domain) => domain.name).join(", ");
  
    // Use the Clipboard API to copy the string to the clipboard
    navigator.clipboard.writeText(domainNames)
      .then(() => {
        // Optionally, show a success message
        alert("Domains copied to clipboard!");
      })
      .catch((err) => {
        // Handle any errors
        console.error("Failed to copy: ", err);
      });
  };
  

  return (
    <Box p={4}>
      {showPopup && <Text color="green.500">Domain added to cart!</Text>}

      <VStack gap={4} align="stretch">
        <HStack>
        <Input
  value={domain}
  onChange={handleInputChange}
  placeholder="Enter domain (example.com)"
  size="lg"
  _invalid={error ? { borderColor: "red.500" } : undefined}  // Set the style on error
/>

          <Button onClick={handleAddDomain} colorScheme="teal">
            Add Domain
          </Button>
        </HStack>

        {error && <Text color="red.500">{error}</Text>}

        <Box>
          {cart.length > 0 && (
            <VStack gap={2}>
              {cart.map((domain) => (
                <HStack key={domain.name} gap={4}>
                  <Text>{domain.name}</Text>
                  <Text>{domain.available ? "Available" : "Unavailable"}</Text>
                  <Button size="sm" onClick={() => removeFromCart(domain.name)} colorScheme="red">
                    Remove
                  </Button>
                </HStack>
              ))}
            </VStack>
          )}
        </Box>

        <HStack justify="space-between">
          <Text>
            {cart.length}/{numDomainsRequired} Domains
          </Text>
          <Button onClick={handleClearCart} colorScheme="red">
            Clear Cart
          </Button>
        </HStack>

        <HStack gap={4}>
          <Button onClick={handleRemoveUnavailable} colorScheme="yellow">
            Remove Unavailable Domains
          </Button>
          <Button onClick={handleCopyToClipboard} colorScheme="blue">
            Copy Domains
          </Button>
          <Button onClick={handleKeepBestDomains} colorScheme="purple">
            Keep Best Domains
          </Button>
        </HStack>

        {cart.length === numDomainsRequired && (
         <Button colorScheme="green" size="lg" w="full">
         Add Domain
       </Button>
        )}
      </VStack>
    </Box>
  );
};
