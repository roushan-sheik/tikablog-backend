import mongoose from "mongoose";
import chalk from "chalk";

const connectDB = async (): Promise<void> => {
    const MONGO_URI: string | undefined = process.env.MONGO_URI;
    if (!MONGO_URI) {
        throw new Error(chalk.red.bold("❗ MONGO_URI is not defined in environment variables."));
    }

    const options: mongoose.ConnectOptions = {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        w: "majority",
        maxPoolSize: 10,
    };

    if (mongoose.connection.readyState === 1) {
        console.log(chalk.yellow.bold("🟢 MongoDB is already connected."));
        return;
    }

    try {
        await mongoose.connect(MONGO_URI, options);
        console.log(chalk.green.bold(`✅ MongoDB Connected: ${mongoose.connection.host}`));

        mongoose.connection.on("error", (err: Error) => {
            console.error(chalk.red.bold(`❌ MongoDB connection error: ${err.message}`));
        });

        mongoose.connection.on("disconnected", () => {
            console.warn(chalk.yellow.bold("⚠️ MongoDB disconnected. Attempting to reconnect..."));
            setTimeout(connectDB, 5000);
        });
    } catch (error: any) {
        console.error(chalk.red.bold(`🚨 MongoDB Connection Failed: ${error.message}`));
        throw error;
    }
};

export default connectDB;