/**
 * Fixed top navigation bar with brand name, desktop links, and mobile sidebar.
 */
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ArrowRight, Sparkles, Home, Users } from "lucide-react";
import mastishkLogo from "../../assets/images/mastishk_logo.png";
import { trackEvent } from "../../lib/analytics";

const ANCHOR_LINKS = [
  { label: "What's Coming", href: "#whats-coming", id: "whats-coming" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const isAbout = location.pathname === "/about";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  const scrollToId = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goHomeAnchor = (id) => {
    setSidebarOpen(false);
    if (isHome) {
      scrollToId(id);
    } else {
      navigate(`/#${id}`);
      setTimeout(() => scrollToId(id), 100);
    }
  };

  const handleGetStarted = (e, source = "navbar") => {
    trackEvent("Clicked Get Started", { location: source });
    setSidebarOpen(false);
    if (isHome) {
      e.preventDefault();
      scrollToId("survey-anchor");
    }
  };

  return (
    <>
      <nav className="top-6 left-1/2 z-50 absolute bg-surface/90 shadow-[0_12px_40px_-12px_rgba(158,61,0,0.2)] backdrop-blur-xl border border-outline-variant/20 rounded-full w-[85%] transition-all -translate-x-1/2 duration-300">
        <div className="flex justify-between items-center px-md sm:px-lg py-sm w-full">
          <Link
            to="/"
            className="flex items-center gap-xs"
            onClick={() => setSidebarOpen(false)}
          >
            <img
              src={mastishkLogo}
              alt=""
              className="w-8 h-8 rounded-[4px] object-cover"
              aria-hidden="true"
            />
            <span className="font-bold text-headline-md text-primary">
              MΛSTISHK
            </span>
          </Link>

          <div className="flex items-center gap-sm sm:gap-md">
            <div className="md:flex items-center gap-md hidden">
              {isAbout && <NavLink to="/" label="Home" active={false} />}

              {isHome &&
                ANCHOR_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(link.id);
                    }}
                    className="font-bold text-label-md text-on-surface-variant hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                ))}

              <NavLink to="/about" label="About Us" active={isAbout} />
            </div>

            <Link
              to={isHome ? "/#survey-anchor" : "/"}
              onClick={(e) => handleGetStarted(e, "navbar")}
              className="sm:flex items-center gap-xs hidden bg-primary hover:bg-primary/90 shadow-sm px-md py-[10px] rounded-full font-bold text-label-md text-on-primary transition-colors"
            >
              Get Started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>

            <button
              type="button"
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen((o) => !o)}
              className="flex justify-center items-center md:hidden hover:bg-primary/10 rounded-full w-10 h-10 text-primary transition-colors"
            >
              {sidebarOpen ? (
                <X size={22} strokeWidth={2} />
              ) : (
                <Menu size={22} strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-300 ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          type="button"
          aria-label="Close menu"
          className="absolute inset-0 bg-[#1b1c17]/40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />

        <aside
          className={`absolute top-0 right-0 h-full w-[min(100%,320px)] bg-surface/95 backdrop-blur-2xl border-l border-outline-variant/20 shadow-[-24px_0_60px_-20px_rgba(158,61,0,0.25)] flex flex-col transition-transform duration-300 ease-out ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center px-6 pt-8 pb-6 border-outline-variant/15 border-b">
            <div className="flex items-center gap-2">
              <img
                src={mastishkLogo}
                alt=""
                className="w-8 h-8 rounded-[4px] object-cover"
                aria-hidden="true"
              />
              <span className="font-bold text-body-md text-primary">
                MΛSTISHK
              </span>
            </div>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setSidebarOpen(false)}
              className="flex justify-center items-center hover:bg-primary/10 rounded-full w-10 h-10 text-on-surface-variant hover:text-primary transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col flex-1 gap-1 px-4 py-6">
            <p className="mb-3 px-3 font-bold text-label-sm text-secondary uppercase tracking-[0.2em]">
              Explore
            </p>

            {!isHome && (
              <SidebarLink
                icon={Home}
                label="Home"
                onClick={() => {
                  setSidebarOpen(false);
                  navigate("/");
                }}
              />
            )}

            <SidebarLink
              icon={Sparkles}
              label="What's Coming"
              onClick={() => goHomeAnchor("whats-coming")}
            />

            <SidebarLink
              icon={Users}
              label="About Us"
              active={isAbout}
              onClick={() => {
                setSidebarOpen(false);
                navigate("/about");
              }}
            />
          </nav>

          <div className="px-5 pt-4 pb-10 border-outline-variant/15 border-t">
            <Link
              to={isHome ? "/#survey-anchor" : "/"}
              onClick={(e) => handleGetStarted(e, "mobile_sidebar")}
              className="flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 bloom-shadow-primary py-3.5 rounded-full w-full font-bold text-label-md text-on-primary transition-colors"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
            <p className="mt-4 text-center text-label-sm text-on-surface-variant">
              90 seconds to map your focus
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

function NavLink({ to, label, active }) {
  return (
    <Link
      to={to}
      className={`relative text-label-md font-bold transition-colors duration-300 px-3 py-1 rounded-full
        ${
          active
            ? "text-primary bg-primary/10"
            : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
        }`}
    >
      {label}
      {active && (
        <span className="bottom-0 left-1/2 absolute bg-primary rounded-full w-1 h-1 -translate-x-1/2 translate-y-[6px]" />
      )}
    </Link>
  );
}

function SidebarLink({ icon: Icon, label, onClick, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-3.5 rounded-2xl text-left text-body-md font-semibold transition-all duration-200 ${
        active
          ? "bg-primary/10 text-primary"
          : "text-on-surface hover:bg-surface-container-low hover:text-primary"
      }`}
    >
      <span
        className={`flex items-center justify-center w-10 h-10 rounded-xl ${
          active
            ? "bg-primary-fixed text-primary"
            : "bg-surface-container text-primary"
        }`}
      >
        <Icon size={18} strokeWidth={1.75} />
      </span>
      {label}
    </button>
  );
}
