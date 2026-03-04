import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

const DocumentTable = ({ search, onRefresh }) => {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 8, total: 0, totalPages: 0 });
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    const fetchDocuments = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const result = await api.get('/documents', {
                page,
                limit: pagination.limit,
                search: search || undefined,
            });
            setDocuments(result.data);
            setPagination(result.pagination);
        } catch (err) {
            console.error('Failed to fetch documents:', err);
        } finally {
            setLoading(false);
        }
    }, [search, pagination.limit]);

    useEffect(() => {
        fetchDocuments(1);
    }, [search]);

    const handlePageChange = (page) => {
        fetchDocuments(page);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) return;
        setDeleting(id);
        try {
            await api.delete(`/documents/${id}`);
            fetchDocuments(pagination.page);
            onRefresh?.();
        } catch (err) {
            alert(err.message || 'Gagal menghapus dokumen.');
        } finally {
            setDeleting(null);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        const now = new Date();
        const diff = now - d;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Hari ini';
        if (days === 1) return 'Kemarin';
        if (days < 7) return `${days} hari lalu`;
        if (days < 30) return `${Math.floor(days / 7)} minggu lalu`;
        if (days < 365) return `${Math.floor(days / 30)} bulan lalu`;
        return d.toLocaleDateString('id-ID');
    };

    const renderPagination = () => {
        const { page, totalPages, total } = pagination;
        if (totalPages <= 1) return null;

        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, page - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

        for (let i = start; i <= end; i++) pages.push(i);

        return (
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">
                    Menampilkan <span className="font-bold text-slate-700 dark:text-white">{((page - 1) * pagination.limit) + 1}-{Math.min(page * pagination.limit, total)}</span> dari <span className="font-bold text-slate-700 dark:text-white">{total.toLocaleString('id-ID')}</span> dokumen
                </p>
                <div className="flex gap-1 items-center">
                    {page > 1 && (
                        <button onClick={() => handlePageChange(page - 1)} className="size-8 flex items-center justify-center text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50 transition-colors">
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                    )}
                    {start > 1 && (
                        <>
                            <button onClick={() => handlePageChange(1)} className="size-8 flex items-center justify-center text-xs font-bold rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50 transition-colors">1</button>
                            {start > 2 && <span className="px-1 text-slate-400">...</span>}
                        </>
                    )}
                    {pages.map((p) => (
                        <button key={p} onClick={() => handlePageChange(p)}
                            className={`size-8 flex items-center justify-center text-xs font-bold rounded-lg transition-colors ${p === page ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50'}`}
                        >
                            {p}
                        </button>
                    ))}
                    {end < totalPages && (
                        <>
                            {end < totalPages - 1 && <span className="px-1 text-slate-400">...</span>}
                            <button onClick={() => handlePageChange(totalPages)} className="size-8 flex items-center justify-center text-xs font-bold rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50 transition-colors">{totalPages}</button>
                        </>
                    )}
                    {page < totalPages && (
                        <button onClick={() => handlePageChange(page + 1)} className="size-8 flex items-center justify-center text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50 transition-colors">
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">NO</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">JUDUL DOKUMEN</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">UNIT KERJA</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">TAHUN</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Tags</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                        <span className="text-sm text-slate-400">Memuat dokumen...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : documents.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="material-symbols-outlined text-4xl text-slate-300">folder_off</span>
                                        <span className="text-sm text-slate-400">Tidak ada dokumen ditemukan.</span>
                                    </div>
                                </td>
                            </tr>
                        ) : documents.map((doc, index) => (
                            <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-slate-500">{((pagination.page - 1) * pagination.limit) + index + 1}</td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{doc.title}</p>
                                    <p className="text-[11px] text-slate-400 mt-1">{formatDate(doc.createdAt)}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{doc.unitKerjaName || '-'}</td>
                                <td className="px-6 py-4 text-sm text-center font-bold text-slate-700 dark:text-slate-300">{doc.year}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {(doc.tags || []).map((tag, i) => (
                                            <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase">{tag}</span>
                                        ))}
                                        {(!doc.tags || doc.tags.length === 0) && <span className="text-xs text-slate-300">-</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/katalog/edit/${doc.id}`)}
                                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                            title="Edit"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(doc.id)}
                                            disabled={deleting === doc.id}
                                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                                            title="Hapus"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">{deleting === doc.id ? 'hourglass_empty' : 'delete'}</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {renderPagination()}
        </div>
    );
};

export default DocumentTable;
