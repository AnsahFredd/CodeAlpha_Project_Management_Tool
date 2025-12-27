import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { Moon, Sun, Bell, Search, User, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes";
import { getInitials } from "../../utils/helpers";
import Button from "../common/Button";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="glass-panel sticky top-0 z-sticky border-b border-border-color h-16 transition-all duration-200">
      <div className="h-full px-4 lg:px-8 flex items-center justify-between gap-4">
        {/* Left Section: Menu & Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMenuClick}
            className="p-2 lg:hidden rounded-md text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => navigate(ROUTES.DASHBOARD)}
          >
            <div className="h-9 w-9 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/25 group-hover:scale-110 transition-transform duration-200">
              <span className="text-white font-bold text-sm">PM</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-text-primary hidden sm:block">
              Project<span className="text-primary">Manager</span>
            </span>
          </div>
        </div>

        {/* Search Bar - Hidden on mobile, visible on tablet+ */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-bg-tertiary/50 border border-border-subtle rounded-md text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <button
            className="p-2 rounded-md text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-error rounded-full ring-2 ring-bg-surface"></span>
          </button>

          <div className="h-6 w-px bg-border-subtle mx-1 hidden sm:block"></div>

          {/* User Profile */}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-text-primary leading-none">
                  {user.name}
                </p>
              </div>

              <div className="relative group">
                <button className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                  {getInitials(user.name)}
                </button>

                {/* Dropdown Menu (Simplified for now) */}
                <div className="absolute right-0 top-full mt-2 w-48 py-1 bg-bg-surface border border-border-subtle rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                  <div className="px-4 py-2 border-b border-border-subtle sm:hidden">
                    <p className="text-sm font-semibold text-text-primary">
                      {user.name}
                    </p>
                    <p className="text-xs text-text-secondary truncate">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(ROUTES.PROFILE)}
                    className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-bg-hover hover:text-text-primary flex items-center gap-2"
                  >
                    <User className="h-4 w-4" /> Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/5 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Login
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(ROUTES.REGISTER)}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
