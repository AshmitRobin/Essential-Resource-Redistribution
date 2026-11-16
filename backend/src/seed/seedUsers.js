// Creates the admin and sample users. Safe to run more than once: existing emails are skipped.
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const users = [
  { name: 'Admin One', email: 'admin@errs.org', password: 'Admin@123', mobile: '9000000001', role: 'Admin' },
  { name: 'Green Grocers', email: 'green@grocers.com', password: 'Pass@123', mobile: '9000000002', role: 'Donor' },
  { name: 'Kind Boutique', email: 'kind@boutique.com', password: 'Pass@123', mobile: '9000000003', role: 'Donor' },
  { name: 'Ravi Kumar', email: 'ravi@gmail.com', password: 'Pass@123', mobile: '9000000004', role: 'Donor' },
  { name: 'Hope NGO', email: 'hope@ngo.org', password: 'Pass@123', mobile: '9000000005', role: 'Beneficiary' },
  { name: 'Sunrise Old Age Home', email: 'sunrise@home.org', password: 'Pass@123', mobile: '9000000006', role: 'Beneficiary' },
  { name: 'Anita Devi', email: 'anita@gmail.com', password: 'Pass@123', mobile: '9000000007', role: 'Beneficiary' },
  { name: 'Asha Shelter', email: 'asha@shelter.org', password: 'Pass@123', mobile: '9000000008', role: 'Beneficiary' },
];

(async () => {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is missing. Add it to backend/.env first.');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  let created = 0;
  for (const u of users) {
    if (await User.exists({ email: u.email })) continue;
    await User.create(u);
    created++;
  }
  console.log(`Seed done: ${created} created, ${users.length - created} already existed.`);
  await mongoose.disconnect();
})().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
