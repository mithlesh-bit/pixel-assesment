import { CartProvider } from "@/context/CartContext";
import "@/app/globals.css";
import { Toaster } from "react-hot-toast";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* You can add global metadata here like title, links, etc. */}
      </head>
      <body>
        <CartProvider>
          {children}
          <Toaster position="top-center" /> {/* Add the Toaster here */}

        </CartProvider>
      </body>
    </html>
  );
}
