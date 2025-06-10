import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <header className="border-b border-blue-200/30 bg-blue-100/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12">
          <div className="flex items-center">
            <Link to="/" className="text-base font-medium text-blue-800/90 hover:text-blue-600 transition-colors">
              AskMeEveryDay
            </Link>
          </div>
          
          {!isHomePage && (
            <div className="flex items-center">
              <Link
                to="/"
                className="text-blue-800/90 hover:text-blue-600 transition-colors"
                title="Strona główna"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 