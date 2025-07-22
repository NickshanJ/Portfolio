import React from "react";
import profileImage from "./image/About Page.webp";
import resumePDF from "./assets/Resume - Nickshan J.pdf";
import {
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaWhatsapp,
  FaDownload,
} from "react-icons/fa";

function About() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-black p-10 md:pt-28">
      {/* Left side image */}
      <div className="w-full md:w-[60%] flex justify-center mt-20 md:mt-0 mb-10 md:mb-0 animate-fadeInLeft">
        <img
          src={profileImage}
          alt="Profile"
          className="shadow-lg w-[80%] md:w-[350px] aspect-auto border-2 border-[#fee71539] rounded-3xl transform hover:scale-105 transition-transform duration-500"
        />
      </div>
      {/* Right side text */}
      <div className="w-full md:w-[80%] text-center md:text-left text-white space-y-6 animate-fadeInRight mx-auto">
        <h3 className="text-[33px] text-[#FEE715FF] font-stylish">
          Hello! I'm Nickshan
        </h3>
        <p className="text-[22px] font-stylish">
          I'm a passionate Full Stack Developer with a talent for developing
          ideas into great digital experiences. I enjoy designing visually
          beautiful and user-friendly websites, and I am interested in both
          front-end and back-end development. Having worked with HTML5, CSS3,
          JavaScript, Tailwind, React.js, Node.js, Mongo DB, and Git, I'm
          excited to add new perspectives and energy to any team. What I value
          most about web development is the combination of creativity and
          rationality required.Each step of the process provides an opportunity
          for learning and growth. I am interested about staying current with
          industry innovations and continually developing my skills. Please feel
          free to contact me..
        </p>
        <div className="flex justify-center md:justify-start space-x-4">
          <a
            href={resumePDF}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl flex text-black bg-white px-2 py-1 rounded-[100px] hover:bg-[#FEE715FF] hover:scale-110 transition-transform items-center font-stylish"
          >
            <FaDownload className="mr-2" />
            Resume
          </a>
          {/* <a
            href="https://www.linkedin.com/in/nickshanj/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl flex items-center"
          >
            <FaLinkedin className="mr-2 text-[25px] hover:scale-110 transition-transform hover:text-blue-600" />
          </a>
          <a
            href="mailto:nickshan001@gmail.com"
            className="text-xl flex items-center"
          >
            <FaEnvelope className="mr-2 text-[25px] hover:scale-110 transition-transform hover:text-red-600" />
          </a>
          <a
            href="https://github.com/NickshanJ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl flex items-center"
          >
            <FaGithub className="mr-2 text-[25px] hover:scale-110 transition-transform hover:text-[#FEE715FF]" />
          </a>
          <a
            href="https://wa.me/7358176388"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl flex items-center"
          >
            <FaWhatsapp className="mr-2 text-[25px] hover:scale-110 transition-transform hover:text-green-400" />
          </a> */}
        </div>
      </div>
    </div>
  );
}

export default About;
