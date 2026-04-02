(function () {
  const _orig = { log: console.log, warn: console.warn, error: console.error, info: console.info, debug: console.debug };

  function send(level, args) {
    window.postMessage({
      type: "__VA_CONSOLE__",
      level: level,
      parts: Array.from(args).map(function (a) {
        try { return typeof a === "object" ? JSON.stringify(a, null, 2) : String(a); }
        catch (e) { return String(a); }
      }),
      ts: Date.now(),
    }, "*");
  }

  ["log", "warn", "error", "info", "debug"].forEach(function (l) {
    console[l] = function () { send(l, arguments); _orig[l].apply(console, arguments); };
  });

  window.addEventListener("error", function (e) {
    send("error", ["Uncaught: " + (e.error && e.error.stack || e.message)]);
  });

  window.addEventListener("unhandledrejection", function (e) {
    send("error", ["Unhandled Promise Rejection: " + (e.reason && e.reason.stack || e.reason)]);
  });
})();
