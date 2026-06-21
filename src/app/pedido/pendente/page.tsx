import Link from "next/link";

export default function PaymentPending() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-yellow-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-3">Pagamento em processamento</h1>
        <p className="text-gray-500 leading-relaxed mb-8">
          Seu pagamento está sendo processado. Assim que for confirmado, entraremos em contato pelo telefone informado.
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
