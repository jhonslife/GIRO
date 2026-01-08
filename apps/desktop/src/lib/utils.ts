import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina classes CSS com merge inteligente de Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata valor em moeda brasileira
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata número como quantidade
 */
export function formatQuantity(value: number, unit: string = 'un'): string {
  if (unit === 'KG' || unit === 'KILOGRAM') {
    return `${value.toFixed(3)} kg`;
  }
  if (unit === 'GRAM') {
    return `${value.toFixed(0)} g`;
  }
  if (unit === 'LITER') {
    return `${value.toFixed(3)} L`;
  }
  if (unit === 'MILLILITER') {
    return `${value.toFixed(0)} mL`;
  }
  return `${value} ${unit.toLowerCase()}`;
}

/**
 * Formata data no padrão brasileiro
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR').format(d);
}

/**
 * Formata data e hora no padrão brasileiro
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(d);
}

/**
 * Calcula margem de lucro percentual
 */
export function calculateMargin(salePrice: number, costPrice: number): number {
  if (costPrice === 0) return 100;
  return ((salePrice - costPrice) / costPrice) * 100;
}

/**
 * Gera ID único para uso local
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Debounce para inputs
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Valida código de barras EAN-13
 */
export function isValidEAN13(barcode: string): boolean {
  if (!/^\d{13}$/.test(barcode)) return false;

  const digits = barcode.split('').map(Number);
  const checkDigit = digits.pop()!;

  const sum = digits.reduce((acc, digit, index) => {
    return acc + digit * (index % 2 === 0 ? 1 : 3);
  }, 0);

  const calculatedCheck = (10 - (sum % 10)) % 10;
  return checkDigit === calculatedCheck;
}

/**
 * Extrai informações de código de barras de balança
 * Formato: 2PPPPPVVVVVC (2 = prefixo balança, P = produto, V = valor/peso, C = check)
 */
export function parseWeightedBarcode(barcode: string): {
  productCode: string;
  weight: number;
} | null {
  if (!barcode.startsWith('2') || barcode.length !== 13) {
    return null;
  }

  const productCode = barcode.substring(1, 6);
  const weightRaw = barcode.substring(6, 11);
  const weight = parseInt(weightRaw, 10) / 1000; // Converte para kg

  return { productCode, weight };
}
