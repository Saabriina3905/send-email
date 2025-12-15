import ChatSession from '../models/ChatSession.js';

export const saveChatSession = async (req, res) => {
  try {
    const { messages, feedback } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input: messages array is required'
      });
    }

    const newSession = new ChatSession({
      messages,
      feedback
    });

    await newSession.save();

    res.status(201).json({
      success: true,
      message: 'Chat session and feedback saved successfully',
      data: newSession
    });
  } catch (error) {
    console.error('Error saving chat session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save chat session',
      error: error.message
    });
  }
};
