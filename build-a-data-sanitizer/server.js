
import express from 'express';
import { inputCleaner, inputValidator } from './middleware.js';
const app = express();
const PORT = 3000;

// Parse incoming form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// GET / redirects to /form
app.get('/', (req, res) => {
    res.redirect('/form');
});

// GET /form returns 200
app.get('/form', (req, res) => {
    res.status(200).send('Form page');
});

// POST /submit
app.post(
    '/submit',
    inputCleaner,
    inputValidator,
    (req, res) => {
        const { username, comment } = req.body;

        res.status(200).json({
            username,
            comment
        });
    }
);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
