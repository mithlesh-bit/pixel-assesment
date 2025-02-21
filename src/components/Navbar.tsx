import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <h1 className="text-lg font-bold">Domain Store</h1>
      <Link href="/cart" className="text-lg">
        🛒 Cart
      </Link>
    </nav>
  );
}
