const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Force the database name
    const uri = process.env.MONGO_URI;
    
    await mongoose.connect(uri, {
      dbName: 'NITS-student' // Force this database name
    });
    
    console.log("✅ MongoDB Atlas connected to database:", mongoose.connection.db.databaseName);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📚 Collections:", collections.map(c => c.name).join(', '));
    
  } catch (err) {
    console.error("❌ MongoDB connection error", err);
    process.exit(1);
  }
};

module.exports = connectDB;