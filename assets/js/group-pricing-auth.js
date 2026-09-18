(function () {
  "use strict";

  var STORAGE_KEY = "hx_gp_access";
  var DB_LOG_URL = "https://garg-enterprise-default-rtdb.asia-southeast1.firebasedatabase.app/group_pricing_access.json";

  var gate = document.getElementById("loginGate");
  var main = document.getElementById("iqMain");
  var userLabel = document.getElementById("signedInAs");
  var signOutBtn = document.getElementById("signOutBtn");

  var form = document.getElementById("phoneForm");
  var nameInput = document.getElementById("loginName");
  var phoneInput = document.getElementById("loginPhone");
  var errEl = document.getElementById("phoneError");
  var submitBtn = document.getElementById("continueBtn");

  function showMain(name, phone) {
    gate.style.display = "none";
    main.style.display = "";
    if (userLabel) userLabel.textContent = name + " · " + phone;
  }

  function showGate() {
    gate.style.display = "";
    main.style.display = "none";
  }

  function logAccess(name, phone) {
    try {
      fetch(DB_LOG_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, phone: phone, at: new Date().toISOString() })
      }).catch(function () {});
    } catch (e) {}
  }

  function loadSaved() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (data && data.name && data.phone) return data;
    } catch (e) {}
    return null;
  }

  function save(name, phone) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: name, phone: phone }));
    } catch (e) {}
  }

  function clearSaved() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  phoneInput.addEventListener("input", function () {
    phoneInput.value = phoneInput.value.replace(/[^\d]/g, "").slice(0, 10);
  });

  var saved = loadSaved();
  if (saved) {
    showMain(saved.name, saved.phone);
  } else {
    showGate();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    errEl.textContent = "";
    var name = nameInput.value.trim();
    var phone = phoneInput.value.trim();

    if (name.length < 2) {
      errEl.textContent = "Please enter your name.";
      return;
    }
    var digits = phone.replace(/[^\d]/g, "");
    if (digits.length !== 10) {
      errEl.textContent = "Please enter a valid 10-digit phone number.";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Entering…";

    save(name, phone);
    logAccess(name, phone);
    showMain(name, phone);

    submitBtn.disabled = false;
    submitBtn.textContent = "Continue";
  });

  if (signOutBtn) {
    signOutBtn.addEventListener("click", function () {
      clearSaved();
      showGate();
      nameInput.value = "";
      phoneInput.value = "";
    });
  }
})();
