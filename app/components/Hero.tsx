// components/HeroSection.jsx or HeroSection.tsx
export default function HeroSection() {
    return (
      <div
        className="relative bg-cover bg-center h-screen"
        style={{ backgroundImage: "url('/images/hero.jpeg')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center px-4">
          <h4 className="text-white text-lg">
            Simple and Transparent Real Estate Platform
          </h4>
          <h1 className="text-white text-4xl md:text-6xl font-bold mt-4">
            Find and List Properties<br />
            with no <span className="text-green-400 italic">hassle</span>
          </h1>
          <p className="text-white mt-4 max-w-xl">
            We bring you the perfect way to find residential and commercial properties effortlessly, seamless, reliable, and stress-free.
          </p>
          <button className="mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full">
            Get Started
          </button>
        </div>
      </div>
    );
  }
  