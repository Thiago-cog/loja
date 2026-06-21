import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-green-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-3">Pagamento confirmado!</h1>
        <p className="text-gray-500 leading-relaxed mb-8">
          Seu pedido foi recebido e o pagamento foi aprovado. Entraremos em contato pelo telefone informado para combinar a entrega.
        </p>
        <Link
          href="/"
          className="inline-block bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors"
        >
          Voltar para a loja
        </Link>
      </div>
    </div>
  );
}
