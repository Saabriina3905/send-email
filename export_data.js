import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import ChatSession from './models/ChatSession.js';
import fs from 'fs';

// Load env vars
dotenv.config();

const exportTrainingData = async () => {
  try {
    await connectDB();
    console.log('🔌 Connected to MongoDB...');

    // Fetch sessions
    // You can filter here, e.g., { 'feedback.isAccurate': 'yes' }
    const sessions = await ChatSession.find({}).sort({ createdAt: -1 });

    console.log(`Found ${sessions.length} chat sessions.`);

    // specific format for your model? (Example: JSONL for fine-tuning)
    const exportData = sessions.map(session => {
        // Construct the conversation history
        const conversation = session.messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
        }));

        return {
            messages: conversation,
            metadata: {
                rating: session.feedback?.rating,
                isAccurate: session.feedback?.isAccurate,
                timestamp: session.createdAt
            }
        };
    });

    // Write to file
    fs.writeFileSync('training_data.json', JSON.stringify(exportData, null, 2));
    console.log('✅ Data exported to training_data.json');
    console.log('You can now use this file to retrain your model!');

  } catch (error) {
    console.error('Export failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

exportTrainingData();
