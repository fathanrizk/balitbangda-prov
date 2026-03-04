import React from 'react';

const StatCard = ({ iconName, title, value, iconBgClass, iconTextClass }) => {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-5">
            <div className={`size-14 rounded-2xl flex items-center justify-center ${iconBgClass} ${iconTextClass}`}>
                <span className="material-symbols-outlined text-3xl">{iconName}</span>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</h3>
            </div>
        </div>
    );
};

export default StatCard;
