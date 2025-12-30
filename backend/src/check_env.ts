import dotenv from "dotenv";
import path from "path";

// Try loading from .env
const result = dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("--- Environment Variable Debug ---");
console.log("Dotenv load error:", result.error);
console.log(
  "Parsed keys:",
  result.parsed ? Object.keys(result.parsed) : "None"
);

console.log("\n--- Specific Values ---");
console.log(
  "MAIL_HOST:",
  process.env.MAIL_HOST ? `'${process.env.MAIL_HOST}'` : "UNDEFINED"
);
console.log(
  "MAIL_USERNAME:",
  process.env.MAIL_USERNAME ? "SET (Hidden)" : "UNDEFINED"
);
console.log(
  "MAIL_PORT:",
  process.env.MAIL_PORT ? `'${process.env.MAIL_PORT}'` : "UNDEFINED"
);
console.log(
  "MAIL_ENCRYPTION:",
  process.env.MAIL_ENCRYPTION ? `'${process.env.MAIL_ENCRYPTION}'` : "UNDEFINED"
);
console.log("--------------------------------");
