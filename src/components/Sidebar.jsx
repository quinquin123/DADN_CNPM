import { House, ChartNoAxesCombined, BellRing, Pencil, UserRoundPen, Menu, Thermometer } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SIDEBAR_ITEMS = [
    { name: "Home", icon: House, color: "#6366f1", href: "/" },
    { name: "Statistics", icon: ChartNoAxesCombined, color: "#8B5CF6", href: "/statistics" },
    { name: "Notification", icon: BellRing, color: "#EC4899", href: "/notification" },
    { name: "Edit", icon: Pencil, color: '#F59E0B', href: "/mode-manager" },
    { name: "Settings", icon: UserRoundPen, color: '#6EE787', href: "/settings" },
    { name: "Sensor Management", icon: Thermometer, color: '#10B981', href: "/sensor-management" },
];

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <motion.div
            className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? 'w-64' : 'w-20'} h-screen sticky top-0`} // Thêm h-screen và sticky
            animate={{ width: isSidebarOpen ? 256 : 80 }}
        >
            <div className='h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700'>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className='p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'
                >
                    <Menu size={24} />
                </motion.button>

                <nav className='mt-8 flex-grow'>
                    {SIDEBAR_ITEMS.map((item) => (
                        <Link key={item.href} to={item.href}>
                            <motion.div
                                className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'
                            >
                                <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                                <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.span
                                            className='ml-4 whitespace-nowrap'
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.2, delay: 0.3 }}
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    ))}
                </nav>
            </div>
        </motion.div>
    );
};

export default Sidebar;