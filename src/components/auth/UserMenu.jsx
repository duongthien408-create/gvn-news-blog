import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, Bookmark, FileText, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const UserMenu = ({ onOpenAuth, onOpenAdmin }) => {
  const { user, profile, isAuthenticated, isAdmin, isModerator, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  // Not logged in - show login button
  if (!isAuthenticated) {
    return (
      <button
        onClick={onOpenAuth}
        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:from-red-600 hover:to-orange-600"
      >
        <User className="h-4 w-4" />
        Đăng nhập
      </button>
    );
  }

  // Logged in - show user menu
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 transition hover:border-zinc-600 hover:bg-zinc-700"
      >
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name}
            className="h-6 w-6 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500">
            <span className="text-xs font-bold text-white">
              {profile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
            </span>
          </div>
        )}
        <span className="hidden text-sm font-medium text-white sm:block">
          {profile?.display_name || profile?.username || 'User'}
        </span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-xl">
          {/* User info */}
          <div className="border-b border-zinc-800 px-4 py-3">
            <p className="font-medium text-white">
              {profile?.display_name || profile?.username}
            </p>
            <p className="text-sm text-zinc-400">{user?.email}</p>
            {profile?.is_verified && (
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">
                <Shield className="h-3 w-3" />
                Verified
              </span>
            )}
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              <FileText className="h-4 w-4" />
              Bài viết của tôi
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              <Bookmark className="h-4 w-4" />
              Đã lưu
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              <Settings className="h-4 w-4" />
              Cài đặt
            </button>

            {(isAdmin || isModerator) && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAdmin?.();
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition hover:bg-zinc-800 hover:text-red-300"
              >
                <Shield className="h-4 w-4" />
                Admin Panel
              </button>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-zinc-800 py-1">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
