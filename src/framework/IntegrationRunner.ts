export interface IntegrationDependency {
  name: string;
  available: boolean;
}

export interface IntegrationCheckResult {
  canRun: boolean;
  unavailableDependencies: string[];
}

export class IntegrationRunner {
  checkDependencies(dependencies: IntegrationDependency[]): IntegrationCheckResult {
    const unavailableDependencies = dependencies
      .filter(dependency => !dependency.available)
      .map(dependency => dependency.name);

    return {
      canRun: unavailableDependencies.length === 0,
      unavailableDependencies
    };
  }
}
