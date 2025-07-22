import React, { useState } from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import emailjs from "emailjs-com";
import config from "./config";
import Modal from "./Modal";

function Contact() {
  const [modalMessage, setModalMessage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        config.SERVICE_ID,
        config.TEMPLATE_ID,
        e.target,
        config.USER_ID
      )
      .then(
        (result) => {
          console.log(result.text);
          setModalMessage("Message sent successfully!");
          setIsModalVisible(true);
        },
        (error) => {
          console.log(error.text);
          setModalMessage("An error occurred. Please try again.");
          setIsModalVisible(true);
        }
      );

    e.target.reset();
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-gray-300">
      <div className="w-full max-w-2xl p-8">
        <h2 className="text-center text-3xl mt-16 md:mt-10 font-stylish mb-6 animate-fadeInRight">
          Get in touch with Me
        </h2>
        <form onSubmit={sendEmail} className="space-y-6 mt-16 font-stylish animate-fadeInLeft">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xl mb-1" htmlFor="from_name">
                Your Name (required)
              </label>
              <input
                type="text"
                id="from_name"
                name="from_name"
                className="w-full bg-transparent border-b border-gray-500 focus:outline-none focus:border-gray-100 p-2"
                required
              />
            </div>
            <div>
              <label className="block text-xl mb-1" htmlFor="reply_to">
                Your E-mail (required)
              </label>
              <input
                type="email"
                id="reply_to"
                name="reply_to"
                className="w-full bg-transparent border-b border-gray-500 focus:outline-none focus:border-gray-100 p-2"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xl mb-1" htmlFor="message">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="3"
              className="w-full bg-transparent border-b border-gray-500 focus:outline-none focus:border-gray-100 p-2"
            ></textarea>
          </div>
          <div className="text-center text-xl mt-4">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg border border-gray-500 text-gray-300 hover:bg-[#d4af37] hover:text-black hover:scale-110 transition-transform"
            >
              Get in touch
            </button>
          </div>
        </form>
      </div>

      {/* Footer Section */}
      <footer className="w-full px-4 py-4 flex flex-col items-center animate-fadeInUp">
        <div className="w-2/3 mx-auto border-t border-gray-500"></div>
        <div className="w-full flex flex-col md:flex-row md:justify-around items-center md:items-start mt-4 gap-4">
          {/* Left side */}
          <div className="flex space-x-6 justify-center md:justify-start w-full md:w-auto">
            <a
              href="https://www.linkedin.com/in/nickshanj/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:scale-110 transition-transform hover:text-blue-600"
            >
              <FaLinkedin size={32} />
            </a>
            <a
              href="https://github.com/NickshanJ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:scale-110 transition-transform hover:text-[#FEE715FF]"
            >
              <FaGithub size={32} />
            </a>
          </div>
          {/* Right side */}
          <div className="text-gray-300 text-center md:text-right w-full md:w-auto">
            Email - nickshan001@gmail.com
            <div className="text-gray-500 mt-2">
              Illustrations by <a
                href="https://storyset.com/"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="hover:underline"
              >
                Storyset
              </a>.
            </div>
          </div>
        </div>
      </footer>

      <Modal
        isVisible={isModalVisible}
        message={modalMessage}
        onClose={closeModal}
      />
    </div>
  );
}

export default Contact;