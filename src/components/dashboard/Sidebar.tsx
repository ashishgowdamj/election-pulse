import { LayoutDashboard, UserCheck, Home, Award, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeItem: string;
  onItemClick: (id: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'voter-gender', label: 'Voter Count on Gender', icon: UserCheck },
  { id: 'voter-house', label: 'Voter Count on House', icon: Home },
  { id: 'live-voters', label: 'Live Voter Registry', icon: Users },
];

const Sidebar = ({ activeItem, onItemClick, collapsed, onToggle }: SidebarProps) => {
  return (
    <aside
      className={cn(
        'min-h-screen sidebar-gradient text-sidebar-foreground flex-shrink-0 transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between gap-2">
        <div
          className={cn(
            'text-xl font-bold font-heading text-sidebar-foreground flex items-center justify-center w-full',
            !collapsed && 'justify-start'
          )}
        >
          <Award className="w-6 h-6 text-sidebar-primary" aria-hidden="true" />
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-2 rounded-md bg-sidebar-accent/40 text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
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
