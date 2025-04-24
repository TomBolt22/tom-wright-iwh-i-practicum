const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Homepage
app.get('/', async (req, res) => {
  const headers = {
    'Authorization': `Bearer ${process.env.APP_TOKEN}`,
    'Content-Type': 'application/json',
  };
  
  try {
    const resp = await axios.get('https://api.hubspot.com/crm/v3/objects/pets?limit=10&properties=name,type,age', { headers });
    const results = resp.data.results;
    
    res.render('homepage', { title: 'Pets | Integrating With HubSpot I Practicum', results });
  } catch (err) {
    console.error(err);
  }
});

// Form
app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// Submit form
app.post('/update-cobj', async (req, res) => {
  const headers = {
    'Authorization': `Bearer ${process.env.APP_TOKEN}`,
    'Content-Type': 'application/json',
  };
  try {
    const resp = await axios.post('https://api.hubspot.com/crm/v3/objects/pets', {
      properties: {
        name: req.body.name,
        age: req.body.age,
        type: req.body.type,
      },
    }, { headers });
    if (resp?.data?.id) {
      res.redirect('/');
    }
  } catch (err) {
    console.error(err);
  }
});

// Listener
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
