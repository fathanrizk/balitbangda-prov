import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authClient } from '../lib/auth';

const AuthGuard = ({ children }) => {
    const [status, setStatus] = useState('loading'); // 'loading' | 'authenticated' | 'unauthenticated'

    useEffect(() => {
        authClient.getSession().then((res) => {
            if (res.data?.session) {
                setStatus('authenticated');
            } else {
                setStatus('unauthenticated');
            }
        }).catch(() => {
            setStatus('unauthenticated');
        });
    }, []);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-sm text-slate-500 font-medium">Memverifikasi sesi...</p>
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default AuthGuard;
