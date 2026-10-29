// Galería de @enersol/ui: todos los componentes, con los estados que dependen de un color de
// marca. comparar.mjs la dibuja con dos versiones del paquete (y con Tailwind v3 y v4, como la
// usan los módulos) y compara las capturas píxel a píxel.
//
// Solo usa props que existían en la 0.4.0, salvo en el modo «distribucion», que muestra la
// marca de Enersol Distribución con las props nuevas de la 0.5.0.
import { useState } from "react";
import { createRoot } from "react-dom/client";

import {
  AppHeader,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CollapsibleCard,
  ConfirmDialog,
  DataTable,
  EmptyState,
  GuiaBoton,
  GuiaPanel,
  Input,
  MessagesBell,
  Modal,
  PageHeader,
  Pagination,
  Select,
  Spinner,
  SugerenciaBoton,
  SugerenciaModal,
} from "@enersol/ui";

const modo = window.GALERIA_MODO; // "enersol" | "distribucion"
const DISTRIBUCION = modo === "distribucion";

const SECCIONES = [
  { href: "/tablero", label: "Tablero" },
  { href: "/ventas", label: "Ventas" },
  { href: "/compras", label: "Compras" },
  { href: "/mayor", label: "Mayor", group: "Contabilidad" },
  { href: "/cierre", label: "Cierre", group: "Contabilidad" },
  { href: "/admin", label: "Administración", group: "Administración" },
];

const GUIAS = [
  {
    id: "ventas",
    titulo: "Ventas",
    icono: "🧾",
    intro: "Cómo registrar una venta.",
    quien: "Ejecutivos y contador.",
    pasos: ["Tocá **Nueva venta**.", "Elegí el **cliente** y los productos.", "Confirmá."],
    notas: ["La factura sale sola."],
    match: (p) => p.startsWith("/ventas"),
  },
  // dos guías para la misma ruta: el panel muestra las pestañas (la elegida en bg-brand)
  { id: "cobros", titulo: "Cobros", pasos: ["Registrá el **cobro** de la venta."], match: (p) => p.startsWith("/ventas") },
];

// Mensajes del Hub de mentira: siempre las mismas respuestas.
const HILOS = [
  { con_email: "luis@example.com", con_nombre: "Luis Rojas", ultimo_cuerpo: "¿Salió la factura?", ultimo_at: "2026-10-29T14:30:00Z", no_leidos: 2 },
  { con_email: "eva@example.com", con_nombre: "Eva Soria", ultimo_cuerpo: "Gracias", ultimo_at: "2026-10-28T10:00:00Z", no_leidos: 0 },
];
const MENCION = {
  id: 9, de_email: "luis@example.com", de_nombre: "Luis Rojas", para_email: "ana@example.com", tipo: "mencion",
  cuerpo: "@Ana revisá la venta 15", context_url: "/ventas/15", context_label: "Venta 15", leido: false, created_at: "2026-10-29T13:00:00Z",
};
const CHAT = [
  { ...MENCION, id: 1, tipo: "mensaje", cuerpo: "¿Salió la factura?", context_url: null, context_label: null },
  { ...MENCION, id: 2, tipo: "mensaje", de_email: "ana@example.com", de_nombre: "Ana Pérez", para_email: "luis@example.com", cuerpo: "Sí, ya salió.", context_url: null, context_label: null, leido: true },
];
const apiMensajes = {
  get: async (path) => {
    if (path.endsWith("/unread")) return { total: 3 };
    if (path.endsWith("/threads")) return HILOS;
    if (path.endsWith("/menciones")) return [MENCION];
    if (path.includes("/thread?")) return CHAT;
    if (path.endsWith("/directorio")) return [];
    return [];
  },
  post: async () => ({}),
};

const FILAS = [
  { id: 1, cliente: "Solar del Oriente SRL", total: 12840.5, estado: "Pagado" },
  { id: 2, cliente: "Instalaciones Chiquitanas", total: 3420, estado: "Pendiente" },
  { id: 3, cliente: "EcoTecho", total: 980.25, estado: "Rechazado" },
];
const COLUMNAS = [
  { key: "cliente", header: "Cliente", render: (r) => r.cliente, sortValue: (r) => r.cliente },
  { key: "total", header: "Total", align: "right", render: (r) => `US$ ${r.total.toFixed(2)}`, sortValue: (r) => r.total },
  {
    key: "estado",
    header: "Estado",
    render: (r) => <Badge tone={r.estado === "Pagado" ? "verde" : r.estado === "Pendiente" ? "atencion" : "neutro"}>{r.estado}</Badge>,
  },
];

function Seccion({ id, titulo, children }) {
  return (
    <section data-seccion={id} className="mb-6">
      <h2 className="mb-2 font-display text-[15px] font-semibold text-ink">{titulo}</h2>
      {children}
    </section>
  );
}

