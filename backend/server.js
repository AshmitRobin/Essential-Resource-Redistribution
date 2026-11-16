require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is missing. Add it to backend/.env (see .env.example).');
  process.exit(1);
}

connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
});
