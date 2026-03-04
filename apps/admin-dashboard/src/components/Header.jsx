import React from 'react';

const Header = ({ content, rightContent }) => {
    return (
        <header className="h-16 border-b border-neutral-soft dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10 flex items-center justify-between px-8">
            <div className="flex items-center gap-2">
                {content ? content : <span className="text-xl font-bold text-slate-800 dark:text-white">Dashboard Admin</span>}
            </div>
            {rightContent ? rightContent : (
                <div className="flex items-center gap-4">
                    <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
                    <button className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <span>Admin Mode</span>
                        <span className="material-symbols-outlined">expand_more</span>
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;
