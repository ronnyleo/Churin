import { Link, useLocation } from "react-router-dom";

const adminLinks = [
  { to: "/admin/overview", label: "Resumen" },
  { to: "/admin/orders", label: "Ordenes" },
  { to: "/admin/menu", label: "Menu" },
  { to: "/admin/settings", label: "Configuración" },
  { to: "/admin/users", label: "Usuarios" },
];

export default function AdminSideBar() {
  const { pathname } = useLocation();

  return (
    <nav className="flex h-full flex-col gap-1 py-6 px-3">
      {adminLinks.map((link) => {
        const activo = pathname.startsWith(link.to);
        return (
          <Link
            key={link.to}
            to={link.to}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activo
                ? "bg-yellow-100 text-yellow-800"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
