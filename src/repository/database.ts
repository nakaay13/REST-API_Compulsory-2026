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
        const isTest = process.env.NODE_ENV === 'test';

        const uri = isTest
            ? process.env.DBHOST_TEST
            : process.env.DBHOST;

        if (!uri) {
            throw new Error('Database environment variable is not defined');
        }

        await mongoose.connect(uri);

        if (mongoose.connection.db) {
            await mongoose.connection.db.admin().command({ ping: 1 });
            console.log(`Connected to ${isTest ? 'TEST' : 'PROD'} database`);
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