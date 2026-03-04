import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ headerContent, rightContent }) => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-text-main dark:text-slate-100">
                <Header content={headerContent} rightContent={rightContent} />
                <div className="p-8 space-y-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
