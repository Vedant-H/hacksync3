// import Link from "next/link";

// export default function LandingPage() {
//   return (
//     <div className="h-screen flex flex-col items-center justify-center bg-blue-50">
//       <h1 className="text-4xl sm:text-3xl md:text-4xl font-bold mb-4">AI Storytelling Companion</h1>
//       <p className="text-lg sm:text-base mb-6">Unleash your creativity with our AI-powered storytelling tool</p>
//       <div className="space-x-4">
//         <Link href="/login">
//           <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
//             Login
//           </button>
//         </Link>
//         <Link href="/signup">
//           <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors">
//             Sign Up
//           </button>
//         </Link>
//       </div>
//     </div>
//   );
// }
// LandingPage.js (Separate landing page file)
"use client";

import { AuroraText } from "./../components/magicui/aurora-text"; // Import the AuroraText component
import { Marquee } from "./../components/magicui/marquee";
import { Ripple } from "./../components/magicui/ripple";
import { ShimmerButton } from "./../components/magicui/shimmer-button";
import Link from "next/link";

const testimonials = [
  "This tool helped me bring my stories to life!",
  "A game changer for any writer looking for inspiration.",
  "I love how easy it is to brainstorm ideas with the AI assistant.",
];

export default function LandingPage() {
  return (
    <div className="relative h-screen bg-gradient-to-br from-blue-100 to-blue-50">
      <Ripple className="absolute inset-0 z-0" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 z-10 font-sans">
  Ship <AuroraText >Beautiful</AuroraText>
</h1>

        <p className="text-lg md:text-xl lg:text-2xl mb-8 z-10 max-w-2xl px-4 font-sans">
          Unleash your creativity with our AI-powered storytelling tool.
        </p>

        <div className="w-full max-w-3xl mx-auto mb-8 z-10">
          <Marquee>
            {testimonials.map((testimonial, index) => (
              <span key={index} className="inline-block mx-6 text-lg md:text-xl font-sans">
                {testimonial}
              </span>
            ))}
          </Marquee>
        </div>

        <div className="space-x-4 mt-6 z-10 flex flex-col md:flex-row items-center">
          <Link href="/login" className="mb-4 md:mb-0">
            <ShimmerButton className="bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors text-lg md:text-xl font-sans">
              Login
            </ShimmerButton>
          </Link>
          <Link href="/signup">
            <ShimmerButton className="bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600 transition-colors text-lg md:text-xl font-sans">
              Sign Up
            </ShimmerButton>
          </Link>
        </div>
      </div>
    </div>
  );
}