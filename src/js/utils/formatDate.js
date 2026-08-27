export function formatDate(unixTime) {
  return new Date(unixTime * 1000).toLocaleString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}