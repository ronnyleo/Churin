import AdminSideBar from "features/admin/components/AdminSideBar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="py-20 px-10 flex h-[calc(100vh-5rem)] overflow-hidden">
      <aside className="">
        <AdminSideBar />
      </aside>
      <section className="flex-1 min-w-0 min-h-0 flex flex-col">
        <main className="flex-1 min-h-0 overflow-y-auto px-5">
          <Outlet />
        </main>
      </section>
    </div>
  );
}