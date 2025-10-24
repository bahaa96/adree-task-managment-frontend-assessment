import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
    },
    {
      name: 'Tasks',
      href: '/tasks',
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

            {/* Navigation and actions */}
            <div className="flex items-center space-x-8">
              {/* Navigation */}
              <nav
                className="flex items-center space-x-8"
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

              {/* Create Task Button */}
              <Button variant="primary" size="sm" className="hidden sm:flex">
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Task
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" role="main">
        {children}
      </main>
    </div>
  );
};