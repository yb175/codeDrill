import { Code, LogIn } from "lucide-react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import ProfileMenu from "./profileMenu";

const Header = () => {
  const isVerified = useSelector((state) => state.auth.isVerified);
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  // FIXED: Manual slug map for ABSOLUTE route safety
  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Problems", path: "/problems" },
    { label: "AI Features", path: "/ai-features" },
    { label: "Discussion", path: "/discussion" },
    user?.role === "admin" && { label: "Admin", path: "/admin" },
  ].filter(Boolean);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 backdrop-blur-sm bg-gray-950/50 border-b border-purple-900/40 shadow-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-14">
        <div className="text-2xl font-extrabold tracking-widest text-white">
          <span className="text-purple-400">Code</span>Drill
        </div>

        <nav className="flex space-x-6 text-sm font-medium">
          {menuItems.map((item) => (
            <Link
              to={item.path}
              key={item.path}
              className="text-gray-300 hover:text-purple-400 transition duration-300 relative group"
            >
              {item.label}
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-purple-400 origin-bottom-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
          ))}
        </nav>

        {loading ? (
          <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse" />
        ) : isVerified ? (
          <ProfileMenu firstLetter={firstLetter} />
        ) : (
          <Link
            to="/signup-login"
            className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-full shadow-lg shadow-purple-600/50 hover:bg-purple-700 transition duration-300 transform hover:scale-105"
          >
            <LogIn size={16} />
            <span>Login</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
