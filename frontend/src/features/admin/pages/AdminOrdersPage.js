import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "shared/ui/Loading";

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function formatearFecha(fechaStr) {
  const [anio, mes, dia] = fechaStr.split("-");
  return `${parseInt(dia, 10)} de ${MESES[parseInt(mes, 10) - 1]}, ${anio}`;
}

export default function OrdersPage() {
  const [pedidosPorFecha, setPedidosPorFecha] = useState([]);
  const [resumenPorFecha, setResumenPorFecha] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [detallesPedidos, setDetallesPedidos] = useState({});
  const [visibilidadDetalles, setVisibilidadDetalles] = useState({});

  useEffect(() => {
    let cancelado = false;

    const fetchPedidos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/pedido`,
        );
        if (cancelado) return;

        const pedidos = response.data;
        if (!Array.isArray(pedidos)) {
          throw new Error("Formato inesperado de los datos de pedidos.");
        }

        const pedidosAgrupados = pedidos.reduce((acc, pedido) => {
          const fecha = pedido.fecha;
          if (!acc[fecha]) acc[fecha] = [];
          acc[fecha].push(pedido);
          return acc;
        }, {});

        const pedidosOrdenados = Object.entries(pedidosAgrupados).sort(
          (a, b) => new Date(b[0]) - new Date(a[0]),
        );

        setPedidosPorFecha(pedidosOrdenados);
        setError(null);
      } catch (err) {
        if (!cancelado) {
          setError("Error al obtener los pedidos");
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    };

    fetchPedidos();
    return () => { cancelado = true; };
  }, []);

  const toggleDetalles = async (pedidoId) => {
    if (visibilidadDetalles[pedidoId]) {
      setVisibilidadDetalles((prev) => ({ ...prev, [pedidoId]: false }));
      return;
    }

    if (detallesPedidos[pedidoId]) {
      setVisibilidadDetalles((prev) => ({ ...prev, [pedidoId]: true }));
      return;
    }

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/pedido/detalle-pedido/${pedidoId}`,
      );
      setDetallesPedidos((prev) => ({ ...prev, [pedidoId]: res.data }));
      setVisibilidadDetalles((prev) => ({ ...prev, [pedidoId]: true }));
    } catch {
      setError("Error al obtener el detalle del pedido");
    }
  };

  const obtenerEstadisticasPorFecha = async (fecha) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/estadisticas/dia/${fecha}`,
      );
      setResumenPorFecha((prev) => ({ ...prev, [fecha]: res.data }));
    } catch {
      setError("Error al obtener estadísticas del día");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col pb-6">
      <h2 className="text-2xl font-bold mb-4">Pedidos recibidos</h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && pedidosPorFecha.length === 0 && !error && (
        <p className="text-gray-500">No hay pedidos disponibles.</p>
      )}

      {pedidosPorFecha.map(([fecha, pedidos]) => (
        <div key={fecha} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-lg font-bold text-gray-800">
              {formatearFecha(fecha)}
            </h3>
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {pedidos.length} {pedidos.length === 1 ? "pedido" : "pedidos"}
            </span>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="font-semibold text-gray-500 px-4 py-3 w-12">#</th>
                  <th className="font-semibold text-gray-500 px-4 py-3">Cliente</th>
                  <th className="font-semibold text-gray-500 px-4 py-3 whitespace-nowrap hidden md:table-cell">Hora</th>
                  <th className="font-semibold text-gray-500 px-4 py-3 whitespace-nowrap text-right">Total</th>
                  <th className="font-semibold text-gray-500 px-4 py-3 whitespace-nowrap hidden sm:table-cell">Tipo</th>
                  <th className="font-semibold text-gray-500 px-4 py-3 whitespace-nowrap hidden lg:table-cell">Telefono</th>
                  <th className="font-semibold text-gray-500 px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => {
                  const abierto = !!visibilidadDetalles[pedido.id];
                  const detalles = detallesPedidos[pedido.id];

                  return (
                    <React.Fragment key={pedido.id}>
                      <tr
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleDetalles(pedido.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") toggleDetalles(pedido.id);
                        }}
                      >
                        <td className="px-4 py-3 font-mono text-gray-400 w-12">
                          {pedido.id}
                        </td>
                        <td className="px-4 py-3 min-w-0">
                          <span className="font-medium text-gray-900 block truncate">
                            {pedido.first_name} {pedido.last_name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap hidden md:table-cell">
                          {pedido.hora}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">
                          ${pedido.total}
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span
                            className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                              pedido.delivery
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {pedido.delivery ? pedido.lugar_envio : "Retiro"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap hidden lg:table-cell">
                          {pedido.telefono}
                        </td>
                        <td className="px-4 py-3 w-10">
                          <div
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                            title={abierto ? "Ocultar detalle" : "Ver detalle"}
                            aria-hidden
                          >
                            <svg
                              className={`w-4 h-4 transition-transform ${abierto ? "rotate-180" : ""}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </td>
                      </tr>

                      {abierto && detalles && (
                        <tr>
                          <td colSpan="7" className="px-4 py-0">
                            <div className="py-3 pl-4 border-l-2 border-yellow-300 ml-2">
                              {detalles.length === 0 ? (
                                <p className="text-sm text-gray-400 italic py-2">
                                  Sin detalle disponible
                                </p>
                              ) : (
                                <div className="flex flex-col gap-2">
                                  {detalles.map((detalle) => (
                                    <div
                                      key={detalle.id}
                                      className="flex items-start justify-between gap-4 text-sm"
                                    >
                                      <div className="flex-1 min-w-0">
                                        <span className="font-medium text-gray-800">
                                          {detalle.nombre}
                                        </span>
                                        {detalle.ingredientes &&
                                          detalle.ingredientes.length > 0 && (
                                            <span className="text-gray-400 ml-2">
                                              — {detalle.ingredientes.map((ing) => ing.nombre).join(", ")}
                                            </span>
                                          )}
                                      </div>
                                      <div className="flex items-center gap-3 text-gray-500 whitespace-nowrap">
                                        <span>x{detalle.cantidad}</span>
                                        <span className="font-semibold text-gray-700">${detalle.precio}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
            <button
              className="px-4 py-2 bg-yellow-300 hover:bg-yellow-400 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
              onClick={() => obtenerEstadisticasPorFecha(fecha)}
            >
              Resumen del dia
            </button>
            {resumenPorFecha[fecha] && (
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>
                  Pedidos: <strong>{resumenPorFecha[fecha].total_pedidos}</strong>
                </span>
                <span>
                  Total: <strong>${resumenPorFecha[fecha].valor_total}</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
