import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

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

// Register event
document.getElementById("registerBtn").addEventListener("click", function (e) {
  e.preventDefault();

  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const errorMessage = document.getElementById("register-error");

  if (!email || !password || !confirmPassword) {
    errorMessage.textContent = "All fields are required.";
    return;
  }

  if (password !== confirmPassword) {
    errorMessage.textContent = "Passwords do not match.";
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Account created successfully!");
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        errorMessage.textContent = "Email is already registered.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage.textContent = "Invalid email format.";
      } else if (error.code === "auth/weak-password") {
        errorMessage.textContent = "Password must be at least 6 characters.";
      } else {
        errorMessage.textContent = "Registration failed. Please try again.";
      }
    });
});
