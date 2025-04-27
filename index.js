const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
require('dotenv').config()
const app = express()

app.use(cors())
app.use(express.json())

const connection = mysql.createConnection(process.env.DATABASE_URL)

app.get('/', (req, res) => {
    res.send('Hello world!!')
})

app.get('/books', (req, res) => {
    connection.query(
        'SELECT * FROM books', // เปลี่ยนจาก 'users' เป็น 'books'
        function (err, results, fields) {
            res.send(results)
        }
    )
})

app.get('/books/:id', (req, res) => {
    const id = req.params.id;
    connection.query(
        'SELECT * FROM books WHERE id = ?', [id], // เปลี่ยนจาก 'users' เป็น 'books'
        function (err, results, fields) {
            res.send(results)
        }
    )
})

app.post('/books', (req, res) => {
    connection.query(
        'INSERT INTO `books` (`title`, `detail`, `price`, `image`) VALUES (?, ?, ?, ?)', // ปรับคำสั่ง SQL ให้ตรงกับฟิลด์ในตาราง books
        [req.body.title, req.body.detail, req.body.price, req.body.image],
         function (err, results, fields) {
            if (err) {
                console.error('Error in POST /books:', err);
                res.status(500).send('Error adding book');
            } else {
                res.status(200).send(results);
            }
        }
    )
})

app.put('/books', (req, res) => {
    connection.query(
        'UPDATE `books` SET `title`=?, `detail`=?, `price`=?, `image`=? WHERE id =?', // ปรับคำสั่ง SQL
        [req.body.title, req.body.detail, req.body.price, req.body.image, req.body.id],
         function (err, results, fields) {
            res.send(results)
        }
    )
})

app.delete('/books', (req, res) => {
    connection.query(
        'DELETE FROM `books` WHERE id =?', // ปรับคำสั่ง SQL
        [req.body.id],
         function (err, results, fields) {
            res.send(results)
        }
    )
})


app.listen(process.env.PORT || 3000, () => {
    console.log('CORS-enabled web server listening on port 3000')
})

// export the app for vercel serverless functions
module.exports = app;
