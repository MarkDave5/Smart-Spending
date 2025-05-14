import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteField } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyASsWwL6DwEw3znq2OkrVfngyx7yyKbRz4",
  authDomain: "finals-mark.firebaseapp.com",
  projectId: "finals-mark",
  storageBucket: "finals-mark.appspot.com",
  messagingSenderId: "567799260393",
  appId: "1:567799260393:web:e61ca6be80946a943a3c78",
  measurementId: "G-CJZ2P42RPP"
};

initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

// DOM
const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const totalAmount = document.getElementById("totalAmount");
const remainingAmount = document.getElementById("remainingAmount");
const setBudgetBtn = document.getElementById("setBudgetBtn");
const resetBudgetBtn = document.getElementById("resetBudgetBtn");
const resetHistoryBtn = document.getElementById("resetHistoryBtn");
const budgetInput = document.getElementById("monthlyBudget");
const budgetAlert = document.getElementById("budget-alert");
const logoutBtn = document.getElementById("logoutBtn");
const toastContainer = document.getElementById("toastContainer");

let expenses = [];
let monthlyBudget = 0;

// Toast function
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Chart
const ctx = document.getElementById("expenseChart").getContext("2d");
const expenseChart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: ["Food", "Rent", "Utilities", "Entertainment", "Other"],
    datasets: [{
      data: [0, 0, 0, 0, 0],
      backgroundColor: ["#FF6347", "#4682B4", "#32CD32", "#FFD700", "#8A2BE2"],
      borderColor: "#fff",
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: ctx => `₱${ctx.raw.toFixed(2)}`
        }
      }
    }
  }
});

function setExpenseFormEnabled(enabled) {
  expenseForm.querySelectorAll("input, select, button[type='submit']").forEach(el => {
    el.disabled = !enabled;
  });
}

function renderExpenseHistory() {
  expenseList.innerHTML = "";
  expenses.forEach(exp => {
    const item = document.createElement("li");
    item.textContent = `${exp.name} - ₱${exp.amount.toFixed(2)} (${exp.category}) on ${exp.date}`;
    expenseList.appendChild(item);
  });
}

function updateBudget() {
  let total = 0;
  const categoryTotals = { Food: 0, Rent: 0, Utilities: 0, Entertainment: 0, Other: 0 };

  expenses.forEach(exp => {
    total += Number(exp.amount);
    categoryTotals[exp.category] += Number(exp.amount);
  });

  totalAmount.textContent = total.toFixed(2);

  if (monthlyBudget > 0) {
    const remaining = monthlyBudget - total;
    remainingAmount.textContent = remaining.toFixed(2);
    budgetAlert.style.display = remaining < 0 ? "block" : "none";
  } else {
    remainingAmount.textContent = "–";
    budgetAlert.style.display = "none";
  }

  expenseChart.data.datasets[0].data = [
    categoryTotals.Food,
    categoryTotals.Rent,
    categoryTotals.Utilities,
    categoryTotals.Entertainment,
    categoryTotals.Other
  ];
  expenseChart.update();
  renderExpenseHistory();
}

async function loadUserData(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    expenses = data.expenses || [];
    monthlyBudget = data.monthlyBudget || 0;
  } else {
    expenses = [];
    monthlyBudget = 0;
  }
}

async function saveUserData(uid) {
  await setDoc(doc(db, "users", uid), {
    monthlyBudget,
    expenses
  }, { merge: true });
}

setBudgetBtn.addEventListener("click", async () => {
  const b = parseFloat(budgetInput.value);
  if (isNaN(b) || b <= 0) {
    alert("Please enter a valid budget.");
    return;
  }
  monthlyBudget = b;
  await saveUserData(auth.currentUser.uid);
  setExpenseFormEnabled(true);
  updateBudget();
  showToast("Budget set successfully!");
});

resetBudgetBtn.addEventListener("click", async () => {
  if (confirm("Reset your budget?")) {
    monthlyBudget = 0;
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      monthlyBudget: deleteField()
    });
    budgetInput.value = "";
    setExpenseFormEnabled(false);
    updateBudget();
    showToast("Budget reset.");
  }
});

expenseForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = expenseForm.expenseName.value.trim();
  const amount = parseFloat(expenseForm.expenseAmount.value.trim());
  const category = expenseForm.expenseCategory.value;
  const date = expenseForm.expenseDate.value;

  if (!name || isNaN(amount) || amount <= 0 || !date) {
    alert("Please enter valid expense details.");
    return;
  }

  expenses.push({ name, amount, category, date });
  await saveUserData(auth.currentUser.uid);
  expenseForm.reset();
  updateBudget();
  showToast("Expense added!");
});

resetHistoryBtn.addEventListener("click", async () => {
  if (confirm("Clear all expenses?")) {
    expenses = [];
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      expenses: deleteField()
    });
    updateBudget();
    showToast("Expense history cleared.");
  }
});

logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    await loadUserData(user.uid);
    updateBudget();
    setExpenseFormEnabled(monthlyBudget > 0);
  } else {
    window.location.href = "login.html";
  }
});
