import { LogOut, CheckCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';

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
  const sections = Array.from(new Set(items.map(item => item.section)));

  return (
    <aside className="w-64 bg-[#0f172a] text-white flex flex-col fixed inset-y-0 shadow-xl z-20 transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <CheckCircle className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">CPMS</h1>
          <p className="text-xs text-gray-400">{portalName}</p>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-6 overflow-y-auto custom-scrollbar">
        {sections.map((section) => (
          <div key={section}>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">{section}</h2>
            <ul className="space-y-1">
              {items.filter(item => item.section === section).map((item) => (
                <li key={item.label}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                      `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                        isActive 
                          ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-sm' 
                          : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}`} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all group"
        >
          <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;

