const { CronJob } = require("cron");
const User = require("./models/user");

const { log } = require("./logger");
const { bot } = require("./bot");

const sec = process.env.CRON_SECONDS;
const min = process.env.CRON_MINS;
const hours = process.env.CRON_HOURS;
const daysMonth = process.env.CRON_DAYS_MONTH;
const month = process.env.CRON_MONTH;
const daysWeek = process.env.CRON_DAYS_WEEK;

module.exports = new CronJob(
  `${sec} ${min} ${hours} ${daysMonth} ${month} ${daysWeek}`,
  async function () {
    log.info("Cron: notifying users..", { source: "cron" });

    const users = await User.find({});

    users.forEach((user) => {
      if (user.notify) {
        bot.telegram.sendMessage(
          user._id,
          "Не забудьте отправить отчёт по питанию! Удачного дня :)"
        );
      }
    });

    log.info("Cron: users notified", { source: "cron" });
  },
  null,
  false,
  "Europe/Minsk"
);
