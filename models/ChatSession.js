import mongoose from 'mongoose';

const chatSessionSchema = new mongoose.Schema({
  messages: [{
    sender: {
      type: String,
      required: true,
      enum: ['user', 'bot']
    },
    text: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  feedback: {
    isAccurate: { // q1: si sax miyuu kuu caawiyey chatbot ka ?
      type: String, // Storing as String 'yes'/'no' to match exact user requirement or Boolean if mapped
      enum: ['yes', 'no']
    },
    isFast: { // q2: si dhaqso leh miyuu ku caawiyey?
      type: String,
      enum: ['yes', 'no']
    },
    wouldUseAgain: { // q3: ma isticmaali lahayd chatbotka markale si uu kuu caawiyo?
      type: String,
      enum: ['yes', 'no']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ChatSession', chatSessionSchema);
