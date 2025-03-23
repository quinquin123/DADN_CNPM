import React, { useState } from 'react';

const YoloHomeSignUp = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    surname: '',
    phone: '',
    email: '',
    password: '',
    repeatPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="flex flex-row font-poppins h-screen w-full">
      {/* Left Panel - Image with text overlay */}
      
      <div className="w-2/5 relative bg-neutral-900">
      <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
          {/* This would be replaced with an actual image in production */}
          <div className="  absolute inset-0 bg-cover bg-center" style={{ 
            backgroundImage: "url('signin.png')", 
          }}></div>
        </div>
        <div className="absolute inset-0 flex flex-col pt-36 px-16 text-white">
          <h1 className="text-4xl font-bold ">Join YoloHome</h1>
          <p className="text-xl">Your journey to smarter living starts here.</p>
        </div>
       
      </div>
      
      {/* Right Panel - Sign Up Form */}
      <div className="w-3/5 flex flex-col justify-center items-center px-16 bg-white">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-wider">YOLOHOME</h1>
        </div>
        
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-3xl font-semibold mb-8">Sign Up</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <input
                  type="text"
                  name="firstname"
                  className="w-full px-4 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                />
              </div>
              <div className="w-1/2">
                <input
                  type="text"
                  name="surname"
                  className="w-full px-4 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Surname"
                  value={formData.surname}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <input
                type="tel"
                name="phone"
                className="w-full pl-10 pr-3 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                type="email"
                name="email"
                className="w-full pl-10 pr-3 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="password"
                name="password"
                className="w-full pl-10 pr-3 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="password"
                name="repeatPassword"
                className="w-full pl-10 pr-3 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Repeat Password"
                value={formData.repeatPassword}
                onChange={handleChange}
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition duration-200 mt-4"
            >
              Sign Up
            </button>
            
            <div className="text-center mt-4">
              <p className="text-gray-500">
                Already have an account? <a href="#" className="text-blue-500">Log In</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default YoloHomeSignUp;