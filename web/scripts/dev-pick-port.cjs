/**
 * 1) `.next/dev/lock` — jarayon o‘lsa, lock ni olib tashlaydi.
 * 2) Birinchi bo'sh portda `next dev` (3000, 3010, ...).
 *
 * Eski next dev tirik bo'lsa: `SOHA_DEV_KILL=1 npm run dev` (faqat o'z mashinangizda).
 * Ishlatish: node scripts/dev-pick-port.cjs [--webpack]
 */
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const net = require("net");

const root = path.join(__dirname, "..");
const lockPath = path.join(root, ".next", "dev", "lock");
const useWebpack = process.argv.includes("--webpack");
const ports = [3000, 3010, 3020, 3030, 3040, 3050, 3060, 3070, 3080, 3090, 3100];

function isPidRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function syncDevLock() {
  try {
    if (!fs.existsSync(lockPath)) return true;
    const raw = fs.readFileSync(lockPath, "utf8");
    let pid = null;
    try {
      const j = JSON.parse(raw);
      pid = typeof j.pid === "number" ? j.pid : null;
    } catch {
      fs.unlinkSync(lockPath);
      console.log("[dev] Eski lock fayli noto‘g‘ri — olib tashlandi.\n");
      return true;
    }
    if (pid == null || !Number.isFinite(pid)) {
      fs.unlinkSync(lockPath);
      console.log("[dev] Lock ichida PID yo‘q — olib tashlandi.\n");
      return true;
    }
    if (!isPidRunning(pid)) {
      fs.unlinkSync(lockPath);
      console.log(`[dev] Eski dev lock olib tashlandi (PID ${pid} ishlamaydi).\n`);
      return true;
    }
    if (process.env.SOHA_DEV_KILL === "1") {
      try {
        process.kill(pid, "SIGTERM");
        console.log(`[dev] SOHA_DEV_KILL=1: PID ${pid} to'xtatildi.\n`);
      } catch (e) {
        console.warn(`[dev] PID ${pid} ni to'xtatishda xato:`, e.message);
      }
      try {
        fs.unlinkSync(lockPath);
      } catch {
        /* */
      }
      return true;
    }
    console.error("\n  Boshqa `next dev` allaqachon ishlayapti (lock fayl).");
    console.error(`  PID: ${pid}`);
    console.error("\n  Variantlar:");
    console.error(`    kill ${pid}`);
    console.error("    yoki: SOHA_DEV_KILL=1 npm run dev");
    console.error("");
    return false;
  } catch (e) {
    console.warn("[dev] Lock tekshiruvi:", e.message);
    return true;
  }
}

function canListen(port) {
  return new Promise((resolve) => {
    const s = net.createServer();
    s.once("error", () => resolve(false));
    s.once("listening", () => {
      s.close(() => resolve(true));
    });
    s.listen(port, "0.0.0.0");
  });
}

(async () => {
  if (!syncDevLock()) process.exit(1);

  let port = null;
  for (const p of ports) {
    if (await canListen(p)) {
      port = p;
      break;
    }
  }
  if (port == null) {
    console.error("Bo'sh port topilmadi (3000–3100).");
    process.exit(1);
  }

  const url = `http://127.0.0.1:${port}`;
  console.log("\n  SohaCV dev server");
  console.log(`  → ${url}`);
  if (port !== 3000) console.log(`  (3000 band bo'lsa, ${port} ishlatilmoqda)`);
  console.log("");

  const args = ["dev", "-H", "0.0.0.0", "-p", String(port)];
  if (useWebpack) args.push("--webpack");

  let nextCli;
  try {
    nextCli = require.resolve("next/dist/bin/next", { paths: [root] });
  } catch {
    console.error("next topilmadi. `npm install` ni `web/` ichida bajaring.");
    process.exit(1);
  }

  const child = spawn(process.execPath, [nextCli, ...args], {
    stdio: "inherit",
    cwd: root,
    env: { ...process.env, PORT: String(port) },
  });

  child.on("exit", (code) => process.exit(code ?? 0));
})();
