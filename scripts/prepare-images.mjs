// Generates the web copies in public/ from the raw originals in assets-src/ (gitignored).
// Run: node scripts/prepare-images.mjs
// Long edge ≤ 2000px, JPEG quality 80, EXIF stripped (no GPS), EXIF rotation applied.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "assets-src";
const OUT = "public";

/** @type {{ from: string; to: string; crop?: sharp.Region; blur?: sharp.Region[] }[]} */
const jobs = [
  // FOS (internship app). 002 shows a client menu banner with an address and phone number: blur it.
  { from: "shots/rms/001_rms.jpg", to: "shots/fos/tables.jpg" },
  {
    from: "shots/rms/002_rms.jpg",
    to: "shots/fos/order.jpg",
    blur: [{ left: 36, top: 1240, width: 490, height: 165 }],
  },

  // AMS
  { from: "shots/ams/003attendance_history_UI.jpg", to: "shots/ams/history.jpg" },
  { from: "shots/ams/004attendance_success_UI.jpg", to: "shots/ams/submitted.jpg" },
  { from: "shots/ams/005error_handling.jpg", to: "shots/ams/offline.jpg" },

  // Vendora: the admin dashboard is cropped above the "Activate Windows" watermark.
  { from: "shots/vendora/20 Salesperson Dashboard.png", to: "shots/vendora/salesperson-dashboard.jpg" },
  {
    from: "shots/vendora/003 Admin Dashboard.png",
    to: "shots/vendora/admin-dashboard.jpg",
    crop: { left: 0, top: 0, width: 1917, height: 780 },
  },

  // Bibhid
  { from: "shots/bibhid/B 3.png", to: "shots/bibhid/admin-overview.jpg" },
  { from: "shots/bibhid/B 2.png", to: "shots/bibhid/login.jpg" },

  // Photos
  { from: "abinash_details/pictures/001main_portfolio_picture.jpeg", to: "photos/portrait.jpg" },
  { from: "abinash_details/pictures/002for_the_background.jpeg", to: "photos/growth-forum-stage.jpg" },
  { from: "abinash_details/pictures/003hosting_the_attendance_pic.jpeg", to: "photos/hosting-college-event.jpg" },
  { from: "abinash_details/pictures/005bizbuzz_2ndrunnerup_photo.jpeg", to: "photos/bizbuzz-trophy.jpg" },
  { from: "abinash_details/pictures/007acknowledgement.jpeg", to: "photos/felicitation-certificate.jpg" },
  { from: "abinash_details/pictures/008acknowledgement_two.jpeg", to: "photos/felicitation-tika.jpg" },
  { from: "abinash_details/pictures/004bim_5th_sem_poster.jpeg", to: "photos/poster-bim-5th-sem.jpg" },
  { from: "abinash_details/pictures/006bim_1stsem_res.jpeg", to: "photos/poster-bim-1st-sem.jpg" },

  // Certificates
  { from: "abinash_details/certificates/Screenshot 2026-10-20 130631.png", to: "certs/tu-topper-bim-1st-sem.jpg" },
  { from: "abinash_details/certificates/Screenshot 2026-10-20 130637.png", to: "certs/tu-2nd-topper-bim-3rd-sem.jpg" },
  { from: "abinash_details/certificates/Screenshot 2026-10-20 130646.png", to: "certs/tu-2nd-topper-bim-6th-sem.jpg" },
  { from: "abinash_details/certificates/Screenshot 2026-10-20 130613.png", to: "certs/bizbuzz-2026.jpg" },
  { from: "abinash_details/certificates/Screenshot 2026-10-20 130605.png", to: "certs/growth-forum-nepal.jpg" },
  { from: "abinash_details/certificates/001_research.png", to: "certs/iccr-2026.jpg" },
  { from: "abinash_details/certificates/Screenshot 2026-10-20 130557.png", to: "certs/steam-paper-writing-workshop.jpg" },
];

for (const job of jobs) {
  const src = path.join(SRC, job.from);
  const dest = path.join(OUT, job.to);
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  // Bake EXIF rotation into the pixels first, so crop/blur coordinates match what you see.
  let buf = await sharp(src).rotate().toBuffer();

  if (job.crop) buf = await sharp(buf).extract(job.crop).toBuffer();

  for (const r of job.blur ?? []) {
    // Pixelate then blur, so text can't be recovered from the result.
    const small = await sharp(buf).extract(r).resize(Math.ceil(r.width / 24), Math.ceil(r.height / 24)).toBuffer();
    const patch = await sharp(small).resize(r.width, r.height, { kernel: "nearest" }).blur(12).toBuffer();
    buf = await sharp(buf).composite([{ input: patch, left: r.left, top: r.top }]).toBuffer();
  }

  const info = await sharp(buf)
    .resize(2000, 2000, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(dest);
  console.log(`${job.to}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}
