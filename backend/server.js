const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({origin: [
  'https://templierdriver.com', 
  'https://templierdriver.org', 
  'https://templier-driver.vercel.app'
],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

let SHOPIFY_ACCESS_TOKEN = null;

const fetchShopifyToken = async () => {
  try {
    const response = await axios.post(`https://${process.env.SHOPIFY_SHOP_NAME}/admin/oauth/access_token`, {
      client_id: process.env.SHOPIFY_CLIENT_ID,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET,
      grant_type: 'client_credentials'
    });
    SHOPIFY_ACCESS_TOKEN = response.data.access_token;
    console.log("✅ Token Shopify récupéré avec succès.");
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du token:", error.response?.data || error.message);
  }
};
fetchShopifyToken();

app.get('/api/user-spend/:email', async (req, res) => {
  const { email } = req.params;
  if (!SHOPIFY_ACCESS_TOKEN) {
    await fetchShopifyToken();
  }

  try {
    const response = await axios({
      url: `https://${process.env.SHOPIFY_SHOP_NAME}/admin/api/2024-01/customers/search.json?query=email:${email}`,
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN, // Utilise le token dynamique
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
    if (error.response?.status === 401) {
      SHOPIFY_ACCESS_TOKEN = null;
    }
    console.error("Erreur Shopify API:", error.response?.data || error.message);
    res.status(500).json({ error: "Impossible de récupérer les données" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur Bridge lancé sur le port ${PORT}`);
  console.log(`🏠 Boutique connectée : ${process.env.SHOPIFY_SHOP_NAME}`);
});