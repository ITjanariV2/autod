if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const mysql = require('mysql')
const jsonFile = require('./correctDB.json')

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

connection.connect((err) => {
    if (err) { console.log(err) }
    console.log('Connected to MySQL')
})

let sql = 'INSERT INTO autod (brand, year, distance, fuel, gearbox, type, drive, image) VALUES ?'
let arrayToBeFilled = []
let count = 0

for (let x in jsonFile) {
    let values = [
    jsonFile[x].title[0], // brand
    parseInt(jsonFile[x].description[0]), // year
    parseInt(jsonFile[x].description[1]), // distance
    jsonFile[x].description[2], // fuel
    jsonFile[x].description[3], // gearbox
    jsonFile[x].description[4], // type
    jsonFile[x].description[5], // drive
    jsonFile[x].image] // image
    
    arrayToBeFilled.push(values)
    count++
}

connection.query(sql, [arrayToBeFilled], (err, result) => {
    if (err) { console.log(err) }
    console.log(`Success: ${count} inserted`)
})