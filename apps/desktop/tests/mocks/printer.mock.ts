/**
 * @file printer.mock.ts - Mock de impressora térmica ESC/POS
 */

export class MockPrinter {
  private buffer: number[] = [];
  private printHistory: Uint8Array[] = [];

  print(data: Uint8Array): void {
    this.buffer.push(...Array.from(data));
    this.printHistory.push(new Uint8Array(data));
  }

  getBuffer(): Uint8Array {
    return new Uint8Array(this.buffer);
  }

  getBufferAsString(): string {
    return String.fromCharCode(...this.buffer.filter((b) => b >= 32 && b < 127));
  }

  containsText(text: string): boolean {
    return this.getBufferAsString().includes(text);
  }

  containsCommand(command: number[]): boolean {
    const bufferStr = this.buffer.join(',');
    const cmdStr = command.join(',');
    return bufferStr.includes(cmdStr);
  }

  getPrintCount(): number {
    return this.printHistory.length;
  }

  reset(): void {
    this.buffer = [];
    this.printHistory = [];
  }

  // ESC/POS command checks
  hasInitCommand(): boolean {
    return this.containsCommand([0x1b, 0x40]); // ESC @
  }

  hasCutCommand(): boolean {
    return this.containsCommand([0x1d, 0x56]); // GS V
  }

  hasDrawerCommand(): boolean {
    return this.containsCommand([0x1b, 0x70]); // ESC p
  }

  hasBoldOn(): boolean {
    return this.containsCommand([0x1b, 0x45, 0x01]); // ESC E 1
  }

  hasCenterAlign(): boolean {
    return this.containsCommand([0x1b, 0x61, 0x01]); // ESC a 1
  }
}

export const createMockPrinter = () => new MockPrinter();
