import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../lib/auth';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await authClient.signIn.email({
                email,
                password,
            });

            if (res.error) {
                setError(res.error.message || 'Email atau kata sandi salah.');
                setLoading(false);
                return;
            }

            navigate('/admin', { replace: true });
        } catch (err) {
            setError('Terjadi kesalahan. Pastikan server backend berjalan.');
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary-light to-primary p-4">
            {/* Abstract Geometric Elements */}
            <div className="absolute inset-0 bg-pattern opacity-40"></div>
            <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-primary-light/30 blur-3xl"></div>

            <div className="layout-container flex w-full max-w-md flex-col z-10">
                {/* Login Card */}
                <div className="bg-white glass-card rounded-2xl shadow-2xl p-8 md:p-10 flex flex-col items-center">

                    {/* Logo & Header */}
                    <div className="flex flex-col items-center gap-4 mb-8">
                        <div className="bg-primary p-3 rounded-xl shadow-lg">
                            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
                            </svg>
                        </div>
                        <div className="text-center">
                            <h1 className="font-plus text-primary text-2xl font-extrabold tracking-tight leading-none mb-1">Balitbangda Lampung</h1>
                            <h2 className="font-plus text-slate-500 text-sm font-semibold uppercase tracking-[0.2em]">Admin Panel</h2>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center font-medium flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    {/* Form Section */}
                    <form className="w-full space-y-5" onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-primary/80 text-sm font-semibold px-1">Email Administrator</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-xl">mail</span>
                                </div>
                                <input
                                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-slate-700"
                                    placeholder="admin@lampungprov.go.id"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-primary/80 text-sm font-semibold">Kata Sandi</label>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-xl">lock</span>
                                </div>
                                <input
                                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-slate-700"
                                    placeholder="••••••••"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            className="w-full py-4 bg-accent hover:bg-[#C49F27] text-primary font-plus font-bold text-base rounded-xl shadow-lg shadow-accent/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                    <span>Memproses...</span>
                                </>
                            ) : (
                                <>
                                    <span>MASUK</span>
                                    <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">login</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Text */}
                    <div className="mt-10 text-center">
                        <p className="text-slate-500 text-xs font-medium">
                            © 2024 Balitbangda Provinsi Lampung.<br />
                            Hanya untuk personil berwenang.
                        </p>
                    </div>
                </div>

                {/* Optional Help Link */}
                <div className="mt-8 flex justify-center">
                    <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-sm font-semibold transition-all backdrop-blur-sm border border-white/10 shadow-sm">
                        <span className="material-symbols-outlined text-lg">help</span>
                        <span>Butuh bantuan?</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
