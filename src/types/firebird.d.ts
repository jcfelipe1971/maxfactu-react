declare module "node-firebird" {
  export interface Options {
    host?: string;
    port?: number;
    database: string;
    user: string;
    password: string;
    lowercase_keys?: boolean;
    role?: string | null;
    pageSize?: number;
  }

  export interface Database {
    query(
      sql: string,
      params?: unknown[],
      callback?: (err: Error | null, result: unknown[]) => void,
    ): void;
    exec(
      sql: string,
      params?: unknown[],
      callback?: (err: Error | null, result: unknown) => void,
    ): void;
    detach(): void;
    commit(callback?: (err: Error | null) => void): void;
  }

  const firebird: {
    attach(config: Options, callback: (err: Error | null, db?: Database) => void): void;
  };

  export default firebird;
}
