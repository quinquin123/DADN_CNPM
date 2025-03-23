import React, { useState } from 'react';

const YoloHomeLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex flex-row font-poppins h-screen w-full">
      {/* Left Panel - Login Form */}
      <div className="w-3/5 flex items-center flex-col ">
          <div className="text-4xl pt-20 font-semibold ">YOLOHOME</div>
        
        <div className="w-full pt-52 max-w-md">
          <h2 className="text-2xl font-semibold mb-2">Log In</h2>
          <p className="text-gray-500 mb-2">
            Don't have an account? <span className="text-blue-500 cursor-pointer">Sign Up</span>
          </p>
          
          <form className="space-y-4  ">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                type="email"
                className="w-full pl-10 pr-3 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                className="w-full pl-10 pr-3 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition duration-200"
            >
              Log In
            </button>
            
            <div className="text-center">
              <a href="#" className="text-blue-500 text-sm">Forgot password?</a>
            </div>
          </form>
        </div>
      </div>
      
      {/* Right Panel - Image */}
      <div className="w-2/5 relative">
        <div className="absolute inset-0 bg-cover bg-center"   style={{ backgroundImage: "url('/login.png')" }}        >
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <div className="absolute inset-0 flex flex-col  px-10 ">
            <h2 className="text-2xl font-semibold mt-32 ">Welcome to YoloHome</h2>
            <p className="text-xl my-0">Smart living begins at home.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YoloHomeLogin;