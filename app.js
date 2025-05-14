// app.js

const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const path = require('path');

// ✅ Replace this with the correct path to your downloaded service account JSON file
const serviceAccount = require('C:/Users/Administrator/Desktop/SANCHEZ.json');

// ✅ Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ✅ Gmail configuration (with App Password — NOT your actual Gmail password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'markdavesanchez64@gmail.com', // Replace with your Gmail
    pass: 'xjki ijkt qpmh bklr',    // App Password from Google (see below)
  },
});

// ✅ Function to send reminder
async function sendBudgetReminder(userEmail, monthlyBudget, totalSpent) {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: userEmail,
    subject: '🚨 Budget Exceeded!',
    text: `Hello! You've exceeded your budget of ₱${monthlyBudget}. You've spent ₱${totalSpent}. Please review your expenses.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent to:', userEmail);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

// ✅ Check Firestore users for overspending
async function checkUserBudgets() {
  try {
    const snapshot = await db.collection('users').get();

    snapshot.forEach((doc) => {
      const user = doc.data();
      const { email, monthlyBudget, totalSpent } = user;

      if (email && totalSpent > monthlyBudget) {
        sendBudgetReminder(email, monthlyBudget, totalSpent);
      }
    });
  } catch (err) {
    console.error('❌ Firestore error:', err);
  }
}

// ✅ Run every 24 hours (or call directly for testing)
checkUserBudgets();
// setInterval(checkUserBudgets, 24 * 60 * 60 * 1000); // Uncomment for daily run
