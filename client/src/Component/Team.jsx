import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import vikas from '../asset/teamImage/vikas.jpg'
import shubham from '../asset/teamImage/my.jpg'
const Team = () => {
  const teamMembers = [
    {
      name: "Shubham Vishwakarma",
      email: "skv6621@gmail.com",
      profession: "Full Stack Developer",
      image: shubham,  // Replace with actual image URL
      github: "https://github.com/shubham8828",
      linkedin: "https://www.linkedin.com/in/shubham-vishwakarma-8b2b06260/",
    },
    {
      name: "Vikas Vishwakarma",
      email: "vikasrv.9922@gmail.com",
      profession: "Software Developer",
      image: vikas,  // Replace with actual image URL
      github: "https://github.com/Vikas-922",
      linkedin: "https://www.linkedin.com/in/vikas-vishwakarma-11b686319/",
    }
  ];
    
  return (
    <>
    <h1>Our Team </h1>
    <div className="team-container">
      {teamMembers.map((member, index) => (
        <div key={index} className="card">
          <img src={member.image} alt={member.name} className="card-image" />
          <h3>{member.name}</h3>
          <p>{member.profession}</p>
          <p><a href={`mailto:${member.email}`} className="email-link" style={{color:"black"}}>{member.email}</a></p>
          <div className="social-icons">
            <a href={member.github} target="_blank" rel="noopener noreferrer">
              <FaGithub className="icon" />
            </a>
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="icon" />
            </a>
          </div>
        </div>
      ))}
    </div>
    </>
  );
};

export default Team;
