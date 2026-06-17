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
  HiOutlineClock
} from 'react-icons/hi2';
import { ROLES, APP_NAME } from '../../config/constants';

const Sidebar = ({ user }) => {
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
    <aside className="w-72 bg-slate-950 text-white h-screen fixed left-0 top-0 flex flex-col z-40 border-r border-slate-800 shadow-2xl">
      <div className="p-8 flex items-center gap-4">
        <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center font-black text-white italic shadow-lg shadow-primary-600/20 rotate-3">SD</div>
        <div className="flex flex-col">
          <h1 className="text-xl font-black tracking-tighter uppercase leading-none">{APP_NAME}</h1>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Enterprise Portal</span>
        </div>
      </div>

      <nav className="flex-grow px-4 mt-8 space-y-10">
        <div>
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Main Navigation</p>
          <ul className="space-y-1.5">
            {filteredItems.slice(0, 4).map((item) => (
              <SidebarItem key={item.path} item={item} />
            ))}
          </ul>
        </div>

        {filteredItems.length > 4 && (
          <div>
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Management</p>
            <ul className="space-y-1.5">
              {filteredItems.slice(4).map((item) => (
                <SidebarItem key={item.path} item={item} />
              ))}
            </ul>
          </div>
        )}
      </nav>

      <div className="p-6">
        <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center gap-4 group cursor-pointer hover:bg-slate-900 transition-all">
          <div className="w-12 h-12 rounded-xl bg-primary-600/10 flex items-center justify-center text-primary-500 font-black text-lg border border-primary-600/20 group-hover:scale-110 transition-transform">
            {user?.name?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate group-hover:text-primary-400 transition-colors">{user?.name}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const SidebarItem = ({ item }) => {
  const Icon = item.icon;
  return (
    <li>
      <NavLink
        to={item.path}
        className={({ isActive }) => `
          flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative
          ${isActive 
            ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/20' 
            : 'text-slate-300 hover:bg-slate-900 hover:text-white'}
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
