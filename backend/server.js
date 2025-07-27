const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Route imports
const userRoutes = require('./routes/userRoutes');
const storyRoutes = require('./routes/storyRoutes');

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/stories', storyRoutes);

// Create HTTP server and integrate Socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Your React app's address
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinStory', (storyId) => {
        socket.join(storyId);
        console.log(`User ${socket.id} joined story room ${storyId}`);
    });

    socket.on('newContribution', (data) => {
        // Broadcast to all clients in the specific story room
        io.to(data.storyId).emit('contributionAdded', data.contribution);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));