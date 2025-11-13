import { Outlet } from "react-router";

export default function AdminLayout() {
  return (
    <div className="p-6">
      <Outlet />
    </div>
  );
}