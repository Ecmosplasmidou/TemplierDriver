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

app.get('/', (req, res) => res.send("🚀 Bridge Shopify Templier Driver en ligne"));

// --- GESTION DU TOKEN SHOPIFY ---
let SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || null;

const fetchShopifyToken = async () => {
  if (process.env.SHOPIFY_ACCESS_TOKEN) {
    SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
    return;
  }

  try {
    const response = await axios.post(`https://${process.env.SHOPIFY_SHOP_NAME}/admin/oauth/access_token`, {
      client_id: process.env.SHOPIFY_CLIENT_ID,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET,
      grant_type: 'client_credentials'
    });
    SHOPIFY_ACCESS_TOKEN = response.data.access_token;
  } catch (error) {
    // Erreur silencieuse
  }
};

fetchShopifyToken();

// --- ROUTE 1 : RÉCUPÉRER LES DÉPENSES (POUR LES GRADES) ---
app.get('/api/user-spend/:email', async (req, res) => {
  const { email } = req.params;
  
  if (!SHOPIFY_ACCESS_TOKEN) await fetchShopifyToken();

  try {
    const response = await axios({
      url: `https://${process.env.SHOPIFY_SHOP_NAME}/admin/api/2024-01/customers/search.json?query=email:${email}`,
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
    if (error.response?.status === 401) SHOPIFY_ACCESS_TOKEN = null;
    res.status(500).json({ error: "Impossible de récupérer les données" });
  }
});

// --- ROUTE 2 : SYNCHRONISER L'UTILISATEUR (CRÉATION COMPTE SHOPIFY) ---
app.post('/api/sync-user', async (req, res) => {
  const { email, firstName } = req.body;

  if (!SHOPIFY_ACCESS_TOKEN) await fetchShopifyToken();

  try {
    const search = await axios({
      url: `https://${process.env.SHOPIFY_SHOP_NAME}/admin/api/2024-01/customers/search.json?query=email:${email}`,
      method: 'GET',
      headers: { 'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN }
    });

    if (search.data.customers.length === 0) {
      await axios({
        url: `https://${process.env.SHOPIFY_SHOP_NAME}/admin/api/2024-01/customers.json`,
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
            send_email_invite: true 
          }
        }
      });
      res.json({ success: true, message: "Client créé sur Shopify" });
    } else {
      res.json({ success: true, message: "Client déjà existant" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur de synchronisation" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur Bridge lancé sur le port ${PORT}`);
});