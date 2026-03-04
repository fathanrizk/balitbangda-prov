import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import StatCard from './components/StatCard';
import Toolbar from './components/Toolbar';
import DocumentTable from './components/DocumentTable';
import AuthGuard from './components/AuthGuard';

import TambahDokumen from './pages/TambahDokumen';
import UnitKerja from './pages/UnitKerja';
import Login from './pages/Login';
import PublicCatalog from './pages/PublicCatalog';
import DetailKatalog from './pages/DetailKatalog';

import { api } from './lib/api';

function AdminDashboardHome() {
  const [stats, setStats] = useState({ totalDocuments: 0, totalDownloads: 0, totalViews: 0 });
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    api.get('/stats').then(setStats).catch(console.error);
  }, [refreshKey]);

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const formatNumber = (n) => Number(n).toLocaleString('id-ID');

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          iconName="folder_open"
          title="Total Dokumen"
          value={formatNumber(stats.totalDocuments)}
          iconBgClass="bg-primary/5"
          iconTextClass="text-primary"
        />
        <StatCard
          iconName="download"
          title="Total Unduhan"
          value={formatNumber(stats.totalDownloads)}
          iconBgClass="bg-accent/10"
          iconTextClass="text-accent"
        />
        <StatCard
          iconName="visibility"
          title="Total Dilihat"
          value={formatNumber(stats.totalViews)}
          iconBgClass="bg-green-500/10"
          iconTextClass="text-green-600"
        />
      </div>

      <Toolbar search={search} onSearchChange={setSearch} />
      <DocumentTable search={search} onRefresh={handleRefresh} />
    </>
  );
}

function App() {
  const location = useLocation();
  const [showUnitKerjaModal, setShowUnitKerjaModal] = useState(false);
  const [unitKerjaSearch, setUnitKerjaSearch] = useState('');

  const tambahDokumenHeader = (
    <>
      <span className="text-slate-400">Policy Papers</span>
      <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
      <span className="font-medium text-slate-700 dark:text-slate-200">Tambah Dokumen Baru</span>
    </>
  );

  const unitKerjaHeader = (
    <h2 className="text-xl font-bold text-primary dark:text-white">Manajemen Unit Kerja</h2>
  );

  const unitKerjaRightContent = (
    <div className="flex items-center gap-4">
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">search</span>
        <input
          className="pl-10 pr-4 py-2 bg-background-light dark:bg-slate-800 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary outline-none"
          placeholder="Cari unit kerja..."
          type="text"
          value={unitKerjaSearch}
          onChange={(e) => setUnitKerjaSearch(e.target.value)}
        />
      </div>
      <button
        className="bg-accent hover:bg-opacity-90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-all"
        onClick={() => setShowUnitKerjaModal(true)}
      >
        <span className="material-symbols-outlined text-sm">add</span>
        Tambah Unit Kerja
      </button>
    </div>
  );

  const isDetailView = location.pathname.includes('/admin/katalog/tambah') || location.pathname.includes('/admin/katalog/edit');
  const isUnitKerjaView = location.pathname.includes('/admin/unit-kerja');

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/katalog" replace />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/katalog" element={<PublicCatalog />} />
      <Route path="/katalog/detail/:id" element={<DetailKatalog />} />

      <Route path="/admin" element={
        <AuthGuard>
          <DashboardLayout
            headerContent={
              isDetailView ? tambahDokumenHeader :
                isUnitKerjaView ? unitKerjaHeader : null
            }
            rightContent={isUnitKerjaView ? unitKerjaRightContent : null}
          />
        </AuthGuard>
      }>
        <Route index element={<AdminDashboardHome />} />
        <Route path="katalog/tambah" element={<TambahDokumen />} />
        <Route path="katalog/edit/:id" element={<TambahDokumen />} />
        <Route path="unit-kerja" element={
          <UnitKerja
            showAddModal={showUnitKerjaModal}
            onCloseAddModal={() => setShowUnitKerjaModal(false)}
            searchQuery={unitKerjaSearch}
          />
        } />
      </Route>
    </Routes>
  );
}

export default App;
