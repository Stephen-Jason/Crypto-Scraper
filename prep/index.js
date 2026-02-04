import fs from "fs";
import pkg from "pg";
import chalk from "chalk";
import boxen from "boxen";
import rawData from "../crypto-rsi-clean.json" with {type: "json"};

import {normalizeRaw} from "./normalizeRaw.js";
import {addRsiStates} from "./rsiStates.js";
import {addNormalizedRsi} from "./normalizeRsi.js";
import {addConfluence} from "./confluence.js";
import {addTrendBias} from "./trendBias.js";
import {addChartSeries} from "./chartSeries.js";
import {addFlags} from "./flags.js";

const {Client} = pkg;

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "crypto_investment",
    password: "postgres",
    port: 5432,
});

(async () => {
    try {
        await client.connect();
        const prepared = rawData
            .map(normalizeRaw)
            .sort((a, b) => b.trendBias - a.trendBias);

        fs.writeFileSync(
            "../coins.json",
            JSON.stringify(prepared, null, 2),
        );

        for (const item of prepared) {
            await client.query(`INSERT INTO crypto_data (id, name, symbol, price, market_cap, volume_24h, rsi_d1, rsi_w1)
                                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO
            UPDATE
                SET price = EXCLUDED.price, market_cap = EXCLUDED.market_cap, volume_24h = EXCLUDED.volume_24h, rsi_d1 = EXCLUDED.rsi_d1, rsi_w1 = EXCLUDED.rsi_w1`, [item.id, item.name, item.symbol, item.price, item.marketCap, item.volume24h, item.rsi.d1, item.rsi.w1,]);
        }

        const message =
            chalk.green.bold("✅ PREP COMPLETE\n") +
            chalk.white("Data prepared, and saved to ") +
            chalk.cyan.bold("data/coins.json");

        console.log(boxen(message, {padding: 1, borderColor: "green"}));

    } catch (error) {
        const message =
            chalk.red.bold("❌ PREP FAILED\n") +
            chalk.white("An error occurred during data preparation:\n") +
            chalk.yellow(error.message);
        console.log(boxen(message, {padding: 1, borderColor: "red"}));
    } finally {
        await client.end();
    }
})();