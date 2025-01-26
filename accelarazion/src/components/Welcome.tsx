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
      <div ></div>
      <div >
        <h1 >
          Alyah: Be Prepared, Be Ahead, Start with a Job!
        </h1>
      </div>
    </section>
  );
};

export default Welcome;
