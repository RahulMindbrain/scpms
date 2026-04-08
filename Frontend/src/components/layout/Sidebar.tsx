import { LogOut, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  path: string;
  section: string;
}

interface SidebarProps {
  items: SidebarItem[];
  portalName?: string;
  onSignOut?: () => void;
}

const Sidebar = ({ items, portalName = 'Student Portal', onSignOut }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sections = Array.from(new Set(items.map(item => item.section)));

  return (
    <aside 
      className={`bg-[#0f172a] text-white flex flex-col fixed inset-y-0 shadow-xl z-20 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header Section */}
      <div className="p-6 flex items-center h-20 overflow-hidden">
        <div className="flex items-center gap-3 min-w-max">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <CheckCircle className="text-white w-6 h-6" />
          </div>
          <div className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            <h1 className="font-bold text-lg leading-tight whitespace-nowrap">CPMS</h1>
            <p className="text-xs text-gray-400 whitespace-nowrap">{portalName}</p>
          </div>
        </div>
      </div>

      {/* CENTERED TOGGLE BUTTON */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 bg-cyan-500 text-white p-1 rounded-full shadow-lg hover:bg-cyan-400 transition-colors z-30"
        aria-label="Toggle Sidebar"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-4 space-y-6 overflow-y-auto custom-scrollbar overflow-x-hidden">
        {sections.map((section) => (
          <div key={section}>
            <h2 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2 truncate transition-opacity duration-200 ${
              isCollapsed ? 'opacity-0' : 'opacity-100'
            }`}>
              {section}
            </h2>
            <ul className="space-y-1">
              {items.filter(item => item.section === section).map((item) => (
                <li key={item.label}>
                  <NavLink
                    to={item.path}
                    title={isCollapsed ? item.label : ''}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                        isActive 
                          ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-sm' 
                          : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}`} />
                        <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                          isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
                        }`}>
                          {item.label}
                        </span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer / Sign Out */}
      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all group overflow-hidden"
        >
          <LogOut className="w-5 h-5 shrink-0 text-gray-400 group-hover:text-red-400" />
          <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
            isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
          }`}>
            Sign Out
          </span>
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </aside>
  );
};

export default Sidebar;