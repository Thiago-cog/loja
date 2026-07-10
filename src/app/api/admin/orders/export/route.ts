import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { describePaymentDetail } from "@/lib/paymentDetail";

const STATUS_COLORS: Record<string, { fill: string; font: string }> = {
  pendente: { fill: "FFFEF9C3", font: "FFA16207" },
  confirmado: { fill: "FFDBEAFE", font: "FF1D4ED8" },
  enviado: { fill: "FFF3E8FF", font: "FF7E22CE" },
  entregue: { fill: "FFDCFCE7", font: "FF15803D" },
  cancelado: { fill: "FFFEE2E2", font: "FFB91C1C" },
};

const PAYMENT_COLORS: Record<string, { fill: string; font: string }> = {
  aprovado: { fill: "FFDCFCE7", font: "FF15803D" },
  rejeitado: { fill: "FFFEE2E2", font: "FFB91C1C" },
  reembolsado: { fill: "FFFEE2E2", font: "FFB91C1C" },
};
const PAYMENT_DEFAULT_COLOR = { fill: "FFF3F4F6", font: "FF374151" };

export async function GET(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const status = request.nextUrl.searchParams.get("status");

  const orders = await prisma.order.findMany({
    where: status ? { status } : undefined,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Alive Store";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Pedidos", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  sheet.columns = [
    { header: "Pedido", key: "orderId", width: 14 },
    { header: "Data", key: "date", width: 12 },
    { header: "Cliente", key: "customerName", width: 24 },
    { header: "Telefone", key: "phone", width: 16 },
    { header: "Produto", key: "product", width: 28 },
    { header: "Modelo", key: "model", width: 14 },
    { header: "Tamanho", key: "size", width: 10 },
    { header: "Quantidade", key: "quantity", width: 11 },
    { header: "Preço Unit.", key: "unitPrice", width: 13 },
    { header: "Subtotal", key: "subtotal", width: 13 },
    { header: "Total Pedido", key: "orderTotal", width: 14 },
    { header: "Status", key: "status", width: 14 },
    { header: "Pagamento", key: "paymentStatus", width: 14 },
    { header: "Motivo rejeição", key: "paymentDetail", width: 32 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.height = 22;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF000000" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });
  sheet.autoFilter = { from: "A1", to: "N1" };

  for (const order of orders) {
    for (const item of order.items) {
      const row = sheet.addRow({
        orderId: order.id,
        date: new Date(order.createdAt),
        customerName: order.customerName,
        phone: order.customerPhone,
        product: item.name,
        model: item.model || "",
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.price,
        subtotal: item.price * item.quantity,
        orderTotal: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentDetail: order.paymentStatus === "rejeitado" ? describePaymentDetail(order.paymentDetail) ?? "" : "",
      });

      row.getCell("date").numFmt = "dd/mm/yyyy";
      row.getCell("quantity").alignment = { horizontal: "center" };
      for (const key of ["unitPrice", "subtotal", "orderTotal"]) {
        row.getCell(key).numFmt = '"R$" #,##0.00';
      }

      const statusColor = STATUS_COLORS[order.status] ?? PAYMENT_DEFAULT_COLOR;
      const statusCell = row.getCell("status");
      statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: statusColor.fill } };
      statusCell.font = { color: { argb: statusColor.font }, bold: true };
      statusCell.alignment = { horizontal: "center" };

      const paymentColor = PAYMENT_COLORS[order.paymentStatus] ?? PAYMENT_DEFAULT_COLOR;
      const paymentCell = row.getCell("paymentStatus");
      paymentCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: paymentColor.fill } };
      paymentCell.font = { color: { argb: paymentColor.font }, bold: true };
      paymentCell.alignment = { horizontal: "center" };
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="pedidos-alive-store-${new Date().toISOString().split("T")[0]}.xlsx"`,
    },
  });
}
