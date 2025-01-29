import React from "react";
import Navbar from "./Navbar";
import backgroundImage from "../assets/Welcome_background.jpg";
import "../App.css"

const HomePage: React.FC = () => {
  return (
    <>
      {/* Welcome Section */}
      <div
        className="hero"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        {/* Overlay for readability */}
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Alyah: Be Prepared, Be Ahead, Start with a Job!
          </h1>

          <button
            onClick={() => (window.location.href = "/register")}
            className="hero-button"
          >
            I take the first step toward a successful Alyah.
          </button>
        </div>
      </div>
    </>
  );
};

export default HomePage;




// import React from "react";
// import Welcome from "./Welcome";
// import logo from "../assets/logo.png";
// import Navbar from "./Navbar";

// const HomePage: React.FC = () => {
//   const navigateToRegister = () => {
//     window.location.href = "/register"; // Navigate to the register page
//   };

//   const navigateToLogin = () => {
//     window.location.href = "/login"; // Navigate to the login page
//   };

//   return (
//     <div>
//       {/* Top Navigation Bar */}
//       <header className="flex justify-between items-center p-4 bg-white shadow-md">
//         <img src={logo} alt="Accelerazion Logo" className="h-10" /> {/* Logo */}
//         <nav>
//           <ul className="flex space-x-4">
//             <li>
//               <button
//                 onClick={navigateToLogin}
//                 className="text-sm text-blue-600 hover:text-blue-800"
//               >
//                 Login
//               </button>
//             </li>
//           </ul>
//         </nav>
//       </header>

//       {/* Welcome Section */}
//       <main className="text-center bg-gray-50">
//         <Welcome />

//         {/* Button */}
//         <button
//           onClick={navigateToRegister}
//           className="mt-6 px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-full hover:bg-blue-800"
//         >
//           I take the first step toward a successful Alyah.
//         </button>
//       </main>
//     </div>
//   );
// };

// export default HomePage;

