ALTER TABLE "Order" ADD COLUMN "paymentStatus" TEXT NOT NULL DEFAULT 'pendente';
ALTER TABLE "Order" ADD COLUMN "paymentId" TEXT;
