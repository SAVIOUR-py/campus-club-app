const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db'); // Loads our connection pool bridge

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware configurations
app.use(cors()); // Enables frontend browser communication
app.use(express.json()); // Allows our server to read JSON data sent by the frontend

// ==========================================
// 1. CREATE: Add a new Campus Club profile
// ==========================================
app.post('/api/clubs', async (req, res) => {
    try {
        const { name, president, category, member_count, description } = req.body;
        
        // Simple safety check to ensure required text properties are present
        if (!name || !president || !category) {
            return res.status(400).json({ error: 'Name, President, and Category are required.' });
        }

        const query = `INSERT INTO clubs (name, president, category, member_count, description) 
                       VALUES (?, ?, ?, ?, ?)`;
        
        // Run query using positional placeholders (?) to strictly prevent SQL injections
        const [result] = await db.query(query, [name, president, category, member_count || 0, description]);
        
        res.status(201).json({ message: 'Club profile created successfully!', clubId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Database error while saving profile.', details: err.message });
    }
});

// ==========================================
// 2. READ: Fetch all Campus Club profiles
// ==========================================
app.get('/api/clubs', async (req, res) => {
    try {
        const query = 'SELECT * FROM clubs ORDER BY id DESC';
        const [rows] = await db.query(query);
        res.json(rows); // Sends back the entire roster array to the frontend layout
    } catch (err) {
        res.status(500).json({ error: 'Database error while reading roster.', details: err.message });
    }
});

// ==========================================
// 3. UPDATE: Edit an existing club profile
// ==========================================
app.put('/api/clubs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, president, category, member_count, description } = req.body;

        const query = `UPDATE clubs 
                       SET name = ?, president = ?, category = ?, member_count = ?, description = ? 
                       WHERE id = ?`;
        
        const [result] = await db.query(query, [name, president, category, member_count, description, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Club profile not found.' });
        }

        res.json({ message: 'Club profile updated successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Database error while modifying details.', details: err.message });
    }
});

// ==========================================
// 4. DELETE: Erase a club profile completely
// ==========================================
app.delete('/api/clubs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM clubs WHERE id = ?';
        
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Club profile not found.' });
        }

        res.json({ message: 'Club profile deleted from roster.' });
    } catch (err) {
        res.status(500).json({ error: 'Database error while removing profile.', details: err.message });
    }
});

// Start the Express network listening pipeline
app.listen(PORT, () => {
    console.log(`🚀 Server successfully launched! Listening on host port: ${PORT}`);
});