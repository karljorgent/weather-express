const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const fetch = require('node-fetch')
const bp = require('body-parser')
const { resolve } = require('path/posix')
const res = require('express/lib/response')

// view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// body-parser
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

// weather key and city
const key = '09c55a9a2af84d1398ebb65835dd5b72'

// get weather data
const getWeatherDataPromise = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
        .then((responce) => {
            return responce.json()
        })
        .then((data) => {
            let description = data.weather[0].description
            let city = data.name
            let temp = Math.round(parseFloat(data.main.temp) - 273.15)
            let result = {
                description: description,
                city: city,
                temp: temp,
                error: null
            }
            resolve(result)
        })
        .catch(error => {
            reject(error)
        })
    })
}

// weather data to UI
app.all('/', function (req, res) {
    let city
    if(req.method == 'GET'){
        city = 'Tartu'
    }
    if(req.method == 'POST'){
        city = req.body.cityname
    }
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    getWeatherDataPromise(url)
    .then(data => {
        res.render('index', data)
    })
    .catch(error => {
        res.render('index', {error: 'Problem with getting data, try again'})
    })
})

app.listen(port, () => {
    console.log(`Now listening on port http://localhost:${port}`)
})