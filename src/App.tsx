import React, { useState, useEffect, useCallback } from 'react';
import { ChemicalBottle, Location, ChemicalThreshold, UserProfile } from './types';
import { StorageService } from './services/storageService';
import { AuthPortal } from './components/AuthPortal';
import { Navbar } from './components/Navbar';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { InventoryList } from './components/InventoryList';
import { StockInForm } from './components/StockInForm';
import { DisposalManagement } from './components/DisposalManagement';
import { UserManagement } from './components/UserManagement';
import { ReportsAndSettings } from './components/ReportsAndSettings';
import { QRModal } from './components/QRModal';
import { QRScannerModal } from './components/QRScannerModal';
import { BottleDetailModal } from './components/BottleDetailModal';
import { MoveLocationModal } from './components/MoveLocationModal';
import { DisposalModal } from './components/DisposalModal';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return StorageService.getCurrentSessionUser();
  });
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [bottles, setBottles] = useState<ChemicalBottle[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [thresholds, setThresholds] = useState<ChemicalThreshold[]>([]);

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrModalBottles, setQrModalBottles] = useState<ChemicalBottle[]>([]);
  const [qrModalTitle, setQrModalTitle] = useState('Cetak Label QR Code Fizikal');

  const [selectedBottleForDetail, setSelectedBottleForDetail] = useState<ChemicalBottle | null>(null);
  const [selectedBottleForMove, setSelectedBottleForMove] = useState<ChemicalBottle | null>(null);
  const [selectedBottleForDisposal, setSelectedBottleForDisposal] = useState<ChemicalBottle | null>(null);
  const [disposalInitialStep, setDisposalInitialStep] = useState<1 | 2>(1);

  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const loadData = useCallback(() => {
    const loadedBottles = StorageService.getBottles();
    const loadedLocations = StorageService.getLocations();
    const loadedThresholds = StorageService.getThresholds();
    const loadedUsers = StorageService.getUsers();

    setBottles([...loadedBottles]);
    setLocations([...loadedLocations]);
    setThresholds([...loadedThresholds]);
    setUsers([...loadedUsers]);

    // Kemas kini profil pengguna aktif jika wujud dalam senarai terkini
    setCurrentUser(prevUser => {
      if (!prevUser) return null;
      const match = loadedUsers.find(u => u.id === prevUser.id);
      return match || prevUser;
    });

    if (selectedBottleForDetail) {
      const refreshed = loadedBottles.find(b => b.id === selectedBottleForDetail.id);
      if (refreshed) setSelectedBottleForDetail(refreshed);
    }
  }, [selectedBottleForDetail]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    loadData();
    showToast(
      `Selamat kembali, ${user.name} (${user.role === 'ADMIN' ? 'Pegawai / Admin' : 'Staf Makmal'}). Peranan aktif dihubungkan.`,
      'success'
    );
  };

  const handleSignOut = () => {
    StorageService.clearSession();
    setCurrentUser(null);
    showToast('Sesi anda telah ditamatkan. Sila log masuk semula untuk mengakses konsol makmal.', 'info');
  };

  const metrics = StorageService.getDashboardMetrics();

  const handleOpenBottleDetail = (bottle: ChemicalBottle) => {
    setSelectedBottleForDetail(bottle);
  };

  const handleOpenMoveModal = (bottle: ChemicalBottle) => {
    setSelectedBottleForMove(bottle);
  };

  const handleOpenDisposalModal = (bottle: ChemicalBottle, step: 1 | 2 = 1) => {
    setSelectedBottleForDisposal(bottle);
    setDisposalInitialStep(step);
  };

  const handleOpenSingleQRPrint = (bottle: ChemicalBottle) => {
    setQrModalBottles([bottle]);
    setQrModalTitle(`Cetak Label QR Fizikal (${bottle.id})`);
    setIsQRModalOpen(true);
  };

  const handleOpenBulkQRPrint = (selectedBottles: ChemicalBottle[]) => {
    setQrModalBottles(selectedBottles);
    setQrModalTitle(`Cetak ${selectedBottles.length} Label QR Code Pukal`);
    setIsQRModalOpen(true);
  };

  const handleSuccessStockIn = (newBottles: ChemicalBottle[]) => {
    loadData();
    showToast(`Didaftarkan ${newBottles.length} unit botol fizikal baharu ke dalam stor.`);
    setQrModalBottles(newBottles);
    setQrModalTitle(`Label QR Code Baharu (${newBottles.length} Botol Sedia Dicetak)`);
    setIsQRModalOpen(true);
    setActiveTab('inventory');
  };

  const handleSuccessMove = (updatedBottle: ChemicalBottle) => {
    loadData();
    showToast(`Botol ${updatedBottle.id} berjaya dipindahkan dan dicatat dalam audit trail.`);
    setSelectedBottleForMove(null);
  };

  const handleSuccessDisposal = (updatedBottle: ChemicalBottle) => {
    loadData();
    if (updatedBottle.status === 'PENDING_DISPOSAL') {
      showToast(`Botol ${updatedBottle.id} ditandakan Menunggu Pelupusan.`);
    } else {
      showToast(`Pelupusan botol ${updatedBottle.id} disahkan (Ref: ${updatedBottle.disposalRefNo}).`);
    }
    setSelectedBottleForDisposal(null);
  };

  // Jika tiada sesi log masuk aktif, paparkan Paparan Pemula (Sign In / Sign Up Portal)
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-3.5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded shadow-lg border border-slate-700 animate-in fade-in duration-150">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        )}
        <AuthPortal onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 pb-16 lg:pb-0">
      {/* Bar Atas Konsol Makmal */}
      <Navbar
        currentUser={currentUser}
        users={users}
        onChangeUser={user => {
          setCurrentUser(user);
          StorageService.setCurrentSessionUser(user);
          showToast(`Sesi aktif: ${user.name} (${user.role === 'ADMIN' ? 'Admin / Pegawai' : 'Staf Makmal'})`, 'info');
        }}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenUserRegister={() => setActiveTab('users')}
        onSignOut={handleSignOut}
        expiredCount={metrics.expiredCount}
      />

      {/* Badan Aplikasi dengan Sidebar Konsol */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Navigation
          activeTab={activeTab}
          onTabChange={tab => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenScanner={() => setIsScannerOpen(true)}
          expiredCount={metrics.expiredCount}
          pendingDisposalCount={metrics.pendingDisposalCount}
          currentUser={currentUser}
        />

        {/* Viewport Utama */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-x-hidden min-w-0">
          {activeTab === 'dashboard' && (
            <Dashboard
              bottles={bottles}
              locations={locations}
              currentUser={currentUser}
              onNavigateTab={tab => setActiveTab(tab)}
              onSelectBottle={handleOpenBottleDetail}
              onOpenMoveModal={handleOpenMoveModal}
              onOpenDisposalModal={handleOpenDisposalModal}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryList
              bottles={bottles}
              locations={locations}
              currentUser={currentUser}
              onSelectBottle={handleOpenBottleDetail}
              onOpenMoveModal={handleOpenMoveModal}
              onOpenDisposalModal={handleOpenDisposalModal}
              onOpenQRPrintModal={handleOpenSingleQRPrint}
              onOpenBulkQRPrint={handleOpenBulkQRPrint}
              onOpenScanner={() => setIsScannerOpen(true)}
            />
          )}

          {activeTab === 'stock-in' && (
            <StockInForm
              locations={locations}
              currentUser={currentUser}
              onSuccessStockIn={handleSuccessStockIn}
            />
          )}

          {activeTab === 'disposal' && (
            <DisposalManagement
              bottles={bottles}
              locations={locations}
              currentUser={currentUser}
              onSelectBottle={handleOpenBottleDetail}
              onOpenConfirmDisposal={b => handleOpenDisposalModal(b, 2)}
            />
          )}

          {activeTab === 'users' && (
            <UserManagement
              users={users}
              currentUser={currentUser}
              onRefreshUsers={loadData}
              onSwitchUser={user => {
                setCurrentUser(user);
                StorageService.setCurrentSessionUser(user);
                showToast(`Sesi ditukar kepada ${user.name} (${user.role === 'ADMIN' ? 'Admin / Pegawai' : 'Staf Makmal'})`, 'info');
              }}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsAndSettings
              bottles={bottles}
              locations={locations}
              thresholds={thresholds}
              currentUser={currentUser}
              onRefreshData={loadData}
            />
          )}
        </main>
      </div>

      {/* Toast Ringkas */}
      {toastMessage && (
        <div className="fixed bottom-18 lg:bottom-5 right-5 z-50 flex items-center gap-2 px-3.5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded shadow-lg border border-slate-700 animate-in fade-in duration-150">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Modals */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        bottles={bottles}
        onBottleFound={bottle => {
          setSelectedBottleForDetail(bottle);
          showToast(`Botol ${bottle.id} berjaya dikenal pasti.`);
        }}
      />

      <QRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        bottles={qrModalBottles}
        locations={locations}
        title={qrModalTitle}
      />

      <BottleDetailModal
        isOpen={!!selectedBottleForDetail}
        bottle={selectedBottleForDetail}
        locations={locations}
        currentUser={currentUser}
        onClose={() => setSelectedBottleForDetail(null)}
        onOpenMoveModal={bottle => {
          setSelectedBottleForDetail(null);
          setSelectedBottleForMove(bottle);
        }}
        onOpenDisposalModal={(bottle, step) => {
          setSelectedBottleForDetail(null);
          setSelectedBottleForDisposal(bottle);
          setDisposalInitialStep(step);
        }}
        onOpenQRPrintModal={bottle => {
          handleOpenSingleQRPrint(bottle);
        }}
      />

      <MoveLocationModal
        isOpen={!!selectedBottleForMove}
        bottle={selectedBottleForMove}
        locations={locations}
        currentUser={currentUser}
        onClose={() => setSelectedBottleForMove(null)}
        onSuccess={handleSuccessMove}
      />

      <DisposalModal
        isOpen={!!selectedBottleForDisposal}
        bottle={selectedBottleForDisposal}
        currentUser={currentUser}
        initialStep={disposalInitialStep}
        onClose={() => setSelectedBottleForDisposal(null)}
        onSuccess={handleSuccessDisposal}
      />
    </div>
  );
}
