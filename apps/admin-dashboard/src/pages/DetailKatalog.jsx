import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { toDirectImageUrl } from '../lib/utils';

const DetailKatalog = () => {
    const { id } = useParams();
    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedDocs, setRelatedDocs] = useState([]);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        setLoading(true);
        api.get(`/documents/${id}`)
            .then((data) => {
                setDoc(data);
                // Fetch related documents
                api.get('/documents', { limit: 4 }).then((res) => {
                    setRelatedDocs(res.data.filter((d) => d.id !== id).slice(0, 4));
                }).catch(console.error);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    const handleDownload = async () => {
        if (!doc) return;
        setDownloading(true);
        try {
            const res = await api.post(`/documents/${id}/download`);
            if (res.pdfUrl) {
                window.open(res.pdfUrl, '_blank');
            } else {
                alert('Link PDF tidak tersedia.');
            }
        } catch (err) {
            alert(err.message || 'Gagal mengunduh dokumen.');
        } finally {
            setDownloading(false);
        }
    };

    const handlePreview = () => {
        if (doc?.pdfUrl) {
            window.open(doc.pdfUrl, '_blank');
        } else {
            alert('Link PDF tidak tersedia.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-sm text-slate-500 font-medium">Memuat dokumen...</p>
                </div>
            </div>
        );
    }

    if (!doc) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
                <div className="flex flex-col items-center gap-4">
                    <span className="material-symbols-outlined text-5xl text-slate-300">error</span>
                    <p className="text-slate-500 font-medium">Dokumen tidak ditemukan.</p>
                    <Link to="/katalog" className="text-primary font-bold hover:underline">Kembali ke Katalog</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
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
                        <div className="md:hidden flex items-center">
                            <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">menu</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto w-full px-6 py-6 lg:px-10 flex-1 mt-16">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 mb-4 text-sm text-slate-500 dark:text-slate-400">
                    <Link to="/katalog" className="hover:text-primary dark:hover:text-white transition-colors">Beranda</Link>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                    <Link to="/katalog" className="hover:text-primary dark:hover:text-white transition-colors">Katalog</Link>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                    <span className="text-primary dark:text-slate-100 font-semibold">Detail Dokumen</span>
                </nav>

                {/* Back Button */}
                <div className="mb-8">
                    <Link to="/katalog" className="flex items-center gap-2 text-primary dark:text-slate-300 font-bold hover:translate-x-[-4px] transition-transform w-fit">
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span>Kembali ke Katalog</span>
                    </Link>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Document Cover */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <div className="relative aspect-[3/4] w-full bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
                            {doc.coverUrl ? (
                                <img
                                    src={toDirectImageUrl(doc.coverUrl)}
                                    alt={doc.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.querySelector('.cover-fallback').style.display = 'flex'; }}
                                />
                            ) : null}
                            <div className={`cover-fallback absolute inset-0 flex-col items-center justify-center text-center p-8 ${doc.coverUrl ? 'hidden' : 'flex'}`} style={{ display: doc.coverUrl ? 'none' : 'flex' }}>
                                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">description</span>
                                <p className="text-slate-400 font-bold text-sm">Tidak ada cover</p>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>
                    </div>

                    {/* Right Column: Metadata & Actions */}
                    <div className="lg:col-span-7 flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap gap-2">
                                {(doc.tags || []).map((tag, i) => (
                                    <span key={i} className="px-3 py-1 bg-primary/10 text-primary dark:bg-primary/30 dark:text-slate-100 text-xs font-bold rounded-full uppercase tracking-wider">{tag}</span>
                                ))}
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight">{doc.title}</h1>
                            <div className="flex flex-col gap-2 border-l-4 border-accent pl-4 mt-2">
                                <p className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">corporate_fare</span>
                                    Unit Kerja: <span className="text-slate-900 dark:text-slate-200 font-bold">{doc.unitKerjaName || '-'}</span>
                                </p>
                                <p className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                                    Tahun Publikasi: <span className="text-slate-900 dark:text-slate-200 font-bold">{doc.year}</span>
                                </p>
                                <p className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">visibility</span>
                                    Dilihat: <span className="text-slate-900 dark:text-slate-200 font-bold">{Number(doc.viewCount).toLocaleString('id-ID')}</span> kali
                                </p>
                                <p className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">download</span>
                                    Diunduh: <span className="text-slate-900 dark:text-slate-200 font-bold">{Number(doc.downloadCount).toLocaleString('id-ID')}</span> kali
                                </p>
                            </div>
                        </div>

                        {doc.summary && (
                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-bold text-primary dark:text-slate-100">Ringkasan Eksekutif</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm lg:text-base">
                                    {doc.summary}
                                </p>
                            </div>
                        )}

                        {doc.authors && doc.authors.length > 0 && (
                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-bold text-primary dark:text-slate-100">Tim Penyusun</h3>
                                <div className="flex flex-wrap gap-4">
                                    {doc.authors.map((author) => (
                                        <div key={author.id} className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 pr-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary text-xl">person</span>
                                            </div>
                                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{author.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                            <button
                                onClick={handleDownload}
                                disabled={downloading}
                                className="flex-1 bg-accent hover:brightness-110 text-white flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60"
                            >
                                <span className="material-symbols-outlined">{downloading ? 'hourglass_empty' : 'download'}</span>
                                {downloading ? 'Memproses...' : 'Unduh Dokumen'}
                            </button>
                            <button
                                onClick={handlePreview}
                                className="flex-1 bg-primary hover:brightness-125 text-white flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                <span className="material-symbols-outlined">visibility</span>
                                Preview Dokumen
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Documents Section */}
                {relatedDocs.length > 0 && (
                    <section className="mt-24 mb-12">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-primary dark:text-slate-100">Dokumen Terkait</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedDocs.map((rDoc) => (
                                <Link key={rDoc.id} to={`/katalog/detail/${rDoc.id}`} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-xl transition-all cursor-pointer block">
                                    <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                                        {rDoc.coverUrl ? (
                                            <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url('${rDoc.coverUrl}')` }}></div>
                                        ) : (
                                            <span className="material-symbols-outlined text-4xl text-slate-300">description</span>
                                        )}
                                    </div>
                                    <div className="p-5 flex flex-col gap-2">
                                        <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
                                            {(rDoc.tags || [])[0] || rDoc.unitKerjaName || '-'}
                                        </span>
                                        <h4 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-2">{rDoc.title}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Tahun: {rDoc.year}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <footer className="bg-primary text-slate-400 py-12 px-6 lg:px-20 mt-auto border-t border-primary/20">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-1.5 rounded-lg text-white">
                            <span className="material-symbols-outlined block text-[18px]">policy</span>
                        </div>
                        <h2 className="text-white text-lg font-bold leading-tight">Katalog Kebijakan</h2>
                    </div>
                    <div className="flex gap-8 text-sm">
                        <a className="hover:text-white transition-colors" href="#">Privasi</a>
                        <a className="hover:text-white transition-colors" href="#">Syarat &amp; Ketentuan</a>
                        <a className="hover:text-white transition-colors" href="#">Kontak</a>
                    </div>
                    <p className="text-xs">© 2024 Balitbangda Provinsi Lampung. Seluruh Hak Cipta Dilindungi.</p>
                </div>
            </footer>
        </div>
    );
};

export default DetailKatalog;
