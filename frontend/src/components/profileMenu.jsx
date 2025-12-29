import { LayoutDashboard, Sparkles, LogOut } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useDispatch} from "react-redux";
import { logout } from "../slice/authSlice";
import ProfileAvatarDisplay from "./profileAvatarDisplay";
const ProfileMenu = ({ firstLetter }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  return (
    <div className="relative">
      <ProfileAvatarDisplay 
        firstLetter={firstLetter} 
        onClick={() => setOpen(!open)} 
      />

      {open && (
        <ul className="menu bg-base-200 rounded-box w-56 absolute right-0 mt-3 shadow-lg border border-gray-700 z-50">
          <li>
            <Link to="/dashboard" className="flex items-center gap-2">
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          </li>

          <li>
            <Link to="/new-features" className="flex items-center gap-2">
              <Sparkles size={18} />
              New Features
            </Link>
          </li>

          <li>
            <button 
            className="flex items-center gap-2 text-red-400"
            onClick={() => dispatch(logout())}
            >
            <LogOut size={18} />
              Sign Out
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ProfileMenu;
