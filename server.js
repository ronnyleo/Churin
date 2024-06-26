// server.js

//const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurante';

//mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Define a route for the root URL (/)
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
