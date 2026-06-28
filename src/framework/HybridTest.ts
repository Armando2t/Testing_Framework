export type TestCallback = () => void | Promise<void>;

export interface HybridTestCase {
  name: string;
  type: 'unit' | 'integration' | 'generated';
  callback: TestCallback;
}

export class HybridTest {
  private readonly testCases: HybridTestCase[] = [];

  addUnitTest(name: string, callback: TestCallback): void {
    this.testCases.push({
      name,
      type: 'unit',
      callback
    });
  }

  addIntegrationTest(name: string, callback: TestCallback): void {
    this.testCases.push({
      name,
      type: 'integration',
      callback
    });
  }

  addGeneratedTest(name: string, callback: TestCallback): void {
    this.testCases.push({
      name,
      type: 'generated',
      callback
    });
  }

  getTests(): HybridTestCase[] {
    return this.testCases;
  }

  countByType(type: HybridTestCase['type']): number {
    return this.testCases.filter(testCase => testCase.type === type).length;
  }
}
