import Link from 'next/link';
import { Profile } from '@/types';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  user: Profile | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'staff':
        return 'bg-blue-100 text-blue-800';
      case 'principal':
        return 'bg-purple-100 text-purple-800';
      case 'president':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
          <span className="font-bold text-lg text-gray-900 hidden sm:inline">
            File Approval
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium text-gray-900">{user.name}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          {user && (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && user && (
        <div className="md:hidden bg-gray-50 px-4 py-4 border-t">
          <div className="text-center pb-4 border-b">
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
