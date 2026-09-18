import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut
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
const form = document.getElementById("loginForm");
const emailEl = document.getElementById("loginEmail");
const passEl = document.getElementById("loginPassword");
const errEl = document.getElementById("loginError");
const submitBtn = document.getElementById("loginSubmit");
const signOutBtn = document.getElementById("signOutBtn");
const userLabel = document.getElementById("signedInAs");

onAuthStateChanged(auth, function (user) {
  if (user) {
    gate.style.display = "none";
    main.style.display = "";
    if (userLabel) userLabel.textContent = user.email || "";
  } else {
    gate.style.display = "";
    main.style.display = "none";
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  errEl.textContent = "";
  submitBtn.disabled = true;
  submitBtn.textContent = "Signing in…";
  signInWithEmailAndPassword(auth, emailEl.value.trim(), passEl.value)
    .catch(function (err) {
      var msg = "Sign-in failed. Check your email and password.";
      if (err && err.code === "auth/invalid-email") msg = "That email address looks invalid.";
      if (err && (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential")) msg = "Incorrect email or password.";
      if (err && err.code === "auth/user-not-found") msg = "No account found for that email.";
      if (err && err.code === "auth/too-many-requests") msg = "Too many attempts. Please wait and try again.";
      errEl.textContent = msg;
    })
    .finally(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign in";
    });
});

if (signOutBtn) {
  signOutBtn.addEventListener("click", function () {
    signOut(auth);
  });
}
