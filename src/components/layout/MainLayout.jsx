import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../../context/AuthContext';
import Loading from '../common/Loading';

const MainLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loading fullPage />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      <Sidebar user={user} />
      
      <div className="flex-grow ml-72 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="mt-20 p-8 flex-grow">
          <div className="max-w-[1600px] mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
        
        <footer className="px-8 py-6 flex flex-col md:flex-row justify-between items-center border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} Enterprise Service Desk Agent • Global IT Operations
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-600 transition-colors">System Status</a>
            <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-600 transition-colors">Privacy Policy</a>
            <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-600 transition-colors">Support</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
