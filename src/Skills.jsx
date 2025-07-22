import React from "react";
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, FaGithub } from "react-icons/fa";
import { SiTailwindcss, SiExpress, SiMongodb, SiMysql } from "react-icons/si";
import "./App.css";

function Skills() {
  const skills = [
    { name: "HTML", icon: <FaHtml5 size={50} color="#E44D26" /> },
    { name: "CSS", icon: <FaCss3Alt size={50} color="#1572B6" /> },
    { name: "Tailwind CSS", icon: <SiTailwindcss size={50} color="#38B2AC" /> },
    { name: "JavaScript", icon: <FaJs size={50} color="#F7DF1E" /> },
    { name: "React", icon: <FaReact size={50} color="#61DAFB" /> },
    { name: "Node.js", icon: <FaNodeJs size={50} color="#68A063" /> },
    { name: "Express.js", icon: <SiExpress size={50} color="#000000" /> },
    { name: "MongoDB", icon: <SiMongodb size={50} color="#47A248" /> },
    { name: "MySQL", icon: <SiMysql size={50} color="#4479A1" /> },
    { name: "GitHub", icon: <FaGithub size={50} color="#181717" /> },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h2 className="text-4xl font-bold mb-8 mt-32 font-stylish text-center">My Skills</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 font-stylish mt-16 justify-items-center">
        {skills.map((skill, idx) => {
          // 5 columns per row, so idx < 5 is first row, idx >= 5 is second row
          const animationClass = idx < 5 ? 'animate-fadeInRight' : 'animate-fadeInLeft';
          return (
            <div key={skill.name} className={`flex flex-col items-center hover:scale-110 transition-transform space-y-4 ${animationClass}`} style={{ animationDelay: `${idx * 0.1 + (idx < 5 ? 0 : 0.5)}s` }}>
              <div className="rounded-full bg-white p-4">{skill.icon}</div>
              <p className="text-xl">{skill.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Skills;