require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const http = require('http')
const bodyParser = require('body-parser')
const mysql = require('mysql2')

const server = http.createServer(app)

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

app.set("view engine", "ejs") // get ejs files
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'style')))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.post('/submit', async (req, res) => {
    const { brand, yearOne, yearTwo, distanceOne, distanceTwo, fuel, gearbox, type, drive, pageNum, itemsPerPage } = req.body
    
    const limit = parseInt(itemsPerPage)
    const page = parseInt(pageNum)
    const offset = (page - 1) * limit
    
    let sql = `SELECT * FROM autod WHERE 1=1` // pagination
    let sqlCounter = `SELECT COUNT(*) AS totalCount FROM autod WHERE 1=1 ` // COUNT selects all the records FROM autod
    let arg = []

    if (brand) {
        sql += ` AND brand LIKE ?`
        arg.push(`%${brand}%`)
    }

    if (yearOne && yearTwo) {
        sql += ` AND year BETWEEN ? AND ?`
        arg.push(yearOne, yearTwo)
    }

    if (distanceOne && distanceTwo) {
        sql += ` AND distance BETWEEN ? AND ?`
        arg.push(distanceOne, distanceTwo)
    }

    if (fuel) {
        sql += ` AND fuel LIKE ?`
        arg.push(`%${fuel}%`)
    }

    if (gearbox) {
        sql += ` AND gearbox LIKE ?`
        arg.push(`%${gearbox}%`)
    }

    if (type) {
        sql += ` AND type LIKE ?`
        arg.push(`%${type}%`)
    }

    if (drive) {
        sql += ` AND drive LIKE ?`
        arg.push(`%${drive}%`)
    }

    for (let x = 0; x < arg.length; x++) {
        if (arg[x] == '%%') { arg[x] = '' }
        if (!arg[x].includes('%')) { arg[x] = isNaN(parseInt(arg[x])) ? '' : parseInt(arg[x]) }
    }

    sqlCounter += sql.split(' ').splice(6).join(' ')

    sql += ` LIMIT ? OFFSET ?`
    arg.push(limit, offset)
    
    try {
        // saadud autod ja kogu v22rtus
        const [items, totalCountResult] = await Promise.all([
            getData(sql, arg),
            getData(sqlCounter, arg)
        ])

        const totalCount = totalCountResult[0].totalCount
        const totalPages = Math.ceil(totalCount / limit)

        const carInfoObj = {
            items: items,
            currentPage: page,
            totalPages: totalPages,
            totalCount: totalCount
        }

        res.json(carInfoObj)

    } catch(err) {
        console.log(err)
    }
})

const getData = (sql, arg) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, arg, (err, result) => {
            if (err) { console.log(err); reject(err) }
            else { resolve(result) }
        })
    })
}

server.listen(process.env.PORT || 3000, () => { console.log('Server running') })