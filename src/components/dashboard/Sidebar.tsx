import { LayoutDashboard, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeItem: string;
  onItemClick: (id: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'live-voters', label: 'Live Voter Registry', icon: Users },
];

const Sidebar = ({ activeItem, onItemClick, collapsed, onToggle }: SidebarProps) => {
  return (
    <aside
      className={cn(
        'min-h-screen sidebar-gradient text-sidebar-foreground flex-shrink-0 transition-all duration-300 group',
        collapsed ? 'w-20' : 'w-64'
      )}
      onMouseEnter={() => {
        if (collapsed) {
          onToggle();
        }
      }}
      onMouseLeave={() => {
        if (!collapsed) {
          onToggle();
        }
      }}
    >
      <div className={cn('p-4 flex items-center', collapsed ? 'justify-center' : 'justify-start')}>
        {collapsed ? (
          <div className="text-xl font-bold font-heading text-sidebar-foreground flex items-center justify-center w-12 h-12 rounded-lg bg-sidebar-accent/30 border border-sidebar-border">
            CC
          </div>
        ) : (
          <span className="text-xl font-bold font-heading text-sidebar-foreground">Citizen Connect</span>
        )}
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onItemClick(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 py-2.5 rounded-md text-sm transition-all duration-200',
                    collapsed ? 'justify-center px-2' : 'px-3',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
