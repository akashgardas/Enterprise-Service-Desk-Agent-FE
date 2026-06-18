import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HiOutlineTicket, 
  HiOutlineUserGroup, 
  HiOutlineChartBar, 
  HiOutlineCog6Tooth,
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineXMark
} from 'react-icons/hi2';
import { ROLES, APP_NAME } from '../../config/constants';

const Sidebar = ({ user, onClose }) => {
  const menuItems = [
    { label: 'Dashboard', icon: HiOutlineHome, path: '/', roles: Object.values(ROLES) },
    { label: 'AI Assistant', icon: HiOutlineSparkles, path: '/ai', roles: Object.values(ROLES) },
    { label: 'Tickets', icon: HiOutlineTicket, path: '/tickets', roles: Object.values(ROLES) },
    { label: 'Knowledge Base', icon: HiOutlineBookOpen, path: '/kb', roles: Object.values(ROLES) },
    { label: 'Team Overview', icon: HiOutlineUserGroup, path: '/team', roles: [ROLES.MANAGER, ROLES.ADMIN] },
    { label: 'Analytics', icon: HiOutlineChartBar, path: '/analytics', roles: [ROLES.MANAGER, ROLES.ADMIN] },
    { label: 'Administration', icon: HiOutlineShieldCheck, path: '/settings', roles: [ROLES.ADMIN] },
    { label: 'Audit Logs', icon: HiOutlineClock, path: '/audit-log', roles: [ROLES.ADMIN] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <aside className="w-72 bg-white dark:bg-slate-950 text-slate-900 dark:text-white h-screen flex flex-col z-40 border-r border-neutral-200 dark:border-slate-800 shadow-md">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white italic shadow-sm rotate-3">SD</div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter uppercase leading-none">{APP_NAME}</h1>
            <span className="text-[10px] font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-widest mt-1">Enterprise Portal</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-neutral-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <HiOutlineXMark className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-grow px-4 mt-8 space-y-10">
        <div>
          <p className="px-4 text-[10px] font-black text-neutral-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-4">Main Navigation</p>
          <ul className="space-y-1.5">
            {filteredItems.slice(0, 4).map((item) => (
              <SidebarItem key={item.path} item={item} onClose={onClose} />
            ))}
          </ul>
        </div>

        {filteredItems.length > 4 && (
          <div>
            <p className="px-4 text-[10px] font-black text-neutral-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-4">Management</p>
            <ul className="space-y-1.5">
              {filteredItems.slice(4).map((item) => (
              <SidebarItem key={item.path} item={item} onClose={onClose} />
            ))}
            </ul>
          </div>
        )}
      </nav>

      <div className="p-6">
        <div className="p-4 bg-neutral-50 dark:bg-slate-900/50 rounded-2xl border border-neutral-200 dark:border-slate-800 flex items-center gap-4 group cursor-pointer hover:bg-neutral-100 dark:hover:bg-slate-900 transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-600/10 flex items-center justify-center text-blue-600 dark:text-blue-500 font-black text-lg border border-blue-100 dark:border-blue-600/20 group-hover:scale-110 transition-transform">
            {user?.name?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{user?.name}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <p className="text-[10px] text-neutral-500 dark:text-slate-400 font-bold uppercase tracking-widest">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const SidebarItem = ({ item, onClose }) => {
  const Icon = item.icon;
  return (
    <li>
      <NavLink
        to={item.path}
        onClick={onClose}
        className={({ isActive }) => `
          flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative
          ${isActive 
            ? 'bg-blue-600 text-white shadow-sm' 
            : 'text-neutral-600 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'}
        `}
      >
        {({ isActive }) => (
          <>
            <Icon className="w-5 h-5 shrink-0" />
            <span className="font-bold text-sm tracking-tight">{item.label}</span>
            {isActive && (
              <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-sm"></div>
            )}
          </>
        )}
      </NavLink>
    </li>
  );
};

export default Sidebar;
