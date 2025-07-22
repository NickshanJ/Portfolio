import React, { useRef } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import MoviesSearch from "./image/Movies Search.png";
import VehicleRental from "./image/Vehicle Rental.png";
import Portal from "./image/Portal.png";
import Event from "./image/Event.png";

const projects = [
  {
    url: "https://online-vehicle-rental.netlify.app/",
    img: VehicleRental,
    alt: "Vehicle Rental Service",
    text: "Online Vehicle Rental Page",
    description:
      "An online platform to search and book vehicles for rent with ease.",
    skills: ["MongoDB", "Express", "React", "Node", "Tailwind", "Razorpay"],
    codeLinks: {
      frontend: "https://github.com/NickshanJ/Vehicle-Rental.git",
      backend: "https://github.com/NickshanJ/Vehicle-rental-server.git",
    },
  },
  {
    url: "https://moviesearch00.netlify.app/",
    img: MoviesSearch,
    alt: "Movies Search: Your Movie Journey Starts Here!",
    text: "Movies Search: Your Movie Journey Starts Here!",
    description: "Search and view movie details with pagination, routing, filtering, and favorites in a React application.",
    skills: ["React","HTML", "CSS", "JavaScript", "Tailwind CSS"],
    codeLinks: {
      frontend: "https://github.com/NickshanJ/Movie-Search.git",
      backend: "https://github.com/NickshanJ/Movie-Search.git",
    },
  },
  {
    url: "https://student-teacher-portal.netlify.app/",
    img: Portal,
    alt: "Student Teacher Portal",
    text: "Student Teacher Portal",
    description: "A platform where students and teachers connect, learn, and grow together.",
    skills: ["MongoDB", "Express", "React", "Node", "Tailwind CSS"],
    codeLinks: {
      frontend: "https://github.com/NickshanJ/Student-Teacher-Portal/tree/main/frontend",
      backend: "https://github.com/NickshanJ/Student-Teacher-Portal/tree/main/backend",
    },
  },
  {
    url: "https://event-managementsystem.netlify.app/",
    img: Event,
    alt: "Event Management System",
    text: "Event Management System",
    description: "A dynamic platform to explore, reserve, and celebrate events that bring people together.",
    skills: ["MongoDB", "Express", "React", "Node", "Tailwind CSS"],
    codeLinks: {
      frontend: "https://github.com/NickshanJ/Event-Management-System/tree/main/frontend",
      backend: "https://github.com/NickshanJ/Event-Management-System/tree/main/backend",
    },
  },
];

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 4,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

function Projects() {
  const carouselRef = useRef(null);

  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.previous();
    }
  };

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-stylish p-10">
      <h2 className="text-4xl font-bold mb-8 mt-20 md:mt-14 text-center">
        My Projects
      </h2>
      <Carousel
        ref={carouselRef}
        responsive={responsive}
        infinite={true}
        autoPlay={false}
        keyBoardControl={true}
        transitionDuration={500}
        containerClass="carousel-container"
        itemClass="px-4"
        arrows={false}
      >
        {projects.map((project, index) => {
          // Animation logic based on visible position
          let animationClass = "";
          // Desktop: 3 items, Tablet: 2, Mobile: 1
          // We use index % itemsPerView to determine position
          // But since Carousel handles visible items, we animate all
          if (window.innerWidth >= 1024) {
            // Desktop: 3 items
            if (index % 3 === 0) animationClass = "animate-fadeInLeft";
            else if (index % 3 === 1) animationClass = "animate-fadeInDown";
            else if (index % 3 === 2) animationClass = "animate-fadeInRight";
          } else if (window.innerWidth >= 464) {
            // Tablet: 2 items
            if (index % 2 === 0) animationClass = "animate-fadeInLeft";
            else animationClass = "animate-fadeInRight";
          } else {
            // Mobile: 1 item
            animationClass = "animate-fadeInDown";
          }
          return (
            <div
              key={index}
              className={`flex flex-col items-center bg-gray-800 rounded-lg p-4 cursor-pointer transition-transform ${animationClass}`}
              onClick={() => window.open(project.url, "_blank")}
            >
              <img
                src={project.img}
                alt={project.alt}
                className="rounded-lg h-40 object-cover mb-4"
              />
              <p className="text-center font-semibold text-xl">
                {project.text}
              </p>
              <p className="text-gray-400 mt-2 text-center">
                {project.description}
              </p>
              <ul className="flex md:flex-nowrap flex-wrap gap-1 mt-2 justify-center">
                {project.skills &&
                  project.skills.map((skill, idx) => (
                    <li key={idx} className="bg-gray-700 px-1 sm:px-2 md:px-0 md:py-2 py-1 rounded-md">
                      {skill}
                    </li>
                  ))}
              </ul>
              {/* Code Links */}
              {project.codeLinks && (
                <div className="flex gap-4 mt-2">
                  <a
                    href={project.codeLinks.frontend}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Frontend
                  </a>
                  <a
                    href={project.codeLinks.backend}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Backend
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </Carousel>
      <div className="flex justify-center mt-8">
        <button
          className="w-12 h-12 bg-gray-800 rounded-full mx-4 hover:bg-[#d4af37] shadow-lg transform hover:scale-105 transition-transform duration-300 flex items-center justify-center"
          onClick={handlePrev}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            className="text-white text-2xl"
          />
        </button>
        <button
          className="w-12 h-12 bg-gray-800 rounded-full mx-4 hover:bg-[#d4af37] shadow-lg transform hover:scale-105 transition-transform duration-300 flex items-center justify-center"
          onClick={handleNext}
        >
          <FontAwesomeIcon
            icon={faChevronRight}
            className="text-white text-2xl"
          />
        </button>
      </div>
    </div>
  );
}

export default Projects;
