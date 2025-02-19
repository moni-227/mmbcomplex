const express = require('express');
const path = require('path'); // Ensure you include the path module
const cors = require('cors');
const mongoose = require('mongoose');

const server = express();

// Use CORS first (if needed)
server.use(cors());

// Parse incoming JSON and URL-encoded data with an increased limit
server.use(express.json({ limit: '10mb' }));
server.use(express.urlencoded({ limit: '10mb', extended: true }));

// Import your route modules
const authRoutes = require('./route/userRoutes');
const hostelBookingRoutes = require('./route/hostelBookingRoutes');
const paymentRoutes = require('./route/paymentRoutes');
const dashboardRoutes = require('./route/dashboardRoutes');

// Register API routes BEFORE serving static files or the catch-all route
server.use('/api/auth', authRoutes);
server.use('/api', hostelBookingRoutes);
server.use('/api/payments', paymentRoutes);
server.use('/api', dashboardRoutes);

// Serve Angular Frontend Static Files
// Adjust the path based on your directory structure
const frontendPath = path.join(__dirname, 'browser');
server.use(express.static(frontendPath));

// Catch-all route: For any route that isn't an API route,
// send the Angular app's index.html so Angular can handle routing.
server.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Connect to MongoDB
const url = 'mongodb+srv://monisha:monisha@cluster0.bkwhz.mongodb.net/mmbcomplex';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("DB connected............");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

// Start the server on port 3000
server.listen(3000, () => {
    console.log("Server started on port 3000...");
});
