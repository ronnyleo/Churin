import { Link } from "react-router-dom";

const adminLinks = [
  { to: "/admin/overview", label: "Resumen" },
  { to: "/admin/orders", label: "Ordenes" },
  { to: "/admin/menu", label: "Menu" },
];

export default function AdminSideBar() {
  return (
    <nav className="flex h-full flex-col gap-4 border-r-2 px-10 py-5">
      {adminLinks.map((link) => (
        <Link key={link.to} to={link.to}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
