declare module "node-firebird" {
  interface FirebirdConfig {
    host?: string;
    port?: number;
    database: string;
    user: string;
    password: string;
    lowercase_keys?: boolean;
    role?: string | null;
    pageSize?: number;
  }

  interface FirebirdDatabase {
    query(
      sql: string,
      params?: any[],
      callback?: (err: Error | null, result: any[]) => void
    ): void;
    exec(
      sql: string,
      params?: any[],
      callback?: (err: Error | null, result: any) => void
    ): void;
    detach(): void;
    commit(callback?: (err: Error | null) => void): void;
  }

  function attach(
    config: FirebirdConfig,
    callback: (err: Error | null, db?: FirebirdDatabase) => void
  ): void;

  export { attach };
}