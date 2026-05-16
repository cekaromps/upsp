import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export interface ProcessCosts {
  milling?: number;
  turning?: number;
  grinding?: number;
  edm?: number;
  wireCut?: number;
  hardening?: number;
  plating?: number;
  others?: number;
}

export interface QuoteItem {
  name: string;
  material: string;
  length: number;
  width: number;
  thickness: number;
  density: number;
  qty: number;
  volume: number;
  weight: number;
  materialCost: number;
  processCost: number;
  totalPrice: number;
  salePrice: number;
  idr: number;
  processes: ProcessCosts;
}

export interface QuoteMeta {
  quoteNumber?: string;
  date?: string;
  companyName?: string;
  customerName?: string;
  notes?: string;
}

// ─── Formatters ─────────────────────────────────────

const fmtSGD = (v: number) =>
  new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    maximumFractionDigits: 2,
  }).format(v);

const fmtIDR = (v: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);

const fmtNum = (v: number, dp = 2) => v.toFixed(dp);

// ─── HTML BUILDER ─────────────────────────────────────

function buildHTML(items: QuoteItem[], meta: QuoteMeta = {}): string {
  const today = new Date().toLocaleDateString("en-SG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const grandTotalSGD = items.reduce((s, i) => s + i.salePrice, 0);
  const grandTotalIDR = items.reduce((s, i) => s + i.idr, 0);

  const itemRows = items
    .map(
      (item, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${item.name || "—"}</td>
        <td>${item.material || "—"}</td>
        <td>${item.length} × ${item.width} × ${item.thickness}</td>
        <td>${item.qty}</td>
        <td>${fmtSGD(item.materialCost)}</td>
        <td>${fmtSGD(item.processCost)}</td>
        <td>${fmtSGD(item.totalPrice)}</td>
        <td><strong>${fmtSGD(item.salePrice)}</strong></td>
        <td><strong>${fmtIDR(item.idr)}</strong></td>
      </tr>
    `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>

<style>
  body {
    font-family: Arial, sans-serif;
    font-size: 11px;
    padding: 28px;
    color: #111827;
  }

  /* HEADER */
  .header {
    display: flex;
    justify-content: space-between;
    border-bottom: 3px solid #000;
    padding-bottom: 14px;
    margin-bottom: 20px;
  }

  .company {
    font-size: 20px;
    font-weight: bold;
    color: #000;
  }

  .meta {
    text-align: right;
    font-size: 12px;
  }

  /* INFO */
  .info {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }

  .box {
    flex: 1;
    padding: 10px;
    background: #f3f4f6;
    border-radius: 6px;
  }

  /* TABLE */
  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead th {
    background: #2563eb;
    color: white;
    padding: 8px;
    font-size: 10px;
    text-transform: uppercase;
  }

  tbody td {
    padding: 8px;
    border-bottom: 1px solid #e5e7eb;
  }

  tbody tr:nth-child(even) {
    background: #f9fafb;
  }

  td {
    vertical-align: top;
  }

  td:nth-child(n+5) {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  /* GRAND TOTAL */
  .total {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 40px;
    border-top: 2px solid #000;
    padding-top: 12px;
  }

  .total div {
    text-align: right;
  }

  .sgd {
    font-size: 16px;
    color: #000;
    font-weight: bold;
  }

  .idr {
    font-size: 16px;
    color: #000;
    font-weight: bold;
  }

  /* FOOTER */
  .footer {
    margin-top: 30px;
    text-align: center;
    font-size: 10px;
    color: #9ca3af;
    border-top: 1px solid #e5e7eb;
    padding-top: 10px;
  }
</style>

</head>

<body>

  <div class="header">
    <div>
      <div class="company">${meta.companyName || "Price Estimator"}</div>
      <div>QUOTATION / PRICE ESTIMATE</div>
    </div>

    <div class="meta">
      <div><strong>${meta.quoteNumber ? `#${meta.quoteNumber}` : ""}</strong></div>
      <div>${meta.date || today}</div>
    </div>
  </div>

  ${
    meta.customerName || meta.notes
      ? `
    <div class="info">
      ${
        meta.customerName
          ? `<div class="box"><strong>Customer</strong><br/>${meta.customerName}</div>`
          : ""
      }
      ${
        meta.notes
          ? `<div class="box"><strong>Notes</strong><br/>${meta.notes}</div>`
          : ""
      }
    </div>
  `
      : ""
  }

  <!-- ITEMS TABLE -->
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Item</th>
        <th>Material</th>
        <th>Size (L×W×T)</th>
        <th>Qty</th>
        <th>Material</th>
        <th>Process</th>
        <th>Total</th>
        <th>Sale (SGD)</th>
        <th>Sale (IDR)</th>
      </tr>
    </thead>

    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <!-- GRAND TOTAL -->
  <div class="total">
    <div>
      <div>Grand Total (SGD)</div>
      <div class="sgd">${fmtSGD(grandTotalSGD)}</div>
    </div>

    <div>
      <div>Grand Total (IDR)</div>
      <div class="idr">${fmtIDR(grandTotalIDR)}</div>
    </div>
  </div>

  <div class="footer">
    Generated by Price Estimator • ${today}
  </div>

</body>
</html>
`;
}

// ─── PUBLIC API ─────────────────────────────────────

export async function generateAndShareQuotePDF(
  items: QuoteItem[],
  meta: QuoteMeta = {}
): Promise<void> {
  const html = buildHTML(items, meta);

  const { uri } = await Print.printToFileAsync({ html });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle: "Share Quote PDF",
      UTI: "com.adobe.pdf",
    });
  } else {
    await Print.printAsync({ uri });
  }
}

export function buildQuoteHTML(
  items: QuoteItem[],
  meta: QuoteMeta = {}
): string {
  return buildHTML(items, meta);
}