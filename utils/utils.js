// get today's day of week
module.exports.getToday = function getToday() {
  let days = [
    "воскресенье",
    "понедельник",
    "вторник",
    "среда",
    "четверг",
    "пятница",
    "суббота",
  ];

  const today = new Date();
  return days[today.getDay()];
};
