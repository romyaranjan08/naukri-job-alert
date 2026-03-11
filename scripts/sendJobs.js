import axios from "axios";
import fs from "fs";
import { getJobs } from "../lib/naukri.js";

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

async function sendJobs() {
  const jobs = await getJobs();

  let sentJobs = [];

  if (fs.existsSync("./data/sentJobs.json")) {
    sentJobs = JSON.parse(fs.readFileSync("./data/sentJobs.json"));
  }

  const newJobs = jobs.filter((job) => !sentJobs.includes(job.link));

  if (!newJobs.length) {
    console.log("No new jobs");
    return;
  }

  let message = "🚀 New React Jobs\n\n";

  newJobs.forEach((job, i) => {
    message += `${i + 1}. ${job.title}\n${job.link}\n\n`;
  });

  await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    chat_id: CHAT_ID,
    text: message,
  });

  const updated = [...sentJobs, ...newJobs.map((j) => j.link)];

  fs.writeFileSync("./data/sentJobs.json", JSON.stringify(updated, null, 2));

  console.log("Jobs sent");
}

sendJobs();
