import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faUserPlus,
  faArrowRightFromBracket,
  faPager,
} from "@fortawesome/free-solid-svg-icons";

function NavItem({ to, children, disabled }) {
  return disabled ? (
    <span className="inline-flex items-center gap-2 px-3 py-2 text-gray-400 cursor-not-allowed">
      {children}
    </span>
  ) : (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `inline-flex items-center gap-2 px-3 py-2 text-dark hover:text-blue-600 relative transition-colors ${
          isActive ? "text-blue-600 after:w-full" : ""
        } after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, dashboardPath, logout } = useAuth();

  const goAuth = (kind) => navigate({ pathname: "/", search: `?auth=${kind}` });

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur shadow-lg"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto max-w-8xl px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/src/assets/logo.png"
              alt="Study Buddy"
              className="h-14 w-14 rounded-full ring-1 ring-muted/40"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            <NavItem to="/">
              <span>Home</span>
            </NavItem>
            <NavItem to="/about">
              <span>About</span>
            </NavItem>
            <NavItem to="/faq">
              <span>FAQ</span>
            </NavItem>
             <NavItem to="/contact">
              <span>Contact</span>
            </NavItem>

            {isAuthenticated && dashboardPath && (
              <NavItem to={dashboardPath}>
                <FontAwesomeIcon icon={faPager} className="h-4 w-4" />
                <span>Dashboard</span>
              </NavItem>
            )}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <button 
                  onClick={() => goAuth("login")} 
                  className="hover:text-blue-600 transition-colors font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => goAuth("register")}
                  className="rounded-3xl px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md"
                >
                  <span className="inline-flex items-center gap-2">
                    <FontAwesomeIcon icon={faUserPlus} className="h-4 w-4" />
                    Join Now
                  </span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Welcome, {user?.name || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-3xl px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 transition-colors border border-blue-700"
                >
                  <span className="inline-flex items-center gap-2">
                    <FontAwesomeIcon icon={faArrowRightFromBracket} className="h-4 w-4" />
                    Logout
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg ring-1 ring-muted/40 text-dark hover:bg-gray-50 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white shadow-lg border-t">
          <div className="mx-auto max-w-7xl px-4 py-4 space-y-3">
            <NavLink 
              to="/" 
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-blue-50 text-blue-600 border border-blue-200" 
                    : "text-dark hover:bg-gray-50"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <span>Home</span>
            </NavLink>
            
            <NavLink 
              to="/about" 
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-blue-50 text-blue-600 border border-blue-200" 
                    : "text-dark hover:bg-gray-50"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <span>About</span>
            </NavLink>
            
            <NavLink 
              to="/faq" 
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-blue-50 text-blue-600 border border-blue-200" 
                    : "text-dark hover:bg-gray-50"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <span>FAQ</span>
            </NavLink>

            {isAuthenticated && dashboardPath && (
              <NavLink 
                to={dashboardPath}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-blue-50 text-blue-600 border border-blue-200" 
                      : "text-dark hover:bg-gray-50"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                <FontAwesomeIcon icon={faPager} className="h-4 w-4" />
                <span>Dashboard</span>
              </NavLink>
            )}

            <div className="pt-4 flex flex-col gap-3 border-t">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      goAuth("login");
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-3 text-dark hover:text-blue-600 transition-colors text-left"
                  >
                    <FontAwesomeIcon icon={faRightToBracket} className="h-4 w-4" />
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      goAuth("register");
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <FontAwesomeIcon icon={faUserPlus} className="h-4 w-4" />
                    Join Now
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="px-3 py-2 text-sm text-gray-600 border-b">
                    Welcome, {user?.name || user?.email}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-dark hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left"
                  >
                    <FontAwesomeIcon icon={faArrowRightFromBracket} className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}