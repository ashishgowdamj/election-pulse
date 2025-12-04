import { 
  LayoutDashboard, 
  Search, 
  Users, 
  Copy, 
  UserCheck, 
  Home, 
  MapPin, 
  MessageSquare, 
  Mail, 
  Calendar, 
  Award 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeItem: string;
  onItemClick: (id: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'search-voter', label: 'Search Voter', icon: Search },
  { id: 'search-blo', label: 'Search BLO', icon: Users },
  { id: 'duplicate-voters', label: 'Duplicate Voters', icon: Copy },
  { id: 'voter-gender', label: 'Voter Count on Gender', icon: UserCheck },
  { id: 'voter-house', label: 'Voter Count on House', icon: Home },
  { id: 'polling-station', label: 'Polling Station List', icon: MapPin },
  { id: 'send-sms', label: 'Send SMS', icon: MessageSquare },
  { id: 'send-mail', label: 'Send Mail', icon: Mail },
  { id: 'event-list', label: 'Event List', icon: Calendar },
  { id: 'election-result', label: 'Election Result 2012', icon: Award },
];

const Sidebar = ({ activeItem, onItemClick }: SidebarProps) => {
  return (
    <aside className="w-64 min-h-screen sidebar-gradient text-sidebar-foreground flex-shrink-0">
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-xl font-bold font-heading text-sidebar-foreground flex items-center gap-2">
          <Award className="w-6 h-6 text-sidebar-primary" />
          Election Portal
        </h1>
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
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
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
