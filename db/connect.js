const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    
    // Log URI without password for debugging
    const sanitizedUri = uri.replace(/:[^:@]*@/, ':****@');
    console.log("🔌 Attempting to connect to:", sanitizedUri);
    
    const conn = await mongoose.connect(uri, {
      dbName: 'NITS-student',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Add timeout options
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log("✅ MongoDB Atlas connected successfully!");
    console.log("📊 Database:", mongoose.connection.db.databaseName);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📚 Collections:", collections.map(c => c.name).join(', '));
    
    return conn;
  } catch (err) {
    console.error("❌ MongoDB connection error");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    
    if (err.message.includes('bad auth')) {
      console.error("🔐 AUTHENTICATION FAILED - Check username and password in Atlas");
    }
    if (err.message.includes('getaddrinfo')) {
      console.error("🌐 NETWORK ERROR - Check Atlas Network Access (0.0.0.0/0)");
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;