import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';

const TambahDokumen = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [unitKerjaList, setUnitKerjaList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!id);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({
        title: '',
        unitKerjaId: '',
        year: '',
        summary: '',
        coverUrl: '',
        pdfUrl: '',
    });

    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [authors, setAuthors] = useState(['']);

    useEffect(() => {
        api.get('/unit-kerja').then(setUnitKerjaList).catch(console.error);
    }, []);

    // Fetch existing document in edit mode
    useEffect(() => {
        if (!id) return;
        setFetching(true);
        api.get(`/documents/${id}`)
            .then((doc) => {
                setForm({
                    title: doc.title || '',
                    unitKerjaId: doc.unitKerjaId || '',
                    year: doc.year ? String(doc.year) : '',
                    summary: doc.summary || '',
                    coverUrl: doc.coverUrl || '',
                    pdfUrl: doc.pdfUrl || '',
                });
                setTags(doc.tags || []);
                setAuthors(
                    doc.authors && doc.authors.length > 0
                        ? doc.authors.map((a) => a.name)
                        : ['']
                );
            })
            .catch((err) => setError('Gagal memuat data dokumen.'))
            .finally(() => setFetching(false));
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((t) => t !== tagToRemove));
    };

    const handleAuthorChange = (index, value) => {
        const newAuthors = [...authors];
        newAuthors[index] = value;
        setAuthors(newAuthors);
    };

    const handleAddAuthor = () => {
        setAuthors([...authors, '']);
    };

    const handleRemoveAuthor = (index) => {
        if (authors.length <= 1) return;
        setAuthors(authors.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const payload = {
                title: form.title,
                year: Number(form.year),
                summary: form.summary || undefined,
                coverUrl: form.coverUrl || undefined,
                pdfUrl: form.pdfUrl || undefined,
                unitKerjaId: form.unitKerjaId || undefined,
                tags: tags.length > 0 ? tags : undefined,
                authors: authors.filter((a) => a.trim()).length > 0
                    ? authors.filter((a) => a.trim()).map((name) => ({ name }))
                    : undefined,
            };

            if (isEditMode) {
                await api.put(`/documents/${id}`, payload);
            } else {
                await api.post('/documents', payload);
            }
            setSuccess(true);
            setTimeout(() => navigate('/admin'), 1500);
        } catch (err) {
            setError(err.message || 'Gagal menyimpan dokumen.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <span className="text-sm text-slate-400">Memuat data dokumen...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center w-full">
            <div className="w-full max-w-[800px]">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-primary dark:text-slate-100">{isEditMode ? 'Edit Dokumen' : 'Tambah Dokumen Baru'}</h2>
                    <p className="text-slate-500 text-sm mt-1">{isEditMode ? 'Perbarui informasi policy paper di bawah ini.' : 'Lengkapi informasi di bawah ini untuk menambahkan policy paper ke repositori.'}</p>
                </div>

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium flex items-center gap-2">
                        <span className="material-symbols-outlined">check_circle</span>
                        {isEditMode ? 'Dokumen berhasil diperbarui!' : 'Dokumen berhasil disimpan!'} Mengalihkan...
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
                        <span className="material-symbols-outlined">error</span>
                        {error}
                    </div>
                )}

                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <form className="p-8 space-y-6" onSubmit={handleSubmit}>
                        {/* Judul Policy Paper */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Judul Policy Paper <span className="text-red-500">*</span></label>
                            <input
                                className="w-full px-4 py-3 rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-primary focus:border-primary border outline-none text-sm"
                                placeholder="Masukkan judul lengkap policy paper"
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Two Column Row: Unit Kerja & Tahun */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Unit Kerja</label>
                                <select
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-primary focus:border-primary outline-none text-sm"
                                    name="unitKerjaId"
                                    value={form.unitKerjaId}
                                    onChange={handleChange}
                                    disabled={loading}
                                >
                                    <option value="">Pilih Unit Kerja</option>
                                    {unitKerjaList.map((uk) => (
                                        <option key={uk.id} value={uk.id}>{uk.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tahun <span className="text-red-500">*</span></label>
                                <select
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-primary focus:border-primary outline-none text-sm"
                                    name="year"
                                    value={form.year}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                >
                                    <option value="">Pilih Tahun</option>
                                    {[2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Tags / Tema */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tags / Tema</label>
                            <div className="flex flex-wrap gap-2 p-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-lg focus-within:ring-2 focus-within:ring-primary/20">
                                {tags.map((tag) => (
                                    <span key={tag} className="inline-flex items-center gap-1 bg-primary/5 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-md text-xs font-semibold border border-slate-200 dark:border-slate-700">
                                        {tag}
                                        <button className="material-symbols-outlined text-[16px] leading-none hover:text-red-500 text-slate-400" type="button" onClick={() => handleRemoveTag(tag)}>close</button>
                                    </span>
                                ))}
                                <input
                                    className="border-none bg-transparent focus:ring-0 text-sm flex-1 min-w-[120px] outline-none"
                                    placeholder="Tambah tag lalu tekan Enter..."
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Ringkasan Eksekutif */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ringkasan Eksekutif</label>
                            <textarea
                                className="w-full px-4 py-3 rounded-lg border flex border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-primary focus:border-primary outline-none text-sm resize-y"
                                placeholder="Tuliskan ringkasan singkat isi policy paper..."
                                rows="4"
                                name="summary"
                                value={form.summary}
                                onChange={handleChange}
                                disabled={loading}
                            ></textarea>
                        </div>

                        {/* Tim Penyusun */}
                        <div className="space-y-4">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tim Penyusun</label>
                            <div className="space-y-3">
                                {authors.map((author, index) => (
                                    <div key={index} className="flex gap-3 items-center">
                                        <input
                                            className="flex-1 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-primary focus:border-primary outline-none text-sm"
                                            placeholder="Nama Anggota Tim"
                                            type="text"
                                            value={author}
                                            onChange={(e) => handleAuthorChange(index, e.target.value)}
                                            disabled={loading}
                                        />
                                        <button
                                            className="p-2 text-slate-400 hover:text-red-500 transition-colors flex items-center justify-center rounded-lg hover:bg-slate-100 disabled:opacity-30"
                                            type="button"
                                            onClick={() => handleRemoveAuthor(index)}
                                            disabled={authors.length <= 1 || loading}
                                        >
                                            <span className="material-symbols-outlined text-xl">delete</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                className="flex items-center gap-1.5 text-primary dark:text-blue-400 text-sm font-bold hover:underline"
                                type="button"
                                onClick={handleAddAuthor}
                                disabled={loading}
                            >
                                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                                Tambah Anggota
                            </button>
                        </div>

                        {/* Document Links */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Link Cover Dokumen</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-xl">image</span>
                                    </div>
                                    <input
                                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-primary focus:border-primary outline-none text-sm"
                                        placeholder="https://drive.google.com/..."
                                        type="url"
                                        name="coverUrl"
                                        value={form.coverUrl}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                </div>
                                <p className="text-xs text-slate-400">Masukkan link Google Drive untuk gambar cover</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Link File PDF</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
                                    </div>
                                    <input
                                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-primary focus:border-primary outline-none text-sm"
                                        placeholder="https://drive.google.com/..."
                                        type="url"
                                        name="pdfUrl"
                                        value={form.pdfUrl}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                </div>
                                <p className="text-xs text-slate-400">Masukkan link Google Drive untuk file PDF dokumen</p>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4">
                            <button
                                className="px-6 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
                                type="button"
                                onClick={() => navigate('/admin')}
                                disabled={loading}
                            >
                                Batal
                            </button>
                            <button
                                className="px-6 py-2.5 rounded-lg bg-[#d4af37] text-white font-bold hover:brightness-110 shadow-lg shadow-[#d4af37]/30 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Simpan Dokumen'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <p className="mt-8 text-center text-xs text-slate-400">
                    © 2024 Badan Perencanaan Pembangunan Daerah Provinsi Lampung. Seluruh Hak Cipta Dilindungi.
                </p>
            </div>
        </div>
    );
};

export default TambahDokumen;
