import React from "react";
import backgroundImage from "../assets/Welcome_background.jpg"

const Welcome: React.FC = () => {
  return (
    <section
      className="h-[500px] bg-cover bg-center relative"
      style={{
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
}}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-white">
        <h1 className="text-4xl sm:text-6xl font-bold mb-4">
          Alyah: Be Prepared, Be Ahead, Start with a Job!
        </h1>
      </div>
    </section>
  );
};

export default Welcome;
