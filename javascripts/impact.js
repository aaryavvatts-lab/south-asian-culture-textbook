/* Live counts for the Impact page, read from this book's public GitHub issue forms.
   Shows real numbers only; if GitHub can't be reached, it says so instead of guessing. */
(function () {
  "use strict";
  var REPO = "aaryavvatts-lab/south-asian-culture-textbook";
  function count(node) {
    var label = node.getAttribute("data-label");
    var q = encodeURIComponent("repo:" + REPO + " is:issue label:" + label);
    fetch("https://api.github.com/search/issues?q=" + q + "&per_page=1")
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) { node.textContent = String(d.total_count); })
      .catch(function () { node.textContent = "n/a"; node.title = "Couldn't reach GitHub right now. Try again later."; });
  }
  function init() { document.querySelectorAll(".rr-count[data-label]").forEach(count); }
  if (window.document$ && window.document$.subscribe) window.document$.subscribe(init);
  else document.addEventListener("DOMContentLoaded", init);
})();
