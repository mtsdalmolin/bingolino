import { sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  timestamp,
  index,
  integer,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";

export const bingos = pgTable(
  "bingos",
  {
    id: serial("id").primaryKey(),
    streamer: text("streamer").notNull(),
    expiredAt: timestamp("expiredAt", { mode: "date", precision: 3 })
      .default(sql`now() + '16 hour'::interval`)
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (bingo) => {
    return {
      b_streamerIndex: index("b_streamerIndex").on(bingo.streamer),
    };
  }
);

export const streamerBingosItems = pgTable(
  "streamer_bingos_items",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    streamer: text("streamer").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (sbi) => {
    return {
      sbi_streamerIndex: index("sbi_streamerIndex").on(sbi.streamer),
    };
  }
);

export const selectedBingoItems = pgTable(
  "selected_bingos_items",
  {
    bingoItemId: integer("bingoItemId").references(
      () => streamerBingosItems.id,
      {
        onUpdate: "cascade",
        onDelete: "cascade",
      }
    ),
    bingoId: integer("bingoId").references(() => bingos.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
    marked: boolean("marked").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (bingoItems) => {
    return {
      bi_pk: primaryKey({
        columns: [bingoItems.bingoId, bingoItems.bingoItemId],
      }),
    };
  }
);
