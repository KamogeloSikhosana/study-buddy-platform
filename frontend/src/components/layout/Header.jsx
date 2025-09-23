import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  faRightToBracket,
  faUserPlus,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function NavItem({ to, children, disabled }) {
  return disabled ? (
    <span className="inline-flex items-center gap-2 px-3 py-2 text-gray-400 cursor-not-allowed">
      {children}
    </span>
  ) : (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `inline-flex items-center gap-2 px-3 py-2 text-dark hover:text-blue-600 relative ${
          isActive ? "text-blue-600 after:w-full" : ""
        } after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all`
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
  const { user, logout } = useAuth();

  const isAuthenticated = !!user;
  const goAuth = (kind) => navigate({ pathname: "/", search: `?auth=${kind}` });

  // Dashboard link logic
  const dashboardHref = user?.role === "student" ? "/studentdashboard" : null;
  const dashboardDisabled = user?.role === "admin";

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dashboard SVG icon
  const DashboardIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
      />
    </svg>
  );

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur shadow"
          : "bg-transparent backdrop-blur-sm"
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
            <NavItem to="/">Home</NavItem>
            <NavItem to="/about">About</NavItem>
            <NavItem to="/FAQ">FAQ</NavItem>
            <NavItem to="/contact">Contact</NavItem>

            {isAuthenticated && dashboardHref && (
              <NavItem to={dashboardHref} disabled={dashboardDisabled}>
                <DashboardIcon />
                <span>Dashboard</span>
              </NavItem>
            )}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <button onClick={() => goAuth("login")} className="hover:text-blue-600">
                  Sign In
                </button>
                <button
                  onClick={() => goAuth("register")}
                  className="rounded-3xl px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                  <span className="inline-flex items-center gap-2 cursor-pointer">
                    <FontAwesomeIcon icon={faUserPlus} className="h-4 w-4" />
                    Join Now
                  </span>
                </button>
              </>
            ) : (
              <button
                onClick={logout}
                className="rounded-3xl border border-dark/30 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg ring-1 ring-muted/40 text-dark"
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
        <div className="md:hidden bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-3 space-y-2">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/about">About</NavItem>
            <NavItem to="/societies">Testimonials</NavItem>
            <NavItem to="/contact">FAQ</NavItem>

            {isAuthenticated && dashboardHref && (
              <NavItem to={dashboardHref} disabled={dashboardDisabled}>
                <DashboardIcon />
                <span>Dashboard</span>
              </NavItem>
            )}

            <div className="pt-3 flex gap-2">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => goAuth("login")}
                    className="text-dark hover:text-blue-600 flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faRightToBracket} />
                    Sign In
                  </button>
                  <button
                    onClick={() => goAuth("register")}
                    className="rounded-lg px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faUserPlus} />
                    Join Now
                  </button>
                </>
              ) : (
                <button
                  onClick={logout}
                  className="rounded-lg border border-dark/30 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faArrowRightFromBracket} />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
