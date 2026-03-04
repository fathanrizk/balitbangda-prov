import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authClient } from '../lib/auth';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authClient.signOut();
        } catch (err) {
            console.error('Logout error:', err);
        }
        navigate('/admin/login', { replace: true });
    };

    return (
        <aside className="w-64 bg-primary text-white flex flex-col fixed h-full z-50">
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="size-10 bg-accent rounded-lg flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined font-bold">account_balance</span>
                    </div>
                    <div>
                        <h1 className="text-sm font-extrabold leading-tight uppercase tracking-wider">Balitbangda</h1>
                        <p className="text-[10px] text-white/60 font-medium">Provinsi Lampung</p>
                    </div>
                </div>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-2">
                <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${location.pathname === '/admin' ? 'bg-white/10 text-white font-semibold' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                    <span className="material-symbols-outlined">dashboard</span>
                    <span className="text-sm">Dashboard</span>
                </Link>
                <Link to="/admin/katalog/tambah" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${location.pathname.includes('/admin/katalog/tambah') ? 'bg-white/10 text-white font-semibold' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                    <span className="material-symbols-outlined">description</span>
                    <span className="text-sm">Policy Paper</span>
                </Link>
                <Link to="/admin/unit-kerja" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${location.pathname.includes('/admin/unit-kerja') ? 'bg-white/10 text-white font-semibold' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                    <span className="material-symbols-outlined">corporate_fare</span>
                    <span className="text-sm">Unit Kerja</span>
                </Link>
                <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all font-medium">
                    <span className="material-symbols-outlined">manage_accounts</span>
                    <span className="text-sm">User Management</span>
                </Link>
                <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all font-medium">
                    <span className="material-symbols-outlined">settings</span>
                    <span className="text-sm">Settings</span>
                </Link>
            </nav>
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium"
                >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    <span className="text-sm">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
