const express = require('express');
const { Imgur } = require('imgur-uploader-api')
const { alldl } = require('imran-dlmedia');
const path = require('path');
const axios = require('axios')

const app = express(); // Initialize app here
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get("/docs", (req, res) => res.sendFile(path.join(__dirname, 'public', 'docs.html')));



app.get('/api', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const data = await alldl(url);
        res.json(data);
        console.log(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to download media' });
    }
});

app.get('/sim', async (req, res) => {
    const { ask } = req.query;

    
    if (!ask) {
        return res.status(400).json({ error: 'The "ask" query parameter is required.' });
    }

    try {
        
        const response = await axios.get('http://5.9.12.94:14642/sim', {
            params: {
                ask: ask, 
            }
        });

        
        if (response.data) {
            return res.json(response.data);
        } else {
            return res.status(500).json({ error: 'Error communicating with the external API' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get response from external API' });
    }
});

app.get('/imgur', async (req, res) => {
  const url = req.query.Url; 

  if (!url) {
    return res.status(400).json({ error: 'imageUrl query parameter is required' });
  }

  try {
    
    const result = await Imgur(url);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
    console.log(`Server is running`);
});
