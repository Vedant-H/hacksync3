import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-blue-50">
      <h1 className="text-4xl sm:text-3xl md:text-4xl font-bold mb-4">AI Storytelling Companion</h1>
      <p className="text-lg sm:text-base mb-6">Unleash your creativity with our AI-powered storytelling tool</p>
      <div className="space-x-4">
        <Link href="/login">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
            Login
          </button>
        </Link>
        <Link href="/signup">
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}
