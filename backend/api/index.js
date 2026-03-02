import app from '../src/server.js';
import connectDB from '../src/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error('DB connection error:', err.message);
  }
  
  return app(req, res);
}
