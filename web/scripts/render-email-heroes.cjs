/**
 * Renders the email banner images (public/email/*.png) in the site's style:
 * poster type (Archivo Expanded), violet stage, floating UI cards, orange
 * stickers. No people photos. Run after changing the art:
 *   node scripts/render-email-heroes.cjs
 * Each image is 1120×560 (shown at 560×280 in email, sharp on retina).
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("node:path");
const fs = require("node:fs");
const { chromium } = require("playwright");

const root = path.join(__dirname, "..");
// Inlined as data URLs: a page set with setContent() may not load file:// fonts.
const font = (f) => `url(data:font/woff2;base64,${fs.readFileSync(path.join(root, "src/fonts", f)).toString("base64")}) format("woff2")`;
const OUT = path.join(root, "public/email");

const css = `
@font-face { font-family: Archivo; src: ${font("archivo-latin-wdth-normal.woff2")}; font-stretch: 62% 125%; font-weight: 100 900; }
@font-face { font-family: Figtree; src: ${font("figtree-latin-wght-normal.woff2")}; font-weight: 300 900; }
@font-face { font-family: JB; src: ${font("jetbrains-mono-latin-wght-normal.woff2")}; font-weight: 100 800; }
* { box-sizing: border-box; margin: 0; }
body { width: 560px; height: 280px; overflow: hidden; font-family: Figtree, sans-serif; }
.stage { position: relative; width: 560px; height: 280px; overflow: hidden; }
.poster { position: absolute; inset: 0; top: 14px; text-align: center; font-family: Archivo; font-stretch: 125%; font-weight: 800; letter-spacing: -0.045em; white-space: nowrap; font-size: 96px; line-height: 92px; }
.circle { position: absolute; border-radius: 50%; }
.card { position: absolute; background: #fff; border-radius: 16px; box-shadow: 0 24px 48px -20px rgba(36,24,120,.45); padding: 12px 14px; color: #121226; }
.label { font-size: 9px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #66647c; }
.sticker { position: absolute; background: #ff7a45; color: #fff; font-family: Archivo; font-stretch: 112%; font-weight: 800; font-size: 13px; letter-spacing: .02em; padding: 7px 12px; border-radius: 999px; box-shadow: 0 10px 20px -8px rgba(255,122,69,.7); }
.row { display: flex; align-items: center; justify-content: space-between; gap: 10px; font-size: 11px; font-weight: 600; padding: 5px 0; border-top: 1px solid #eeecf5; }
.ok { color: #0b7a4f; font-weight: 800; }
.miss { color: #c2410c; font-weight: 800; font-size: 10px; }
.ring { width: 46px; height: 46px; border-radius: 50%; background: conic-gradient(#12b76a 0 91%, #e8e6f2 0); display: grid; place-items: center; }
.ring > span { width: 36px; height: 36px; border-radius: 50%; background: #fff; display: grid; place-items: center; font-weight: 800; font-size: 15px; }
.mono { font-family: JB; }
`;

const ats = (left, top, score = 91, note = "Strong match") => `
<div class="card" style="left:${left}px;top:${top}px;width:170px;display:flex;gap:12px;align-items:center">
  <div class="ring" style="background:conic-gradient(#12b76a 0 ${score}%, #e8e6f2 0)"><span>${score}</span></div>
  <div><div class="label">ATS score</div><div style="font-size:13px;font-weight:800;margin-top:2px">${note}</div></div>
</div>`;

const keywords = (left, top) => `
<div class="card" style="left:${left}px;top:${top}px;width:196px">
  <div class="label" style="margin-bottom:4px">Job post keywords</div>
  <div class="row"><span>SQL</span><span class="ok">✓</span></div>
  <div class="row"><span>Roadmapping</span><span class="ok">✓</span></div>
  <div class="row"><span>Stakeholder mgmt</span><span class="miss">Missing</span></div>
</div>`;

const HEROES = {
  // Welcome offer + email confirmation
  welcome: `
<div class="stage" style="background:#5440e8">
  <p class="poster" style="color:#c9c0ff">GET HIRED</p>
  <div class="circle" style="width:330px;height:330px;left:115px;top:150px;background:#4430d6"></div>
  ${ats(46, 142)}
  ${keywords(318, 128)}
  <div class="card" style="left:112px;top:218px;width:190px;padding:10px 12px">
    <div class="label">AI bullet rewrite</div>
    <div style="font-size:11px;font-weight:700;margin-top:3px;line-height:1.35">Cut onboarding time by <span style="background:#dcf5ea;color:#0b4f35;padding:0 3px;border-radius:4px">38%</span> in one quarter</div>
  </div>
  <div class="sticker" style="left:400px;top:96px;transform:rotate(8deg)">WELCOME&nbsp;GIFT</div>
</div>`,
  verify: `
<div class="stage" style="background:#5440e8">
  <p class="poster" style="color:#c9c0ff">ONE CLICK</p>
  <div class="circle" style="width:330px;height:330px;left:115px;top:150px;background:#4430d6"></div>
  <div class="card" style="left:160px;top:136px;width:240px;padding:16px">
    <div style="display:flex;align-items:center;gap:10px">
      <div style="width:34px;height:34px;border-radius:10px;background:#eeebff;color:#5440e8;display:grid;place-items:center;font-weight:900;font-size:18px">✓</div>
      <div><div class="label">Your account</div><div style="font-size:14px;font-weight:800">Email confirmed</div></div>
    </div>
    <div class="row" style="margin-top:10px"><span>Free ATS check</span><span class="ok">Unlocked</span></div>
    <div class="row"><span>Resume import</span><span class="ok">Ready</span></div>
  </div>
  <div class="sticker" style="left:372px;top:118px;transform:rotate(8deg)">+ A GIFT</div>
</div>`,
  winback: `
<div class="stage" style="background:#121226">
  <p class="poster" style="color:#5440e8">NEXT JOB</p>
  <div class="circle" style="width:300px;height:300px;left:-60px;top:170px;background:#1d1b3a"></div>
  <div class="card" style="left:70px;top:132px;width:200px">
    <div class="label">Match score</div>
    <div style="display:flex;align-items:baseline;gap:8px;margin-top:4px"><span style="font-size:26px;font-weight:800;color:#9a98ad">72</span><span style="font-size:16px;color:#9a98ad">→</span><span style="font-size:30px;font-weight:800;color:#0b7a4f">86</span></div>
    <div style="height:6px;border-radius:6px;background:#eeecf5;margin-top:8px"><div style="height:6px;width:86%;border-radius:6px;background:#12b76a"></div></div>
  </div>
  ${keywords(296, 150)}
  <div class="sticker" style="left:390px;top:104px;transform:rotate(-6deg)">STILL&nbsp;LOOKING?</div>
</div>`,
  reset: `
<div class="stage" style="background:#eeebff">
  <p class="poster" style="color:#d9d3ff">BACK IN</p>
  <div class="card" style="left:170px;top:122px;width:220px;padding:16px">
    <div class="label">New password</div>
    <div class="mono" style="margin-top:8px;padding:9px 12px;border:1.5px solid #5440e8;border-radius:10px;font-size:15px;letter-spacing:.2em">••••••••••</div>
    <div style="margin-top:10px;background:#5440e8;color:#fff;border-radius:10px;padding:8px;text-align:center;font-size:12px;font-weight:800">Save password</div>
  </div>
  <div class="sticker" style="left:356px;top:104px;transform:rotate(8deg);background:#121226;box-shadow:none">🔒 SECURE</div>
</div>`,
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  // PW_CHROMIUM: a Chromium binary when the project's Playwright can't find its own.
  const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
  const page = await browser.newPage({ viewport: { width: 560, height: 280 }, deviceScaleFactor: 2 });
  for (const [name, body] of Object.entries(HEROES)) {
    await page.setContent(`<!doctype html><html><head><style>${css}</style></head><body>${body}</body></html>`);
    await page.evaluate(async () => {
      await document.fonts.ready;
      // Shrink the poster line until it fits the banner with a small margin.
      const el = document.querySelector(".poster");
      if (!el) return;
      el.style.width = "max-content";
      el.style.left = "50%";
      el.style.right = "auto";
      el.style.transform = "translateX(-50%)";
      let size = 96;
      while (el.getBoundingClientRect().width > 524 && size > 40) {
        size -= 2;
        el.style.fontSize = `${size}px`;
        el.style.lineHeight = `${Math.round(size * 0.96)}px`;
      }
    });
    await page.screenshot({ path: path.join(OUT, `${name}.png`) });
    console.log(`public/email/${name}.png`);
  }
  await browser.close();
})();
