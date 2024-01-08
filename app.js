const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/expenseTracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Expense schema and model
const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  date: Date,
});
const Expense = mongoose.model('Expense', expenseSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from 'public' folder

app.post('/add_expense', (req, res) => {
   const { description, amount, date } = req.body;
 
   const newExpense = new Expense({
     description,
     amount,
     date,
   });
 
   newExpense.save((err, savedExpense) => {
     if (err) {
       console.error('Error saving expense:', err);
       return res.status(500).send('Error saving expense');
     }
     console.log('Expense added:', savedExpense);
     res.status(200).send('Expense added successfully');
   });
 });

// Start server
const PORT = process.env.PORT || 3090;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
