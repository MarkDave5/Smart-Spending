import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASsWwL6DwEw3znq2OkrVfngyx7yyKbRz4",
  authDomain: "finals-mark.firebaseapp.com",
  projectId: "finals-mark",
  storageBucket: "finals-mark.firebasestorage.app",
  messagingSenderId: "567799260393",
  appId: "1:567799260393:web:6d426fd71386b9ff3a3c78",
  measurementId: "G-5Y1SKBRE2Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Email/Password login
document.getElementById("loginBtn").addEventListener("click", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMessage = document.getElementById("login-error");

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(() => {
      errorMessage.textContent = "Invalid username or password.";
    });
});

// Google login
document.getElementById("googleLoginBtn").addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  signInWithPopup(auth, provider)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      console.error(error);
      alert("Google Sign-In failed: " + error.message);
    });
});

// Forgot Password
document.getElementById("forgotPasswordLink").addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const errorMessage = document.getElementById("login-error");

  if (email) {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent. Please check your inbox.");
      })
      .catch((error) => {
        console.error(error);
        errorMessage.textContent = "Error: " + error.message;
      });
  } else {
    errorMessage.textContent = "Please enter your email address to reset your password.";
  }
});
