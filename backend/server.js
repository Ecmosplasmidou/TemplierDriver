const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/user-spend/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const response = await axios({
      url: `https://${process.env.SHOPIFY_SHOP_NAME}.myshopify.com/admin/api/2024-01/customers/search.json?query=email:${email}`,
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    const customers = response.data.customers;

    if (customers.length > 0) {
      res.json({ 
        total_spent: parseFloat(customers[0].total_spent),
        firstName: customers[0].first_name 
      });
    } else {
      res.json({ total_spent: 0, firstName: null });
    }
  } catch (error) {
    console.error("Erreur Shopify API:", error);
    res.status(500).json({ error: "Impossible de récupérer les données" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur Bridge lancé sur le port ${PORT}`));