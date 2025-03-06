import Header from "../components/Header"
import { useState, useEffect } from "react"
import Image from "../../public/image.png"

const HomePage = () => {
  const [greeting, setGreeting] = useState("Good evening")
  
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning")
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good afternoon")
    } else {
      setGreeting("Good evening")
    }
  }, [])

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-y-auto">
      <div className="flex-1 overflow-auto relative z-10">
        <Header title='SmartHome' />
        
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{greeting}</h2>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Welcome, Quynh!</h1>
              </div>
              <div className="flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                <span className="text-2xl mr-2">👋</span>
                <span className="font-medium text-blue-700 dark:text-blue-300">Have a nice day!</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Temperature Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="bg-blue-500/10 dark:bg-blue-500/20 px-4 py-3">
                <h3 className="text-blue-700 dark:text-blue-300 font-medium">TEMPERATURE</h3>
              </div>
              <div className="p-6 flex justify-center items-center">
                <div className="text-center">
                  <span className="text-4xl font-bold text-gray-800 dark:text-white">30°C</span>
                </div>
              </div>
            </div>

            {/* Humidity Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="bg-green-500/10 dark:bg-green-500/20 px-4 py-3">
                <h3 className="text-green-700 dark:text-green-300 font-medium">HUMIDITY</h3>
              </div>
              <div className="p-6 flex justify-center items-center">
                <div className="text-center">
                  <span className="text-4xl font-bold text-gray-800 dark:text-white">80%</span>
                </div>
              </div>
            </div>

            {/* Light Intensity Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="bg-yellow-500/10 dark:bg-yellow-500/20 px-4 py-3">
                <h3 className="text-yellow-700 dark:text-yellow-300 font-medium">LIGHT INTENSITY</h3>
              </div>
              <div className="p-6 flex justify-center items-center">
                <div className="text-center">
                  <span className="text-4xl font-bold text-gray-800 dark:text-white">13 lux</span>
                </div>
              </div>
            </div>
          </div>

          {/* Room Image with overlay information */}
          <div className="relative rounded-xl overflow-hidden shadow-lg">
            <img
              src={Image}
              alt="Living Room"
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h3 className="text-white text-xl font-medium mb-2">Living Room</h3>
              <div className="flex space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm">
                  3 devices active
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm">
                  Energy saving mode
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage