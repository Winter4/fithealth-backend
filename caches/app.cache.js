const LRU = require("lru-cache");

const cache = new LRU({
  // max count of cache records
  max: 500,

  // record's time to live in ms
  // 60s / 1000ms
  ttl: 60 * 1000,
});

function getRecord(key) {
  return cache.get(key);
}

function setRecord(key, value) {
  cache.set(key, value);
}

function deleteRecord(key) {
  cache.delete(key);
}

module.exports = {
  get: getRecord,
  set: setRecord,
  del: deleteRecord,
};
