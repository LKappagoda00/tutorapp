// const express = require('express');
// const { OpenAI } = require('openai');
// const router = express.Router();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// router.post('/chat', async (req, res) => {
//   try {
//     const { message } = req.body;

//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content: `You are a helpful library assistant for a digital library system. Help users with:
//           - Finding resources and materials
//           - Understanding how to use the library
//           - Search tips and recommendations
//           - Information about available resources (PDFs, videos, books)
//           - General library inquiries
          
//           Keep responses friendly, helpful, and focused on library-related topics.`
//         },
//         {
//           role: "user",
//           content: message
//         }
//       ],
//       max_tokens: 500,
//       temperature: 0.7
//     });

//     res.json({ response: completion.choices[0].message.content });
//   } catch (error) {
//     console.error('Chatbot error:', error);
//     res.status(500).json({ error: 'Failed to get response from AI' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();

// ================== SIMPLE RULE-BASED CHATBOT FUNCTION ==================
const getChatbotResponse = (message) => {
  const lowerMessage = message.toLowerCase(); // Normalize message to lowercase for easier matching
  
  // ---------- Library-related responses ----------
  if (lowerMessage.includes('search') || lowerMessage.includes('find')) {
    return "You can search for resources using the search bar at the top of the Library page. Try using specific keywords or tags to find what you're looking for!";
  }
  
  if (lowerMessage.includes('upload') || lowerMessage.includes('add')) {
    return "To upload a resource, go to the Upload page. You can upload PDFs, share video links, or create virtual books with text content.";
  }
  
  if (lowerMessage.includes('pdf') || lowerMessage.includes('document')) {
    return "We support PDF uploads! You can upload PDF files up to 10MB in size. Go to the Upload page and select 'PDF' as the resource type.";
  }
  
  if (lowerMessage.includes('video') || lowerMessage.includes('youtube') || lowerMessage.includes('drive')) {
    return "For videos, you can share Google Drive links. Make sure the link is publicly accessible so others can view your video resource.";
  }
  
  if (lowerMessage.includes('book') || lowerMessage.includes('virtual')) {
    return "Virtual books allow you to share text content directly. You can create educational materials, notes, or any text-based resource.";
  }
  
  if (lowerMessage.includes('tag') || lowerMessage.includes('category')) {
    return "Tags help organize resources. Use descriptive tags like 'math', 'science', 'history' to make your resources easier to find.";
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return "I can help you with: searching resources, uploading content, understanding different resource types (PDFs, videos, books), and using tags. What would you like to know?";
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! 👋 I'm your library assistant. I can help you with searching resources, uploading content, and answering questions about our digital library system!";
  }
  
  // ---------- Default responses ----------
  const defaultResponses = [
    "I'm here to help you with the library system. You can ask me about searching resources, uploading content, or using different resource types.",
    "That's a great question! Our library system supports PDFs, video links, and virtual books. How can I assist you today?",
    "I specialize in helping with library resources. Try asking me about searching, uploading, or different content types!",
    "I'm your digital library assistant! I can help you navigate our collection of resources and answer questions about the system.",
    "Welcome to our digital library! I can help you find resources, understand how to upload content, or answer any questions you have."
  ];
  
  // Pick a random default response if no specific match
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

// ================== CHAT ENDPOINT ==================
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body; // Extract user message from request body
    
    // ---------- Validation ----------
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // ---------- Simulate delay for realism ----------
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // ---------- Get chatbot response ----------
    const response = getChatbotResponse(message);
    
    // Send response back to client
    res.json({ response });
    
  } catch (error) {
    console.error('Chatbot error:', error);
    // Fallback response if something goes wrong
    res.json({ 
      response: "I'm experiencing some technical difficulties. Please try again in a moment." 
    });
  }
});

// ================== HEALTH CHECK ENDPOINT ==================
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Chatbot service is running' });
});

// Export router so it can be used in app.js/server.js
module.exports = router;
