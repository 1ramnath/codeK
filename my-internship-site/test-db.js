const mongoose = require('mongoose');
const uri = 'mongodb+srv://Ramnath:Ramnath1315@.mongodb.net/internship-platform?retryWrites=true&w=majority';
mongoose.connect(uri)
  .then(() => {
    console.log('Connected');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection failed:', err.message);
    process.exit(1);
  });
