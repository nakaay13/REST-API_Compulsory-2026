import mongoose from "mongoose";

// Test the database connection by connecting and disconnecting immediately.
export async function testConnection() {
    try {
        await connect();
        await disconnect(); 
        console.log('Database connection test successful');
    } catch (error) {
        console.log('Error testing database connection: ', error);
    }
}

/// Connects to the MongoDB database using Mongoose.
export async function connect() {
    try {
        if (!process.env.DBHOST) {
            throw new Error('DBHOST environment variable is not defined');
        }
        await mongoose.connect(process.env.DBHOST);

        if (mongoose.connection.db) {
           await mongoose.connection.db.admin().command({ ping: 1 });
            console.log('Successfully connected to the database');
        } else {
            throw new Error('Failed to connect to the database');
        }
    } catch (error) {
        console.log('Error connecting to the database: ', error);
    } 
}

/// Disconnects from the MongoDB database using Mongoose.
export async function disconnect() {
    try {
        await mongoose.disconnect();
        console.log('Successfully disconnected from the database');
    } catch (error) {
        console.log('Error disconnecting from the database: ', error);
    }
}