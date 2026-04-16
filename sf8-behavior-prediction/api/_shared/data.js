import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

let cachedCustomers = null;
let cachedCatalog = null;

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(MODULE_DIR, "..", "..");

function resolveExistingPath(relativePath) {
  const candidates = [
    path.join(PROJECT_ROOT, relativePath),
    path.join(process.cwd(), relativePath),
    path.join("/var/task", relativePath),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  throw new Error(`Data file not found: ${relativePath}`);
}

function readJson(relativePath) {
  const fullPath = resolveExistingPath(relativePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(raw);
}

export function loadCustomers() {
  if (!cachedCustomers) {
    cachedCustomers = readJson("backend/customers_data.json");
  }
  return cachedCustomers;
}

export function loadProductCatalog() {
  if (!cachedCatalog) {
    cachedCatalog = readJson("backend/Product_Catalog.json");
  }
  return cachedCatalog;
}

export function findCustomer(customerId) {
  return loadCustomers().find((item) => item.customer_id === customerId) || null;
}
