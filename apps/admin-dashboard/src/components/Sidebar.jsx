import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authClient } from '../lib/auth';

const Sidebar = ({ isOpen = true }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authClient.signOut();
        } catch (err) {
            console.error('Logout error:', err);
        }
        navigate('/katalog', { replace: true });
    };

    return (
        <aside className={`bg-primary text-white flex flex-col fixed h-full z-50 transition-all duration-300 overflow-hidden ${isOpen ? 'w-64' : 'w-20'}`}>
            <div className={`p-6 ${isOpen ? '' : 'px-0 flex justify-center'}`}>
                <div className="flex items-center gap-3">
                    <div className="size-10 shrink-0 bg-accent rounded-lg flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined font-bold">account_balance</span>
                    </div>
                    {isOpen && (
                        <div className="whitespace-nowrap transition-opacity duration-300">
                            <h1 className="text-sm font-extrabold leading-tight uppercase tracking-wider">Balitbangda</h1>
                            <p className="text-[10px] text-white/60 font-medium">Provinsi Lampung</p>
                        </div>
                    )}
                </div>
            </div>
            <nav className={`flex-1 py-4 space-y-2 ${isOpen ? 'px-4' : 'px-2'}`}>
                <Link to="/admin" className={`flex items-center gap-3 py-3 rounded-xl transition-all font-medium ${isOpen ? 'px-4' : 'justify-center'} ${location.pathname === '/admin' ? 'bg-white/10 text-white font-semibold' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                    <span className="material-symbols-outlined shrink-0">dashboard</span>
                    {isOpen && <span className="text-sm whitespace-nowrap">Dashboard</span>}
                </Link>
                <Link to="/admin/katalog/tambah" className={`flex items-center gap-3 py-3 rounded-xl transition-all font-medium ${isOpen ? 'px-4' : 'justify-center'} ${location.pathname.includes('/admin/katalog/tambah') ? 'bg-white/10 text-white font-semibold' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                    <span className="material-symbols-outlined shrink-0">description</span>
                    {isOpen && <span className="text-sm whitespace-nowrap">Policy Paper</span>}
                </Link>
                <Link to="/admin/unit-kerja" className={`flex items-center gap-3 py-3 rounded-xl transition-all font-medium ${isOpen ? 'px-4' : 'justify-center'} ${location.pathname.includes('/admin/unit-kerja') ? 'bg-white/10 text-white font-semibold' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                    <span className="material-symbols-outlined shrink-0">corporate_fare</span>
                    {isOpen && <span className="text-sm whitespace-nowrap">Unit Kerja</span>}
                </Link>
                <Link to="/admin" className={`flex items-center gap-3 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all font-medium ${isOpen ? 'px-4' : 'justify-center'}`}>
                    <span className="material-symbols-outlined shrink-0">manage_accounts</span>
                    {isOpen && <span className="text-sm whitespace-nowrap">User Management</span>}
                </Link>
                <Link to="/admin" className={`flex items-center gap-3 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all font-medium ${isOpen ? 'px-4' : 'justify-center'}`}>
                    <span className="material-symbols-outlined shrink-0">settings</span>
                    {isOpen && <span className="text-sm whitespace-nowrap">Settings</span>}
                </Link>
            </nav>
            <div className={`p-4 border-t border-white/10 ${isOpen ? '' : 'flex justify-center'}`}>
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium ${isOpen ? 'w-full px-4' : 'justify-center w-12 h-12'}`}
                >
                    <span className="material-symbols-outlined text-sm shrink-0">logout</span>
                    {isOpen && <span className="text-sm whitespace-nowrap">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
