/**
 * @file scanner.mock.ts - Mock de leitor de código de barras
 */

type ScanCallback = (barcode: string) => void;

export class MockScanner {
  private callbacks: ScanCallback[] = [];
  private scanHistory: string[] = [];
  private isConnected: boolean = true;

  onScan(callback: ScanCallback): () => void {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    };
  }

  simulateScan(barcode: string): void {
    if (!this.isConnected) return;
    this.scanHistory.push(barcode);
    this.callbacks.forEach((cb) => cb(barcode));
  }

  getScanHistory(): string[] {
    return [...this.scanHistory];
  }

  getLastScan(): string | undefined {
    return this.scanHistory[this.scanHistory.length - 1];
  }

  getScanCount(): number {
    return this.scanHistory.length;
  }

  setConnected(connected: boolean): void {
    this.isConnected = connected;
  }

  checkConnection(): boolean {
    return this.isConnected;
  }

  reset(): void {
    this.callbacks = [];
    this.scanHistory = [];
    this.isConnected = true;
  }

  // Generate valid barcodes
  static generateEAN13(): string {
    const digits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
    const sum = digits.reduce((acc, d, i) => acc + d * (i % 2 === 0 ? 1 : 3), 0);
    const check = (10 - (sum % 10)) % 10;
    return digits.join('') + check;
  }

  static generateWeightCode(productCode: string, weight: number): string {
    // Prefixo 2 para código pesado
    const prefix = '2';
    const code = productCode.padStart(5, '0').substring(0, 5);
    const weightDigits = Math.round(weight * 1000)
      .toString()
      .padStart(5, '0');
    const partial = prefix + code + weightDigits;

    const digits = partial.split('').map(Number);
    const sum = digits.reduce((acc, d, i) => acc + d * (i % 2 === 0 ? 1 : 3), 0);
    const check = (10 - (sum % 10)) % 10;

    return partial + check;
  }
}

export const createMockScanner = () => new MockScanner();
