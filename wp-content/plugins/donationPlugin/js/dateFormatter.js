const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getOrdinalSuffix(day) {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function formatDate(deadline) {
  const monthName = months[deadline.getMonth()];
  const day = deadline.getDate();
  const year = deadline.getFullYear();
  const ordinalSuffix = getOrdinalSuffix(day);

  return `${monthName} ${day}<sup>${ordinalSuffix}</sup>, ${year}`;
}

export default formatDate;
