
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model accounts
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type accounts = $Result.DefaultSelection<Prisma.$accountsPayload>
/**
 * Model mfa_codes
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type mfa_codes = $Result.DefaultSelection<Prisma.$mfa_codesPayload>
/**
 * Model transactions
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type transactions = $Result.DefaultSelection<Prisma.$transactionsPayload>
/**
 * Model users
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type users = $Result.DefaultSelection<Prisma.$usersPayload>
/**
 * Model sinpe_subscriptions
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type sinpe_subscriptions = $Result.DefaultSelection<Prisma.$sinpe_subscriptionsPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const accounts_account_type: {
  CORRIENTE: 'CORRIENTE',
  AHORROS: 'AHORROS'
};

export type accounts_account_type = (typeof accounts_account_type)[keyof typeof accounts_account_type]


export const transactions_status: {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED'
};

export type transactions_status = (typeof transactions_status)[keyof typeof transactions_status]


export const accounts_status: {
  ACTIVO: 'ACTIVO',
  BLOQUEADO: 'BLOQUEADO',
  CERRADO: 'CERRADO'
};

export type accounts_status = (typeof accounts_status)[keyof typeof accounts_status]

}

export type accounts_account_type = $Enums.accounts_account_type

export const accounts_account_type: typeof $Enums.accounts_account_type

export type transactions_status = $Enums.transactions_status

export const transactions_status: typeof $Enums.transactions_status

export type accounts_status = $Enums.accounts_status

export const accounts_status: typeof $Enums.accounts_status

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Accounts
 * const accounts = await prisma.accounts.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Accounts
   * const accounts = await prisma.accounts.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.accounts`: Exposes CRUD operations for the **accounts** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.accounts.findMany()
    * ```
    */
  get accounts(): Prisma.accountsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.mfa_codes`: Exposes CRUD operations for the **mfa_codes** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Mfa_codes
    * const mfa_codes = await prisma.mfa_codes.findMany()
    * ```
    */
  get mfa_codes(): Prisma.mfa_codesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transactions`: Exposes CRUD operations for the **transactions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transactions
    * const transactions = await prisma.transactions.findMany()
    * ```
    */
  get transactions(): Prisma.transactionsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.users`: Exposes CRUD operations for the **users** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.users.findMany()
    * ```
    */
  get users(): Prisma.usersDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sinpe_subscriptions`: Exposes CRUD operations for the **sinpe_subscriptions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sinpe_subscriptions
    * const sinpe_subscriptions = await prisma.sinpe_subscriptions.findMany()
    * ```
    */
  get sinpe_subscriptions(): Prisma.sinpe_subscriptionsDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.9.0
   * Query Engine version: 81e4af48011447c3cc503a190e86995b66d2a28e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    accounts: 'accounts',
    mfa_codes: 'mfa_codes',
    transactions: 'transactions',
    users: 'users',
    sinpe_subscriptions: 'sinpe_subscriptions'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "accounts" | "mfa_codes" | "transactions" | "users" | "sinpe_subscriptions"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      accounts: {
        payload: Prisma.$accountsPayload<ExtArgs>
        fields: Prisma.accountsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.accountsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.accountsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>
          }
          findFirst: {
            args: Prisma.accountsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.accountsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>
          }
          findMany: {
            args: Prisma.accountsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>[]
          }
          create: {
            args: Prisma.accountsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>
          }
          createMany: {
            args: Prisma.accountsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.accountsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>
          }
          update: {
            args: Prisma.accountsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>
          }
          deleteMany: {
            args: Prisma.accountsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.accountsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.accountsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>
          }
          aggregate: {
            args: Prisma.AccountsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccounts>
          }
          groupBy: {
            args: Prisma.accountsGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountsGroupByOutputType>[]
          }
          count: {
            args: Prisma.accountsCountArgs<ExtArgs>
            result: $Utils.Optional<AccountsCountAggregateOutputType> | number
          }
        }
      }
      mfa_codes: {
        payload: Prisma.$mfa_codesPayload<ExtArgs>
        fields: Prisma.mfa_codesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.mfa_codesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mfa_codesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.mfa_codesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mfa_codesPayload>
          }
          findFirst: {
            args: Prisma.mfa_codesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mfa_codesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.mfa_codesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mfa_codesPayload>
          }
          findMany: {
            args: Prisma.mfa_codesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mfa_codesPayload>[]
          }
          create: {
            args: Prisma.mfa_codesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mfa_codesPayload>
          }
          createMany: {
            args: Prisma.mfa_codesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.mfa_codesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mfa_codesPayload>
          }
          update: {
            args: Prisma.mfa_codesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mfa_codesPayload>
          }
          deleteMany: {
            args: Prisma.mfa_codesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.mfa_codesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.mfa_codesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$mfa_codesPayload>
          }
          aggregate: {
            args: Prisma.Mfa_codesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMfa_codes>
          }
          groupBy: {
            args: Prisma.mfa_codesGroupByArgs<ExtArgs>
            result: $Utils.Optional<Mfa_codesGroupByOutputType>[]
          }
          count: {
            args: Prisma.mfa_codesCountArgs<ExtArgs>
            result: $Utils.Optional<Mfa_codesCountAggregateOutputType> | number
          }
        }
      }
      transactions: {
        payload: Prisma.$transactionsPayload<ExtArgs>
        fields: Prisma.transactionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.transactionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$transactionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.transactionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$transactionsPayload>
          }
          findFirst: {
            args: Prisma.transactionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$transactionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.transactionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$transactionsPayload>
          }
          findMany: {
            args: Prisma.transactionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$transactionsPayload>[]
          }
          create: {
            args: Prisma.transactionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$transactionsPayload>
          }
          createMany: {
            args: Prisma.transactionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.transactionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$transactionsPayload>
          }
          update: {
            args: Prisma.transactionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$transactionsPayload>
          }
          deleteMany: {
            args: Prisma.transactionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.transactionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.transactionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$transactionsPayload>
          }
          aggregate: {
            args: Prisma.TransactionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransactions>
          }
          groupBy: {
            args: Prisma.transactionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransactionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.transactionsCountArgs<ExtArgs>
            result: $Utils.Optional<TransactionsCountAggregateOutputType> | number
          }
        }
      }
      users: {
        payload: Prisma.$usersPayload<ExtArgs>
        fields: Prisma.usersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.usersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.usersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          findFirst: {
            args: Prisma.usersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.usersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          findMany: {
            args: Prisma.usersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          create: {
            args: Prisma.usersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          createMany: {
            args: Prisma.usersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.usersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          update: {
            args: Prisma.usersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          deleteMany: {
            args: Prisma.usersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.usersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.usersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          aggregate: {
            args: Prisma.UsersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsers>
          }
          groupBy: {
            args: Prisma.usersGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsersGroupByOutputType>[]
          }
          count: {
            args: Prisma.usersCountArgs<ExtArgs>
            result: $Utils.Optional<UsersCountAggregateOutputType> | number
          }
        }
      }
      sinpe_subscriptions: {
        payload: Prisma.$sinpe_subscriptionsPayload<ExtArgs>
        fields: Prisma.sinpe_subscriptionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.sinpe_subscriptionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sinpe_subscriptionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.sinpe_subscriptionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sinpe_subscriptionsPayload>
          }
          findFirst: {
            args: Prisma.sinpe_subscriptionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sinpe_subscriptionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.sinpe_subscriptionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sinpe_subscriptionsPayload>
          }
          findMany: {
            args: Prisma.sinpe_subscriptionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sinpe_subscriptionsPayload>[]
          }
          create: {
            args: Prisma.sinpe_subscriptionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sinpe_subscriptionsPayload>
          }
          createMany: {
            args: Prisma.sinpe_subscriptionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.sinpe_subscriptionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sinpe_subscriptionsPayload>
          }
          update: {
            args: Prisma.sinpe_subscriptionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sinpe_subscriptionsPayload>
          }
          deleteMany: {
            args: Prisma.sinpe_subscriptionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.sinpe_subscriptionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.sinpe_subscriptionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sinpe_subscriptionsPayload>
          }
          aggregate: {
            args: Prisma.Sinpe_subscriptionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSinpe_subscriptions>
          }
          groupBy: {
            args: Prisma.sinpe_subscriptionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Sinpe_subscriptionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.sinpe_subscriptionsCountArgs<ExtArgs>
            result: $Utils.Optional<Sinpe_subscriptionsCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    accounts?: accountsOmit
    mfa_codes?: mfa_codesOmit
    transactions?: transactionsOmit
    users?: usersOmit
    sinpe_subscriptions?: sinpe_subscriptionsOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AccountsCountOutputType
   */

  export type AccountsCountOutputType = {
    users: number
  }

  export type AccountsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | AccountsCountOutputTypeCountUsersArgs
  }

  // Custom InputTypes
  /**
   * AccountsCountOutputType without action
   */
  export type AccountsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountsCountOutputType
     */
    select?: AccountsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AccountsCountOutputType without action
   */
  export type AccountsCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: usersWhereInput
  }


  /**
   * Count Type UsersCountOutputType
   */

  export type UsersCountOutputType = {
    mfa_codes: number
  }

  export type UsersCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mfa_codes?: boolean | UsersCountOutputTypeCountMfa_codesArgs
  }

  // Custom InputTypes
  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsersCountOutputType
     */
    select?: UsersCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountMfa_codesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: mfa_codesWhereInput
  }


  /**
   * Models
   */

  /**
   * Model accounts
   */

  export type AggregateAccounts = {
    _count: AccountsCountAggregateOutputType | null
    _avg: AccountsAvgAggregateOutputType | null
    _sum: AccountsSumAggregateOutputType | null
    _min: AccountsMinAggregateOutputType | null
    _max: AccountsMaxAggregateOutputType | null
  }

  export type AccountsAvgAggregateOutputType = {
    balance: Decimal | null
  }

  export type AccountsSumAggregateOutputType = {
    balance: Decimal | null
  }

  export type AccountsMinAggregateOutputType = {
    iban: string | null
    account_number: string | null
    account_type: $Enums.accounts_account_type | null
    account_holder: string | null
    balance: Decimal | null
    status: $Enums.accounts_status | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type AccountsMaxAggregateOutputType = {
    iban: string | null
    account_number: string | null
    account_type: $Enums.accounts_account_type | null
    account_holder: string | null
    balance: Decimal | null
    status: $Enums.accounts_status | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type AccountsCountAggregateOutputType = {
    iban: number
    account_number: number
    account_type: number
    account_holder: number
    balance: number
    status: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type AccountsAvgAggregateInputType = {
    balance?: true
  }

  export type AccountsSumAggregateInputType = {
    balance?: true
  }

  export type AccountsMinAggregateInputType = {
    iban?: true
    account_number?: true
    account_type?: true
    account_holder?: true
    balance?: true
    status?: true
    created_at?: true
    updated_at?: true
  }

  export type AccountsMaxAggregateInputType = {
    iban?: true
    account_number?: true
    account_type?: true
    account_holder?: true
    balance?: true
    status?: true
    created_at?: true
    updated_at?: true
  }

  export type AccountsCountAggregateInputType = {
    iban?: true
    account_number?: true
    account_type?: true
    account_holder?: true
    balance?: true
    status?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type AccountsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which accounts to aggregate.
     */
    where?: accountsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts to fetch.
     */
    orderBy?: accountsOrderByWithRelationInput | accountsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: accountsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned accounts
    **/
    _count?: true | AccountsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountsMaxAggregateInputType
  }

  export type GetAccountsAggregateType<T extends AccountsAggregateArgs> = {
        [P in keyof T & keyof AggregateAccounts]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccounts[P]>
      : GetScalarType<T[P], AggregateAccounts[P]>
  }




  export type accountsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: accountsWhereInput
    orderBy?: accountsOrderByWithAggregationInput | accountsOrderByWithAggregationInput[]
    by: AccountsScalarFieldEnum[] | AccountsScalarFieldEnum
    having?: accountsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountsCountAggregateInputType | true
    _avg?: AccountsAvgAggregateInputType
    _sum?: AccountsSumAggregateInputType
    _min?: AccountsMinAggregateInputType
    _max?: AccountsMaxAggregateInputType
  }

  export type AccountsGroupByOutputType = {
    iban: string
    account_number: string
    account_type: $Enums.accounts_account_type
    account_holder: string
    balance: Decimal
    status: $Enums.accounts_status
    created_at: Date
    updated_at: Date
    _count: AccountsCountAggregateOutputType | null
    _avg: AccountsAvgAggregateOutputType | null
    _sum: AccountsSumAggregateOutputType | null
    _min: AccountsMinAggregateOutputType | null
    _max: AccountsMaxAggregateOutputType | null
  }

  type GetAccountsGroupByPayload<T extends accountsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountsGroupByOutputType[P]>
            : GetScalarType<T[P], AccountsGroupByOutputType[P]>
        }
      >
    >


  export type accountsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    iban?: boolean
    account_number?: boolean
    account_type?: boolean
    account_holder?: boolean
    balance?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    users?: boolean | accounts$usersArgs<ExtArgs>
    _count?: boolean | AccountsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["accounts"]>



  export type accountsSelectScalar = {
    iban?: boolean
    account_number?: boolean
    account_type?: boolean
    account_holder?: boolean
    balance?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type accountsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"iban" | "account_number" | "account_type" | "account_holder" | "balance" | "status" | "created_at" | "updated_at", ExtArgs["result"]["accounts"]>
  export type accountsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | accounts$usersArgs<ExtArgs>
    _count?: boolean | AccountsCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $accountsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "accounts"
    objects: {
      users: Prisma.$usersPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      iban: string
      account_number: string
      account_type: $Enums.accounts_account_type
      account_holder: string
      balance: Prisma.Decimal
      status: $Enums.accounts_status
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["accounts"]>
    composites: {}
  }

  type accountsGetPayload<S extends boolean | null | undefined | accountsDefaultArgs> = $Result.GetResult<Prisma.$accountsPayload, S>

  type accountsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<accountsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountsCountAggregateInputType | true
    }

  export interface accountsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['accounts'], meta: { name: 'accounts' } }
    /**
     * Find zero or one Accounts that matches the filter.
     * @param {accountsFindUniqueArgs} args - Arguments to find a Accounts
     * @example
     * // Get one Accounts
     * const accounts = await prisma.accounts.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends accountsFindUniqueArgs>(args: SelectSubset<T, accountsFindUniqueArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Accounts that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {accountsFindUniqueOrThrowArgs} args - Arguments to find a Accounts
     * @example
     * // Get one Accounts
     * const accounts = await prisma.accounts.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends accountsFindUniqueOrThrowArgs>(args: SelectSubset<T, accountsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountsFindFirstArgs} args - Arguments to find a Accounts
     * @example
     * // Get one Accounts
     * const accounts = await prisma.accounts.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends accountsFindFirstArgs>(args?: SelectSubset<T, accountsFindFirstArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Accounts that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountsFindFirstOrThrowArgs} args - Arguments to find a Accounts
     * @example
     * // Get one Accounts
     * const accounts = await prisma.accounts.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends accountsFindFirstOrThrowArgs>(args?: SelectSubset<T, accountsFindFirstOrThrowArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.accounts.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.accounts.findMany({ take: 10 })
     * 
     * // Only select the `iban`
     * const accountsWithIbanOnly = await prisma.accounts.findMany({ select: { iban: true } })
     * 
     */
    findMany<T extends accountsFindManyArgs>(args?: SelectSubset<T, accountsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Accounts.
     * @param {accountsCreateArgs} args - Arguments to create a Accounts.
     * @example
     * // Create one Accounts
     * const Accounts = await prisma.accounts.create({
     *   data: {
     *     // ... data to create a Accounts
     *   }
     * })
     * 
     */
    create<T extends accountsCreateArgs>(args: SelectSubset<T, accountsCreateArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {accountsCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const accounts = await prisma.accounts.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends accountsCreateManyArgs>(args?: SelectSubset<T, accountsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Accounts.
     * @param {accountsDeleteArgs} args - Arguments to delete one Accounts.
     * @example
     * // Delete one Accounts
     * const Accounts = await prisma.accounts.delete({
     *   where: {
     *     // ... filter to delete one Accounts
     *   }
     * })
     * 
     */
    delete<T extends accountsDeleteArgs>(args: SelectSubset<T, accountsDeleteArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Accounts.
     * @param {accountsUpdateArgs} args - Arguments to update one Accounts.
     * @example
     * // Update one Accounts
     * const accounts = await prisma.accounts.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends accountsUpdateArgs>(args: SelectSubset<T, accountsUpdateArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {accountsDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.accounts.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends accountsDeleteManyArgs>(args?: SelectSubset<T, accountsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const accounts = await prisma.accounts.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends accountsUpdateManyArgs>(args: SelectSubset<T, accountsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Accounts.
     * @param {accountsUpsertArgs} args - Arguments to update or create a Accounts.
     * @example
     * // Update or create a Accounts
     * const accounts = await prisma.accounts.upsert({
     *   create: {
     *     // ... data to create a Accounts
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Accounts we want to update
     *   }
     * })
     */
    upsert<T extends accountsUpsertArgs>(args: SelectSubset<T, accountsUpsertArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountsCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.accounts.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends accountsCountArgs>(
      args?: Subset<T, accountsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountsAggregateArgs>(args: Subset<T, AccountsAggregateArgs>): Prisma.PrismaPromise<GetAccountsAggregateType<T>>

    /**
     * Group by Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends accountsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: accountsGroupByArgs['orderBy'] }
        : { orderBy?: accountsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, accountsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the accounts model
   */
  readonly fields: accountsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for accounts.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__accountsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends accounts$usersArgs<ExtArgs> = {}>(args?: Subset<T, accounts$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the accounts model
   */
  interface accountsFieldRefs {
    readonly iban: FieldRef<"accounts", 'String'>
    readonly account_number: FieldRef<"accounts", 'String'>
    readonly account_type: FieldRef<"accounts", 'accounts_account_type'>
    readonly account_holder: FieldRef<"accounts", 'String'>
    readonly balance: FieldRef<"accounts", 'Decimal'>
    readonly status: FieldRef<"accounts", 'accounts_status'>
    readonly created_at: FieldRef<"accounts", 'DateTime'>
    readonly updated_at: FieldRef<"accounts", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * accounts findUnique
   */
  export type accountsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * Filter, which accounts to fetch.
     */
    where: accountsWhereUniqueInput
  }

  /**
   * accounts findUniqueOrThrow
   */
  export type accountsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * Filter, which accounts to fetch.
     */
    where: accountsWhereUniqueInput
  }

  /**
   * accounts findFirst
   */
  export type accountsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * Filter, which accounts to fetch.
     */
    where?: accountsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts to fetch.
     */
    orderBy?: accountsOrderByWithRelationInput | accountsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for accounts.
     */
    cursor?: accountsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of accounts.
     */
    distinct?: AccountsScalarFieldEnum | AccountsScalarFieldEnum[]
  }

  /**
   * accounts findFirstOrThrow
   */
  export type accountsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * Filter, which accounts to fetch.
     */
    where?: accountsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts to fetch.
     */
    orderBy?: accountsOrderByWithRelationInput | accountsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for accounts.
     */
    cursor?: accountsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of accounts.
     */
    distinct?: AccountsScalarFieldEnum | AccountsScalarFieldEnum[]
  }

  /**
   * accounts findMany
   */
  export type accountsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * Filter, which accounts to fetch.
     */
    where?: accountsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts to fetch.
     */
    orderBy?: accountsOrderByWithRelationInput | accountsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing accounts.
     */
    cursor?: accountsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts.
     */
    skip?: number
    distinct?: AccountsScalarFieldEnum | AccountsScalarFieldEnum[]
  }

  /**
   * accounts create
   */
  export type accountsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * The data needed to create a accounts.
     */
    data: XOR<accountsCreateInput, accountsUncheckedCreateInput>
  }

  /**
   * accounts createMany
   */
  export type accountsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many accounts.
     */
    data: accountsCreateManyInput | accountsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * accounts update
   */
  export type accountsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * The data needed to update a accounts.
     */
    data: XOR<accountsUpdateInput, accountsUncheckedUpdateInput>
    /**
     * Choose, which accounts to update.
     */
    where: accountsWhereUniqueInput
  }

  /**
   * accounts updateMany
   */
  export type accountsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update accounts.
     */
    data: XOR<accountsUpdateManyMutationInput, accountsUncheckedUpdateManyInput>
    /**
     * Filter which accounts to update
     */
    where?: accountsWhereInput
    /**
     * Limit how many accounts to update.
     */
    limit?: number
  }

  /**
   * accounts upsert
   */
  export type accountsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * The filter to search for the accounts to update in case it exists.
     */
    where: accountsWhereUniqueInput
    /**
     * In case the accounts found by the `where` argument doesn't exist, create a new accounts with this data.
     */
    create: XOR<accountsCreateInput, accountsUncheckedCreateInput>
    /**
     * In case the accounts was found with the provided `where` argument, update it with this data.
     */
    update: XOR<accountsUpdateInput, accountsUncheckedUpdateInput>
  }

  /**
   * accounts delete
   */
  export type accountsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * Filter which accounts to delete.
     */
    where: accountsWhereUniqueInput
  }

  /**
   * accounts deleteMany
   */
  export type accountsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which accounts to delete
     */
    where?: accountsWhereInput
    /**
     * Limit how many accounts to delete.
     */
    limit?: number
  }

  /**
   * accounts.users
   */
  export type accounts$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    where?: usersWhereInput
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    cursor?: usersWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * accounts without action
   */
  export type accountsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
  }


  /**
   * Model mfa_codes
   */

  export type AggregateMfa_codes = {
    _count: Mfa_codesCountAggregateOutputType | null
    _avg: Mfa_codesAvgAggregateOutputType | null
    _sum: Mfa_codesSumAggregateOutputType | null
    _min: Mfa_codesMinAggregateOutputType | null
    _max: Mfa_codesMaxAggregateOutputType | null
  }

  export type Mfa_codesAvgAggregateOutputType = {
    id: number | null
  }

  export type Mfa_codesSumAggregateOutputType = {
    id: number | null
  }

  export type Mfa_codesMinAggregateOutputType = {
    id: number | null
    user_id: string | null
    mfa_code: string | null
    created_at: Date | null
    expires_at: Date | null
    used: boolean | null
  }

  export type Mfa_codesMaxAggregateOutputType = {
    id: number | null
    user_id: string | null
    mfa_code: string | null
    created_at: Date | null
    expires_at: Date | null
    used: boolean | null
  }

  export type Mfa_codesCountAggregateOutputType = {
    id: number
    user_id: number
    mfa_code: number
    created_at: number
    expires_at: number
    used: number
    _all: number
  }


  export type Mfa_codesAvgAggregateInputType = {
    id?: true
  }

  export type Mfa_codesSumAggregateInputType = {
    id?: true
  }

  export type Mfa_codesMinAggregateInputType = {
    id?: true
    user_id?: true
    mfa_code?: true
    created_at?: true
    expires_at?: true
    used?: true
  }

  export type Mfa_codesMaxAggregateInputType = {
    id?: true
    user_id?: true
    mfa_code?: true
    created_at?: true
    expires_at?: true
    used?: true
  }

  export type Mfa_codesCountAggregateInputType = {
    id?: true
    user_id?: true
    mfa_code?: true
    created_at?: true
    expires_at?: true
    used?: true
    _all?: true
  }

  export type Mfa_codesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which mfa_codes to aggregate.
     */
    where?: mfa_codesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of mfa_codes to fetch.
     */
    orderBy?: mfa_codesOrderByWithRelationInput | mfa_codesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: mfa_codesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` mfa_codes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` mfa_codes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned mfa_codes
    **/
    _count?: true | Mfa_codesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Mfa_codesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Mfa_codesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Mfa_codesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Mfa_codesMaxAggregateInputType
  }

  export type GetMfa_codesAggregateType<T extends Mfa_codesAggregateArgs> = {
        [P in keyof T & keyof AggregateMfa_codes]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMfa_codes[P]>
      : GetScalarType<T[P], AggregateMfa_codes[P]>
  }




  export type mfa_codesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: mfa_codesWhereInput
    orderBy?: mfa_codesOrderByWithAggregationInput | mfa_codesOrderByWithAggregationInput[]
    by: Mfa_codesScalarFieldEnum[] | Mfa_codesScalarFieldEnum
    having?: mfa_codesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Mfa_codesCountAggregateInputType | true
    _avg?: Mfa_codesAvgAggregateInputType
    _sum?: Mfa_codesSumAggregateInputType
    _min?: Mfa_codesMinAggregateInputType
    _max?: Mfa_codesMaxAggregateInputType
  }

  export type Mfa_codesGroupByOutputType = {
    id: number
    user_id: string
    mfa_code: string
    created_at: Date
    expires_at: Date
    used: boolean
    _count: Mfa_codesCountAggregateOutputType | null
    _avg: Mfa_codesAvgAggregateOutputType | null
    _sum: Mfa_codesSumAggregateOutputType | null
    _min: Mfa_codesMinAggregateOutputType | null
    _max: Mfa_codesMaxAggregateOutputType | null
  }

  type GetMfa_codesGroupByPayload<T extends mfa_codesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Mfa_codesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Mfa_codesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Mfa_codesGroupByOutputType[P]>
            : GetScalarType<T[P], Mfa_codesGroupByOutputType[P]>
        }
      >
    >


  export type mfa_codesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    mfa_code?: boolean
    created_at?: boolean
    expires_at?: boolean
    used?: boolean
    users?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mfa_codes"]>



  export type mfa_codesSelectScalar = {
    id?: boolean
    user_id?: boolean
    mfa_code?: boolean
    created_at?: boolean
    expires_at?: boolean
    used?: boolean
  }

  export type mfa_codesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "mfa_code" | "created_at" | "expires_at" | "used", ExtArgs["result"]["mfa_codes"]>
  export type mfa_codesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | usersDefaultArgs<ExtArgs>
  }

  export type $mfa_codesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "mfa_codes"
    objects: {
      users: Prisma.$usersPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      user_id: string
      mfa_code: string
      created_at: Date
      expires_at: Date
      used: boolean
    }, ExtArgs["result"]["mfa_codes"]>
    composites: {}
  }

  type mfa_codesGetPayload<S extends boolean | null | undefined | mfa_codesDefaultArgs> = $Result.GetResult<Prisma.$mfa_codesPayload, S>

  type mfa_codesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<mfa_codesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Mfa_codesCountAggregateInputType | true
    }

  export interface mfa_codesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['mfa_codes'], meta: { name: 'mfa_codes' } }
    /**
     * Find zero or one Mfa_codes that matches the filter.
     * @param {mfa_codesFindUniqueArgs} args - Arguments to find a Mfa_codes
     * @example
     * // Get one Mfa_codes
     * const mfa_codes = await prisma.mfa_codes.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends mfa_codesFindUniqueArgs>(args: SelectSubset<T, mfa_codesFindUniqueArgs<ExtArgs>>): Prisma__mfa_codesClient<$Result.GetResult<Prisma.$mfa_codesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Mfa_codes that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {mfa_codesFindUniqueOrThrowArgs} args - Arguments to find a Mfa_codes
     * @example
     * // Get one Mfa_codes
     * const mfa_codes = await prisma.mfa_codes.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends mfa_codesFindUniqueOrThrowArgs>(args: SelectSubset<T, mfa_codesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__mfa_codesClient<$Result.GetResult<Prisma.$mfa_codesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Mfa_codes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {mfa_codesFindFirstArgs} args - Arguments to find a Mfa_codes
     * @example
     * // Get one Mfa_codes
     * const mfa_codes = await prisma.mfa_codes.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends mfa_codesFindFirstArgs>(args?: SelectSubset<T, mfa_codesFindFirstArgs<ExtArgs>>): Prisma__mfa_codesClient<$Result.GetResult<Prisma.$mfa_codesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Mfa_codes that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {mfa_codesFindFirstOrThrowArgs} args - Arguments to find a Mfa_codes
     * @example
     * // Get one Mfa_codes
     * const mfa_codes = await prisma.mfa_codes.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends mfa_codesFindFirstOrThrowArgs>(args?: SelectSubset<T, mfa_codesFindFirstOrThrowArgs<ExtArgs>>): Prisma__mfa_codesClient<$Result.GetResult<Prisma.$mfa_codesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Mfa_codes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {mfa_codesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Mfa_codes
     * const mfa_codes = await prisma.mfa_codes.findMany()
     * 
     * // Get first 10 Mfa_codes
     * const mfa_codes = await prisma.mfa_codes.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mfa_codesWithIdOnly = await prisma.mfa_codes.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends mfa_codesFindManyArgs>(args?: SelectSubset<T, mfa_codesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$mfa_codesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Mfa_codes.
     * @param {mfa_codesCreateArgs} args - Arguments to create a Mfa_codes.
     * @example
     * // Create one Mfa_codes
     * const Mfa_codes = await prisma.mfa_codes.create({
     *   data: {
     *     // ... data to create a Mfa_codes
     *   }
     * })
     * 
     */
    create<T extends mfa_codesCreateArgs>(args: SelectSubset<T, mfa_codesCreateArgs<ExtArgs>>): Prisma__mfa_codesClient<$Result.GetResult<Prisma.$mfa_codesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Mfa_codes.
     * @param {mfa_codesCreateManyArgs} args - Arguments to create many Mfa_codes.
     * @example
     * // Create many Mfa_codes
     * const mfa_codes = await prisma.mfa_codes.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends mfa_codesCreateManyArgs>(args?: SelectSubset<T, mfa_codesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Mfa_codes.
     * @param {mfa_codesDeleteArgs} args - Arguments to delete one Mfa_codes.
     * @example
     * // Delete one Mfa_codes
     * const Mfa_codes = await prisma.mfa_codes.delete({
     *   where: {
     *     // ... filter to delete one Mfa_codes
     *   }
     * })
     * 
     */
    delete<T extends mfa_codesDeleteArgs>(args: SelectSubset<T, mfa_codesDeleteArgs<ExtArgs>>): Prisma__mfa_codesClient<$Result.GetResult<Prisma.$mfa_codesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Mfa_codes.
     * @param {mfa_codesUpdateArgs} args - Arguments to update one Mfa_codes.
     * @example
     * // Update one Mfa_codes
     * const mfa_codes = await prisma.mfa_codes.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends mfa_codesUpdateArgs>(args: SelectSubset<T, mfa_codesUpdateArgs<ExtArgs>>): Prisma__mfa_codesClient<$Result.GetResult<Prisma.$mfa_codesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Mfa_codes.
     * @param {mfa_codesDeleteManyArgs} args - Arguments to filter Mfa_codes to delete.
     * @example
     * // Delete a few Mfa_codes
     * const { count } = await prisma.mfa_codes.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends mfa_codesDeleteManyArgs>(args?: SelectSubset<T, mfa_codesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Mfa_codes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {mfa_codesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Mfa_codes
     * const mfa_codes = await prisma.mfa_codes.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends mfa_codesUpdateManyArgs>(args: SelectSubset<T, mfa_codesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Mfa_codes.
     * @param {mfa_codesUpsertArgs} args - Arguments to update or create a Mfa_codes.
     * @example
     * // Update or create a Mfa_codes
     * const mfa_codes = await prisma.mfa_codes.upsert({
     *   create: {
     *     // ... data to create a Mfa_codes
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Mfa_codes we want to update
     *   }
     * })
     */
    upsert<T extends mfa_codesUpsertArgs>(args: SelectSubset<T, mfa_codesUpsertArgs<ExtArgs>>): Prisma__mfa_codesClient<$Result.GetResult<Prisma.$mfa_codesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Mfa_codes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {mfa_codesCountArgs} args - Arguments to filter Mfa_codes to count.
     * @example
     * // Count the number of Mfa_codes
     * const count = await prisma.mfa_codes.count({
     *   where: {
     *     // ... the filter for the Mfa_codes we want to count
     *   }
     * })
    **/
    count<T extends mfa_codesCountArgs>(
      args?: Subset<T, mfa_codesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Mfa_codesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Mfa_codes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Mfa_codesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Mfa_codesAggregateArgs>(args: Subset<T, Mfa_codesAggregateArgs>): Prisma.PrismaPromise<GetMfa_codesAggregateType<T>>

    /**
     * Group by Mfa_codes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {mfa_codesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends mfa_codesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: mfa_codesGroupByArgs['orderBy'] }
        : { orderBy?: mfa_codesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, mfa_codesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMfa_codesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the mfa_codes model
   */
  readonly fields: mfa_codesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for mfa_codes.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__mfa_codesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends usersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, usersDefaultArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the mfa_codes model
   */
  interface mfa_codesFieldRefs {
    readonly id: FieldRef<"mfa_codes", 'Int'>
    readonly user_id: FieldRef<"mfa_codes", 'String'>
    readonly mfa_code: FieldRef<"mfa_codes", 'String'>
    readonly created_at: FieldRef<"mfa_codes", 'DateTime'>
    readonly expires_at: FieldRef<"mfa_codes", 'DateTime'>
    readonly used: FieldRef<"mfa_codes", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * mfa_codes findUnique
   */
  export type mfa_codesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mfa_codes
     */
    select?: mfa_codesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mfa_codes
     */
    omit?: mfa_codesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: mfa_codesInclude<ExtArgs> | null
    /**
     * Filter, which mfa_codes to fetch.
     */
    where: mfa_codesWhereUniqueInput
  }

  /**
   * mfa_codes findUniqueOrThrow
   */
  export type mfa_codesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mfa_codes
     */
    select?: mfa_codesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mfa_codes
     */
    omit?: mfa_codesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: mfa_codesInclude<ExtArgs> | null
    /**
     * Filter, which mfa_codes to fetch.
     */
    where: mfa_codesWhereUniqueInput
  }

  /**
   * mfa_codes findFirst
   */
  export type mfa_codesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mfa_codes
     */
    select?: mfa_codesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mfa_codes
     */
    omit?: mfa_codesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: mfa_codesInclude<ExtArgs> | null
    /**
     * Filter, which mfa_codes to fetch.
     */
    where?: mfa_codesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of mfa_codes to fetch.
     */
    orderBy?: mfa_codesOrderByWithRelationInput | mfa_codesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for mfa_codes.
     */
    cursor?: mfa_codesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` mfa_codes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` mfa_codes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of mfa_codes.
     */
    distinct?: Mfa_codesScalarFieldEnum | Mfa_codesScalarFieldEnum[]
  }

  /**
   * mfa_codes findFirstOrThrow
   */
  export type mfa_codesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mfa_codes
     */
    select?: mfa_codesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mfa_codes
     */
    omit?: mfa_codesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: mfa_codesInclude<ExtArgs> | null
    /**
     * Filter, which mfa_codes to fetch.
     */
    where?: mfa_codesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of mfa_codes to fetch.
     */
    orderBy?: mfa_codesOrderByWithRelationInput | mfa_codesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for mfa_codes.
     */
    cursor?: mfa_codesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` mfa_codes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` mfa_codes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of mfa_codes.
     */
    distinct?: Mfa_codesScalarFieldEnum | Mfa_codesScalarFieldEnum[]
  }

  /**
   * mfa_codes findMany
   */
  export type mfa_codesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mfa_codes
     */
    select?: mfa_codesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mfa_codes
     */
    omit?: mfa_codesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: mfa_codesInclude<ExtArgs> | null
    /**
     * Filter, which mfa_codes to fetch.
     */
    where?: mfa_codesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of mfa_codes to fetch.
     */
    orderBy?: mfa_codesOrderByWithRelationInput | mfa_codesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing mfa_codes.
     */
    cursor?: mfa_codesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` mfa_codes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` mfa_codes.
     */
    skip?: number
    distinct?: Mfa_codesScalarFieldEnum | Mfa_codesScalarFieldEnum[]
  }

  /**
   * mfa_codes create
   */
  export type mfa_codesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mfa_codes
     */
    select?: mfa_codesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mfa_codes
     */
    omit?: mfa_codesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: mfa_codesInclude<ExtArgs> | null
    /**
     * The data needed to create a mfa_codes.
     */
    data: XOR<mfa_codesCreateInput, mfa_codesUncheckedCreateInput>
  }

  /**
   * mfa_codes createMany
   */
  export type mfa_codesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many mfa_codes.
     */
    data: mfa_codesCreateManyInput | mfa_codesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * mfa_codes update
   */
  export type mfa_codesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mfa_codes
     */
    select?: mfa_codesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mfa_codes
     */
    omit?: mfa_codesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: mfa_codesInclude<ExtArgs> | null
    /**
     * The data needed to update a mfa_codes.
     */
    data: XOR<mfa_codesUpdateInput, mfa_codesUncheckedUpdateInput>
    /**
     * Choose, which mfa_codes to update.
     */
    where: mfa_codesWhereUniqueInput
  }

  /**
   * mfa_codes updateMany
   */
  export type mfa_codesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update mfa_codes.
     */
    data: XOR<mfa_codesUpdateManyMutationInput, mfa_codesUncheckedUpdateManyInput>
    /**
     * Filter which mfa_codes to update
     */
    where?: mfa_codesWhereInput
    /**
     * Limit how many mfa_codes to update.
     */
    limit?: number
  }

  /**
   * mfa_codes upsert
   */
  export type mfa_codesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mfa_codes
     */
    select?: mfa_codesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mfa_codes
     */
    omit?: mfa_codesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: mfa_codesInclude<ExtArgs> | null
    /**
     * The filter to search for the mfa_codes to update in case it exists.
     */
    where: mfa_codesWhereUniqueInput
    /**
     * In case the mfa_codes found by the `where` argument doesn't exist, create a new mfa_codes with this data.
     */
    create: XOR<mfa_codesCreateInput, mfa_codesUncheckedCreateInput>
    /**
     * In case the mfa_codes was found with the provided `where` argument, update it with this data.
     */
    update: XOR<mfa_codesUpdateInput, mfa_codesUncheckedUpdateInput>
  }

  /**
   * mfa_codes delete
   */
  export type mfa_codesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mfa_codes
     */
    select?: mfa_codesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mfa_codes
     */
    omit?: mfa_codesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: mfa_codesInclude<ExtArgs> | null
    /**
     * Filter which mfa_codes to delete.
     */
    where: mfa_codesWhereUniqueInput
  }

  /**
   * mfa_codes deleteMany
   */
  export type mfa_codesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which mfa_codes to delete
     */
    where?: mfa_codesWhereInput
    /**
     * Limit how many mfa_codes to delete.
     */
    limit?: number
  }

  /**
   * mfa_codes without action
   */
  export type mfa_codesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mfa_codes
     */
    select?: mfa_codesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mfa_codes
     */
    omit?: mfa_codesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: mfa_codesInclude<ExtArgs> | null
  }


  /**
   * Model transactions
   */

  export type AggregateTransactions = {
    _count: TransactionsCountAggregateOutputType | null
    _avg: TransactionsAvgAggregateOutputType | null
    _sum: TransactionsSumAggregateOutputType | null
    _min: TransactionsMinAggregateOutputType | null
    _max: TransactionsMaxAggregateOutputType | null
  }

  export type TransactionsAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type TransactionsSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type TransactionsMinAggregateOutputType = {
    transaction_id: string | null
    created_at: Date | null
    origin_iban: string | null
    destination_iban: string | null
    amount: Decimal | null
    currency: string | null
    status: $Enums.transactions_status | null
    description: string | null
    hmac_md5: string | null
    updated_at: Date | null
  }

  export type TransactionsMaxAggregateOutputType = {
    transaction_id: string | null
    created_at: Date | null
    origin_iban: string | null
    destination_iban: string | null
    amount: Decimal | null
    currency: string | null
    status: $Enums.transactions_status | null
    description: string | null
    hmac_md5: string | null
    updated_at: Date | null
  }

  export type TransactionsCountAggregateOutputType = {
    transaction_id: number
    created_at: number
    origin_iban: number
    destination_iban: number
    amount: number
    currency: number
    status: number
    description: number
    hmac_md5: number
    updated_at: number
    _all: number
  }


  export type TransactionsAvgAggregateInputType = {
    amount?: true
  }

  export type TransactionsSumAggregateInputType = {
    amount?: true
  }

  export type TransactionsMinAggregateInputType = {
    transaction_id?: true
    created_at?: true
    origin_iban?: true
    destination_iban?: true
    amount?: true
    currency?: true
    status?: true
    description?: true
    hmac_md5?: true
    updated_at?: true
  }

  export type TransactionsMaxAggregateInputType = {
    transaction_id?: true
    created_at?: true
    origin_iban?: true
    destination_iban?: true
    amount?: true
    currency?: true
    status?: true
    description?: true
    hmac_md5?: true
    updated_at?: true
  }

  export type TransactionsCountAggregateInputType = {
    transaction_id?: true
    created_at?: true
    origin_iban?: true
    destination_iban?: true
    amount?: true
    currency?: true
    status?: true
    description?: true
    hmac_md5?: true
    updated_at?: true
    _all?: true
  }

  export type TransactionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which transactions to aggregate.
     */
    where?: transactionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of transactions to fetch.
     */
    orderBy?: transactionsOrderByWithRelationInput | transactionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: transactionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned transactions
    **/
    _count?: true | TransactionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransactionsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransactionsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransactionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransactionsMaxAggregateInputType
  }

  export type GetTransactionsAggregateType<T extends TransactionsAggregateArgs> = {
        [P in keyof T & keyof AggregateTransactions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransactions[P]>
      : GetScalarType<T[P], AggregateTransactions[P]>
  }




  export type transactionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: transactionsWhereInput
    orderBy?: transactionsOrderByWithAggregationInput | transactionsOrderByWithAggregationInput[]
    by: TransactionsScalarFieldEnum[] | TransactionsScalarFieldEnum
    having?: transactionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransactionsCountAggregateInputType | true
    _avg?: TransactionsAvgAggregateInputType
    _sum?: TransactionsSumAggregateInputType
    _min?: TransactionsMinAggregateInputType
    _max?: TransactionsMaxAggregateInputType
  }

  export type TransactionsGroupByOutputType = {
    transaction_id: string
    created_at: Date
    origin_iban: string
    destination_iban: string
    amount: Decimal
    currency: string
    status: $Enums.transactions_status
    description: string | null
    hmac_md5: string
    updated_at: Date
    _count: TransactionsCountAggregateOutputType | null
    _avg: TransactionsAvgAggregateOutputType | null
    _sum: TransactionsSumAggregateOutputType | null
    _min: TransactionsMinAggregateOutputType | null
    _max: TransactionsMaxAggregateOutputType | null
  }

  type GetTransactionsGroupByPayload<T extends transactionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransactionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionsGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionsGroupByOutputType[P]>
        }
      >
    >


  export type transactionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    transaction_id?: boolean
    created_at?: boolean
    origin_iban?: boolean
    destination_iban?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    description?: boolean
    hmac_md5?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["transactions"]>



  export type transactionsSelectScalar = {
    transaction_id?: boolean
    created_at?: boolean
    origin_iban?: boolean
    destination_iban?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    description?: boolean
    hmac_md5?: boolean
    updated_at?: boolean
  }

  export type transactionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"transaction_id" | "created_at" | "origin_iban" | "destination_iban" | "amount" | "currency" | "status" | "description" | "hmac_md5" | "updated_at", ExtArgs["result"]["transactions"]>

  export type $transactionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "transactions"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      transaction_id: string
      created_at: Date
      origin_iban: string
      destination_iban: string
      amount: Prisma.Decimal
      currency: string
      status: $Enums.transactions_status
      description: string | null
      hmac_md5: string
      updated_at: Date
    }, ExtArgs["result"]["transactions"]>
    composites: {}
  }

  type transactionsGetPayload<S extends boolean | null | undefined | transactionsDefaultArgs> = $Result.GetResult<Prisma.$transactionsPayload, S>

  type transactionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<transactionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TransactionsCountAggregateInputType | true
    }

  export interface transactionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['transactions'], meta: { name: 'transactions' } }
    /**
     * Find zero or one Transactions that matches the filter.
     * @param {transactionsFindUniqueArgs} args - Arguments to find a Transactions
     * @example
     * // Get one Transactions
     * const transactions = await prisma.transactions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends transactionsFindUniqueArgs>(args: SelectSubset<T, transactionsFindUniqueArgs<ExtArgs>>): Prisma__transactionsClient<$Result.GetResult<Prisma.$transactionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Transactions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {transactionsFindUniqueOrThrowArgs} args - Arguments to find a Transactions
     * @example
     * // Get one Transactions
     * const transactions = await prisma.transactions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends transactionsFindUniqueOrThrowArgs>(args: SelectSubset<T, transactionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__transactionsClient<$Result.GetResult<Prisma.$transactionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {transactionsFindFirstArgs} args - Arguments to find a Transactions
     * @example
     * // Get one Transactions
     * const transactions = await prisma.transactions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends transactionsFindFirstArgs>(args?: SelectSubset<T, transactionsFindFirstArgs<ExtArgs>>): Prisma__transactionsClient<$Result.GetResult<Prisma.$transactionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transactions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {transactionsFindFirstOrThrowArgs} args - Arguments to find a Transactions
     * @example
     * // Get one Transactions
     * const transactions = await prisma.transactions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends transactionsFindFirstOrThrowArgs>(args?: SelectSubset<T, transactionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__transactionsClient<$Result.GetResult<Prisma.$transactionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {transactionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transactions
     * const transactions = await prisma.transactions.findMany()
     * 
     * // Get first 10 Transactions
     * const transactions = await prisma.transactions.findMany({ take: 10 })
     * 
     * // Only select the `transaction_id`
     * const transactionsWithTransaction_idOnly = await prisma.transactions.findMany({ select: { transaction_id: true } })
     * 
     */
    findMany<T extends transactionsFindManyArgs>(args?: SelectSubset<T, transactionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$transactionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Transactions.
     * @param {transactionsCreateArgs} args - Arguments to create a Transactions.
     * @example
     * // Create one Transactions
     * const Transactions = await prisma.transactions.create({
     *   data: {
     *     // ... data to create a Transactions
     *   }
     * })
     * 
     */
    create<T extends transactionsCreateArgs>(args: SelectSubset<T, transactionsCreateArgs<ExtArgs>>): Prisma__transactionsClient<$Result.GetResult<Prisma.$transactionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Transactions.
     * @param {transactionsCreateManyArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transactions = await prisma.transactions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends transactionsCreateManyArgs>(args?: SelectSubset<T, transactionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Transactions.
     * @param {transactionsDeleteArgs} args - Arguments to delete one Transactions.
     * @example
     * // Delete one Transactions
     * const Transactions = await prisma.transactions.delete({
     *   where: {
     *     // ... filter to delete one Transactions
     *   }
     * })
     * 
     */
    delete<T extends transactionsDeleteArgs>(args: SelectSubset<T, transactionsDeleteArgs<ExtArgs>>): Prisma__transactionsClient<$Result.GetResult<Prisma.$transactionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Transactions.
     * @param {transactionsUpdateArgs} args - Arguments to update one Transactions.
     * @example
     * // Update one Transactions
     * const transactions = await prisma.transactions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends transactionsUpdateArgs>(args: SelectSubset<T, transactionsUpdateArgs<ExtArgs>>): Prisma__transactionsClient<$Result.GetResult<Prisma.$transactionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Transactions.
     * @param {transactionsDeleteManyArgs} args - Arguments to filter Transactions to delete.
     * @example
     * // Delete a few Transactions
     * const { count } = await prisma.transactions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends transactionsDeleteManyArgs>(args?: SelectSubset<T, transactionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {transactionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transactions
     * const transactions = await prisma.transactions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends transactionsUpdateManyArgs>(args: SelectSubset<T, transactionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Transactions.
     * @param {transactionsUpsertArgs} args - Arguments to update or create a Transactions.
     * @example
     * // Update or create a Transactions
     * const transactions = await prisma.transactions.upsert({
     *   create: {
     *     // ... data to create a Transactions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transactions we want to update
     *   }
     * })
     */
    upsert<T extends transactionsUpsertArgs>(args: SelectSubset<T, transactionsUpsertArgs<ExtArgs>>): Prisma__transactionsClient<$Result.GetResult<Prisma.$transactionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {transactionsCountArgs} args - Arguments to filter Transactions to count.
     * @example
     * // Count the number of Transactions
     * const count = await prisma.transactions.count({
     *   where: {
     *     // ... the filter for the Transactions we want to count
     *   }
     * })
    **/
    count<T extends transactionsCountArgs>(
      args?: Subset<T, transactionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TransactionsAggregateArgs>(args: Subset<T, TransactionsAggregateArgs>): Prisma.PrismaPromise<GetTransactionsAggregateType<T>>

    /**
     * Group by Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {transactionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends transactionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: transactionsGroupByArgs['orderBy'] }
        : { orderBy?: transactionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, transactionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the transactions model
   */
  readonly fields: transactionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for transactions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__transactionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the transactions model
   */
  interface transactionsFieldRefs {
    readonly transaction_id: FieldRef<"transactions", 'String'>
    readonly created_at: FieldRef<"transactions", 'DateTime'>
    readonly origin_iban: FieldRef<"transactions", 'String'>
    readonly destination_iban: FieldRef<"transactions", 'String'>
    readonly amount: FieldRef<"transactions", 'Decimal'>
    readonly currency: FieldRef<"transactions", 'String'>
    readonly status: FieldRef<"transactions", 'transactions_status'>
    readonly description: FieldRef<"transactions", 'String'>
    readonly hmac_md5: FieldRef<"transactions", 'String'>
    readonly updated_at: FieldRef<"transactions", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * transactions findUnique
   */
  export type transactionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the transactions
     */
    select?: transactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the transactions
     */
    omit?: transactionsOmit<ExtArgs> | null
    /**
     * Filter, which transactions to fetch.
     */
    where: transactionsWhereUniqueInput
  }

  /**
   * transactions findUniqueOrThrow
   */
  export type transactionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the transactions
     */
    select?: transactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the transactions
     */
    omit?: transactionsOmit<ExtArgs> | null
    /**
     * Filter, which transactions to fetch.
     */
    where: transactionsWhereUniqueInput
  }

  /**
   * transactions findFirst
   */
  export type transactionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the transactions
     */
    select?: transactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the transactions
     */
    omit?: transactionsOmit<ExtArgs> | null
    /**
     * Filter, which transactions to fetch.
     */
    where?: transactionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of transactions to fetch.
     */
    orderBy?: transactionsOrderByWithRelationInput | transactionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for transactions.
     */
    cursor?: transactionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of transactions.
     */
    distinct?: TransactionsScalarFieldEnum | TransactionsScalarFieldEnum[]
  }

  /**
   * transactions findFirstOrThrow
   */
  export type transactionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the transactions
     */
    select?: transactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the transactions
     */
    omit?: transactionsOmit<ExtArgs> | null
    /**
     * Filter, which transactions to fetch.
     */
    where?: transactionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of transactions to fetch.
     */
    orderBy?: transactionsOrderByWithRelationInput | transactionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for transactions.
     */
    cursor?: transactionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of transactions.
     */
    distinct?: TransactionsScalarFieldEnum | TransactionsScalarFieldEnum[]
  }

  /**
   * transactions findMany
   */
  export type transactionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the transactions
     */
    select?: transactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the transactions
     */
    omit?: transactionsOmit<ExtArgs> | null
    /**
     * Filter, which transactions to fetch.
     */
    where?: transactionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of transactions to fetch.
     */
    orderBy?: transactionsOrderByWithRelationInput | transactionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing transactions.
     */
    cursor?: transactionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` transactions.
     */
    skip?: number
    distinct?: TransactionsScalarFieldEnum | TransactionsScalarFieldEnum[]
  }

  /**
   * transactions create
   */
  export type transactionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the transactions
     */
    select?: transactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the transactions
     */
    omit?: transactionsOmit<ExtArgs> | null
    /**
     * The data needed to create a transactions.
     */
    data: XOR<transactionsCreateInput, transactionsUncheckedCreateInput>
  }

  /**
   * transactions createMany
   */
  export type transactionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many transactions.
     */
    data: transactionsCreateManyInput | transactionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * transactions update
   */
  export type transactionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the transactions
     */
    select?: transactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the transactions
     */
    omit?: transactionsOmit<ExtArgs> | null
    /**
     * The data needed to update a transactions.
     */
    data: XOR<transactionsUpdateInput, transactionsUncheckedUpdateInput>
    /**
     * Choose, which transactions to update.
     */
    where: transactionsWhereUniqueInput
  }

  /**
   * transactions updateMany
   */
  export type transactionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update transactions.
     */
    data: XOR<transactionsUpdateManyMutationInput, transactionsUncheckedUpdateManyInput>
    /**
     * Filter which transactions to update
     */
    where?: transactionsWhereInput
    /**
     * Limit how many transactions to update.
     */
    limit?: number
  }

  /**
   * transactions upsert
   */
  export type transactionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the transactions
     */
    select?: transactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the transactions
     */
    omit?: transactionsOmit<ExtArgs> | null
    /**
     * The filter to search for the transactions to update in case it exists.
     */
    where: transactionsWhereUniqueInput
    /**
     * In case the transactions found by the `where` argument doesn't exist, create a new transactions with this data.
     */
    create: XOR<transactionsCreateInput, transactionsUncheckedCreateInput>
    /**
     * In case the transactions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<transactionsUpdateInput, transactionsUncheckedUpdateInput>
  }

  /**
   * transactions delete
   */
  export type transactionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the transactions
     */
    select?: transactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the transactions
     */
    omit?: transactionsOmit<ExtArgs> | null
    /**
     * Filter which transactions to delete.
     */
    where: transactionsWhereUniqueInput
  }

  /**
   * transactions deleteMany
   */
  export type transactionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which transactions to delete
     */
    where?: transactionsWhereInput
    /**
     * Limit how many transactions to delete.
     */
    limit?: number
  }

  /**
   * transactions without action
   */
  export type transactionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the transactions
     */
    select?: transactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the transactions
     */
    omit?: transactionsOmit<ExtArgs> | null
  }


  /**
   * Model users
   */

  export type AggregateUsers = {
    _count: UsersCountAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  export type UsersMinAggregateOutputType = {
    identification: string | null
    name: string | null
    last_name: string | null
    second_last_name: string | null
    phone: string | null
    email: string | null
    password_hash: string | null
    user_type: string | null
    account_iban: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type UsersMaxAggregateOutputType = {
    identification: string | null
    name: string | null
    last_name: string | null
    second_last_name: string | null
    phone: string | null
    email: string | null
    password_hash: string | null
    user_type: string | null
    account_iban: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type UsersCountAggregateOutputType = {
    identification: number
    name: number
    last_name: number
    second_last_name: number
    phone: number
    email: number
    password_hash: number
    user_type: number
    account_iban: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type UsersMinAggregateInputType = {
    identification?: true
    name?: true
    last_name?: true
    second_last_name?: true
    phone?: true
    email?: true
    password_hash?: true
    user_type?: true
    account_iban?: true
    created_at?: true
    updated_at?: true
  }

  export type UsersMaxAggregateInputType = {
    identification?: true
    name?: true
    last_name?: true
    second_last_name?: true
    phone?: true
    email?: true
    password_hash?: true
    user_type?: true
    account_iban?: true
    created_at?: true
    updated_at?: true
  }

  export type UsersCountAggregateInputType = {
    identification?: true
    name?: true
    last_name?: true
    second_last_name?: true
    phone?: true
    email?: true
    password_hash?: true
    user_type?: true
    account_iban?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type UsersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to aggregate.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned users
    **/
    _count?: true | UsersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsersMaxAggregateInputType
  }

  export type GetUsersAggregateType<T extends UsersAggregateArgs> = {
        [P in keyof T & keyof AggregateUsers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsers[P]>
      : GetScalarType<T[P], AggregateUsers[P]>
  }




  export type usersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: usersWhereInput
    orderBy?: usersOrderByWithAggregationInput | usersOrderByWithAggregationInput[]
    by: UsersScalarFieldEnum[] | UsersScalarFieldEnum
    having?: usersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsersCountAggregateInputType | true
    _min?: UsersMinAggregateInputType
    _max?: UsersMaxAggregateInputType
  }

  export type UsersGroupByOutputType = {
    identification: string
    name: string
    last_name: string
    second_last_name: string | null
    phone: string
    email: string
    password_hash: string
    user_type: string
    account_iban: string
    created_at: Date
    updated_at: Date
    _count: UsersCountAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  type GetUsersGroupByPayload<T extends usersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsersGroupByOutputType[P]>
            : GetScalarType<T[P], UsersGroupByOutputType[P]>
        }
      >
    >


  export type usersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identification?: boolean
    name?: boolean
    last_name?: boolean
    second_last_name?: boolean
    phone?: boolean
    email?: boolean
    password_hash?: boolean
    user_type?: boolean
    account_iban?: boolean
    created_at?: boolean
    updated_at?: boolean
    mfa_codes?: boolean | users$mfa_codesArgs<ExtArgs>
    accounts?: boolean | accountsDefaultArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["users"]>



  export type usersSelectScalar = {
    identification?: boolean
    name?: boolean
    last_name?: boolean
    second_last_name?: boolean
    phone?: boolean
    email?: boolean
    password_hash?: boolean
    user_type?: boolean
    account_iban?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type usersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"identification" | "name" | "last_name" | "second_last_name" | "phone" | "email" | "password_hash" | "user_type" | "account_iban" | "created_at" | "updated_at", ExtArgs["result"]["users"]>
  export type usersInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mfa_codes?: boolean | users$mfa_codesArgs<ExtArgs>
    accounts?: boolean | accountsDefaultArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $usersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "users"
    objects: {
      mfa_codes: Prisma.$mfa_codesPayload<ExtArgs>[]
      accounts: Prisma.$accountsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      identification: string
      name: string
      last_name: string
      second_last_name: string | null
      phone: string
      email: string
      password_hash: string
      user_type: string
      account_iban: string
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["users"]>
    composites: {}
  }

  type usersGetPayload<S extends boolean | null | undefined | usersDefaultArgs> = $Result.GetResult<Prisma.$usersPayload, S>

  type usersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<usersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsersCountAggregateInputType | true
    }

  export interface usersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['users'], meta: { name: 'users' } }
    /**
     * Find zero or one Users that matches the filter.
     * @param {usersFindUniqueArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends usersFindUniqueArgs>(args: SelectSubset<T, usersFindUniqueArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Users that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {usersFindUniqueOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends usersFindUniqueOrThrowArgs>(args: SelectSubset<T, usersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends usersFindFirstArgs>(args?: SelectSubset<T, usersFindFirstArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends usersFindFirstOrThrowArgs>(args?: SelectSubset<T, usersFindFirstOrThrowArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.users.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.users.findMany({ take: 10 })
     * 
     * // Only select the `identification`
     * const usersWithIdentificationOnly = await prisma.users.findMany({ select: { identification: true } })
     * 
     */
    findMany<T extends usersFindManyArgs>(args?: SelectSubset<T, usersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Users.
     * @param {usersCreateArgs} args - Arguments to create a Users.
     * @example
     * // Create one Users
     * const Users = await prisma.users.create({
     *   data: {
     *     // ... data to create a Users
     *   }
     * })
     * 
     */
    create<T extends usersCreateArgs>(args: SelectSubset<T, usersCreateArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {usersCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends usersCreateManyArgs>(args?: SelectSubset<T, usersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Users.
     * @param {usersDeleteArgs} args - Arguments to delete one Users.
     * @example
     * // Delete one Users
     * const Users = await prisma.users.delete({
     *   where: {
     *     // ... filter to delete one Users
     *   }
     * })
     * 
     */
    delete<T extends usersDeleteArgs>(args: SelectSubset<T, usersDeleteArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Users.
     * @param {usersUpdateArgs} args - Arguments to update one Users.
     * @example
     * // Update one Users
     * const users = await prisma.users.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends usersUpdateArgs>(args: SelectSubset<T, usersUpdateArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {usersDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.users.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends usersDeleteManyArgs>(args?: SelectSubset<T, usersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends usersUpdateManyArgs>(args: SelectSubset<T, usersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Users.
     * @param {usersUpsertArgs} args - Arguments to update or create a Users.
     * @example
     * // Update or create a Users
     * const users = await prisma.users.upsert({
     *   create: {
     *     // ... data to create a Users
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Users we want to update
     *   }
     * })
     */
    upsert<T extends usersUpsertArgs>(args: SelectSubset<T, usersUpsertArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.users.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends usersCountArgs>(
      args?: Subset<T, usersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsersAggregateArgs>(args: Subset<T, UsersAggregateArgs>): Prisma.PrismaPromise<GetUsersAggregateType<T>>

    /**
     * Group by Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends usersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: usersGroupByArgs['orderBy'] }
        : { orderBy?: usersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, usersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the users model
   */
  readonly fields: usersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for users.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__usersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    mfa_codes<T extends users$mfa_codesArgs<ExtArgs> = {}>(args?: Subset<T, users$mfa_codesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$mfa_codesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    accounts<T extends accountsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, accountsDefaultArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the users model
   */
  interface usersFieldRefs {
    readonly identification: FieldRef<"users", 'String'>
    readonly name: FieldRef<"users", 'String'>
    readonly last_name: FieldRef<"users", 'String'>
    readonly second_last_name: FieldRef<"users", 'String'>
    readonly phone: FieldRef<"users", 'String'>
    readonly email: FieldRef<"users", 'String'>
    readonly password_hash: FieldRef<"users", 'String'>
    readonly user_type: FieldRef<"users", 'String'>
    readonly account_iban: FieldRef<"users", 'String'>
    readonly created_at: FieldRef<"users", 'DateTime'>
    readonly updated_at: FieldRef<"users", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * users findUnique
   */
  export type usersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findUniqueOrThrow
   */
  export type usersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findFirst
   */
  export type usersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users findFirstOrThrow
   */
  export type usersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users findMany
   */
  export type usersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users create
   */
  export type usersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The data needed to create a users.
     */
    data: XOR<usersCreateInput, usersUncheckedCreateInput>
  }

  /**
   * users createMany
   */
  export type usersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many users.
     */
    data: usersCreateManyInput | usersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * users update
   */
  export type usersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The data needed to update a users.
     */
    data: XOR<usersUpdateInput, usersUncheckedUpdateInput>
    /**
     * Choose, which users to update.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users updateMany
   */
  export type usersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update users.
     */
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: usersWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * users upsert
   */
  export type usersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The filter to search for the users to update in case it exists.
     */
    where: usersWhereUniqueInput
    /**
     * In case the users found by the `where` argument doesn't exist, create a new users with this data.
     */
    create: XOR<usersCreateInput, usersUncheckedCreateInput>
    /**
     * In case the users was found with the provided `where` argument, update it with this data.
     */
    update: XOR<usersUpdateInput, usersUncheckedUpdateInput>
  }

  /**
   * users delete
   */
  export type usersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter which users to delete.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users deleteMany
   */
  export type usersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to delete
     */
    where?: usersWhereInput
    /**
     * Limit how many users to delete.
     */
    limit?: number
  }

  /**
   * users.mfa_codes
   */
  export type users$mfa_codesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the mfa_codes
     */
    select?: mfa_codesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the mfa_codes
     */
    omit?: mfa_codesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: mfa_codesInclude<ExtArgs> | null
    where?: mfa_codesWhereInput
    orderBy?: mfa_codesOrderByWithRelationInput | mfa_codesOrderByWithRelationInput[]
    cursor?: mfa_codesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Mfa_codesScalarFieldEnum | Mfa_codesScalarFieldEnum[]
  }

  /**
   * users without action
   */
  export type usersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
  }


  /**
   * Model sinpe_subscriptions
   */

  export type AggregateSinpe_subscriptions = {
    _count: Sinpe_subscriptionsCountAggregateOutputType | null
    _min: Sinpe_subscriptionsMinAggregateOutputType | null
    _max: Sinpe_subscriptionsMaxAggregateOutputType | null
  }

  export type Sinpe_subscriptionsMinAggregateOutputType = {
    sinpe_number: string | null
    sinpe_client_name: string | null
    sinpe_bank_code: string | null
  }

  export type Sinpe_subscriptionsMaxAggregateOutputType = {
    sinpe_number: string | null
    sinpe_client_name: string | null
    sinpe_bank_code: string | null
  }

  export type Sinpe_subscriptionsCountAggregateOutputType = {
    sinpe_number: number
    sinpe_client_name: number
    sinpe_bank_code: number
    _all: number
  }


  export type Sinpe_subscriptionsMinAggregateInputType = {
    sinpe_number?: true
    sinpe_client_name?: true
    sinpe_bank_code?: true
  }

  export type Sinpe_subscriptionsMaxAggregateInputType = {
    sinpe_number?: true
    sinpe_client_name?: true
    sinpe_bank_code?: true
  }

  export type Sinpe_subscriptionsCountAggregateInputType = {
    sinpe_number?: true
    sinpe_client_name?: true
    sinpe_bank_code?: true
    _all?: true
  }

  export type Sinpe_subscriptionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which sinpe_subscriptions to aggregate.
     */
    where?: sinpe_subscriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sinpe_subscriptions to fetch.
     */
    orderBy?: sinpe_subscriptionsOrderByWithRelationInput | sinpe_subscriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: sinpe_subscriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sinpe_subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sinpe_subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned sinpe_subscriptions
    **/
    _count?: true | Sinpe_subscriptionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Sinpe_subscriptionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Sinpe_subscriptionsMaxAggregateInputType
  }

  export type GetSinpe_subscriptionsAggregateType<T extends Sinpe_subscriptionsAggregateArgs> = {
        [P in keyof T & keyof AggregateSinpe_subscriptions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSinpe_subscriptions[P]>
      : GetScalarType<T[P], AggregateSinpe_subscriptions[P]>
  }




  export type sinpe_subscriptionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: sinpe_subscriptionsWhereInput
    orderBy?: sinpe_subscriptionsOrderByWithAggregationInput | sinpe_subscriptionsOrderByWithAggregationInput[]
    by: Sinpe_subscriptionsScalarFieldEnum[] | Sinpe_subscriptionsScalarFieldEnum
    having?: sinpe_subscriptionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Sinpe_subscriptionsCountAggregateInputType | true
    _min?: Sinpe_subscriptionsMinAggregateInputType
    _max?: Sinpe_subscriptionsMaxAggregateInputType
  }

  export type Sinpe_subscriptionsGroupByOutputType = {
    sinpe_number: string
    sinpe_client_name: string
    sinpe_bank_code: string
    _count: Sinpe_subscriptionsCountAggregateOutputType | null
    _min: Sinpe_subscriptionsMinAggregateOutputType | null
    _max: Sinpe_subscriptionsMaxAggregateOutputType | null
  }

  type GetSinpe_subscriptionsGroupByPayload<T extends sinpe_subscriptionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Sinpe_subscriptionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Sinpe_subscriptionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Sinpe_subscriptionsGroupByOutputType[P]>
            : GetScalarType<T[P], Sinpe_subscriptionsGroupByOutputType[P]>
        }
      >
    >


  export type sinpe_subscriptionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    sinpe_number?: boolean
    sinpe_client_name?: boolean
    sinpe_bank_code?: boolean
  }, ExtArgs["result"]["sinpe_subscriptions"]>



  export type sinpe_subscriptionsSelectScalar = {
    sinpe_number?: boolean
    sinpe_client_name?: boolean
    sinpe_bank_code?: boolean
  }

  export type sinpe_subscriptionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"sinpe_number" | "sinpe_client_name" | "sinpe_bank_code", ExtArgs["result"]["sinpe_subscriptions"]>

  export type $sinpe_subscriptionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "sinpe_subscriptions"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      sinpe_number: string
      sinpe_client_name: string
      sinpe_bank_code: string
    }, ExtArgs["result"]["sinpe_subscriptions"]>
    composites: {}
  }

  type sinpe_subscriptionsGetPayload<S extends boolean | null | undefined | sinpe_subscriptionsDefaultArgs> = $Result.GetResult<Prisma.$sinpe_subscriptionsPayload, S>

  type sinpe_subscriptionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<sinpe_subscriptionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Sinpe_subscriptionsCountAggregateInputType | true
    }

  export interface sinpe_subscriptionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['sinpe_subscriptions'], meta: { name: 'sinpe_subscriptions' } }
    /**
     * Find zero or one Sinpe_subscriptions that matches the filter.
     * @param {sinpe_subscriptionsFindUniqueArgs} args - Arguments to find a Sinpe_subscriptions
     * @example
     * // Get one Sinpe_subscriptions
     * const sinpe_subscriptions = await prisma.sinpe_subscriptions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends sinpe_subscriptionsFindUniqueArgs>(args: SelectSubset<T, sinpe_subscriptionsFindUniqueArgs<ExtArgs>>): Prisma__sinpe_subscriptionsClient<$Result.GetResult<Prisma.$sinpe_subscriptionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Sinpe_subscriptions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {sinpe_subscriptionsFindUniqueOrThrowArgs} args - Arguments to find a Sinpe_subscriptions
     * @example
     * // Get one Sinpe_subscriptions
     * const sinpe_subscriptions = await prisma.sinpe_subscriptions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends sinpe_subscriptionsFindUniqueOrThrowArgs>(args: SelectSubset<T, sinpe_subscriptionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__sinpe_subscriptionsClient<$Result.GetResult<Prisma.$sinpe_subscriptionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sinpe_subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sinpe_subscriptionsFindFirstArgs} args - Arguments to find a Sinpe_subscriptions
     * @example
     * // Get one Sinpe_subscriptions
     * const sinpe_subscriptions = await prisma.sinpe_subscriptions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends sinpe_subscriptionsFindFirstArgs>(args?: SelectSubset<T, sinpe_subscriptionsFindFirstArgs<ExtArgs>>): Prisma__sinpe_subscriptionsClient<$Result.GetResult<Prisma.$sinpe_subscriptionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sinpe_subscriptions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sinpe_subscriptionsFindFirstOrThrowArgs} args - Arguments to find a Sinpe_subscriptions
     * @example
     * // Get one Sinpe_subscriptions
     * const sinpe_subscriptions = await prisma.sinpe_subscriptions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends sinpe_subscriptionsFindFirstOrThrowArgs>(args?: SelectSubset<T, sinpe_subscriptionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__sinpe_subscriptionsClient<$Result.GetResult<Prisma.$sinpe_subscriptionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sinpe_subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sinpe_subscriptionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sinpe_subscriptions
     * const sinpe_subscriptions = await prisma.sinpe_subscriptions.findMany()
     * 
     * // Get first 10 Sinpe_subscriptions
     * const sinpe_subscriptions = await prisma.sinpe_subscriptions.findMany({ take: 10 })
     * 
     * // Only select the `sinpe_number`
     * const sinpe_subscriptionsWithSinpe_numberOnly = await prisma.sinpe_subscriptions.findMany({ select: { sinpe_number: true } })
     * 
     */
    findMany<T extends sinpe_subscriptionsFindManyArgs>(args?: SelectSubset<T, sinpe_subscriptionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sinpe_subscriptionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Sinpe_subscriptions.
     * @param {sinpe_subscriptionsCreateArgs} args - Arguments to create a Sinpe_subscriptions.
     * @example
     * // Create one Sinpe_subscriptions
     * const Sinpe_subscriptions = await prisma.sinpe_subscriptions.create({
     *   data: {
     *     // ... data to create a Sinpe_subscriptions
     *   }
     * })
     * 
     */
    create<T extends sinpe_subscriptionsCreateArgs>(args: SelectSubset<T, sinpe_subscriptionsCreateArgs<ExtArgs>>): Prisma__sinpe_subscriptionsClient<$Result.GetResult<Prisma.$sinpe_subscriptionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sinpe_subscriptions.
     * @param {sinpe_subscriptionsCreateManyArgs} args - Arguments to create many Sinpe_subscriptions.
     * @example
     * // Create many Sinpe_subscriptions
     * const sinpe_subscriptions = await prisma.sinpe_subscriptions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends sinpe_subscriptionsCreateManyArgs>(args?: SelectSubset<T, sinpe_subscriptionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Sinpe_subscriptions.
     * @param {sinpe_subscriptionsDeleteArgs} args - Arguments to delete one Sinpe_subscriptions.
     * @example
     * // Delete one Sinpe_subscriptions
     * const Sinpe_subscriptions = await prisma.sinpe_subscriptions.delete({
     *   where: {
     *     // ... filter to delete one Sinpe_subscriptions
     *   }
     * })
     * 
     */
    delete<T extends sinpe_subscriptionsDeleteArgs>(args: SelectSubset<T, sinpe_subscriptionsDeleteArgs<ExtArgs>>): Prisma__sinpe_subscriptionsClient<$Result.GetResult<Prisma.$sinpe_subscriptionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Sinpe_subscriptions.
     * @param {sinpe_subscriptionsUpdateArgs} args - Arguments to update one Sinpe_subscriptions.
     * @example
     * // Update one Sinpe_subscriptions
     * const sinpe_subscriptions = await prisma.sinpe_subscriptions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends sinpe_subscriptionsUpdateArgs>(args: SelectSubset<T, sinpe_subscriptionsUpdateArgs<ExtArgs>>): Prisma__sinpe_subscriptionsClient<$Result.GetResult<Prisma.$sinpe_subscriptionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sinpe_subscriptions.
     * @param {sinpe_subscriptionsDeleteManyArgs} args - Arguments to filter Sinpe_subscriptions to delete.
     * @example
     * // Delete a few Sinpe_subscriptions
     * const { count } = await prisma.sinpe_subscriptions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends sinpe_subscriptionsDeleteManyArgs>(args?: SelectSubset<T, sinpe_subscriptionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sinpe_subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sinpe_subscriptionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sinpe_subscriptions
     * const sinpe_subscriptions = await prisma.sinpe_subscriptions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends sinpe_subscriptionsUpdateManyArgs>(args: SelectSubset<T, sinpe_subscriptionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Sinpe_subscriptions.
     * @param {sinpe_subscriptionsUpsertArgs} args - Arguments to update or create a Sinpe_subscriptions.
     * @example
     * // Update or create a Sinpe_subscriptions
     * const sinpe_subscriptions = await prisma.sinpe_subscriptions.upsert({
     *   create: {
     *     // ... data to create a Sinpe_subscriptions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sinpe_subscriptions we want to update
     *   }
     * })
     */
    upsert<T extends sinpe_subscriptionsUpsertArgs>(args: SelectSubset<T, sinpe_subscriptionsUpsertArgs<ExtArgs>>): Prisma__sinpe_subscriptionsClient<$Result.GetResult<Prisma.$sinpe_subscriptionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sinpe_subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sinpe_subscriptionsCountArgs} args - Arguments to filter Sinpe_subscriptions to count.
     * @example
     * // Count the number of Sinpe_subscriptions
     * const count = await prisma.sinpe_subscriptions.count({
     *   where: {
     *     // ... the filter for the Sinpe_subscriptions we want to count
     *   }
     * })
    **/
    count<T extends sinpe_subscriptionsCountArgs>(
      args?: Subset<T, sinpe_subscriptionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Sinpe_subscriptionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Sinpe_subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Sinpe_subscriptionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Sinpe_subscriptionsAggregateArgs>(args: Subset<T, Sinpe_subscriptionsAggregateArgs>): Prisma.PrismaPromise<GetSinpe_subscriptionsAggregateType<T>>

    /**
     * Group by Sinpe_subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sinpe_subscriptionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends sinpe_subscriptionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: sinpe_subscriptionsGroupByArgs['orderBy'] }
        : { orderBy?: sinpe_subscriptionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, sinpe_subscriptionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSinpe_subscriptionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the sinpe_subscriptions model
   */
  readonly fields: sinpe_subscriptionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for sinpe_subscriptions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__sinpe_subscriptionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the sinpe_subscriptions model
   */
  interface sinpe_subscriptionsFieldRefs {
    readonly sinpe_number: FieldRef<"sinpe_subscriptions", 'String'>
    readonly sinpe_client_name: FieldRef<"sinpe_subscriptions", 'String'>
    readonly sinpe_bank_code: FieldRef<"sinpe_subscriptions", 'String'>
  }
    

  // Custom InputTypes
  /**
   * sinpe_subscriptions findUnique
   */
  export type sinpe_subscriptionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sinpe_subscriptions
     */
    select?: sinpe_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sinpe_subscriptions
     */
    omit?: sinpe_subscriptionsOmit<ExtArgs> | null
    /**
     * Filter, which sinpe_subscriptions to fetch.
     */
    where: sinpe_subscriptionsWhereUniqueInput
  }

  /**
   * sinpe_subscriptions findUniqueOrThrow
   */
  export type sinpe_subscriptionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sinpe_subscriptions
     */
    select?: sinpe_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sinpe_subscriptions
     */
    omit?: sinpe_subscriptionsOmit<ExtArgs> | null
    /**
     * Filter, which sinpe_subscriptions to fetch.
     */
    where: sinpe_subscriptionsWhereUniqueInput
  }

  /**
   * sinpe_subscriptions findFirst
   */
  export type sinpe_subscriptionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sinpe_subscriptions
     */
    select?: sinpe_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sinpe_subscriptions
     */
    omit?: sinpe_subscriptionsOmit<ExtArgs> | null
    /**
     * Filter, which sinpe_subscriptions to fetch.
     */
    where?: sinpe_subscriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sinpe_subscriptions to fetch.
     */
    orderBy?: sinpe_subscriptionsOrderByWithRelationInput | sinpe_subscriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for sinpe_subscriptions.
     */
    cursor?: sinpe_subscriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sinpe_subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sinpe_subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sinpe_subscriptions.
     */
    distinct?: Sinpe_subscriptionsScalarFieldEnum | Sinpe_subscriptionsScalarFieldEnum[]
  }

  /**
   * sinpe_subscriptions findFirstOrThrow
   */
  export type sinpe_subscriptionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sinpe_subscriptions
     */
    select?: sinpe_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sinpe_subscriptions
     */
    omit?: sinpe_subscriptionsOmit<ExtArgs> | null
    /**
     * Filter, which sinpe_subscriptions to fetch.
     */
    where?: sinpe_subscriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sinpe_subscriptions to fetch.
     */
    orderBy?: sinpe_subscriptionsOrderByWithRelationInput | sinpe_subscriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for sinpe_subscriptions.
     */
    cursor?: sinpe_subscriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sinpe_subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sinpe_subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sinpe_subscriptions.
     */
    distinct?: Sinpe_subscriptionsScalarFieldEnum | Sinpe_subscriptionsScalarFieldEnum[]
  }

  /**
   * sinpe_subscriptions findMany
   */
  export type sinpe_subscriptionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sinpe_subscriptions
     */
    select?: sinpe_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sinpe_subscriptions
     */
    omit?: sinpe_subscriptionsOmit<ExtArgs> | null
    /**
     * Filter, which sinpe_subscriptions to fetch.
     */
    where?: sinpe_subscriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sinpe_subscriptions to fetch.
     */
    orderBy?: sinpe_subscriptionsOrderByWithRelationInput | sinpe_subscriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing sinpe_subscriptions.
     */
    cursor?: sinpe_subscriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sinpe_subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sinpe_subscriptions.
     */
    skip?: number
    distinct?: Sinpe_subscriptionsScalarFieldEnum | Sinpe_subscriptionsScalarFieldEnum[]
  }

  /**
   * sinpe_subscriptions create
   */
  export type sinpe_subscriptionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sinpe_subscriptions
     */
    select?: sinpe_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sinpe_subscriptions
     */
    omit?: sinpe_subscriptionsOmit<ExtArgs> | null
    /**
     * The data needed to create a sinpe_subscriptions.
     */
    data: XOR<sinpe_subscriptionsCreateInput, sinpe_subscriptionsUncheckedCreateInput>
  }

  /**
   * sinpe_subscriptions createMany
   */
  export type sinpe_subscriptionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many sinpe_subscriptions.
     */
    data: sinpe_subscriptionsCreateManyInput | sinpe_subscriptionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * sinpe_subscriptions update
   */
  export type sinpe_subscriptionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sinpe_subscriptions
     */
    select?: sinpe_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sinpe_subscriptions
     */
    omit?: sinpe_subscriptionsOmit<ExtArgs> | null
    /**
     * The data needed to update a sinpe_subscriptions.
     */
    data: XOR<sinpe_subscriptionsUpdateInput, sinpe_subscriptionsUncheckedUpdateInput>
    /**
     * Choose, which sinpe_subscriptions to update.
     */
    where: sinpe_subscriptionsWhereUniqueInput
  }

  /**
   * sinpe_subscriptions updateMany
   */
  export type sinpe_subscriptionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update sinpe_subscriptions.
     */
    data: XOR<sinpe_subscriptionsUpdateManyMutationInput, sinpe_subscriptionsUncheckedUpdateManyInput>
    /**
     * Filter which sinpe_subscriptions to update
     */
    where?: sinpe_subscriptionsWhereInput
    /**
     * Limit how many sinpe_subscriptions to update.
     */
    limit?: number
  }

  /**
   * sinpe_subscriptions upsert
   */
  export type sinpe_subscriptionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sinpe_subscriptions
     */
    select?: sinpe_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sinpe_subscriptions
     */
    omit?: sinpe_subscriptionsOmit<ExtArgs> | null
    /**
     * The filter to search for the sinpe_subscriptions to update in case it exists.
     */
    where: sinpe_subscriptionsWhereUniqueInput
    /**
     * In case the sinpe_subscriptions found by the `where` argument doesn't exist, create a new sinpe_subscriptions with this data.
     */
    create: XOR<sinpe_subscriptionsCreateInput, sinpe_subscriptionsUncheckedCreateInput>
    /**
     * In case the sinpe_subscriptions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<sinpe_subscriptionsUpdateInput, sinpe_subscriptionsUncheckedUpdateInput>
  }

  /**
   * sinpe_subscriptions delete
   */
  export type sinpe_subscriptionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sinpe_subscriptions
     */
    select?: sinpe_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sinpe_subscriptions
     */
    omit?: sinpe_subscriptionsOmit<ExtArgs> | null
    /**
     * Filter which sinpe_subscriptions to delete.
     */
    where: sinpe_subscriptionsWhereUniqueInput
  }

  /**
   * sinpe_subscriptions deleteMany
   */
  export type sinpe_subscriptionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which sinpe_subscriptions to delete
     */
    where?: sinpe_subscriptionsWhereInput
    /**
     * Limit how many sinpe_subscriptions to delete.
     */
    limit?: number
  }

  /**
   * sinpe_subscriptions without action
   */
  export type sinpe_subscriptionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sinpe_subscriptions
     */
    select?: sinpe_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sinpe_subscriptions
     */
    omit?: sinpe_subscriptionsOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AccountsScalarFieldEnum: {
    iban: 'iban',
    account_number: 'account_number',
    account_type: 'account_type',
    account_holder: 'account_holder',
    balance: 'balance',
    status: 'status',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type AccountsScalarFieldEnum = (typeof AccountsScalarFieldEnum)[keyof typeof AccountsScalarFieldEnum]


  export const Mfa_codesScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    mfa_code: 'mfa_code',
    created_at: 'created_at',
    expires_at: 'expires_at',
    used: 'used'
  };

  export type Mfa_codesScalarFieldEnum = (typeof Mfa_codesScalarFieldEnum)[keyof typeof Mfa_codesScalarFieldEnum]


  export const TransactionsScalarFieldEnum: {
    transaction_id: 'transaction_id',
    created_at: 'created_at',
    origin_iban: 'origin_iban',
    destination_iban: 'destination_iban',
    amount: 'amount',
    currency: 'currency',
    status: 'status',
    description: 'description',
    hmac_md5: 'hmac_md5',
    updated_at: 'updated_at'
  };

  export type TransactionsScalarFieldEnum = (typeof TransactionsScalarFieldEnum)[keyof typeof TransactionsScalarFieldEnum]


  export const UsersScalarFieldEnum: {
    identification: 'identification',
    name: 'name',
    last_name: 'last_name',
    second_last_name: 'second_last_name',
    phone: 'phone',
    email: 'email',
    password_hash: 'password_hash',
    user_type: 'user_type',
    account_iban: 'account_iban',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type UsersScalarFieldEnum = (typeof UsersScalarFieldEnum)[keyof typeof UsersScalarFieldEnum]


  export const Sinpe_subscriptionsScalarFieldEnum: {
    sinpe_number: 'sinpe_number',
    sinpe_client_name: 'sinpe_client_name',
    sinpe_bank_code: 'sinpe_bank_code'
  };

  export type Sinpe_subscriptionsScalarFieldEnum = (typeof Sinpe_subscriptionsScalarFieldEnum)[keyof typeof Sinpe_subscriptionsScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const accountsOrderByRelevanceFieldEnum: {
    iban: 'iban',
    account_number: 'account_number',
    account_holder: 'account_holder'
  };

  export type accountsOrderByRelevanceFieldEnum = (typeof accountsOrderByRelevanceFieldEnum)[keyof typeof accountsOrderByRelevanceFieldEnum]


  export const mfa_codesOrderByRelevanceFieldEnum: {
    user_id: 'user_id',
    mfa_code: 'mfa_code'
  };

  export type mfa_codesOrderByRelevanceFieldEnum = (typeof mfa_codesOrderByRelevanceFieldEnum)[keyof typeof mfa_codesOrderByRelevanceFieldEnum]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const transactionsOrderByRelevanceFieldEnum: {
    transaction_id: 'transaction_id',
    origin_iban: 'origin_iban',
    destination_iban: 'destination_iban',
    currency: 'currency',
    description: 'description',
    hmac_md5: 'hmac_md5'
  };

  export type transactionsOrderByRelevanceFieldEnum = (typeof transactionsOrderByRelevanceFieldEnum)[keyof typeof transactionsOrderByRelevanceFieldEnum]


  export const usersOrderByRelevanceFieldEnum: {
    identification: 'identification',
    name: 'name',
    last_name: 'last_name',
    second_last_name: 'second_last_name',
    phone: 'phone',
    email: 'email',
    password_hash: 'password_hash',
    user_type: 'user_type',
    account_iban: 'account_iban'
  };

  export type usersOrderByRelevanceFieldEnum = (typeof usersOrderByRelevanceFieldEnum)[keyof typeof usersOrderByRelevanceFieldEnum]


  export const sinpe_subscriptionsOrderByRelevanceFieldEnum: {
    sinpe_number: 'sinpe_number',
    sinpe_client_name: 'sinpe_client_name',
    sinpe_bank_code: 'sinpe_bank_code'
  };

  export type sinpe_subscriptionsOrderByRelevanceFieldEnum = (typeof sinpe_subscriptionsOrderByRelevanceFieldEnum)[keyof typeof sinpe_subscriptionsOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'accounts_account_type'
   */
  export type Enumaccounts_account_typeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'accounts_account_type'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'accounts_status'
   */
  export type Enumaccounts_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'accounts_status'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'transactions_status'
   */
  export type Enumtransactions_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'transactions_status'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type accountsWhereInput = {
    AND?: accountsWhereInput | accountsWhereInput[]
    OR?: accountsWhereInput[]
    NOT?: accountsWhereInput | accountsWhereInput[]
    iban?: StringFilter<"accounts"> | string
    account_number?: StringFilter<"accounts"> | string
    account_type?: Enumaccounts_account_typeFilter<"accounts"> | $Enums.accounts_account_type
    account_holder?: StringFilter<"accounts"> | string
    balance?: DecimalFilter<"accounts"> | Decimal | DecimalJsLike | number | string
    status?: Enumaccounts_statusFilter<"accounts"> | $Enums.accounts_status
    created_at?: DateTimeFilter<"accounts"> | Date | string
    updated_at?: DateTimeFilter<"accounts"> | Date | string
    users?: UsersListRelationFilter
  }

  export type accountsOrderByWithRelationInput = {
    iban?: SortOrder
    account_number?: SortOrder
    account_type?: SortOrder
    account_holder?: SortOrder
    balance?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    users?: usersOrderByRelationAggregateInput
    _relevance?: accountsOrderByRelevanceInput
  }

  export type accountsWhereUniqueInput = Prisma.AtLeast<{
    iban?: string
    account_number?: string
    AND?: accountsWhereInput | accountsWhereInput[]
    OR?: accountsWhereInput[]
    NOT?: accountsWhereInput | accountsWhereInput[]
    account_type?: Enumaccounts_account_typeFilter<"accounts"> | $Enums.accounts_account_type
    account_holder?: StringFilter<"accounts"> | string
    balance?: DecimalFilter<"accounts"> | Decimal | DecimalJsLike | number | string
    status?: Enumaccounts_statusFilter<"accounts"> | $Enums.accounts_status
    created_at?: DateTimeFilter<"accounts"> | Date | string
    updated_at?: DateTimeFilter<"accounts"> | Date | string
    users?: UsersListRelationFilter
  }, "iban" | "account_number">

  export type accountsOrderByWithAggregationInput = {
    iban?: SortOrder
    account_number?: SortOrder
    account_type?: SortOrder
    account_holder?: SortOrder
    balance?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: accountsCountOrderByAggregateInput
    _avg?: accountsAvgOrderByAggregateInput
    _max?: accountsMaxOrderByAggregateInput
    _min?: accountsMinOrderByAggregateInput
    _sum?: accountsSumOrderByAggregateInput
  }

  export type accountsScalarWhereWithAggregatesInput = {
    AND?: accountsScalarWhereWithAggregatesInput | accountsScalarWhereWithAggregatesInput[]
    OR?: accountsScalarWhereWithAggregatesInput[]
    NOT?: accountsScalarWhereWithAggregatesInput | accountsScalarWhereWithAggregatesInput[]
    iban?: StringWithAggregatesFilter<"accounts"> | string
    account_number?: StringWithAggregatesFilter<"accounts"> | string
    account_type?: Enumaccounts_account_typeWithAggregatesFilter<"accounts"> | $Enums.accounts_account_type
    account_holder?: StringWithAggregatesFilter<"accounts"> | string
    balance?: DecimalWithAggregatesFilter<"accounts"> | Decimal | DecimalJsLike | number | string
    status?: Enumaccounts_statusWithAggregatesFilter<"accounts"> | $Enums.accounts_status
    created_at?: DateTimeWithAggregatesFilter<"accounts"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"accounts"> | Date | string
  }

  export type mfa_codesWhereInput = {
    AND?: mfa_codesWhereInput | mfa_codesWhereInput[]
    OR?: mfa_codesWhereInput[]
    NOT?: mfa_codesWhereInput | mfa_codesWhereInput[]
    id?: IntFilter<"mfa_codes"> | number
    user_id?: StringFilter<"mfa_codes"> | string
    mfa_code?: StringFilter<"mfa_codes"> | string
    created_at?: DateTimeFilter<"mfa_codes"> | Date | string
    expires_at?: DateTimeFilter<"mfa_codes"> | Date | string
    used?: BoolFilter<"mfa_codes"> | boolean
    users?: XOR<UsersScalarRelationFilter, usersWhereInput>
  }

  export type mfa_codesOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    mfa_code?: SortOrder
    created_at?: SortOrder
    expires_at?: SortOrder
    used?: SortOrder
    users?: usersOrderByWithRelationInput
    _relevance?: mfa_codesOrderByRelevanceInput
  }

  export type mfa_codesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: mfa_codesWhereInput | mfa_codesWhereInput[]
    OR?: mfa_codesWhereInput[]
    NOT?: mfa_codesWhereInput | mfa_codesWhereInput[]
    user_id?: StringFilter<"mfa_codes"> | string
    mfa_code?: StringFilter<"mfa_codes"> | string
    created_at?: DateTimeFilter<"mfa_codes"> | Date | string
    expires_at?: DateTimeFilter<"mfa_codes"> | Date | string
    used?: BoolFilter<"mfa_codes"> | boolean
    users?: XOR<UsersScalarRelationFilter, usersWhereInput>
  }, "id">

  export type mfa_codesOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    mfa_code?: SortOrder
    created_at?: SortOrder
    expires_at?: SortOrder
    used?: SortOrder
    _count?: mfa_codesCountOrderByAggregateInput
    _avg?: mfa_codesAvgOrderByAggregateInput
    _max?: mfa_codesMaxOrderByAggregateInput
    _min?: mfa_codesMinOrderByAggregateInput
    _sum?: mfa_codesSumOrderByAggregateInput
  }

  export type mfa_codesScalarWhereWithAggregatesInput = {
    AND?: mfa_codesScalarWhereWithAggregatesInput | mfa_codesScalarWhereWithAggregatesInput[]
    OR?: mfa_codesScalarWhereWithAggregatesInput[]
    NOT?: mfa_codesScalarWhereWithAggregatesInput | mfa_codesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"mfa_codes"> | number
    user_id?: StringWithAggregatesFilter<"mfa_codes"> | string
    mfa_code?: StringWithAggregatesFilter<"mfa_codes"> | string
    created_at?: DateTimeWithAggregatesFilter<"mfa_codes"> | Date | string
    expires_at?: DateTimeWithAggregatesFilter<"mfa_codes"> | Date | string
    used?: BoolWithAggregatesFilter<"mfa_codes"> | boolean
  }

  export type transactionsWhereInput = {
    AND?: transactionsWhereInput | transactionsWhereInput[]
    OR?: transactionsWhereInput[]
    NOT?: transactionsWhereInput | transactionsWhereInput[]
    transaction_id?: StringFilter<"transactions"> | string
    created_at?: DateTimeFilter<"transactions"> | Date | string
    origin_iban?: StringFilter<"transactions"> | string
    destination_iban?: StringFilter<"transactions"> | string
    amount?: DecimalFilter<"transactions"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"transactions"> | string
    status?: Enumtransactions_statusFilter<"transactions"> | $Enums.transactions_status
    description?: StringNullableFilter<"transactions"> | string | null
    hmac_md5?: StringFilter<"transactions"> | string
    updated_at?: DateTimeFilter<"transactions"> | Date | string
  }

  export type transactionsOrderByWithRelationInput = {
    transaction_id?: SortOrder
    created_at?: SortOrder
    origin_iban?: SortOrder
    destination_iban?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    description?: SortOrderInput | SortOrder
    hmac_md5?: SortOrder
    updated_at?: SortOrder
    _relevance?: transactionsOrderByRelevanceInput
  }

  export type transactionsWhereUniqueInput = Prisma.AtLeast<{
    transaction_id?: string
    AND?: transactionsWhereInput | transactionsWhereInput[]
    OR?: transactionsWhereInput[]
    NOT?: transactionsWhereInput | transactionsWhereInput[]
    created_at?: DateTimeFilter<"transactions"> | Date | string
    origin_iban?: StringFilter<"transactions"> | string
    destination_iban?: StringFilter<"transactions"> | string
    amount?: DecimalFilter<"transactions"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"transactions"> | string
    status?: Enumtransactions_statusFilter<"transactions"> | $Enums.transactions_status
    description?: StringNullableFilter<"transactions"> | string | null
    hmac_md5?: StringFilter<"transactions"> | string
    updated_at?: DateTimeFilter<"transactions"> | Date | string
  }, "transaction_id">

  export type transactionsOrderByWithAggregationInput = {
    transaction_id?: SortOrder
    created_at?: SortOrder
    origin_iban?: SortOrder
    destination_iban?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    description?: SortOrderInput | SortOrder
    hmac_md5?: SortOrder
    updated_at?: SortOrder
    _count?: transactionsCountOrderByAggregateInput
    _avg?: transactionsAvgOrderByAggregateInput
    _max?: transactionsMaxOrderByAggregateInput
    _min?: transactionsMinOrderByAggregateInput
    _sum?: transactionsSumOrderByAggregateInput
  }

  export type transactionsScalarWhereWithAggregatesInput = {
    AND?: transactionsScalarWhereWithAggregatesInput | transactionsScalarWhereWithAggregatesInput[]
    OR?: transactionsScalarWhereWithAggregatesInput[]
    NOT?: transactionsScalarWhereWithAggregatesInput | transactionsScalarWhereWithAggregatesInput[]
    transaction_id?: StringWithAggregatesFilter<"transactions"> | string
    created_at?: DateTimeWithAggregatesFilter<"transactions"> | Date | string
    origin_iban?: StringWithAggregatesFilter<"transactions"> | string
    destination_iban?: StringWithAggregatesFilter<"transactions"> | string
    amount?: DecimalWithAggregatesFilter<"transactions"> | Decimal | DecimalJsLike | number | string
    currency?: StringWithAggregatesFilter<"transactions"> | string
    status?: Enumtransactions_statusWithAggregatesFilter<"transactions"> | $Enums.transactions_status
    description?: StringNullableWithAggregatesFilter<"transactions"> | string | null
    hmac_md5?: StringWithAggregatesFilter<"transactions"> | string
    updated_at?: DateTimeWithAggregatesFilter<"transactions"> | Date | string
  }

  export type usersWhereInput = {
    AND?: usersWhereInput | usersWhereInput[]
    OR?: usersWhereInput[]
    NOT?: usersWhereInput | usersWhereInput[]
    identification?: StringFilter<"users"> | string
    name?: StringFilter<"users"> | string
    last_name?: StringFilter<"users"> | string
    second_last_name?: StringNullableFilter<"users"> | string | null
    phone?: StringFilter<"users"> | string
    email?: StringFilter<"users"> | string
    password_hash?: StringFilter<"users"> | string
    user_type?: StringFilter<"users"> | string
    account_iban?: StringFilter<"users"> | string
    created_at?: DateTimeFilter<"users"> | Date | string
    updated_at?: DateTimeFilter<"users"> | Date | string
    mfa_codes?: Mfa_codesListRelationFilter
    accounts?: XOR<AccountsScalarRelationFilter, accountsWhereInput>
  }

  export type usersOrderByWithRelationInput = {
    identification?: SortOrder
    name?: SortOrder
    last_name?: SortOrder
    second_last_name?: SortOrderInput | SortOrder
    phone?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    user_type?: SortOrder
    account_iban?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    mfa_codes?: mfa_codesOrderByRelationAggregateInput
    accounts?: accountsOrderByWithRelationInput
    _relevance?: usersOrderByRelevanceInput
  }

  export type usersWhereUniqueInput = Prisma.AtLeast<{
    identification?: string
    phone?: string
    email?: string
    AND?: usersWhereInput | usersWhereInput[]
    OR?: usersWhereInput[]
    NOT?: usersWhereInput | usersWhereInput[]
    name?: StringFilter<"users"> | string
    last_name?: StringFilter<"users"> | string
    second_last_name?: StringNullableFilter<"users"> | string | null
    password_hash?: StringFilter<"users"> | string
    user_type?: StringFilter<"users"> | string
    account_iban?: StringFilter<"users"> | string
    created_at?: DateTimeFilter<"users"> | Date | string
    updated_at?: DateTimeFilter<"users"> | Date | string
    mfa_codes?: Mfa_codesListRelationFilter
    accounts?: XOR<AccountsScalarRelationFilter, accountsWhereInput>
  }, "identification" | "phone" | "email">

  export type usersOrderByWithAggregationInput = {
    identification?: SortOrder
    name?: SortOrder
    last_name?: SortOrder
    second_last_name?: SortOrderInput | SortOrder
    phone?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    user_type?: SortOrder
    account_iban?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: usersCountOrderByAggregateInput
    _max?: usersMaxOrderByAggregateInput
    _min?: usersMinOrderByAggregateInput
  }

  export type usersScalarWhereWithAggregatesInput = {
    AND?: usersScalarWhereWithAggregatesInput | usersScalarWhereWithAggregatesInput[]
    OR?: usersScalarWhereWithAggregatesInput[]
    NOT?: usersScalarWhereWithAggregatesInput | usersScalarWhereWithAggregatesInput[]
    identification?: StringWithAggregatesFilter<"users"> | string
    name?: StringWithAggregatesFilter<"users"> | string
    last_name?: StringWithAggregatesFilter<"users"> | string
    second_last_name?: StringNullableWithAggregatesFilter<"users"> | string | null
    phone?: StringWithAggregatesFilter<"users"> | string
    email?: StringWithAggregatesFilter<"users"> | string
    password_hash?: StringWithAggregatesFilter<"users"> | string
    user_type?: StringWithAggregatesFilter<"users"> | string
    account_iban?: StringWithAggregatesFilter<"users"> | string
    created_at?: DateTimeWithAggregatesFilter<"users"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"users"> | Date | string
  }

  export type sinpe_subscriptionsWhereInput = {
    AND?: sinpe_subscriptionsWhereInput | sinpe_subscriptionsWhereInput[]
    OR?: sinpe_subscriptionsWhereInput[]
    NOT?: sinpe_subscriptionsWhereInput | sinpe_subscriptionsWhereInput[]
    sinpe_number?: StringFilter<"sinpe_subscriptions"> | string
    sinpe_client_name?: StringFilter<"sinpe_subscriptions"> | string
    sinpe_bank_code?: StringFilter<"sinpe_subscriptions"> | string
  }

  export type sinpe_subscriptionsOrderByWithRelationInput = {
    sinpe_number?: SortOrder
    sinpe_client_name?: SortOrder
    sinpe_bank_code?: SortOrder
    _relevance?: sinpe_subscriptionsOrderByRelevanceInput
  }

  export type sinpe_subscriptionsWhereUniqueInput = Prisma.AtLeast<{
    sinpe_number?: string
    sinpe_client_name?: string
    AND?: sinpe_subscriptionsWhereInput | sinpe_subscriptionsWhereInput[]
    OR?: sinpe_subscriptionsWhereInput[]
    NOT?: sinpe_subscriptionsWhereInput | sinpe_subscriptionsWhereInput[]
    sinpe_bank_code?: StringFilter<"sinpe_subscriptions"> | string
  }, "sinpe_number" | "sinpe_client_name">

  export type sinpe_subscriptionsOrderByWithAggregationInput = {
    sinpe_number?: SortOrder
    sinpe_client_name?: SortOrder
    sinpe_bank_code?: SortOrder
    _count?: sinpe_subscriptionsCountOrderByAggregateInput
    _max?: sinpe_subscriptionsMaxOrderByAggregateInput
    _min?: sinpe_subscriptionsMinOrderByAggregateInput
  }

  export type sinpe_subscriptionsScalarWhereWithAggregatesInput = {
    AND?: sinpe_subscriptionsScalarWhereWithAggregatesInput | sinpe_subscriptionsScalarWhereWithAggregatesInput[]
    OR?: sinpe_subscriptionsScalarWhereWithAggregatesInput[]
    NOT?: sinpe_subscriptionsScalarWhereWithAggregatesInput | sinpe_subscriptionsScalarWhereWithAggregatesInput[]
    sinpe_number?: StringWithAggregatesFilter<"sinpe_subscriptions"> | string
    sinpe_client_name?: StringWithAggregatesFilter<"sinpe_subscriptions"> | string
    sinpe_bank_code?: StringWithAggregatesFilter<"sinpe_subscriptions"> | string
  }

  export type accountsCreateInput = {
    iban: string
    account_number: string
    account_type: $Enums.accounts_account_type
    account_holder: string
    balance?: Decimal | DecimalJsLike | number | string
    status?: $Enums.accounts_status
    created_at?: Date | string
    updated_at?: Date | string
    users?: usersCreateNestedManyWithoutAccountsInput
  }

  export type accountsUncheckedCreateInput = {
    iban: string
    account_number: string
    account_type: $Enums.accounts_account_type
    account_holder: string
    balance?: Decimal | DecimalJsLike | number | string
    status?: $Enums.accounts_status
    created_at?: Date | string
    updated_at?: Date | string
    users?: usersUncheckedCreateNestedManyWithoutAccountsInput
  }

  export type accountsUpdateInput = {
    iban?: StringFieldUpdateOperationsInput | string
    account_number?: StringFieldUpdateOperationsInput | string
    account_type?: Enumaccounts_account_typeFieldUpdateOperationsInput | $Enums.accounts_account_type
    account_holder?: StringFieldUpdateOperationsInput | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: Enumaccounts_statusFieldUpdateOperationsInput | $Enums.accounts_status
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: usersUpdateManyWithoutAccountsNestedInput
  }

  export type accountsUncheckedUpdateInput = {
    iban?: StringFieldUpdateOperationsInput | string
    account_number?: StringFieldUpdateOperationsInput | string
    account_type?: Enumaccounts_account_typeFieldUpdateOperationsInput | $Enums.accounts_account_type
    account_holder?: StringFieldUpdateOperationsInput | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: Enumaccounts_statusFieldUpdateOperationsInput | $Enums.accounts_status
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: usersUncheckedUpdateManyWithoutAccountsNestedInput
  }

  export type accountsCreateManyInput = {
    iban: string
    account_number: string
    account_type: $Enums.accounts_account_type
    account_holder: string
    balance?: Decimal | DecimalJsLike | number | string
    status?: $Enums.accounts_status
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type accountsUpdateManyMutationInput = {
    iban?: StringFieldUpdateOperationsInput | string
    account_number?: StringFieldUpdateOperationsInput | string
    account_type?: Enumaccounts_account_typeFieldUpdateOperationsInput | $Enums.accounts_account_type
    account_holder?: StringFieldUpdateOperationsInput | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: Enumaccounts_statusFieldUpdateOperationsInput | $Enums.accounts_status
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type accountsUncheckedUpdateManyInput = {
    iban?: StringFieldUpdateOperationsInput | string
    account_number?: StringFieldUpdateOperationsInput | string
    account_type?: Enumaccounts_account_typeFieldUpdateOperationsInput | $Enums.accounts_account_type
    account_holder?: StringFieldUpdateOperationsInput | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: Enumaccounts_statusFieldUpdateOperationsInput | $Enums.accounts_status
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type mfa_codesCreateInput = {
    mfa_code: string
    created_at?: Date | string
    expires_at: Date | string
    used?: boolean
    users: usersCreateNestedOneWithoutMfa_codesInput
  }

  export type mfa_codesUncheckedCreateInput = {
    id?: number
    user_id: string
    mfa_code: string
    created_at?: Date | string
    expires_at: Date | string
    used?: boolean
  }

  export type mfa_codesUpdateInput = {
    mfa_code?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    users?: usersUpdateOneRequiredWithoutMfa_codesNestedInput
  }

  export type mfa_codesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: StringFieldUpdateOperationsInput | string
    mfa_code?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
  }

  export type mfa_codesCreateManyInput = {
    id?: number
    user_id: string
    mfa_code: string
    created_at?: Date | string
    expires_at: Date | string
    used?: boolean
  }

  export type mfa_codesUpdateManyMutationInput = {
    mfa_code?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
  }

  export type mfa_codesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: StringFieldUpdateOperationsInput | string
    mfa_code?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
  }

  export type transactionsCreateInput = {
    transaction_id?: string
    created_at?: Date | string
    origin_iban: string
    destination_iban: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: $Enums.transactions_status
    description?: string | null
    hmac_md5: string
    updated_at?: Date | string
  }

  export type transactionsUncheckedCreateInput = {
    transaction_id?: string
    created_at?: Date | string
    origin_iban: string
    destination_iban: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: $Enums.transactions_status
    description?: string | null
    hmac_md5: string
    updated_at?: Date | string
  }

  export type transactionsUpdateInput = {
    transaction_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    origin_iban?: StringFieldUpdateOperationsInput | string
    destination_iban?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: Enumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status
    description?: NullableStringFieldUpdateOperationsInput | string | null
    hmac_md5?: StringFieldUpdateOperationsInput | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type transactionsUncheckedUpdateInput = {
    transaction_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    origin_iban?: StringFieldUpdateOperationsInput | string
    destination_iban?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: Enumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status
    description?: NullableStringFieldUpdateOperationsInput | string | null
    hmac_md5?: StringFieldUpdateOperationsInput | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type transactionsCreateManyInput = {
    transaction_id?: string
    created_at?: Date | string
    origin_iban: string
    destination_iban: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: $Enums.transactions_status
    description?: string | null
    hmac_md5: string
    updated_at?: Date | string
  }

  export type transactionsUpdateManyMutationInput = {
    transaction_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    origin_iban?: StringFieldUpdateOperationsInput | string
    destination_iban?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: Enumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status
    description?: NullableStringFieldUpdateOperationsInput | string | null
    hmac_md5?: StringFieldUpdateOperationsInput | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type transactionsUncheckedUpdateManyInput = {
    transaction_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    origin_iban?: StringFieldUpdateOperationsInput | string
    destination_iban?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: Enumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status
    description?: NullableStringFieldUpdateOperationsInput | string | null
    hmac_md5?: StringFieldUpdateOperationsInput | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type usersCreateInput = {
    identification: string
    name: string
    last_name: string
    second_last_name?: string | null
    phone: string
    email: string
    password_hash: string
    user_type?: string
    created_at?: Date | string
    updated_at?: Date | string
    mfa_codes?: mfa_codesCreateNestedManyWithoutUsersInput
    accounts: accountsCreateNestedOneWithoutUsersInput
  }

  export type usersUncheckedCreateInput = {
    identification: string
    name: string
    last_name: string
    second_last_name?: string | null
    phone: string
    email: string
    password_hash: string
    user_type?: string
    account_iban: string
    created_at?: Date | string
    updated_at?: Date | string
    mfa_codes?: mfa_codesUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersUpdateInput = {
    identification?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    second_last_name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    user_type?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    mfa_codes?: mfa_codesUpdateManyWithoutUsersNestedInput
    accounts?: accountsUpdateOneRequiredWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateInput = {
    identification?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    second_last_name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    user_type?: StringFieldUpdateOperationsInput | string
    account_iban?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    mfa_codes?: mfa_codesUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type usersCreateManyInput = {
    identification: string
    name: string
    last_name: string
    second_last_name?: string | null
    phone: string
    email: string
    password_hash: string
    user_type?: string
    account_iban: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type usersUpdateManyMutationInput = {
    identification?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    second_last_name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    user_type?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type usersUncheckedUpdateManyInput = {
    identification?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    second_last_name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    user_type?: StringFieldUpdateOperationsInput | string
    account_iban?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type sinpe_subscriptionsCreateInput = {
    sinpe_number: string
    sinpe_client_name: string
    sinpe_bank_code: string
  }

  export type sinpe_subscriptionsUncheckedCreateInput = {
    sinpe_number: string
    sinpe_client_name: string
    sinpe_bank_code: string
  }

  export type sinpe_subscriptionsUpdateInput = {
    sinpe_number?: StringFieldUpdateOperationsInput | string
    sinpe_client_name?: StringFieldUpdateOperationsInput | string
    sinpe_bank_code?: StringFieldUpdateOperationsInput | string
  }

  export type sinpe_subscriptionsUncheckedUpdateInput = {
    sinpe_number?: StringFieldUpdateOperationsInput | string
    sinpe_client_name?: StringFieldUpdateOperationsInput | string
    sinpe_bank_code?: StringFieldUpdateOperationsInput | string
  }

  export type sinpe_subscriptionsCreateManyInput = {
    sinpe_number: string
    sinpe_client_name: string
    sinpe_bank_code: string
  }

  export type sinpe_subscriptionsUpdateManyMutationInput = {
    sinpe_number?: StringFieldUpdateOperationsInput | string
    sinpe_client_name?: StringFieldUpdateOperationsInput | string
    sinpe_bank_code?: StringFieldUpdateOperationsInput | string
  }

  export type sinpe_subscriptionsUncheckedUpdateManyInput = {
    sinpe_number?: StringFieldUpdateOperationsInput | string
    sinpe_client_name?: StringFieldUpdateOperationsInput | string
    sinpe_bank_code?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type Enumaccounts_account_typeFilter<$PrismaModel = never> = {
    equals?: $Enums.accounts_account_type | Enumaccounts_account_typeFieldRefInput<$PrismaModel>
    in?: $Enums.accounts_account_type[]
    notIn?: $Enums.accounts_account_type[]
    not?: NestedEnumaccounts_account_typeFilter<$PrismaModel> | $Enums.accounts_account_type
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type Enumaccounts_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.accounts_status | Enumaccounts_statusFieldRefInput<$PrismaModel>
    in?: $Enums.accounts_status[]
    notIn?: $Enums.accounts_status[]
    not?: NestedEnumaccounts_statusFilter<$PrismaModel> | $Enums.accounts_status
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UsersListRelationFilter = {
    every?: usersWhereInput
    some?: usersWhereInput
    none?: usersWhereInput
  }

  export type usersOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type accountsOrderByRelevanceInput = {
    fields: accountsOrderByRelevanceFieldEnum | accountsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type accountsCountOrderByAggregateInput = {
    iban?: SortOrder
    account_number?: SortOrder
    account_type?: SortOrder
    account_holder?: SortOrder
    balance?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type accountsAvgOrderByAggregateInput = {
    balance?: SortOrder
  }

  export type accountsMaxOrderByAggregateInput = {
    iban?: SortOrder
    account_number?: SortOrder
    account_type?: SortOrder
    account_holder?: SortOrder
    balance?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type accountsMinOrderByAggregateInput = {
    iban?: SortOrder
    account_number?: SortOrder
    account_type?: SortOrder
    account_holder?: SortOrder
    balance?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type accountsSumOrderByAggregateInput = {
    balance?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type Enumaccounts_account_typeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.accounts_account_type | Enumaccounts_account_typeFieldRefInput<$PrismaModel>
    in?: $Enums.accounts_account_type[]
    notIn?: $Enums.accounts_account_type[]
    not?: NestedEnumaccounts_account_typeWithAggregatesFilter<$PrismaModel> | $Enums.accounts_account_type
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumaccounts_account_typeFilter<$PrismaModel>
    _max?: NestedEnumaccounts_account_typeFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type Enumaccounts_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.accounts_status | Enumaccounts_statusFieldRefInput<$PrismaModel>
    in?: $Enums.accounts_status[]
    notIn?: $Enums.accounts_status[]
    not?: NestedEnumaccounts_statusWithAggregatesFilter<$PrismaModel> | $Enums.accounts_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumaccounts_statusFilter<$PrismaModel>
    _max?: NestedEnumaccounts_statusFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UsersScalarRelationFilter = {
    is?: usersWhereInput
    isNot?: usersWhereInput
  }

  export type mfa_codesOrderByRelevanceInput = {
    fields: mfa_codesOrderByRelevanceFieldEnum | mfa_codesOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type mfa_codesCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    mfa_code?: SortOrder
    created_at?: SortOrder
    expires_at?: SortOrder
    used?: SortOrder
  }

  export type mfa_codesAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type mfa_codesMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    mfa_code?: SortOrder
    created_at?: SortOrder
    expires_at?: SortOrder
    used?: SortOrder
  }

  export type mfa_codesMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    mfa_code?: SortOrder
    created_at?: SortOrder
    expires_at?: SortOrder
    used?: SortOrder
  }

  export type mfa_codesSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type Enumtransactions_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.transactions_status | Enumtransactions_statusFieldRefInput<$PrismaModel>
    in?: $Enums.transactions_status[]
    notIn?: $Enums.transactions_status[]
    not?: NestedEnumtransactions_statusFilter<$PrismaModel> | $Enums.transactions_status
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type transactionsOrderByRelevanceInput = {
    fields: transactionsOrderByRelevanceFieldEnum | transactionsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type transactionsCountOrderByAggregateInput = {
    transaction_id?: SortOrder
    created_at?: SortOrder
    origin_iban?: SortOrder
    destination_iban?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    description?: SortOrder
    hmac_md5?: SortOrder
    updated_at?: SortOrder
  }

  export type transactionsAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type transactionsMaxOrderByAggregateInput = {
    transaction_id?: SortOrder
    created_at?: SortOrder
    origin_iban?: SortOrder
    destination_iban?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    description?: SortOrder
    hmac_md5?: SortOrder
    updated_at?: SortOrder
  }

  export type transactionsMinOrderByAggregateInput = {
    transaction_id?: SortOrder
    created_at?: SortOrder
    origin_iban?: SortOrder
    destination_iban?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    description?: SortOrder
    hmac_md5?: SortOrder
    updated_at?: SortOrder
  }

  export type transactionsSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type Enumtransactions_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.transactions_status | Enumtransactions_statusFieldRefInput<$PrismaModel>
    in?: $Enums.transactions_status[]
    notIn?: $Enums.transactions_status[]
    not?: NestedEnumtransactions_statusWithAggregatesFilter<$PrismaModel> | $Enums.transactions_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumtransactions_statusFilter<$PrismaModel>
    _max?: NestedEnumtransactions_statusFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type Mfa_codesListRelationFilter = {
    every?: mfa_codesWhereInput
    some?: mfa_codesWhereInput
    none?: mfa_codesWhereInput
  }

  export type AccountsScalarRelationFilter = {
    is?: accountsWhereInput
    isNot?: accountsWhereInput
  }

  export type mfa_codesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type usersOrderByRelevanceInput = {
    fields: usersOrderByRelevanceFieldEnum | usersOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type usersCountOrderByAggregateInput = {
    identification?: SortOrder
    name?: SortOrder
    last_name?: SortOrder
    second_last_name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    user_type?: SortOrder
    account_iban?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type usersMaxOrderByAggregateInput = {
    identification?: SortOrder
    name?: SortOrder
    last_name?: SortOrder
    second_last_name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    user_type?: SortOrder
    account_iban?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type usersMinOrderByAggregateInput = {
    identification?: SortOrder
    name?: SortOrder
    last_name?: SortOrder
    second_last_name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    user_type?: SortOrder
    account_iban?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type sinpe_subscriptionsOrderByRelevanceInput = {
    fields: sinpe_subscriptionsOrderByRelevanceFieldEnum | sinpe_subscriptionsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type sinpe_subscriptionsCountOrderByAggregateInput = {
    sinpe_number?: SortOrder
    sinpe_client_name?: SortOrder
    sinpe_bank_code?: SortOrder
  }

  export type sinpe_subscriptionsMaxOrderByAggregateInput = {
    sinpe_number?: SortOrder
    sinpe_client_name?: SortOrder
    sinpe_bank_code?: SortOrder
  }

  export type sinpe_subscriptionsMinOrderByAggregateInput = {
    sinpe_number?: SortOrder
    sinpe_client_name?: SortOrder
    sinpe_bank_code?: SortOrder
  }

  export type usersCreateNestedManyWithoutAccountsInput = {
    create?: XOR<usersCreateWithoutAccountsInput, usersUncheckedCreateWithoutAccountsInput> | usersCreateWithoutAccountsInput[] | usersUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: usersCreateOrConnectWithoutAccountsInput | usersCreateOrConnectWithoutAccountsInput[]
    createMany?: usersCreateManyAccountsInputEnvelope
    connect?: usersWhereUniqueInput | usersWhereUniqueInput[]
  }

  export type usersUncheckedCreateNestedManyWithoutAccountsInput = {
    create?: XOR<usersCreateWithoutAccountsInput, usersUncheckedCreateWithoutAccountsInput> | usersCreateWithoutAccountsInput[] | usersUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: usersCreateOrConnectWithoutAccountsInput | usersCreateOrConnectWithoutAccountsInput[]
    createMany?: usersCreateManyAccountsInputEnvelope
    connect?: usersWhereUniqueInput | usersWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type Enumaccounts_account_typeFieldUpdateOperationsInput = {
    set?: $Enums.accounts_account_type
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type Enumaccounts_statusFieldUpdateOperationsInput = {
    set?: $Enums.accounts_status
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type usersUpdateManyWithoutAccountsNestedInput = {
    create?: XOR<usersCreateWithoutAccountsInput, usersUncheckedCreateWithoutAccountsInput> | usersCreateWithoutAccountsInput[] | usersUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: usersCreateOrConnectWithoutAccountsInput | usersCreateOrConnectWithoutAccountsInput[]
    upsert?: usersUpsertWithWhereUniqueWithoutAccountsInput | usersUpsertWithWhereUniqueWithoutAccountsInput[]
    createMany?: usersCreateManyAccountsInputEnvelope
    set?: usersWhereUniqueInput | usersWhereUniqueInput[]
    disconnect?: usersWhereUniqueInput | usersWhereUniqueInput[]
    delete?: usersWhereUniqueInput | usersWhereUniqueInput[]
    connect?: usersWhereUniqueInput | usersWhereUniqueInput[]
    update?: usersUpdateWithWhereUniqueWithoutAccountsInput | usersUpdateWithWhereUniqueWithoutAccountsInput[]
    updateMany?: usersUpdateManyWithWhereWithoutAccountsInput | usersUpdateManyWithWhereWithoutAccountsInput[]
    deleteMany?: usersScalarWhereInput | usersScalarWhereInput[]
  }

  export type usersUncheckedUpdateManyWithoutAccountsNestedInput = {
    create?: XOR<usersCreateWithoutAccountsInput, usersUncheckedCreateWithoutAccountsInput> | usersCreateWithoutAccountsInput[] | usersUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: usersCreateOrConnectWithoutAccountsInput | usersCreateOrConnectWithoutAccountsInput[]
    upsert?: usersUpsertWithWhereUniqueWithoutAccountsInput | usersUpsertWithWhereUniqueWithoutAccountsInput[]
    createMany?: usersCreateManyAccountsInputEnvelope
    set?: usersWhereUniqueInput | usersWhereUniqueInput[]
    disconnect?: usersWhereUniqueInput | usersWhereUniqueInput[]
    delete?: usersWhereUniqueInput | usersWhereUniqueInput[]
    connect?: usersWhereUniqueInput | usersWhereUniqueInput[]
    update?: usersUpdateWithWhereUniqueWithoutAccountsInput | usersUpdateWithWhereUniqueWithoutAccountsInput[]
    updateMany?: usersUpdateManyWithWhereWithoutAccountsInput | usersUpdateManyWithWhereWithoutAccountsInput[]
    deleteMany?: usersScalarWhereInput | usersScalarWhereInput[]
  }

  export type usersCreateNestedOneWithoutMfa_codesInput = {
    create?: XOR<usersCreateWithoutMfa_codesInput, usersUncheckedCreateWithoutMfa_codesInput>
    connectOrCreate?: usersCreateOrConnectWithoutMfa_codesInput
    connect?: usersWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type usersUpdateOneRequiredWithoutMfa_codesNestedInput = {
    create?: XOR<usersCreateWithoutMfa_codesInput, usersUncheckedCreateWithoutMfa_codesInput>
    connectOrCreate?: usersCreateOrConnectWithoutMfa_codesInput
    upsert?: usersUpsertWithoutMfa_codesInput
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutMfa_codesInput, usersUpdateWithoutMfa_codesInput>, usersUncheckedUpdateWithoutMfa_codesInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type Enumtransactions_statusFieldUpdateOperationsInput = {
    set?: $Enums.transactions_status
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type mfa_codesCreateNestedManyWithoutUsersInput = {
    create?: XOR<mfa_codesCreateWithoutUsersInput, mfa_codesUncheckedCreateWithoutUsersInput> | mfa_codesCreateWithoutUsersInput[] | mfa_codesUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: mfa_codesCreateOrConnectWithoutUsersInput | mfa_codesCreateOrConnectWithoutUsersInput[]
    createMany?: mfa_codesCreateManyUsersInputEnvelope
    connect?: mfa_codesWhereUniqueInput | mfa_codesWhereUniqueInput[]
  }

  export type accountsCreateNestedOneWithoutUsersInput = {
    create?: XOR<accountsCreateWithoutUsersInput, accountsUncheckedCreateWithoutUsersInput>
    connectOrCreate?: accountsCreateOrConnectWithoutUsersInput
    connect?: accountsWhereUniqueInput
  }

  export type mfa_codesUncheckedCreateNestedManyWithoutUsersInput = {
    create?: XOR<mfa_codesCreateWithoutUsersInput, mfa_codesUncheckedCreateWithoutUsersInput> | mfa_codesCreateWithoutUsersInput[] | mfa_codesUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: mfa_codesCreateOrConnectWithoutUsersInput | mfa_codesCreateOrConnectWithoutUsersInput[]
    createMany?: mfa_codesCreateManyUsersInputEnvelope
    connect?: mfa_codesWhereUniqueInput | mfa_codesWhereUniqueInput[]
  }

  export type mfa_codesUpdateManyWithoutUsersNestedInput = {
    create?: XOR<mfa_codesCreateWithoutUsersInput, mfa_codesUncheckedCreateWithoutUsersInput> | mfa_codesCreateWithoutUsersInput[] | mfa_codesUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: mfa_codesCreateOrConnectWithoutUsersInput | mfa_codesCreateOrConnectWithoutUsersInput[]
    upsert?: mfa_codesUpsertWithWhereUniqueWithoutUsersInput | mfa_codesUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: mfa_codesCreateManyUsersInputEnvelope
    set?: mfa_codesWhereUniqueInput | mfa_codesWhereUniqueInput[]
    disconnect?: mfa_codesWhereUniqueInput | mfa_codesWhereUniqueInput[]
    delete?: mfa_codesWhereUniqueInput | mfa_codesWhereUniqueInput[]
    connect?: mfa_codesWhereUniqueInput | mfa_codesWhereUniqueInput[]
    update?: mfa_codesUpdateWithWhereUniqueWithoutUsersInput | mfa_codesUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: mfa_codesUpdateManyWithWhereWithoutUsersInput | mfa_codesUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: mfa_codesScalarWhereInput | mfa_codesScalarWhereInput[]
  }

  export type accountsUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<accountsCreateWithoutUsersInput, accountsUncheckedCreateWithoutUsersInput>
    connectOrCreate?: accountsCreateOrConnectWithoutUsersInput
    upsert?: accountsUpsertWithoutUsersInput
    connect?: accountsWhereUniqueInput
    update?: XOR<XOR<accountsUpdateToOneWithWhereWithoutUsersInput, accountsUpdateWithoutUsersInput>, accountsUncheckedUpdateWithoutUsersInput>
  }

  export type mfa_codesUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: XOR<mfa_codesCreateWithoutUsersInput, mfa_codesUncheckedCreateWithoutUsersInput> | mfa_codesCreateWithoutUsersInput[] | mfa_codesUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: mfa_codesCreateOrConnectWithoutUsersInput | mfa_codesCreateOrConnectWithoutUsersInput[]
    upsert?: mfa_codesUpsertWithWhereUniqueWithoutUsersInput | mfa_codesUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: mfa_codesCreateManyUsersInputEnvelope
    set?: mfa_codesWhereUniqueInput | mfa_codesWhereUniqueInput[]
    disconnect?: mfa_codesWhereUniqueInput | mfa_codesWhereUniqueInput[]
    delete?: mfa_codesWhereUniqueInput | mfa_codesWhereUniqueInput[]
    connect?: mfa_codesWhereUniqueInput | mfa_codesWhereUniqueInput[]
    update?: mfa_codesUpdateWithWhereUniqueWithoutUsersInput | mfa_codesUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: mfa_codesUpdateManyWithWhereWithoutUsersInput | mfa_codesUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: mfa_codesScalarWhereInput | mfa_codesScalarWhereInput[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumaccounts_account_typeFilter<$PrismaModel = never> = {
    equals?: $Enums.accounts_account_type | Enumaccounts_account_typeFieldRefInput<$PrismaModel>
    in?: $Enums.accounts_account_type[]
    notIn?: $Enums.accounts_account_type[]
    not?: NestedEnumaccounts_account_typeFilter<$PrismaModel> | $Enums.accounts_account_type
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedEnumaccounts_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.accounts_status | Enumaccounts_statusFieldRefInput<$PrismaModel>
    in?: $Enums.accounts_status[]
    notIn?: $Enums.accounts_status[]
    not?: NestedEnumaccounts_statusFilter<$PrismaModel> | $Enums.accounts_status
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumaccounts_account_typeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.accounts_account_type | Enumaccounts_account_typeFieldRefInput<$PrismaModel>
    in?: $Enums.accounts_account_type[]
    notIn?: $Enums.accounts_account_type[]
    not?: NestedEnumaccounts_account_typeWithAggregatesFilter<$PrismaModel> | $Enums.accounts_account_type
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumaccounts_account_typeFilter<$PrismaModel>
    _max?: NestedEnumaccounts_account_typeFilter<$PrismaModel>
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedEnumaccounts_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.accounts_status | Enumaccounts_statusFieldRefInput<$PrismaModel>
    in?: $Enums.accounts_status[]
    notIn?: $Enums.accounts_status[]
    not?: NestedEnumaccounts_statusWithAggregatesFilter<$PrismaModel> | $Enums.accounts_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumaccounts_statusFilter<$PrismaModel>
    _max?: NestedEnumaccounts_statusFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumtransactions_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.transactions_status | Enumtransactions_statusFieldRefInput<$PrismaModel>
    in?: $Enums.transactions_status[]
    notIn?: $Enums.transactions_status[]
    not?: NestedEnumtransactions_statusFilter<$PrismaModel> | $Enums.transactions_status
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumtransactions_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.transactions_status | Enumtransactions_statusFieldRefInput<$PrismaModel>
    in?: $Enums.transactions_status[]
    notIn?: $Enums.transactions_status[]
    not?: NestedEnumtransactions_statusWithAggregatesFilter<$PrismaModel> | $Enums.transactions_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumtransactions_statusFilter<$PrismaModel>
    _max?: NestedEnumtransactions_statusFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type usersCreateWithoutAccountsInput = {
    identification: string
    name: string
    last_name: string
    second_last_name?: string | null
    phone: string
    email: string
    password_hash: string
    user_type?: string
    created_at?: Date | string
    updated_at?: Date | string
    mfa_codes?: mfa_codesCreateNestedManyWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutAccountsInput = {
    identification: string
    name: string
    last_name: string
    second_last_name?: string | null
    phone: string
    email: string
    password_hash: string
    user_type?: string
    created_at?: Date | string
    updated_at?: Date | string
    mfa_codes?: mfa_codesUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutAccountsInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutAccountsInput, usersUncheckedCreateWithoutAccountsInput>
  }

  export type usersCreateManyAccountsInputEnvelope = {
    data: usersCreateManyAccountsInput | usersCreateManyAccountsInput[]
    skipDuplicates?: boolean
  }

  export type usersUpsertWithWhereUniqueWithoutAccountsInput = {
    where: usersWhereUniqueInput
    update: XOR<usersUpdateWithoutAccountsInput, usersUncheckedUpdateWithoutAccountsInput>
    create: XOR<usersCreateWithoutAccountsInput, usersUncheckedCreateWithoutAccountsInput>
  }

  export type usersUpdateWithWhereUniqueWithoutAccountsInput = {
    where: usersWhereUniqueInput
    data: XOR<usersUpdateWithoutAccountsInput, usersUncheckedUpdateWithoutAccountsInput>
  }

  export type usersUpdateManyWithWhereWithoutAccountsInput = {
    where: usersScalarWhereInput
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyWithoutAccountsInput>
  }

  export type usersScalarWhereInput = {
    AND?: usersScalarWhereInput | usersScalarWhereInput[]
    OR?: usersScalarWhereInput[]
    NOT?: usersScalarWhereInput | usersScalarWhereInput[]
    identification?: StringFilter<"users"> | string
    name?: StringFilter<"users"> | string
    last_name?: StringFilter<"users"> | string
    second_last_name?: StringNullableFilter<"users"> | string | null
    phone?: StringFilter<"users"> | string
    email?: StringFilter<"users"> | string
    password_hash?: StringFilter<"users"> | string
    user_type?: StringFilter<"users"> | string
    account_iban?: StringFilter<"users"> | string
    created_at?: DateTimeFilter<"users"> | Date | string
    updated_at?: DateTimeFilter<"users"> | Date | string
  }

  export type usersCreateWithoutMfa_codesInput = {
    identification: string
    name: string
    last_name: string
    second_last_name?: string | null
    phone: string
    email: string
    password_hash: string
    user_type?: string
    created_at?: Date | string
    updated_at?: Date | string
    accounts: accountsCreateNestedOneWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutMfa_codesInput = {
    identification: string
    name: string
    last_name: string
    second_last_name?: string | null
    phone: string
    email: string
    password_hash: string
    user_type?: string
    account_iban: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type usersCreateOrConnectWithoutMfa_codesInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutMfa_codesInput, usersUncheckedCreateWithoutMfa_codesInput>
  }

  export type usersUpsertWithoutMfa_codesInput = {
    update: XOR<usersUpdateWithoutMfa_codesInput, usersUncheckedUpdateWithoutMfa_codesInput>
    create: XOR<usersCreateWithoutMfa_codesInput, usersUncheckedCreateWithoutMfa_codesInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutMfa_codesInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutMfa_codesInput, usersUncheckedUpdateWithoutMfa_codesInput>
  }

  export type usersUpdateWithoutMfa_codesInput = {
    identification?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    second_last_name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    user_type?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: accountsUpdateOneRequiredWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutMfa_codesInput = {
    identification?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    second_last_name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    user_type?: StringFieldUpdateOperationsInput | string
    account_iban?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type mfa_codesCreateWithoutUsersInput = {
    mfa_code: string
    created_at?: Date | string
    expires_at: Date | string
    used?: boolean
  }

  export type mfa_codesUncheckedCreateWithoutUsersInput = {
    id?: number
    mfa_code: string
    created_at?: Date | string
    expires_at: Date | string
    used?: boolean
  }

  export type mfa_codesCreateOrConnectWithoutUsersInput = {
    where: mfa_codesWhereUniqueInput
    create: XOR<mfa_codesCreateWithoutUsersInput, mfa_codesUncheckedCreateWithoutUsersInput>
  }

  export type mfa_codesCreateManyUsersInputEnvelope = {
    data: mfa_codesCreateManyUsersInput | mfa_codesCreateManyUsersInput[]
    skipDuplicates?: boolean
  }

  export type accountsCreateWithoutUsersInput = {
    iban: string
    account_number: string
    account_type: $Enums.accounts_account_type
    account_holder: string
    balance?: Decimal | DecimalJsLike | number | string
    status?: $Enums.accounts_status
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type accountsUncheckedCreateWithoutUsersInput = {
    iban: string
    account_number: string
    account_type: $Enums.accounts_account_type
    account_holder: string
    balance?: Decimal | DecimalJsLike | number | string
    status?: $Enums.accounts_status
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type accountsCreateOrConnectWithoutUsersInput = {
    where: accountsWhereUniqueInput
    create: XOR<accountsCreateWithoutUsersInput, accountsUncheckedCreateWithoutUsersInput>
  }

  export type mfa_codesUpsertWithWhereUniqueWithoutUsersInput = {
    where: mfa_codesWhereUniqueInput
    update: XOR<mfa_codesUpdateWithoutUsersInput, mfa_codesUncheckedUpdateWithoutUsersInput>
    create: XOR<mfa_codesCreateWithoutUsersInput, mfa_codesUncheckedCreateWithoutUsersInput>
  }

  export type mfa_codesUpdateWithWhereUniqueWithoutUsersInput = {
    where: mfa_codesWhereUniqueInput
    data: XOR<mfa_codesUpdateWithoutUsersInput, mfa_codesUncheckedUpdateWithoutUsersInput>
  }

  export type mfa_codesUpdateManyWithWhereWithoutUsersInput = {
    where: mfa_codesScalarWhereInput
    data: XOR<mfa_codesUpdateManyMutationInput, mfa_codesUncheckedUpdateManyWithoutUsersInput>
  }

  export type mfa_codesScalarWhereInput = {
    AND?: mfa_codesScalarWhereInput | mfa_codesScalarWhereInput[]
    OR?: mfa_codesScalarWhereInput[]
    NOT?: mfa_codesScalarWhereInput | mfa_codesScalarWhereInput[]
    id?: IntFilter<"mfa_codes"> | number
    user_id?: StringFilter<"mfa_codes"> | string
    mfa_code?: StringFilter<"mfa_codes"> | string
    created_at?: DateTimeFilter<"mfa_codes"> | Date | string
    expires_at?: DateTimeFilter<"mfa_codes"> | Date | string
    used?: BoolFilter<"mfa_codes"> | boolean
  }

  export type accountsUpsertWithoutUsersInput = {
    update: XOR<accountsUpdateWithoutUsersInput, accountsUncheckedUpdateWithoutUsersInput>
    create: XOR<accountsCreateWithoutUsersInput, accountsUncheckedCreateWithoutUsersInput>
    where?: accountsWhereInput
  }

  export type accountsUpdateToOneWithWhereWithoutUsersInput = {
    where?: accountsWhereInput
    data: XOR<accountsUpdateWithoutUsersInput, accountsUncheckedUpdateWithoutUsersInput>
  }

  export type accountsUpdateWithoutUsersInput = {
    iban?: StringFieldUpdateOperationsInput | string
    account_number?: StringFieldUpdateOperationsInput | string
    account_type?: Enumaccounts_account_typeFieldUpdateOperationsInput | $Enums.accounts_account_type
    account_holder?: StringFieldUpdateOperationsInput | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: Enumaccounts_statusFieldUpdateOperationsInput | $Enums.accounts_status
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type accountsUncheckedUpdateWithoutUsersInput = {
    iban?: StringFieldUpdateOperationsInput | string
    account_number?: StringFieldUpdateOperationsInput | string
    account_type?: Enumaccounts_account_typeFieldUpdateOperationsInput | $Enums.accounts_account_type
    account_holder?: StringFieldUpdateOperationsInput | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: Enumaccounts_statusFieldUpdateOperationsInput | $Enums.accounts_status
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type usersCreateManyAccountsInput = {
    identification: string
    name: string
    last_name: string
    second_last_name?: string | null
    phone: string
    email: string
    password_hash: string
    user_type?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type usersUpdateWithoutAccountsInput = {
    identification?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    second_last_name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    user_type?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    mfa_codes?: mfa_codesUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutAccountsInput = {
    identification?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    second_last_name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    user_type?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    mfa_codes?: mfa_codesUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateManyWithoutAccountsInput = {
    identification?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    second_last_name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    user_type?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type mfa_codesCreateManyUsersInput = {
    id?: number
    mfa_code: string
    created_at?: Date | string
    expires_at: Date | string
    used?: boolean
  }

  export type mfa_codesUpdateWithoutUsersInput = {
    mfa_code?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
  }

  export type mfa_codesUncheckedUpdateWithoutUsersInput = {
    id?: IntFieldUpdateOperationsInput | number
    mfa_code?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
  }

  export type mfa_codesUncheckedUpdateManyWithoutUsersInput = {
    id?: IntFieldUpdateOperationsInput | number
    mfa_code?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}