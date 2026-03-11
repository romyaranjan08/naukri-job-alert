import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const keywords = [
  "react developer",
  "react js developer",
  "reactjs developer",
  "frontend developer",
  "front end developer",
  "ui developer",
  "javascript developer",
  "next js developer",
  "nextjs developer",
  "react redux developer",
  "react hooks developer",
  "react typescript developer",
  "mern stack developer",
  "frontend engineer",
  "ui engineer",
];

export async function getJobs() {
  const browser = await puppeteer.launch({
    headless: false, // important
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();

  const jobs = [];

  for (const keyword of keywords) {
    const search = encodeURIComponent(keyword);

    const url = `https://www.naukri.com/${search}-jobs`;

    await page.goto(url, { waitUntil: "networkidle2" });

    await page.waitForSelector("a.title", { timeout: 20000 });

    const results = await page.evaluate(() => {
      const list = [];

      const jobNodes = document.querySelectorAll("a.title");

      jobNodes.forEach((job) => {
        const title = job.innerText;
        const link = job.href;

        if (title && link) {
          list.push({ title, link });
        }
      });

      return list;
    });

    jobs.push(...results);
  }

  await browser.close();

  const seen = new Set();

  const uniqueJobs = jobs.filter((job) => {
    if (seen.has(job.link)) return false;
    seen.add(job.link);
    return true;
  });

  return uniqueJobs.slice(0, 20);
}
