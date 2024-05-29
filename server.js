const express = require('express');
const request = require('request');
const app = express();

app.use(express.json());

app.post('/proxy', (req, res) => {
    const options = {
        url: 'https://demo-ws-paylands.paynopain.com/v1/sandbox/payment',
        method: 'POST',
        headers: {
            'Authorization': 'Basic YzdhZTI3NmI3ODQ3NDI3ZDhjMGIxOGVjZWFjODg0NWY6',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    };

    request(options, (error, response, body) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(response.statusCode).send(body);
        }
    });
});

app.listen(3000, () => {
    console.log('Proxy server running on port 3000');
});