function Galeria() {
  const [confirmar, setConfirmar] = useState(false);
  const [modal, setModal] = useState(false);
  const [guia, setGuia] = useState(false);
  const [sugerencia, setSugerencia] = useState(false);
  const [offset, setOffset] = useState(50);

  const extra = DISTRIBUCION ? { indicador: "subrayado", mostrarApps: false, mostrarNombre: false } : {};
  const logo = DISTRIBUCION ? (
    <img src="/brand/distribucion/imagotipo-color.svg" alt="Enersol Distribución" className="h-7 w-auto" />
  ) : (
    <img src="/brand/enersol/imagotipo-color.png" alt="Enersol" className="h-7 w-auto" />
  );

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink">
      <AppHeader
        moduleKey={DISTRIBUCION ? "distribucion" : "contabilidad"}
        moduleName={DISTRIBUCION ? "Distribución" : "Contabilidad"}
        logo={logo}
        items={SECCIONES}
        currentPath="/ventas/3"
        user={{ name: "Ana Pérez", email: "ana@example.com" }}
        onLogout={() => {}}
        persistentActions={
          <>
            <MessagesBell api={apiMensajes} selfEmail="ana@example.com" pollMs={3_600_000} />
            <GuiaBoton guias={GUIAS} path="/ventas/3" />
          </>
        }
        actions={<SugerenciaBoton onEnviar={async () => {}} />}
        {...extra}
      />
      <main className="w-full px-6 py-8">
        <PageHeader
          title="Galería"
          count="todos los componentes"
          subtitle="Mismo contenido en cada versión"
          actions={<Button>Acción principal</Button>}
        />

        <Seccion id="botones" titulo="Botones">
          <div className="flex flex-wrap items-center gap-3">
            <Button data-prueba="primario">Confirmar pedido</Button>
            <Button variant="secondary">Guardar cotización</Button>
            <Button variant="ghost">Ver más</Button>
            <Button variant="danger">Eliminar</Button>
            <Button disabled>Deshabilitado</Button>
            <Button size="sm">Chico</Button>
            <Spinner />
          </div>
        </Seccion>

        <Seccion id="pastillas" titulo="Pastillas">
          <div className="flex flex-wrap gap-2">
            <Badge>Neutro</Badge>
            <Badge tone="verde">Pagado</Badge>
            <Badge tone="atencion">Pendiente de pago</Badge>
            <Badge tone="rojo">Error</Badge>
            <Badge tone="marca">Nivel Oro</Badge>
          </div>
        </Seccion>

        <Seccion id="campos" titulo="Campos">
          <div className="grid max-w-xl gap-3 sm:grid-cols-2">
            <Input data-prueba="input" placeholder="nombre@empresa.com" />
            <Select data-prueba="select" defaultValue="b">
              <option value="a">Paneles</option>
              <option value="b">Inversores</option>
            </Select>
          </div>
        </Seccion>

        <Seccion id="tarjetas" titulo="Tarjetas">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>Resumen</CardHeader>
              <CardBody>Total US$ 2.469,12</CardBody>
            </Card>
            <CollapsibleCard title="Con resumen" summary="3 productos" defaultOpen>
              Contenido visible.
            </CollapsibleCard>
            <Card>
              <EmptyState title="No hay productos" hint="Probá con otros filtros." action={<Button variant="secondary">Limpiar filtros</Button>} />
            </Card>
          </div>
        </Seccion>

        <Seccion id="tabla" titulo="Tabla">
          <Card>
            <DataTable columns={COLUMNAS} rows={FILAS} rowKey={(r) => r.id} onRowClick={() => {}} defaultSort={{ key: "cliente", dir: "asc" }} />
          </Card>
          <Pagination total={1251} pageSize={50} offset={offset} onChange={setOffset} itemLabel={["venta", "ventas"]} className="mt-3" />
        </Seccion>

        <Seccion id="dialogos" titulo="Diálogos">
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" data-abrir="confirmar" onClick={() => setConfirmar(true)}>Abrir confirmación</Button>
            <Button variant="secondary" data-abrir="modal" onClick={() => setModal(true)}>Abrir modal</Button>
            <Button variant="secondary" data-abrir="guia" onClick={() => setGuia(true)}>Abrir guía</Button>
            <Button variant="secondary" data-abrir="sugerencia" onClick={() => setSugerencia(true)}>Abrir Mejoras</Button>
          </div>
        </Seccion>
      </main>

      <ConfirmDialog
        open={confirmar}
        title="¿Anular la venta?"
        confirmLabel="Anular"
        reason={{ label: "Motivo", required: false }}
        onConfirm={() => setConfirmar(false)}
        onCancel={() => setConfirmar(false)}
      >
        Se revierten los asientos.
      </ConfirmDialog>
      <Modal open={modal} onClose={() => setModal(false)} title="Detalle">
        <p className="text-caption text-subtle">Contenido del modal.</p>
        <div className="mt-4 flex justify-end">
          <Button>Aceptar</Button>
        </div>
      </Modal>
      <GuiaPanel open={guia} onClose={() => setGuia(false)} guias={GUIAS} path="/ventas/3" multiples="pestanas" />
      {sugerencia && <SugerenciaModal onClose={() => setSugerencia(false)} onEnviar={async () => {}} url="/ventas/3" />}
    </div>
  );
}

createRoot(document.getElementById("raiz")).render(<Galeria />);
