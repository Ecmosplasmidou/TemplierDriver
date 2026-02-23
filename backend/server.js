const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: [
    'https://templierdriver.com', 
    'https://www.templierdriver.com', 
    'https://templierdriver.org', 
    'https://templier-driver.vercel.app',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

const shopName = process.env.SHOPIFY_SHOP_NAME;
let SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

app.get('/', (req, res) => res.send("🚀 Bridge Shopify Templier Driver en ligne"));

app.get('/api/user-spend/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const response = await axios({
      url: `https://${shopName}/admin/api/2024-01/customers/search.json?query=email:${email}`,
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    const customers = response.data.customers;

    if (customers && customers.length > 0) {
      res.json({ 
        total_spent: parseFloat(customers[0].total_spent),
        firstName: customers[0].first_name 
      });
    } else {
      res.json({ total_spent: 0, firstName: null });
    }
  } catch (error) {
    console.error("❌ Erreur Shopify API (Spend):", error.response?.data || error.message);
    res.status(500).json({ error: "Impossible de récupérer les données Shopify" });
  }
});

// --- LOGIQUE DE SYNCHRONISATION (CRÉATION DE COMPTE) ---
// Appelle cette route dans ton frontend lors du Register Firebase
app.post('/api/sync-user', async (req, res) => {
  const { email, firstName } = req.body;

  try {
    // 1. Vérifier si le client existe déjà
    const checkUser = await axios({
      url: `https://${shopName}/admin/api/2024-01/customers/search.json?query=email:${email}`,
      method: 'GET',
      headers: { 'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN }
    });

    if (checkUser.data.customers.length === 0) {
      // 2. Créer le client sur Shopify s'il n'existe pas
      // Note: Shopify enverra un email d'invitation si tu ne définis pas de mot de passe
      const createResponse = await axios({
        url: `https://${shopName}/admin/api/2024-01/customers.json`,
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
        data: {
          customer: {
            first_name: firstName || "Templier",
            email: email,
            verified_email: true,
            send_email_invite: true // Envoie un mail pour que le client crée son mot de passe Shopify
          }
        }
      });
      console.log(`✅ Nouveau client créé sur Shopify : ${email}`);
      return res.json({ message: "Client créé sur Shopify", customer: createResponse.data.customer });
    }

    res.json({ message: "Le client existe déjà sur Shopify" });
  } catch (error) {
    console.error("❌ Erreur Sync Shopify:", error.response?.data || error.message);
    res.status(500).json({ error: "Erreur lors de la synchronisation avec Shopify" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  🛡️  ORDRE DU TEMPLIER DRIVER
  🚀 Serveur Bridge lancé sur le port ${PORT}
  📍 URL Shopify : ${shopName}
  `);
});