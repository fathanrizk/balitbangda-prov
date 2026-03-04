import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

const UnitKerja = ({ showAddModal, onCloseAddModal, searchQuery = '' }) => {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editUnit, setEditUnit] = useState(null);
    const [deleting, setDeleting] = useState(null);

    // Add / Edit form state
    const [formName, setFormName] = useState('');
    const [formCode, setFormCode] = useState('');
    const [formHead, setFormHead] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');

    const fetchUnits = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.get('/unit-kerja');
            setUnits(data);
        } catch (err) {
            console.error('Failed to fetch unit kerja:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUnits();
    }, [fetchUnits]);

    // Filter by search
    const filteredUnits = units.filter((u) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return u.name.toLowerCase().includes(q) || u.code.toLowerCase().includes(q) || (u.headName || '').toLowerCase().includes(q);
    });

    const totalActive = units.filter((u) => u.isActive).length;

    // Modal management
    const isModalOpen = showAddModal || editUnit;

    const resetForm = () => {
        setFormName('');
        setFormCode('');
        setFormHead('');
        setFormError('');
    };

    const handleCloseModal = () => {
        resetForm();
        setEditUnit(null);
        onCloseAddModal?.();
    };

    const handleEdit = (unit) => {
        setFormName(unit.name);
        setFormCode(unit.code);
        setFormHead(unit.headName || '');
        setEditUnit(unit);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormLoading(true);

        try {
            if (editUnit) {
                await api.put(`/unit-kerja/${editUnit.id}`, { name: formName, code: formCode, headName: formHead || undefined });
            } else {
                await api.post('/unit-kerja', { name: formName, code: formCode, headName: formHead || undefined });
            }
            handleCloseModal();
            fetchUnits();
        } catch (err) {
            setFormError(err.message || 'Gagal menyimpan unit kerja.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus unit kerja ini?')) return;
        setDeleting(id);
        try {
            await api.delete(`/unit-kerja/${id}`);
            fetchUnits();
        } catch (err) {
            alert(err.message || 'Gagal menghapus unit kerja.');
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-neutral-soft dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-text-muted text-sm font-medium">Total Unit Kerja</p>
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg text-xl">account_tree</span>
                    </div>
                    <p className="text-3xl font-bold text-primary dark:text-white">{loading ? '...' : units.length}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-neutral-soft dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-text-muted text-sm font-medium">Unit Kerja Aktif</p>
                        <span className="material-symbols-outlined text-accent bg-accent/10 p-2 rounded-lg text-xl">verified</span>
                    </div>
                    <p className="text-3xl font-bold text-primary dark:text-white">{loading ? '...' : totalActive}</p>
                    <p className="text-xs text-text-muted mt-2">{units.length > 0 ? `${Math.round((totalActive / units.length) * 100)}% dari total unit` : '-'}</p>
                </div>
            </div>

            {/* Table Content */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-neutral-soft dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-background-light dark:bg-slate-800/50 border-b border-neutral-soft dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold text-primary dark:text-slate-300 uppercase tracking-wider w-16">No</th>
                                <th className="px-6 py-4 text-xs font-bold text-primary dark:text-slate-300 uppercase tracking-wider">Nama Unit Kerja</th>
                                <th className="px-6 py-4 text-xs font-bold text-primary dark:text-slate-300 uppercase tracking-wider">Kode Unit</th>
                                <th className="px-6 py-4 text-xs font-bold text-primary dark:text-slate-300 uppercase tracking-wider">Kepala Unit</th>
                                <th className="px-6 py-4 text-xs font-bold text-primary dark:text-slate-300 uppercase tracking-wider">Jumlah Dokumen</th>
                                <th className="px-6 py-4 text-xs font-bold text-primary dark:text-slate-300 uppercase tracking-wider text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-soft dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                            <span className="text-sm text-slate-400">Memuat data...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUnits.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="material-symbols-outlined text-4xl text-slate-300">folder_off</span>
                                            <span className="text-sm text-slate-400">Tidak ada unit kerja ditemukan.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUnits.map((unit, index) => (
                                <tr key={unit.id} className="hover:bg-background-light dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 text-sm text-text-muted">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-text-main dark:text-slate-100">{unit.name}</td>
                                    <td className="px-6 py-4 text-sm font-mono text-text-muted">{unit.code}</td>
                                    <td className="px-6 py-4 text-sm text-text-muted">{unit.headName || '-'}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="bg-primary/10 text-primary dark:text-slate-200 dark:bg-primary/40 px-3 py-1 rounded-full text-xs font-bold">{Number(unit.documentCount)}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-3">
                                            <button className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit" onClick={() => handleEdit(unit)}>
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                            <button
                                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                                title="Hapus"
                                                onClick={() => handleDelete(unit.id)}
                                                disabled={deleting === unit.id}
                                            >
                                                <span className="material-symbols-outlined text-[20px]">{deleting === unit.id ? 'hourglass_empty' : 'delete'}</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={handleCloseModal}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-primary dark:text-white mb-6">
                            {editUnit ? 'Edit Unit Kerja' : 'Tambah Unit Kerja Baru'}
                        </h3>

                        {formError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">error</span>
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nama Unit Kerja <span className="text-red-500">*</span></label>
                                <input
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none text-sm"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    required
                                    disabled={formLoading}
                                    placeholder="Contoh: Bidang Inovasi dan Teknologi"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Kode Unit <span className="text-red-500">*</span></label>
                                <input
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none text-sm font-mono"
                                    value={formCode}
                                    onChange={(e) => setFormCode(e.target.value)}
                                    required
                                    disabled={formLoading}
                                    placeholder="Contoh: BIT-001"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Kepala Unit</label>
                                <input
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none text-sm"
                                    value={formHead}
                                    onChange={(e) => setFormHead(e.target.value)}
                                    disabled={formLoading}
                                    placeholder="Contoh: Dr. Ahmad Fauzi"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-5 py-2.5 rounded-lg text-slate-600 font-semibold hover:bg-slate-100 transition-colors text-sm"
                                    disabled={formLoading}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-lg bg-primary text-white font-bold hover:brightness-110 transition-all text-sm disabled:opacity-60 flex items-center gap-2"
                                    disabled={formLoading}
                                >
                                    {formLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        editUnit ? 'Simpan Perubahan' : 'Tambah Unit Kerja'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UnitKerja;
