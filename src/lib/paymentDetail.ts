/**
 * Traduz o `status_detail` que o Mercado Pago envia junto com o pagamento
 * para uma frase curta em português. Usado para mostrar o motivo de uma
 * rejeição no admin de pedidos.
 *
 * Referência dos códigos: https://www.mercadopago.com.br/developers → status_detail
 */
const PAYMENT_DETAIL_MESSAGES: Record<string, string> = {
  // Aprovado / em processamento
  accredited: "Pagamento aprovado",
  pending_contingency: "Em processamento pelo Mercado Pago",
  pending_review_manual: "Em análise manual do Mercado Pago",
  pending_waiting_payment: "Aguardando pagamento do cliente",
  pending_waiting_transfer: "Aguardando transferência do cliente",

  // Rejeições de cartão
  cc_rejected_bad_filled_card_number: "Número do cartão incorreto",
  cc_rejected_bad_filled_date: "Data de validade do cartão incorreta",
  cc_rejected_bad_filled_other: "Dados do cartão preenchidos incorretamente",
  cc_rejected_bad_filled_security_code: "Código de segurança (CVV) incorreto",
  cc_rejected_bad_filled_installments: "Número de parcelas inválido",
  cc_rejected_blacklist: "Cartão recusado por segurança (lista de bloqueio)",
  cc_rejected_call_for_authorize: "O cliente precisa autorizar o pagamento com o banco",
  cc_rejected_card_disabled: "Cartão desabilitado — o cliente deve ativá-lo com o banco",
  cc_rejected_card_error: "Erro ao processar o cartão",
  cc_rejected_duplicated_payment: "Pagamento duplicado",
  cc_rejected_high_risk: "Recusado por prevenção de fraude",
  cc_rejected_insufficient_amount: "Saldo ou limite insuficiente",
  cc_rejected_invalid_installments: "Número de parcelas inválido",
  cc_rejected_max_attempts: "Excedeu o número de tentativas permitidas",
  cc_rejected_other_reason: "Recusado pelo banco (motivo não especificado)",
  cc_rejected_time_out: "Tempo de autorização esgotado",

  // Rejeições gerais
  rejected_high_risk: "Recusado por prevenção de fraude",
  rejected_insufficient_data: "Recusado por dados insuficientes",
  rejected_by_bank: "Recusado pelo banco",
  rejected_by_regulations: "Recusado por regulamentação",
  bank_error: "Erro no banco emissor",
  expired: "Pagamento expirado",
  by_collector: "Cancelado pela loja",
  by_payer: "Cancelado pelo cliente",
};

/**
 * Retorna uma frase amigável para o `status_detail`. Se o código for
 * desconhecido, devolve o próprio código para não perder a informação.
 */
export function describePaymentDetail(detail: string | null | undefined): string | null {
  if (!detail) return null;
  return PAYMENT_DETAIL_MESSAGES[detail] ?? detail;
}
