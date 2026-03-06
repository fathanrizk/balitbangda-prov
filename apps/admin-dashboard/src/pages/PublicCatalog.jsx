import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { toDirectImageUrl } from '../lib/utils';

const PublicCatalog = () => {
    const [documents, setDocuments] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 6, total: 0, totalPages: 0 });
    const [loading, setLoading] = useState(true);
    const [unitKerjaList, setUnitKerjaList] = useState([]);
    const [tagList, setTagList] = useState([]);

    // Filters
    const [search, setSearch] = useState('');
    const [selectedUnitKerja, setSelectedUnitKerja] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [sort, setSort] = useState('newest');
    const [sortOpen, setSortOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const fetchDocuments = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const res = await api.get('/documents', {
                page,
                limit: 8,
                search: search || undefined,
                unitKerjaId: selectedUnitKerja || undefined,
                year: selectedYear || undefined,
                tag: selectedTag || undefined,
                sort,
            });
            setDocuments(res.data);
            setPagination(res.pagination);
        } catch (err) {
            console.error('Failed to fetch documents:', err);
        } finally {
            setLoading(false);
        }
    }, [search, selectedUnitKerja, selectedYear, selectedTag, sort]);

    useEffect(() => {
        fetchDocuments(1);
    }, [fetchDocuments]);

    useEffect(() => {
        api.get('/unit-kerja').then(setUnitKerjaList).catch(console.error);
        api.get('/tags').then(setTagList).catch(console.error);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
    };

    const handlePageChange = (page) => {
        fetchDocuments(page);
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    const years = [2025, 2024, 2023, 2022, 2021];

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
            <div className="mt-16 flex justify-center items-center gap-2">
                {page > 1 && (
                    <button onClick={() => handlePageChange(page - 1)} className="size-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors">
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                )}
                {pages.map((p) => (
                    <button key={p} onClick={() => handlePageChange(p)}
                        className={`size-10 flex items-center justify-center rounded-lg font-bold shadow-sm transition-colors ${p === page ? 'bg-slate-800 dark:bg-slate-700 text-white' : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium'}`}
                    >
                        {p}
                    </button>
                ))}
                {page < totalPages && (
                    <button onClick={() => handlePageChange(page + 1)} className="size-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors">
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="font-display">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-background-dark/70 border-b border-primary/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/katalog" className="flex items-center gap-3">
                            <div className="size-16 rounded-lg flex items-center justify-center text-white">
                                <img src="/logo_pemprov.png" alt="Logo" className="w-12 h-14" />
                                {/* <span className="material-symbols-outlined text-[18px]">account_balance</span> */}
                            </div>
                            <span className="text-lg font-bold tracking-tight text-primary dark:text-slate-100">Balitbangda Provinsi Lampung</span>
                        </Link>
                        <div className="hidden md:flex items-center gap-8">
                            {/*<Link to="/katalog" className="text-sm font-semibold hover:text-primary transition-colors text-slate-700 dark:text-slate-300">Beranda</Link>*/}
                            <a href="/katalog" className="text-sm font-semibold hover:text-primary transition-colors text-slate-700 dark:text-slate-300">Beranda</a>
                            {/* <Link to="https://balitbangda.lampungprov.go.id/" className="text-sm font-semibold hover:text-primary transition-colors text-slate-700 dark:text-slate-300">Balitbangda</Link> */}
                            <a href="https://balitbangda.lampungprov.go.id/" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold hover:text-primary transition-colors text-slate-700 dark:text-slate-300"> Balitbangda</a>
                            <Link to="/admin/login" className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-secondary transition-all shadow-lg shadow-primary/20">
                                Login
                            </Link>
                        </div>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden flex items-center p-1">
                            <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">{mobileMenuOpen ? 'close' : 'menu'}</span>
                        </button>
                    </div>
                </div>
                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-primary/10 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md">
                        <div className="px-4 py-4 flex flex-col gap-3">
                            <Link to="/katalog" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary py-2">Beranda</Link>
                            <Link to="/katalog" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary py-2">Tentang</Link>
                            <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)} className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-bold text-center hover:bg-secondary transition-all shadow-lg shadow-primary/20">Login</Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="pt-24 pb-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="relative rounded-2xl overflow-hidden p-8 md:p-16 text-center shadow-2xl bg-cover bg-center"
                        style={{ backgroundImage: "url('bg_header.jpg')" }}>
                        <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
                        <div className="relative z-10 max-w-1xl mx-auto">
                            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                                Database Policy Paper
                                {/* <br className="hidden md:block" /> Balitbangda Lampung */}
                            </h1>
                            <h2 className="text-2xl font-black text-white mb-4">BADAN PENELITIAN DAN PENGEMBANGAN DAERAH PROVINSI LAMPUNG</h2>
                            <p className="text-white/80 text-lg mb-10">
                                Akses kebijakan dan riset strategis untuk pembangunan Provinsi Lampung yang lebih inovatif dan berkelanjutan.
                            </p>

                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 bg-white p-2 rounded-xl shadow-xl max-w-2xl mx-auto">
                                <div className="flex-1 flex items-center px-4 gap-2">
                                    <span className="material-symbols-outlined text-slate-400">search</span>
                                    <input
                                        className="w-full border-none focus:ring-0 outline-none text-slate-900 placeholder:text-slate-400 text-sm"
                                        placeholder="Cari dokumen, topik, atau kata kunci..."
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all">
                                    <span>Cari</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="px-4 pb-24">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
                    {/* Sidebar */}
                    <aside className="lg:w-1/4 flex-shrink-0">
                        {/* Unit Kerja Filter */}
                        <div className="mb-10">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">corporate_fare</span> UNIT KERJA
                                </h4>
                                <button onClick={() => setSelectedUnitKerja('')} className="text-[10px] font-bold text-slate-400 hover:text-primary uppercase tracking-wider">Reset</button>
                            </div>
                            <ul className="space-y-2">
                                {unitKerjaList.map((uk) => (
                                    <li
                                        key={uk.id}
                                        onClick={() => setSelectedUnitKerja(selectedUnitKerja === uk.id ? '' : uk.id)}
                                        className={`flex justify-between items-center text-sm font-medium cursor-pointer transition-all px-3 py-2.5 rounded-lg ${selectedUnitKerja === uk.id ? 'bg-primary text-white font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary dark:hover:text-white'}`}
                                    >
                                        <span className="leading-tight">{uk.name}</span>
                                        <span className={`text-xs font-bold ml-2 flex-shrink-0 ${selectedUnitKerja === uk.id ? 'text-white/80' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full'}`}>{Number(uk.documentCount) || 0}</span>
                                    </li>
                                ))}
                                {unitKerjaList.length === 0 && <li className="text-xs text-slate-400">Belum ada data.</li>}
                            </ul>
                        </div>

                        {/* Tahun Terbit Filter */}
                        <div className="mb-10">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">calendar_month</span> TAHUN TERBIT
                                </h4>
                                <button onClick={() => setSelectedYear('')} className="text-[10px] font-bold text-slate-400 hover:text-primary uppercase tracking-wider">Reset</button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {years.map((y) => (
                                    <button
                                        key={y}
                                        onClick={() => setSelectedYear(selectedYear === String(y) ? '' : String(y))}
                                        className={`py-2 px-3 text-xs font-bold rounded-lg transition-colors ${selectedYear === String(y) ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary'}`}
                                    >
                                        {y}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Kategori Filter */}
                        <div className="mb-10">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">category</span> KATEGORI
                                </h4>
                                <button onClick={() => setSelectedTag('')} className="text-[10px] font-bold text-slate-400 hover:text-primary uppercase tracking-wider">Reset</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {tagList.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                                        className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition-colors ${selectedTag === tag ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10'}`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                                {tagList.length === 0 && <span className="text-xs text-slate-400">Belum ada tag.</span>}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">Publikasi Policy Paper</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl">Kumpulan publikasi policy paper yang diterbitkan oleh Balitbangda Provinsi Lampung untuk mendukung pengambilan kebijakan strategis.</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm relative">
                                <span className="text-slate-400 font-medium">Urutkan:</span>
                                <button
                                    onClick={() => setSortOpen(!sortOpen)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors shadow-sm"
                                >
                                    {sort === 'newest' ? 'Terbaru' : 'Terlama'} <span className="material-symbols-outlined text-base">expand_more</span>
                                </button>
                                {sortOpen && (
                                    <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-30 overflow-hidden">
                                        <button onClick={() => { setSort('newest'); setSortOpen(false); }} className={`block w-full px-4 py-2 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-700 ${sort === 'newest' ? 'font-bold text-primary' : 'text-slate-600 dark:text-slate-300'}`}>Terbaru</button>
                                        <button onClick={() => { setSort('oldest'); setSortOpen(false); }} className={`block w-full px-4 py-2 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-700 ${sort === 'oldest' ? 'font-bold text-primary' : 'text-slate-600 dark:text-slate-300'}`}>Terlama</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                <p className="text-sm text-slate-400">Memuat dokumen...</p>
                            </div>
                        ) : documents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <span className="material-symbols-outlined text-5xl text-slate-300">search_off</span>
                                <p className="text-slate-500 font-medium">Tidak ada dokumen ditemukan.</p>
                                <p className="text-slate-400 text-sm">Coba ubah filter atau kata kunci pencarian Anda.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                {documents.map((doc) => (
                                    <div key={doc.id} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col group">
                                        <div className="aspect-[3/4] bg-[#e6dcd1] dark:bg-slate-800 relative overflow-hidden flex items-center justify-center">
                                            <div className="absolute top-4 right-4 z-10 bg-slate-800/80 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm backdrop-blur-sm">{doc.year}</div>
                                            {doc.coverUrl ? (
                                                <img
                                                    src={toDirectImageUrl(doc.coverUrl)}
                                                    alt={doc.title}
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-[1.03]"
                                                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                                />
                                            ) : null}
                                            <div className={`w-4/5 h-4/5 bg-white dark:bg-slate-100 shadow-xl rounded-[2px] border border-slate-200 p-6 flex-col items-center text-center transition-transform group-hover:scale-[1.02] ${doc.coverUrl ? 'hidden' : 'flex'}`} style={{ display: doc.coverUrl ? 'none' : 'flex' }}>
                                                <div className="text-[6px] font-bold uppercase tracking-widest text-slate-400 mb-2">Policy Paper Cover</div>
                                                <div className="w-4/5 h-[1px] bg-slate-100 mb-4"></div>
                                                <div className="text-[10px] font-black text-slate-800 leading-tight mb-4 uppercase">{doc.title}</div>
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {(doc.tags || []).slice(0, 2).map((tag, i) => (
                                                    <span key={i} className="text-[8px] font-bold text-primary dark:text-blue-400 tracking-widest uppercase">{tag}</span>
                                                ))}
                                            </div>
                                            <h3 className="text-[12px] font-bold text-slate-900 dark:text-white mb-6 leading-tight line-clamp-3" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{doc.title}</h3>
                                            <div className="mt-auto">
                                                <Link to={`/katalog/detail/${doc.id}`} className="text-[8px] font-black flex items-center justify-center gap-1 group-hover:gap-2 transition-all uppercase bg-[#F6F5F5] dark:bg-slate-800 text-primary dark:text-white w-full px-4 py-3 rounded-md hover:bg-primary hover:text-white group-hover:bg-primary group-hover:text-white">
                                                    <span>BACA SELENGKAPNYA</span>
                                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {renderPagination()}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-primary text-white py-12 px-4 shadow-inner">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                <span className="material-symbols-outlined text-white">account_balance</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight">Balitbangda Lampung</span>
                        </div>
                        <p className="text-white/60 text-sm max-w-md mb-6 leading-relaxed">
                            Badan Penelitian dan Pengembangan Daerah Provinsi Lampung berkomitmen menyediakan data dan analisis kebijakan yang akurat untuk mendukung pembangunan daerah yang inovatif.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-lg tracking-tight">Alamat</h4>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Jl. Kantor Pos No. 3,<br />
                            Gunung Mas, Telukbetung Selatan,<br />
                            Kota Bandar Lampung,<br />
                            Lampung 35211
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-lg tracking-tight">Kontak</h4>
                        <p className="text-white/60 text-sm mb-2">Telepon: (0721) -</p>
                        <p className="text-white/60 text-sm mb-2">Fax: (0721) -</p>
                        <p className="text-white/60 text-sm">Email: balitbangda@lampungprov.go.id</p>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
                    <p>© 2024 Balitbangda Provinsi Lampung. Seluruh Hak Cipta Dilindungi.</p>
                </div>
            </footer>
        </div>
    );
};

export default PublicCatalog;
