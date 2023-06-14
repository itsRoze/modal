import { type MySqlTransaction } from "drizzle-orm/mysql-core";
import {
  type PlanetScalePreparedQueryHKT,
  type PlanetscaleQueryResultHKT,
} from "drizzle-orm/planetscale-serverless";
import { Context } from "sst/context";

import { db } from "../../index";

export type Transaction = MySqlTransaction<
  PlanetscaleQueryResultHKT,
  PlanetScalePreparedQueryHKT,
  Record<string, never>
>;

const TransactionContext = Context.create<{
  tx: Transaction;
  effects: (() => void | Promise<void>)[];
}>();

export type ContextProvideArg = {
  tx: Transaction;
  effects: (() => void | Promise<void>)[];
};

export function useTransaction<T>(callback: (trx: Transaction) => Promise<T>) {
  try {
    const { tx } = TransactionContext.use();
    return callback(tx);
  } catch {
    return db.transaction(
      async (tx) => {
        const effects: (() => void | Promise<void>)[] = [];
        TransactionContext.provide({
          tx,
          effects: effects,
        } as ContextProvideArg);
        const result = await callback(tx as Transaction);
        await Promise.all(effects.map((x) => x()));
        return result;
      },
      {
        isolationLevel: "serializable",
      },
    );
  }
}

export function createTransactionEffect(effect: () => void | Promise<void>) {
  const { effects } = TransactionContext.use();
  effects.push(effect);
}
