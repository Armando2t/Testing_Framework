export interface SpyCall<TArgs extends unknown[]> {
  args: TArgs;
  timestamp: Date;
}

export class CustomSpy<TFunction extends (...args: any[]) => any> {
  private readonly calls: SpyCall<Parameters<TFunction>>[] = [];

  constructor(
    private readonly implementation: TFunction
  ) {}

  execute(...args: Parameters<TFunction>): ReturnType<TFunction> {
    this.calls.push({
      args,
      timestamp: new Date()
    });

    return this.implementation(...args);
  }

  getCallCount(): number {
    return this.calls.length;
  }

  getCalls(): SpyCall<Parameters<TFunction>>[] {
    return this.calls;
  }

  wasCalledWith(...expectedArgs: Parameters<TFunction>): boolean {
    return this.calls.some(call =>
      JSON.stringify(call.args) === JSON.stringify(expectedArgs)
    );
  }
}