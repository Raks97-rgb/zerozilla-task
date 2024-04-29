const express = require('express');
const router = express.Router();
const { generateToken,verifyToken } = require('../middleware/token');
const Agency = require('../schema/agencySchema');
const Client = require('../schema/clientSchema');

// 1st API: Create an agency and client in a single request
router.post('/agency-client', async (req, res) => {
    try {
        const { agencyData, clientData } = req.body;

        const agency = await Agency.create(agencyData);

        clientData.agencyId = agency._id;
        const client = await Client.create(clientData);

        res.status(201).json({ agency, client });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 2nd API: Update a client detail
router.post('/token/:id', (req, res) => {
    const userId = req.params.id; 
    const token = generateToken(userId);
    res.json({ auth: true, token });
});

router.put('/client/:id', verifyToken, async (req, res) => {
    try {
        const clientId = req.params.id;
        const clientData = req.body;

        const client = await Client.findByIdAndUpdate(clientId, clientData, { new: true });

        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }

        res.json(client);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 3rd API: Return agency name and client details with top client(s) with maximum total bill
router.get('/top-client', verifyToken, async (req, res) => {
    try {
        const topClient = await Client.findOne().sort({ totalBill: -1 }).populate('agencyId');

        if (!topClient) {
            return res.status(404).json({ error: "No client found" });
        }

        const { agencyId, name: agencyName } = topClient.agencyId;
        const { name: clientName, totalBill } = topClient;

        res.json({ agencyName, clientName, totalBill });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
