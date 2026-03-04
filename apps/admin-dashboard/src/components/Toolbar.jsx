import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Toolbar = ({ search, onSearchChange }) => {
    const timerRef = useRef(null);

    const handleChange = (e) => {
        const value = e.target.value;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            onSearchChange(value);
        }, 400);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-96">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    placeholder="Cari judul dokumen atau tahun..."
                    type="text"
                    defaultValue={search}
                    onChange={handleChange}
                />
            </div>
            <Link to="/admin/katalog/tambah" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:bg-opacity-90 text-primary font-bold rounded-xl transition-all shadow-lg shadow-accent/20">
                <span className="material-symbols-outlined">add</span>
                <span>Tambah Dokumen Baru</span>
            </Link>
        </div>
    );
};

export default Toolbar;
