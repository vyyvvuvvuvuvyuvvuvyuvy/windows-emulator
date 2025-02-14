const express = require('express');
const httpProxy = require('http-proxy');
const path = require('path');

const app = express();
const proxy = httpProxy.createProxyServer();
const port = 3000;

// Serve static files (like your HTML file)
app.use(express.static(path.join(__dirname, 'public')));

// Map VPN locations to their target URLs (simulated)
const vpnLocations = {
    default: 'https://example.com', // Default VPN route
    US: 'https://us.example.com',
    Germany: 'https://de.example.com',
};

// Proxy route that forwards requests based on VPN location
app.get('/proxy/*', (req, res) => {
    const vpnLocation = req.query.vpn || 'default'; // Default to 'default' if no VPN is selected
    const targetUrl = vpnLocations[vpnLocation];

    if (targetUrl) {
        console.log(`Proxying request to: ${targetUrl}${req.originalUrl.replace('/proxy', '')}`);
        proxy.web(req, res, { target: targetUrl });
    } else {
        res.status(400).send('Invalid VPN location');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
