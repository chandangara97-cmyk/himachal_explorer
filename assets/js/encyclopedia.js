/**
 * Himachal Explorer — Encyclopedia category page engine
 * Config: window.ENC_CONFIG = { catKey, placeholderImg }
 */
(function () {
  const DB = "https://garg-enterprise-default-rtdb.asia-southeast1.firebasedatabase.app";
  const DISTRICT_MAP = {
    Bilaspur: "bilaspur.html",
    Chamba: "chamba.html",
    Hamirpur: "hamirpur.html",
    Kangra: "kangra.html",
    Kinnaur: "kinnaur.html",
    Kullu: "kullu.html",
    Mandi: "mandi.html",
    Shimla: "shimla.html",
    Sirmaur: "sirmour.html",
    Solan: "solan.html",
    Una: "una.html",
    "Lahaul-Spiti": "spiti.html",
    Lahaul: "spiti.html",
    Spiti: "spiti.html",
  };

  const cfg = window.ENC_CONFIG || {};
  const CAT_KEY = cfg.catKey || "";
  const PLACEHOLDER_IMG = cfg.placeholderImg || "assets/images/201-himalaya.jpg";

  let items = [];
  let activeDistrict = "all";
  let activeType = "all";
  let sortBy = "name";

  function districtLink(d) {
    if (!d) return null;
    const first = d.split("/")[0].trim();
    if (DISTRICT_MAP[first]) return DISTRICT_MAP[first];
    for (const k in DISTRICT_MAP) {
      if (first.toLowerCase().indexOf(k.toLowerCase()) !== -1) return DISTRICT_MAP[k];
    }
    return null;
  }

  function uniqueSorted(arr) {
    return [...new Set(arr.filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }

  function buildFilters() {
    const districts = uniqueSorted(
      items.map((it) => (it.district || "").split("/")[0].trim()).filter(Boolean)
    );
    const types = uniqueSorted(items.map((it) => it.type).filter(Boolean));

    const distEl = document.getElementById("encDistrictFilters");
    const typeEl = document.getElementById("encTypeFilters");

    if (distEl) {
      distEl.innerHTML =
        '<button type="button" class="enc-chip active" data-district="all">All Districts</button>' +
        districts
          .map(
            (d) =>
              '<button type="button" class="enc-chip" data-district="' +
              d.replace(/"/g, "&quot;") +
              '">' +
              d +
              "</button>"
          )
          .join("");
      distEl.querySelectorAll(".enc-chip").forEach((btn) => {
        btn.addEventListener("click", () => {
          activeDistrict = btn.getAttribute("data-district");
          distEl.querySelectorAll(".enc-chip").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          encRender();
        });
      });
    }

    if (typeEl) {
      if (types.length <= 1) {
        typeEl.parentElement && (typeEl.parentElement.style.display = "none");
      } else {
        if (typeEl.parentElement) typeEl.parentElement.style.display = "";
        typeEl.innerHTML =
          '<button type="button" class="enc-chip active" data-type="all">All Types</button>' +
          types
            .map(
              (t) =>
                '<button type="button" class="enc-chip" data-type="' +
                t.replace(/"/g, "&quot;") +
                '">' +
                t +
                "</button>"
            )
            .join("");
        typeEl.querySelectorAll(".enc-chip").forEach((btn) => {
          btn.addEventListener("click", () => {
            activeType = btn.getAttribute("data-type");
            typeEl.querySelectorAll(".enc-chip").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            encRender();
          });
        });
      }
    }
  }

  function sortList(list) {
    const copy = list.slice();
    if (sortBy === "altitude-asc") {
      copy.sort((a, b) => (a.altitude_m || 99999) - (b.altitude_m || 99999));
    } else if (sortBy === "altitude-desc") {
      copy.sort((a, b) => (b.altitude_m || 0) - (a.altitude_m || 0));
    } else if (sortBy === "district") {
      copy.sort(
        (a, b) =>
          (a.district || "").localeCompare(b.district || "") ||
          (a.name || "").localeCompare(b.name || "")
      );
    } else {
      copy.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }
    return copy;
  }

  window.encRender = function () {
    const grid = document.getElementById("encGrid");
    const countEl = document.getElementById("encCount");
    const q = (document.getElementById("encSearch")?.value || "").trim().toLowerCase();

    let list = items;

    if (q) {
      list = list.filter(
        (it) =>
          (it.name || "").toLowerCase().includes(q) ||
          (it.district || "").toLowerCase().includes(q) ||
          (it.type || "").toLowerCase().includes(q) ||
          (it.facts || []).some((f) => String(f).toLowerCase().includes(q))
      );
    }

    if (activeDistrict !== "all") {
      list = list.filter((it) => {
        const d = (it.district || "").split("/")[0].trim();
        return (
          d.toLowerCase() === activeDistrict.toLowerCase() ||
          (it.district || "").toLowerCase().includes(activeDistrict.toLowerCase())
        );
      });
    }

    if (activeType !== "all") {
      list = list.filter((it) => (it.type || "").toLowerCase() === activeType.toLowerCase());
    }

    list = sortList(list);

    if (countEl) {
      countEl.textContent =
        list.length === items.length
          ? list.length + " entries"
          : "Showing " + list.length + " of " + items.length;
    }

    if (!list.length) {
      grid.innerHTML =
        '<div class="enc-empty"><div class="enc-empty-icon">🔍</div><div>No matches for your filters.</div><button type="button" class="enc-reset-btn" id="encResetBtn">Clear filters</button></div>';
      document.getElementById("encResetBtn")?.addEventListener("click", () => {
        activeDistrict = "all";
        activeType = "all";
        sortBy = "name";
        const search = document.getElementById("encSearch");
        if (search) search.value = "";
        const sortSel = document.getElementById("encSort");
        if (sortSel) sortSel.value = "name";
        document
          .querySelectorAll("#encDistrictFilters .enc-chip, #encTypeFilters .enc-chip")
          .forEach((b) => {
            b.classList.toggle(
              "active",
              b.getAttribute("data-district") === "all" || b.getAttribute("data-type") === "all"
            );
          });
        encRender();
      });
      return;
    }

    grid.innerHTML = list
      .map((it) => {
        const dLink = districtLink(it.district);
        const facts = (it.facts || [])
          .slice(0, 4)
          .map((f) => "<li>" + f + "</li>")
          .join("");
        const photo = it.photo_1
          ? '<img class="enc-card-img" src="' +
            it.photo_1 +
            '" alt="' +
            (it.name || "") +
            '" loading="lazy" onerror="this.outerHTML=\'<div class=\\\'enc-card-img enc-card-img--placeholder\\\'></div>\'">'
          : '<div class="enc-card-img enc-card-img--placeholder"></div>';
        const distLabel = it.district ? it.district.split("/")[0].trim() : "";
        return (
          '<div class="enc-card">' +
          photo +
          '<div class="enc-card-top">' +
          '<div class="enc-card-name">' +
          (it.name || "") +
          "</div>" +
          (it.district ? '<div class="enc-card-dist">' + it.district + "</div>" : "") +
          "</div>" +
          '<div class="enc-card-meta">' +
          (it.type || "") +
          (it.altitude_m ? " · ~" + it.altitude_m + " m" : "") +
          "</div>" +
          (facts ? "<ul>" + facts + "</ul>" : "") +
          '<div class="enc-card-flags">' +
          (it.verification_required
            ? '<span class="enc-unverified">Unverified — OCR sourced.</span>'
            : "<span></span>") +
          (dLink
            ? '<a class="enc-dist-link" href="' + dLink + '">View ' + distLabel + " District →</a>"
            : "") +
          "</div></div>"
        );
      })
      .join("");
  };

  async function load() {
    const grid = document.getElementById("encGrid");
    if (!CAT_KEY) {
      grid.innerHTML = '<div class="enc-empty">Configuration missing.</div>';
      return;
    }
    grid.innerHTML = Array.from({ length: 6 })
      .map(
        () =>
          '<div class="enc-card enc-skeleton"><div class="enc-skel-img"></div><div class="enc-skel-line w70"></div><div class="enc-skel-line w40"></div><div class="enc-skel-line w90"></div></div>'
      )
      .join("");

    try {
      const res = await fetch(DB + "/encyclopedia/" + CAT_KEY + ".json");
      const data = await res.json();
      if (!data) {
        grid.innerHTML = '<div class="enc-empty">Not available yet — check back soon.</div>';
        return;
      }
      items = Object.keys(data).map((id) => data[id]);
      buildFilters();
      encRender();
    } catch (err) {
      grid.innerHTML = '<div class="enc-empty">Could not load right now. Please refresh.</div>';
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const search = document.getElementById("encSearch");
    if (search) search.addEventListener("input", encRender);

    const sortSel = document.getElementById("encSort");
    if (sortSel) {
      sortSel.addEventListener("change", () => {
        sortBy = sortSel.value;
        encRender();
      });
    }

    const style = document.createElement("style");
    style.textContent =
      ".enc-card-img--placeholder{background:linear-gradient(135deg,rgba(20,48,31,.55),rgba(20,48,31,.8)),url('" +
      PLACEHOLDER_IMG +
      "') center/cover}";
    document.head.appendChild(style);

    load();
  });
})();
