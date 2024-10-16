const express = require('express');
const next = require('next');
const mongoose = require('mongoose');
const Url = require('./Url');
const bodyParser = require('body-parser');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

let isDbConnected = false;

// Database connection function
const connectToDatabase = async () => {
    if (!isDbConnected) {
        try {
            await mongoose.connect("mongodb+srv://url-shortener:vishwa08@samplecluster.clrkivs.mongodb.net/url-shortener?retryWrites=true&w=majority&appName=sampleCluster", {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            const db = mongoose.connection;
            db.on('error', (error) => console.error('Connection error:', error));
            db.once('open', () => {
                isDbConnected = true;
                console.log('Connected to database');
            });
        } catch (error) {
            console.error('Error connecting to the database:', error);
        }
    }
};

async function getUrl(endpoint) {
    try {
        const urlEntry = await Url.findOne({ endpoint }); // Search for the endpoint in the database
        return urlEntry ? urlEntry.redirectTo : null; // Return the redirectTo if found
    } catch (error) {
        console.error('Error fetching URL:', error);
        return null; // Handle the error case
    }
}


async function checkEndpointAvailability(endpoint) {
    try {
        const existingUrl = await Url.findOne({endpoint: endpoint});
        return !existingUrl;
    }
    catch (error) {
        console.error('Error checking endpoint availability:', error);
        return false;
    }
}


async function addUrl(endpoint, redirectTo) {
    try {
        const existingUrl = await Url.findOne({ endpoint });
        if (existingUrl) {
            return 'Endpoint already exists';
        }

        const newUrl = new Url({ endpoint, redirectTo });
        await newUrl.save();
        return {success:true}; // Return success message
    } catch (error) {
        console.error('Error adding URL:', error);
        return {success:false}; // Handle the error case
    }
}




app.prepare().then(async () => {
    const server = express();
    server.use(bodyParser.json());

    await connectToDatabase();

    // Define custom route
    server.get('/:endpoint', (req, res) => {
        const { endpoint } = req.params;

        getUrl(endpoint).then(
            response => {
                if (response) {
                    // add https:// before redirecting, if already there, remove and add using regex
                    if (!response.match(/^[a-zA-Z]+:\/\//)) {
                        response = 'https://' + response;
                    }
                    res.redirect(response);
                } else {
                    res.send('URL not found');
                }
            }
        ).catch(
            error => {
                console.error('Error:', error);
                res.send('Error getting URL'); // Handle any errors
            }
        )
    });


    server.post('/add-url', (req, res) => {
        const { endpoint, redirectUrl } = req.body;
        addUrl(endpoint, redirectUrl).then(
            response => {
                res.json(response);
            }
        ).
        catch(
            error => {
                console.error('Error:', error);
                res.json({success:false}); // Handle any errors
            }
        )
    })

    server.post('/check-endpoint', (req, res) => {
        const { endpoint } = req.body;
        checkEndpointAvailability(endpoint).then(
            response => {
                res.json({available: response});
            }
        ).catch(
            error => {
                console.error('Error:', error);
                res.json({available: false});
            }
        )
    })

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
});
