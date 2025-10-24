import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components';
import { useIsMobile } from './useMediaQuery';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: 'Tasks',
      href: '/tasks',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
    },
  ];

  const isActiveRoute = (href: string) => {
    return (
      location.pathname === href ||
      (href === '/dashboard' && location.pathname === '/')
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header
        className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30"
        role="banner"
      >
        <div className="px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900 hidden sm:block">
                TaskMaster
              </span>
            </Link>

            {/* Navigation */}
            <nav
              className="hidden lg:flex items-center space-x-8"
              role="navigation"
            >
              {navigationItems.map((item) => {
                const isActive = isActiveRoute(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-sm font-medium transition-colors duration-150 ${
                      isActive
                        ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" role="main" className="lg:px-12 xl:px-16 2xl:px-24">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="grid grid-cols-2 gap-1">
            {navigationItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center justify-center py-2 px-3 text-xs font-medium transition-colors duration-150 ${
                    isActive
                      ? 'text-primary-600'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span
                    className={`mb-1 h-6 w-6 ${
                      isActive ? 'text-primary-500' : 'text-gray-400'
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* Add padding for mobile bottom navigation */}
      {isMobile && <div className="h-16" />}
    </div>
  );
};