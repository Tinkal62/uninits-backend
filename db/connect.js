const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    
    // CRITICAL: Force the database name in the connection string
    // Make sure it ends with /NITS-student
    if (!uri.includes('/NITS-student')) {
      console.error("❌ URI is missing database name! It should end with /NITS-student");
    }
    
    const sanitizedUri = uri.replace(/:[^:@]*@/, ':****@');
    console.log("🔌 Connecting to:", sanitizedUri);
    
    await mongoose.connect(uri, {
      dbName: 'NITS-student' // FORCE the database name
    });
    
    console.log("✅ MongoDB Atlas connected!");
    console.log("📊 Connected to database:", mongoose.connection.db.databaseName);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📚 Collections in this database:", collections.map(c => c.name).join(', '));
    
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;