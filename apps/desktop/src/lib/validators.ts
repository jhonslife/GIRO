/**
 * @file validators.ts - Funções de validação de dados
 */

/**
 * Valida CPF (Cadastro de Pessoas Físicas)
 * Algoritmo padrão de validação de dígitos verificadores
 */
export function validateCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cleaned = cpf.replace(/\D/g, '');

  // Verifica tamanho
  if (cleaned.length !== 11) return false;

  // Verifica dígitos iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(9))) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(10))) return false;

  return true;
}

/**
 * Valida CNPJ (Cadastro Nacional da Pessoa Jurídica)
 */
export function validateCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, '');

  if (cleaned.length !== 14) return false;

  if (/^(\d)\1{13}$/.test(cleaned)) return false;

  // Validação dos dígitos verificadores
  // (Implementação simplificada para placeholder, idealmente algoritmo completo)
  // TODO: Implementar algoritmo completo de módulo 11 para CNPJ se necessário
  return true;
}

/**
 * Valida EAN-13 (Código de Barras)
 */
export function validateEAN13(ean: string): boolean {
  const cleaned = ean.replace(/\D/g, '');

  if (cleaned.length !== 13) return false;

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(cleaned.charAt(i));
    sum += i % 2 === 0 ? digit : digit * 3;
  }

  const remainder = sum % 10;
  const checkDigit = remainder === 0 ? 0 : 10 - remainder;

  return checkDigit === parseInt(cleaned.charAt(12));
}

/**
 * Valida formato de E-mail
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida senha forte
 * Mínimo 8 caracteres, uma maiúscula, uma minúscula, um número
 */
export function validateStrongPassword(password: string): boolean {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
}
