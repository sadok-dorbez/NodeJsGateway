match = require("string-similarity-js");
const stringMatch = (ch, name) => {
  if (!ch) return true;
  if (ch === "") return true;
  ch = ch.trim().toLowerCase();
  name = name.trim().toLowerCase();
  if (name.startsWith(ch)) return true;
  if (match.stringSimilarity(`${ch}`, name) > 0.79) return true;
  return false;
};
module.exports = stringMatch;
