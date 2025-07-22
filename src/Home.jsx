import React from "react";
import backgroundImage from "./image/HomeBG.jpg";
import DynamicText from "./DynamicText";
import resumePDF from "./assets/Resume - Nickshan J.pdf";
import "./App.css";

function HomePage() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Background Image Section */}
      <div
        className="absolute inset-0 w-full h-full -z-10"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Content Section */}
      <div className="flex flex-col justify-center items-start text-white pl-10 md:pl-40 h-screen animate-fadeInLeft">
        <h1 className="text-[33px] md:text-[65px] font-bold mb-4 fill-text font-stylish">
          Hi, I'm J. Nickshan
        </h1>
        <p className="text-[25px] md:text-3xl mb-2 font-stylish">
          I'm a{" "}
          <DynamicText
            texts={["Front-End Developer", "MERN Full Stack Developer"]}
            typingSpeed={50}
            pauseDuration={1500}
          />
        </p>
        <button className="mt-8 bg-[#FEE715FF] text-black px-2 py-1 md:px-4 md:py-2 rounded-[30px] hover:scale-110 transition-transform font-trade-winds">
          <a href={resumePDF} target="_blank" rel="nofollow noopener noreferrer">
            Resume
          </a>
        </button>
      </div>
    </div>
  );
}

export default HomePage;