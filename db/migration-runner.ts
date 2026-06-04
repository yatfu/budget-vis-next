/***
 * CHATGPT CODE
 * runs all sql-migrations, creating the tables within database
 * 
 */

 import fs from "fs";
 import path from "path";
 import { pool } from "./db";
 
 async function migrate() {
   const migrationsDir = path.join(__dirname, "sql-migrations");
 
   const files = fs
     .readdirSync(migrationsDir)
     .filter((f) => f.endsWith(".sql"))
     .sort(); // ensures 001, 002, 003 order
 
   for (const file of files) {
     const filePath = path.join(migrationsDir, file);
     const sql = fs.readFileSync(filePath, "utf-8");
 
     console.log(`Running ${file}...`);
 
     await pool.query(sql);
   }
 
   console.log("All migrations complete");
   await pool.end();
 }
 
 migrate().catch((err) => {
   console.error(err);
   process.exit(1);
 });