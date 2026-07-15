const express = require('express');
const axios = require('axios');
const cors = require("cors");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

//  Route
app.get('/', (req, res) => {
    res.send('Backend is running');
})


app.post('/predict', async (req, res) => {
    const email = req.body.email;
    if (!email || email.trim() === "") {
        return res.status(400).json({
            error: "Email is required"
        });
    }

    const response = await axios.post(
        'https://email-spam-ml-api.onrender.com/predict',
        {
            email: email
        }
    );
    res.json(response.data);
})

app.listen(port, () => {
    console.log(`Server is Staring at ${port}`);
})



