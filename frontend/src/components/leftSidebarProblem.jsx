import React, { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router"; 
import clsx from "clsx";
import {
  HiOutlineCommandLine,
  HiOutlineTrophy,
  HiOutlineUserCircle,
  HiOutlineSparkles,
  HiOutlineArrowRight,
} from "react-icons/hi2";

// ⚡ Futuristic Transparent Sidebar
// [FINAL] Simplified, ultra-transparent, and no header.

// --- Navigation Config ---
const navItems = [
  {
    label: "All Problems",
    path: "/problems",
    icon: HiOutlineCommandLine,
    color: "text-[#00eaff]",
  },
  {
    label: "Contests",
    path: "/contests",
    icon: HiOutlineTrophy,
    color: "text-[#9a82ff]",
  },
  {
    label: "My Profile",
    path: "/profile",
    icon: HiOutlineUserCircle,
    color: "text-[#00ff95]",
  },
];

export default function LeftSidebar({ width = 300, setWidth }) {
  const ref = useRef();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e) => {
    e.preventDefault();
    setDragging(true);
    ref.current.startX = e.clientX;
    ref.current.startWidth = width;
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - ref.current.startX;
    const next = Math.max(260, Math.min(450, ref.current.startWidth + dx));
    setWidth(next);
  };

  const onPointerUp = () => {
    setDragging(false);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  };

  return (
    <aside
      style={{ width }}
      className="h-screen sticky top-0 left-0 flex flex-col px-6 py-7 select-none
       bg-black/20 backdrop-blur-xl border-r border-[#181f27]/40
       shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
    >
      {/* Holographic transparent gradient layer */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]
         bg-[radial-gradient(circle_at_20%_0%,#00eaff25_0%,transparent_50%)]"
      />

      {/* Vertical hologram lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.1]
       bg-[repeating-linear-gradient(to_bottom,transparent_0_94%,#00eaff15_95%,transparent_100%)]"
      />

      {/* NAVIGATION (Refactored) */}
      <nav className="flex flex-col gap-2.5 text-[14px] relative z-10">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={clsx(
                "group flex items-center gap-3.5 px-3 py-2.5 rounded-lg",
                "border transition-all duration-200 tracking-wide backdrop-blur-sm",
                isActive
                  ? "bg-white/[0.08] border-white/20 text-white shadow-lg shadow-[#00eaff]/10"
                  : "text-gray-300 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10"
              )}
            >
              <Icon
                className={clsx(
                  "text-xl transition-all group-hover:scale-110",
                  isActive ? item.color : "text-gray-400 group-hover:text-white"
                )}
              />
              <span
                className={clsx(
                  "font-medium",
                  isActive && "drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="my-7 h-px w-full bg-gradient-to-r from-transparent via-[#2d3340]/80 to-transparent" />

      {/* Study Plans Hub */}
      <div className="relative z-10">
        <div className="text-[11px] text-gray-400 tracking-[0.25em] px-1 uppercase mb-3">
          Study Plans
        </div>

        <button
          onClick={() => navigate("/sheets")}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg font-semibold text-[14px]
           bg-white/5 border border-white/10
           hover:bg-white/10 hover:border-white/20
           text-white tracking-wide transition backdrop-blur-sm
           shadow-[0_0_15px_rgba(0,255,255,0.08)]"
        >
          <span>View My Plans</span>
          <HiOutlineArrowRight className="text-lg" />
        </button>
      </div>

      {/* Bottom CTA (Pushed to bottom with mt-auto) */}
      <div className="mt-40 relative z-10">
        <button
          onClick={() => navigate("/generate-sheet")}
          className="w-full py-3 mt-6 rounded-lg text-white font-bold text-[15px]
           flex items-center justify-center gap-2.5
           bg-gradient-to-r from-[#00eaffcc] to-[#7f5cffcc]
           shadow-[0_0_25px_#00eaff50] backdrop-blur-sm
           hover:scale-[1.03] hover:shadow-[0_0_35px_#00eaff70]
           active:scale-[0.98] transition-all duration-200 tracking-wide"
        >
          <HiOutlineSparkles className="text-xl" />
          <span>Create New Plan</span>
        </button>
      </div>

      {/* Resize Handle */}
      <div
        ref={ref}
        onPointerDown={onPointerDown}
        className={clsx(
          "absolute right-0 top-0 h-full w-1.5 cursor-col-resize",
          "bg-transparent transition-colors duration-200",
          dragging
            ? "bg-[#00eaff]" // Solid color when dragging
            : "hover:bg-[#00eaff]/70" // Hover state
        )}
      />
    </aside>
  );
}