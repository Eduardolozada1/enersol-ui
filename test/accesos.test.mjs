// 0.7.0: los módulos que la persona tiene habilitados en el Hub viajan en el ticket de SSO
// (`modulos`); el módulo los guarda al entrar y el menú Apps los usa solo. Correr con `npm test`.
import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import {
  MODULOS_ENERSOL,
  accesosDelMenu,
  accesosDelTicket,
  accesosGuardados,
  guardarAccesosDelTicket,
  modulosVisibles,
  olvidarAccesos,
} from "../dist/index.js";

const CLAVE = "enersol-accesos-hub";

/** Un ticket con la forma del que firma el Hub (la firma no importa: el menú no la mira). */
function ticket(datos) {
  const parte = (objeto) => Buffer.from(JSON.stringify(objeto)).toString("base64url");
  return `${parte({ alg: "HS256", typ: "JWT" })}.${parte(datos)}.firma`;
}

const DEL_HUB = { email: "ana@example.com", nombre: "José Pérez Ñuflo", modulo: "contabilidad", rol: "contador" };

class AlmacenDePrueba {
  constructor() {
    this.datos = new Map();
  }
  getItem(clave) {
    return this.datos.has(clave) ? this.datos.get(clave) : null;
  }
  setItem(clave, valor) {
    this.datos.set(clave, String(valor));
  }
  removeItem(clave) {
    this.datos.delete(clave);
  }
}

let almacen;
beforeEach(() => {
  almacen = new AlmacenDePrueba();
  globalThis.localStorage = almacen;
});
afterEach(() => {
  delete globalThis.localStorage;
});

test("lee los módulos del ticket (también con tildes en el nombre)", () => {
  const t = ticket({ ...DEL_HUB, modulos: ["contabilidad", "distribucion"] });
  assert.deepEqual(accesosDelTicket(t), ["contabilidad", "distribucion"]);
});

test("un ticket sin módulos, roto o con claves raras no da lista", () => {
  assert.equal(accesosDelTicket(ticket(DEL_HUB)), null); // Hub de antes
  assert.equal(accesosDelTicket(null), null);
  assert.equal(accesosDelTicket(""), null);
  assert.equal(accesosDelTicket("sin-puntos"), null);
  assert.equal(accesosDelTicket("a.%%%.c"), null);
  assert.equal(accesosDelTicket(ticket({ ...DEL_HUB, modulos: "distribucion" })), null);
  assert.equal(accesosDelTicket(ticket({ ...DEL_HUB, modulos: ["Distribución"] })), null);
  assert.equal(accesosDelTicket(ticket({ ...DEL_HUB, modulos: ["<script>"] })), null);
  assert.equal(accesosDelTicket(ticket({ ...DEL_HUB, modulos: Array(51).fill("x") })), null);
});

test("guardar al entrar, leer y olvidar al salir", () => {
  guardarAccesosDelTicket(ticket({ ...DEL_HUB, modulos: ["contabilidad", "distribucion"] }));
  assert.deepEqual(accesosGuardados(), ["contabilidad", "distribucion"]);
  olvidarAccesos();
  assert.equal(accesosGuardados(), null);
  assert.equal(almacen.getItem(CLAVE), null);
});

test("un ticket sin módulos borra lo guardado (nunca queda la lista de otra persona)", () => {
  guardarAccesosDelTicket(ticket({ ...DEL_HUB, modulos: ["distribucion"] }));
  guardarAccesosDelTicket(ticket(DEL_HUB));
  assert.equal(accesosGuardados(), null);
});

test("lo guardado a mano con otra forma no se usa", () => {
  almacen.setItem(CLAVE, JSON.stringify(["distribucion", { x: 1 }]));
  assert.equal(accesosGuardados(), null);
  almacen.setItem(CLAVE, "no es json");
  assert.equal(accesosGuardados(), null);
});

test("sin almacenamiento (bloqueado o en el servidor) nada falla", () => {
  delete globalThis.localStorage;
  guardarAccesosDelTicket(ticket({ ...DEL_HUB, modulos: ["distribucion"] }));
  assert.equal(accesosGuardados(), null);
  olvidarAccesos();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get() {
      throw new Error("SecurityError");
    },
  });
  guardarAccesosDelTicket(ticket({ ...DEL_HUB, modulos: ["distribucion"] }));
  assert.equal(accesosGuardados(), null);
  olvidarAccesos();
});

test("menú Apps: la prop manda; sin la prop, lo guardado al entrar por SSO", () => {
  const claves = (lista) => lista.map((m) => m.clave);
  guardarAccesosDelTicket(ticket({ ...DEL_HUB, modulos: ["contabilidad", "distribucion"] }));
  assert.deepEqual(accesosDelMenu(undefined), ["contabilidad", "distribucion"]);
  assert.equal(accesosDelMenu(null), null); // el módulo dice «ninguno»
  assert.deepEqual(accesosDelMenu(["operaciones"]), ["operaciones"]);
  const visibles = claves(modulosVisibles(MODULOS_ENERSOL, "contabilidad", accesosDelMenu(undefined)));
  assert.ok(visibles.includes("distribucion"));
  olvidarAccesos();
  const sinAcceso = claves(modulosVisibles(MODULOS_ENERSOL, "contabilidad", accesosDelMenu(undefined)));
  assert.ok(!sinAcceso.includes("distribucion"));
});
