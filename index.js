const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const fetch = require('node-fetch')
const bp = require('body-parser')

// view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// body-parser
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

// weather key and city
const key = '09c55a9a2af84d1398ebb65835dd5b72'
let city = 'Tartu'

// get weather data for Tartu
app.get('/', function (req, res) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`)
    .then((responce) => {
        return responce.json()
    })
    .then((data) => {
        let description = data.weather[0].description
        let city = data.name
        let temp = Math.round(parseFloat(data.main.temp) - 273.15)
        res.render('index', {
            description: description,
            city: city,
            temp: temp
        })
    })
})

// Change data to your liking
app.post('/', function(req, res){
    let city = req.body.cityname
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`)
    .then((responce) => {
        return responce.json()
    })
    .then((data) => {
        let description = data.weather[0].description
        let city = data.name
        let temp = Math.round(parseFloat(data.main.temp) - 273.15)
        res.render('index', {
            description: description,
            city: city,
            temp: temp
        })
    })
})

app.listen(port, () => {
    console.log(`Now listening on port http://localhost:${port}`)
});