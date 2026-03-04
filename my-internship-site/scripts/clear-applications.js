#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

async function main() {
  const args = process.argv.slice(2);
  const yes = args.includes("--yes");

  if (!yes) {
    console.error("Refusing to clear applications without --yes.");
    process.exit(1);
  }

  const projectRoot = process.cwd();

  const applicationsFile = path.join(projectRoot, "data", "applications.json");
  fs.mkdirSync(path.dirname(applicationsFile), { recursive: true });
  fs.writeFileSync(applicationsFile, "[]\n", "utf8");
  console.log(`Cleared file applications data: ${applicationsFile}`);

  let mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    const envFile = path.join(process.cwd(), ".env.local");
    if (fs.existsSync(envFile)) {
      const content = fs.readFileSync(envFile, "utf8");
      const match = content.match(/MONGODB_URI=(.*)/);
      if (match) mongoUri = match[1].trim();
    }
  }
  if (!mongoUri) {
    console.log("MONGODB_URI is not set; skipping MongoDB clear.");
    return;
  }

  await mongoose.connect(mongoUri);
  const result = await mongoose.connection.db.collection("applications").deleteMany({});
  console.log(`Cleared MongoDB applications collection: ${result.deletedCount ?? 0} document(s) deleted.`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error("Failed to clear applications data:", error);
  process.exit(1);
});

