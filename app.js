const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;
const PDFDocument = require('pdfkit');
const { Weather } = require('./models/database');
const { Op } = require('sequelize');


app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

const apiKey = '24801cdeb38042efb4f120733252704';

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

app.get('/', async (req, res) => {
    const history = await Weather.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5
    });
    res.render('form', { history });
});

app.post('/weather', async (req, res) => {
    const { city, zip, startDate, endDate } = req.body;

    if (!startDate || !endDate) {
        return res.send('Please provide a start and end date!');
    }
    if (new Date(startDate) > new Date(endDate)) {
        return res.send('Start Date cannot be after End Date!');
    }

    if (!city && !zip) {
        return res.send('Please provide at least City or Zip Code!');
    }

    try {
        const location = city || zip;
        const today = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        let weatherResults = [];

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const formattedDate = formatDate(d);
            let url = '';

            if (d < today) {
                url = `http://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${location}&dt=${formattedDate}`;
            } else {
                url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&dt=${formattedDate}`;
            }

            const response = await axios.get(url);
            let weatherData;

            if (response.data.forecast) {
                const forecastDay = response.data.forecast.forecastday[0];
                weatherData = {
                    date: forecastDay.date,
                    location: response.data.location.name,
                    temp_c: forecastDay.day.avgtemp_c,
                    condition: forecastDay.day.condition.text,
                };
            }

            if (weatherData) {
                await Weather.create({
                    city,
                    zip,
                    date: weatherData.date,
                    temp_c: weatherData.temp_c,
                    condition: weatherData.condition,
                    location: weatherData.location
                });

                weatherResults.push(weatherData);
            }
        }

        res.render('result', { weatherResults });

    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.send('Error retrieving weather data. Please check your location and try again.');
    }
});

app.get("/history", async (req, res) => {
    const history = await Weather.findAll({
        order: [['date', 'DESC']]
    });
    res.render("history", { history });
});

app.get('/history/edit/:recordId', async (req, res) => {
    const { recordId } = req.params;
    
    const record = await Weather.findByPk(recordId);
    
    if (record) {
        res.render('edit', { record });
    } else {
        res.status(404).send('Record not found');
    }
});


app.post("/history/:recordId/update", async (req, res) => {
    const { recordId } = req.params;
    const { temp_c, condition } = req.body;

    try {
        const record = await Weather.findByPk(recordId);

        if (!record) {
            return res.status(404).send("Record not found");
        }

        // Update only temperature and condition
        await record.update({
            temp_c: parseFloat(temp_c),
            condition
        });

        res.redirect("/history");
    } catch (error) {
        console.error(error);
        res.send('Error updating weather record');
    }
});


app.post('/history/delete/:recordId', async (req, res) => {
    const { recordId } = req.params;
    
    try {
        const record = await Weather.findByPk(recordId);
        if (record) {
            await record.destroy();
        }
        res.redirect('/history');
    } catch (error) {
        res.status(500).send('Error deleting record');
    }
});


app.get('/export/json', async (req, res) => {
    const records = await Weather.findAll();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=weather_history.json');
    res.json(records);
});

app.get('/export/csv', async (req, res) => {
    const records = await Weather.findAll();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=weather_history.csv');
    
    
    let csv = 'Location,Date,Temperature (°C),Condition\n';

    records.forEach(record => {
        csv += `"${record.location}","${record.date}","${record.temp_c}","${record.condition}"\n`;
    });
    
    res.send(csv);
});

app.get('/export/pdf', async (req, res) => {
    const records = await Weather.findAll({
        order: [['date', 'DESC']]
    });
    
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=weather_history.pdf');
    
    doc.pipe(res);
    
    doc.fontSize(20).text('Weather History Report', { align: 'center' });
    doc.moveDown();
    
    records.forEach((record, index) => {
        doc.fontSize(12).text(`Record #${index + 1}`);
        doc.fontSize(10)
           .text(`Location: ${record.location}`)
           .text(`Date: ${record.date}`)
           .text(`Temperature: ${record.temp_c}°C`)
           .text(`Condition: ${record.condition}`)
           .moveDown();
    });
    
    doc.end();
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
