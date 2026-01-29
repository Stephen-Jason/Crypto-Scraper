import puppeteer from "puppeteer";
import fs from "fs";
import { Parser } from "json2csv";
import chalk from "chalk";
import boxen from "boxen";

try {
  (async () => {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();

    await page.goto("https://coinmarketcap.com/charts/rsi/", {
      waitUntil: "networkidle0",
    });

    // Wait for table rows to render
    await page.waitForSelector("table tbody tr");

    const data = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll("table tbody tr"));

      return rows.map((row) => {
        const cells = row.querySelectorAll("td");

        return {
          rank: cells[0]?.innerText.trim(),
          name: cells[1]?.innerText.trim(),
          price: cells[2]?.innerText.trim(),
          marketCap: cells[3]?.innerText.trim(),
          volume24h: cells[4]?.innerText.trim(),
          rsi_15m: cells[5]?.innerText.trim(),
          rsi_1h: cells[6]?.innerText.trim(),
          rsi_4h: cells[7]?.innerText.trim(),
          rsi_24h: cells[8]?.innerText.trim(),
          rsi_7d: cells[9]?.innerText.trim(),
        };
      });
    });

    const parser = new Parser();
    const csv = parser.parse(data);

    fs.writeFileSync("crypto-rsi.csv", csv);

    const message =
      chalk.green.bold("✅ SCRAPE COMPLETE\n") +
      chalk.white("Data saved to ") +
      chalk.cyan.bold("crypto-rsi.csv");

    console.log(
      boxen(message, {
        padding: 1,
        borderStyle: "round",
        borderColor: "green",
      }),
    );

    await browser.close();
  })();
} catch (error) {
  const message =
    chalk.red.bold("❌ SCRAPE FAILED\n") + chalk.red(error.message);

  console.log(
    boxen(message, {
      padding: 1,
      borderStyle: "round",
      borderColor: "red",
    }),
  );
}
