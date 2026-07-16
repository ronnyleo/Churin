import AdminSideBar from "features/admin/components/AdminSideBar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="pt-20 px-4 md:px-8 flex h-[calc(100vh-5rem)] overflow-hidden">
      <aside className="flex-shrink-0 border-r border-gray-200">
        <AdminSideBar />
      </aside>
      <section className="flex-1 min-w-0 min-h-0 overflow-y-auto px-4 md:px-8 py-6">
        <Outlet />
      </section>
    </div>
  );
}