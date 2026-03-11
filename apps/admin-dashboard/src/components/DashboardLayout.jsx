import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ headerContent, rightContent }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex min-h-screen">
            <Sidebar isOpen={isSidebarOpen} />
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-text-main dark:text-slate-100`}>
                <Header
                    content={headerContent}
                    rightContent={rightContent}
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                />
                <div className="p-8 space-y-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
