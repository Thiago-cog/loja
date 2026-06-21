import Link from "next/link";

export default function PaymentFailure() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-red-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-3">Pagamento não aprovado</h1>
        <p className="text-gray-500 leading-relaxed mb-8">
          Houve um problema com o pagamento. Tente novamente ou entre em contato conosco para ajuda.
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
