import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signOut,
  RecaptchaVerifier, signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

const app = initializeApp({
  apiKey:            "AIzaSyBmJDsXvokR8kYs_yoLPau1DqANPBBORJY",
  authDomain:        "garg-enterprise.firebaseapp.com",
  databaseURL:       "https://garg-enterprise-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "garg-enterprise",
  storageBucket:     "garg-enterprise.firebasestorage.app",
  messagingSenderId: "1097408452571",
  appId:             "1:1097408452571:web:1e5803fa8bbea4fbb5b9fe",
  measurementId:     "G-DTJFFCMFD3"
});
const auth = getAuth(app);

const gate = document.getElementById("loginGate");
const main = document.getElementById("iqMain");
const userLabel = document.getElementById("signedInAs");
const signOutBtn = document.getElementById("signOutBtn");

const phoneStep = document.getElementById("phoneStep");
const otpStep = document.getElementById("otpStep");
const phoneForm = document.getElementById("phoneForm");
const phoneInput = document.getElementById("loginPhone");
const phoneError = document.getElementById("phoneError");
const sendBtn = document.getElementById("sendOtpBtn");

const otpForm = document.getElementById("otpForm");
const otpInput = document.getElementById("loginOtp");
const otpError = document.getElementById("otpError");
const verifyBtn = document.getElementById("verifyOtpBtn");
const otpSentTo = document.getElementById("otpSentTo");
const changeNumberBtn = document.getElementById("changeNumberBtn");
const resendBtn = document.getElementById("resendOtpBtn");

let confirmationResult = null;
let recaptchaVerifier = null;

function normalizePhone(v) {
  var digits = v.replace(/[^\d+]/g, "");
  if (!digits.startsWith("+")) {
    digits = digits.replace(/^0+/, "");
    digits = "+91" + digits; // default India country code
  }
  return digits;
}

function ensureRecaptcha() {
  if (recaptchaVerifier) return recaptchaVerifier;
  recaptchaVerifier = new RecaptchaVerifier(auth, "recaptchaContainer", { size: "invisible" });
  return recaptchaVerifier;
}

onAuthStateChanged(auth, function (user) {
  if (user) {
    gate.style.display = "none";
    main.style.display = "";
    if (userLabel) userLabel.textContent = user.phoneNumber || "";
  } else {
    gate.style.display = "";
    main.style.display = "none";
    phoneStep.style.display = "";
    otpStep.style.display = "none";
  }
});

phoneForm.addEventListener("submit", function (e) {
  e.preventDefault();
  phoneError.textContent = "";
  var phone = normalizePhone(phoneInput.value.trim());
  if (!/^\+\d{8,15}$/.test(phone)) {
    phoneError.textContent = "Enter a valid phone number with country code.";
    return;
  }
  sendBtn.disabled = true;
  sendBtn.textContent = "Sending OTP…";
  signInWithPhoneNumber(auth, phone, ensureRecaptcha())
    .then(function (result) {
      confirmationResult = result;
      otpSentTo.textContent = phone;
      phoneStep.style.display = "none";
      otpStep.style.display = "";
      otpInput.value = "";
      otpInput.focus();
    })
    .catch(function (err) {
      var msg = "Could not send OTP. Please try again.";
      if (err && err.code === "auth/invalid-phone-number") msg = "That phone number looks invalid.";
      if (err && err.code === "auth/too-many-requests") msg = "Too many attempts. Please wait and try again.";
      if (err && err.code === "auth/billing-not-enabled") msg = "SMS sign-in isn't active yet — contact the site owner.";
      phoneError.textContent = msg;
      if (recaptchaVerifier) { recaptchaVerifier.clear(); recaptchaVerifier = null; }
    })
    .finally(function () {
      sendBtn.disabled = false;
      sendBtn.textContent = "Send OTP";
    });
});

otpForm.addEventListener("submit", function (e) {
  e.preventDefault();
  otpError.textContent = "";
  if (!confirmationResult) { otpError.textContent = "Please request a new OTP."; return; }
  var code = otpInput.value.trim();
  if (!/^\d{4,8}$/.test(code)) { otpError.textContent = "Enter the code you received."; return; }
  verifyBtn.disabled = true;
  verifyBtn.textContent = "Verifying…";
  confirmationResult.confirm(code)
    .catch(function (err) {
      var msg = "Incorrect code. Please try again.";
      if (err && err.code === "auth/code-expired") msg = "That code expired — request a new one.";
      otpError.textContent = msg;
    })
    .finally(function () {
      verifyBtn.disabled = false;
      verifyBtn.textContent = "Verify & sign in";
    });
});

changeNumberBtn.addEventListener("click", function () {
  otpStep.style.display = "none";
  phoneStep.style.display = "";
  phoneError.textContent = "";
  confirmationResult = null;
});

resendBtn.addEventListener("click", function () {
  phoneForm.requestSubmit ? phoneForm.requestSubmit() : phoneForm.dispatchEvent(new Event("submit", {cancelable:true}));
});

if (signOutBtn) {
  signOutBtn.addEventListener("click", function () { signOut(auth); });
}
