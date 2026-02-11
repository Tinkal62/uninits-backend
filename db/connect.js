const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    
    // Log URI without password
    const sanitizedUri = uri.replace(/:[^:@]*@/, ':****@');
    console.log("🔌 Connecting to:", sanitizedUri);
    
    // Simple connection - Mongoose 7+ doesn't need those options
    await mongoose.connect(uri);
    
    console.log("✅ MongoDB Atlas connected!");
    console.log("📊 Database:", mongoose.connection.db.databaseName);
    
    // Send a ping to confirm connection
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("🏓 Ping successful!");
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📚 Collections:", collections.map(c => c.name).join(', '));
    
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;