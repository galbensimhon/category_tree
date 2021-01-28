const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');

const PATH_FILE = './data/category_trees.json';
const PORT = 3232;

app.use(
    cors({
        origin: 'http://localhost:3000'
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/calculate_tree/load', (req, res) => {
    const file = fs.readFileSync(PATH_FILE);
    const data = JSON.parse(file);
    res.send(data);
    res.status(200);
});

app.post('/calculate_tree/save', (req, res) => {
    if(!req.body)
        return res.status(400).send("wrong");
    const json = JSON.stringify(req.body, 2);
    fs.writeFileSync(PATH_FILE, json);
    res.status(200).json({message: "OK"});
});

app.get('*', (req, res) => {
    res.send('404 page, please try again :)');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke! please try again :)');
});

app.listen(PORT, function () {
    console.log(`server is running on port ${PORT}!`);
});