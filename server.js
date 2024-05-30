import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.post('/proxy', async (req, res) => {
    const apiUrl = 'https://demo-ws-paylands.paynopain.com/v1/sandbox/payment';
    const token = 'c7ae276b7847427d8c0b18eceac8845f';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });

        const result = await response.json();
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error en la solicitud de pago' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});