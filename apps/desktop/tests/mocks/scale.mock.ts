/**
 * @file scale.mock.ts - Mock de balança serial
 */

export class MockScale {
  private currentWeight: number = 0;
  private isStable: boolean = true;
  private isConnected: boolean = true;

  setWeight(weight: number): void {
    this.currentWeight = Math.max(0, weight);
  }

  getWeight(): number {
    if (!this.isConnected) throw new Error('Scale not connected');
    return this.currentWeight;
  }

  setStable(stable: boolean): void {
    this.isStable = stable;
  }

  isWeightStable(): boolean {
    return this.isStable;
  }

  setConnected(connected: boolean): void {
    this.isConnected = connected;
  }

  checkConnection(): boolean {
    return this.isConnected;
  }

  // Simulate weight reading (like Toledo/Filizola protocol)
  readProtocolResponse(): string {
    const signal = this.currentWeight >= 0 ? '+' : '-';
    const weight = Math.abs(this.currentWeight).toFixed(3).padStart(7, '0');
    const stableChar = this.isStable ? 'S' : 'I';
    return `${stableChar}${signal}${weight}\r\n`;
  }

  // Simulate weight fluctuation
  simulateFluctuation(variance: number = 0.002): void {
    if (this.currentWeight > 0) {
      const change = (Math.random() - 0.5) * 2 * variance;
      this.currentWeight = Math.max(0, this.currentWeight + change);
    }
  }

  reset(): void {
    this.currentWeight = 0;
    this.isStable = true;
    this.isConnected = true;
  }
}

export const createMockScale = (initialWeight: number = 0) => {
  const scale = new MockScale();
  scale.setWeight(initialWeight);
  return scale;
};
