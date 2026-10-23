/* Roots & Rivers data charts.
   Usage in Markdown: <div class="rr-chart" data-chart="population"></div>
   Every number below is copied from a sourced page in the book; the source is printed under each chart. */
(function () {
  "use strict";

  var DATA = {
    population: {
      kind: "bars",
      unit: "people",
      source: "World Bank, World Development Indicators (SP.POP.TOTL), 2025 estimates, dataset updated October 2026.",
      sourceUrl: "https://data.worldbank.org/indicator/SP.POP.TOTL",
      note: "India is so large that it can hide the others. Use the button to compare the other seven on their own scale.",
      toggle: { label: "Hide India", hide: "India" },
      rows: [
        ["India", 1463865525], ["Pakistan", 255219554], ["Bangladesh", 175686899],
        ["Afghanistan", 43844111], ["Nepal", 29618118], ["Sri Lanka", 21756000],
        ["Bhutan", 796682], ["Maldives", 529676]
      ]
    },
    usgroups: {
      kind: "bars",
      unit: "people",
      approx: true,
      source: "Pew Research Center fact sheets (May 2025), using 2023 American Community Survey data; people who identify with the group alone or in combination.",
      sourceUrl: "https://www.pewresearch.org/race-and-ethnicity/fact-sheet/asian-americans-indians-in-the-u-s/",
      rows: [
        ["Indian", 5200000], ["Pakistani", 680000], ["Bangladeshi", 300000],
        ["Nepalese", 225000], ["Sri Lankan", 85000], ["Bhutanese", 20000]
      ]
    },
    faiths: {
      kind: "stack",
      source: "Pew Research Center, \"Religious Composition by Country, 2010-2020\" (June 2025), 2020 estimates. Only the groups Pew lists for each country are shown. Shares are rounded, and groups under 1% that Pew does not list separately are left out, so some rows do not reach exactly 100%. Each bar is drawn on its own row total.",
      sourceUrl: "https://www.pewresearch.org/religion/feature/religious-composition-by-country-2010-2020/",
      series: ["Hindu", "Muslim", "Buddhist", "Christian", "Other"],
      rows: [
        ["Afghanistan", [0, 99.9, 0, 0, 0]],
        ["Bangladesh", [7.9, 91.1, 0, 0, 0]],
        ["Bhutan", [22.5, 0, 74.7, 0, 1.9]],
        ["India", [79.4, 15.2, 0, 2.2, 2.5]],
        ["Maldives", [2.5, 94.1, 1.3, 1.6, 0]],
        ["Nepal", [81.2, 5.1, 8.2, 1.8, 3.8]],
        ["Pakistan", [2.1, 96.5, 0, 1.3, 0]],
        ["Sri Lanka", [14.5, 10.2, 69.6, 5.6, 0]]
      ],
      rowNotes: {
        "Bangladesh": "Buddhists and Christians are each under 1% (not shown).",
        "India": "Other is Sikhs and Jains (2.5% together). Buddhists are under 1% (not shown).",
        "Nepal": "Other is mostly Kirat.",
        "Bhutan": "Buddhists here are mostly Vajrayana."
      }
    }
  };

  var NS = "http://www.w3.org/2000/svg";
  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function fmt(v, approx) {
    if (v >= 1e9) return (v / 1e9).toFixed(2) + " billion";
    if (v >= 1e6) return (approx ? "about " : "") + (v / 1e6).toFixed(v >= 1e8 ? 0 : 1).replace(/\.0$/, "") + " million";
    if (v >= 1e3) return (approx ? "about " : "") + Math.round(v / 1e3).toLocaleString("en-US") + ",000";
    return String(v);
  }
  function exact(v) { return v.toLocaleString("en-US"); }

  function tooltip(root) {
    var t = document.createElement("div");
    t.className = "rr-tip";
    t.setAttribute("role", "status");
    root.appendChild(t);
    return {
      show: function (html, evt) {
        t.innerHTML = html;
        t.style.display = "block";
        var r = root.getBoundingClientRect();
        var x = evt.clientX - r.left + 12, y = evt.clientY - r.top + 12;
        if (x + t.offsetWidth > r.width) x = Math.max(4, r.width - t.offsetWidth - 4);
        t.style.left = x + "px"; t.style.top = y + "px";
      },
      hide: function () { t.style.display = "none"; }
    };
  }

  function drawBars(box, spec, state) {
    box.innerHTML = "";
    var rows = spec.rows.filter(function (r) { return !(state.hidden && spec.toggle && r[0] === spec.toggle.hide); });
    var W = box.clientWidth || 600, narrow = W < 480;
    var labelW = narrow ? 92 : 120, valueW = narrow ? 92 : 130, barH = 22, gap = 12, top = 6;
    var H = top + rows.length * (barH + gap);
    var svg = el("svg", { width: W, height: H, viewBox: "0 0 " + W + " " + H, role: "img",
      "aria-label": "Bar chart: " + rows.map(function (r) { return r[0] + " " + fmt(r[1], spec.approx); }).join("; ") }, box);
    var max = Math.max.apply(null, rows.map(function (r) { return r[1]; }));
    var plotW = W - labelW - valueW;
    var tip = tooltip(box);
    rows.forEach(function (r, i) {
      var y = top + i * (barH + gap), w = Math.max(3, plotW * r[1] / max);
      var t = el("text", { x: labelW - 8, y: y + barH / 2, "text-anchor": "end", "dominant-baseline": "central", class: "rr-lbl" }, svg);
      t.textContent = r[0];
      el("rect", { x: labelW, y: y, width: w, height: barH, rx: 4, class: "rr-s1" }, svg);
      var v = el("text", { x: labelW + w + 6, y: y + barH / 2, "dominant-baseline": "central", class: "rr-val" }, svg);
      v.textContent = fmt(r[1], spec.approx);
      var hit = el("rect", { x: 0, y: y - gap / 2, width: W, height: barH + gap, fill: "transparent" }, svg);
      hit.addEventListener("mousemove", function (e) { tip.show("<b>" + r[0] + "</b><br>" + (spec.approx ? "about " : "") + exact(r[1]) + " " + spec.unit, e); });
      hit.addEventListener("mouseleave", tip.hide);
    });
  }

  function drawStack(box, spec) {
    box.innerHTML = "";
    var W = box.clientWidth || 600, narrow = W < 480;
    var labelW = narrow ? 84 : 110, barH = 24, gap = 12, top = 6, right = 8;
    var H = top + spec.rows.length * (barH + gap);
    var svg = el("svg", { width: W, height: H, viewBox: "0 0 " + W + " " + H, role: "img",
      "aria-label": "Stacked bar chart of faith shares by country. Full numbers are in the table below." }, box);
    var plotW = W - labelW - right;
    var tip = tooltip(box);
    spec.rows.forEach(function (r, i) {
      var y = top + i * (barH + gap), x = labelW;
      var t = el("text", { x: labelW - 8, y: y + barH / 2, "text-anchor": "end", "dominant-baseline": "central", class: "rr-lbl" }, svg);
      t.textContent = r[0];
      var total = r[1].reduce(function (a, b) { return a + b; }, 0);
      r[1].forEach(function (v, s) {
        if (v <= 0) return;
        var w = plotW * v / total;
        var seg = el("rect", { x: x + 1, y: y, width: Math.max(1, w - 2), height: barH, rx: 3, class: "rr-s" + (s + 1) }, svg);
        if (w > (narrow ? 44 : 52)) {
          var lt = el("text", { x: x + w / 2, y: y + barH / 2, "text-anchor": "middle", "dominant-baseline": "central", class: "rr-in" }, svg);
          lt.textContent = (v >= 99 ? v.toFixed(1) : Math.round(v)) + "%";
        }
        var note = spec.rowNotes[r[0]] ? "<br><span class='rr-tipnote'>" + spec.rowNotes[r[0]] + "</span>" : "";
        seg.addEventListener("mousemove", function (e) { tip.show("<b>" + r[0] + "</b><br>" + spec.series[s] + ": " + v + "%" + note, e); });
        seg.addEventListener("mouseleave", tip.hide);
        x += w;
      });
    });
  }

  function legend(spec) {
    var lg = document.createElement("div");
    lg.className = "rr-legend";
    spec.series.forEach(function (s, i) {
      var it = document.createElement("span");
      it.innerHTML = "<i class='rr-sw rr-s" + (i + 1) + "'></i>" + s;
      lg.appendChild(it);
    });
    return lg;
  }

  function table(spec) {
    var d = document.createElement("details");
    d.className = "rr-table";
    var html = "<summary>Show the numbers as a table</summary><table><thead><tr><th>Country or group</th>";
    if (spec.kind === "stack") {
      spec.series.forEach(function (s) { html += "<th>" + s + " (%)</th>"; });
      html += "</tr></thead><tbody>";
      spec.rows.forEach(function (r) { html += "<tr><td>" + r[0] + "</td>" + r[1].map(function (v) { return "<td>" + (v ? v : "not listed") + "</td>"; }).join("") + "</tr>"; });
    } else {
      html += "<th>Number</th></tr></thead><tbody>";
      spec.rows.forEach(function (r) { html += "<tr><td>" + r[0] + "</td><td>" + (spec.approx ? "about " : "") + exact(r[1]) + "</td></tr>"; });
    }
    d.innerHTML = html + "</tbody></table>";
    return d;
  }

  function mount(node) {
    var spec = DATA[node.getAttribute("data-chart")];
    if (!spec || node.getAttribute("data-mounted")) return;
    node.setAttribute("data-mounted", "1");
    node.innerHTML = "";
    var state = { hidden: false };
    if (spec.note) { var p = document.createElement("p"); p.className = "rr-note"; p.textContent = spec.note; node.appendChild(p); }
    if (spec.toggle) {
      var b = document.createElement("button");
      b.className = "md-button rr-toggle"; b.type = "button"; b.textContent = spec.toggle.label;
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function () {
        state.hidden = !state.hidden;
        b.textContent = state.hidden ? "Show India" : spec.toggle.label;
        b.setAttribute("aria-pressed", String(state.hidden));
        render();
      });
      node.appendChild(b);
    }
    if (spec.kind === "stack") node.appendChild(legend(spec));
    var box = document.createElement("div"); box.className = "rr-plot"; node.appendChild(box);
    var src = document.createElement("p"); src.className = "rr-src";
    src.innerHTML = "Source: <a href='" + spec.sourceUrl + "'>" + spec.source + "</a>";
    node.appendChild(src);
    node.appendChild(table(spec));
    function render() { if (spec.kind === "stack") drawStack(box, spec); else drawBars(box, spec, state); }
    render();
    var lastW = box.clientWidth;
    window.addEventListener("resize", function () { if (box.clientWidth !== lastW) { lastW = box.clientWidth; render(); } });
  }

  function init() { document.querySelectorAll(".rr-chart").forEach(mount); }
  if (window.document$ && window.document$.subscribe) window.document$.subscribe(init);
  else document.addEventListener("DOMContentLoaded", init);
})();
