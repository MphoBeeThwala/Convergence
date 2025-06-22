import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <h1 className="text-3xl font-bold mb-4">Unified E-Commerce</h1>
      <p className="mb-6">Welcome! Please login or register to continue.</p>
      <div className="flex gap-4">
        <Link href="/login">
          <span className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800">
            Login
          </span>
        </Link>
        <Link href="/register">
          <span className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800">
            Register
          </span>
        </Link>
        <Link href="/products">
          <span className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-800">
            View Products
          </span>
        </Link>
      </div>
    </div>
  );
}
