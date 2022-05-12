const express = require('express')

const app = express()

const path = require('path')


app.use(express.static(path.join(__dirname, '/build/')))

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/build/index.html'));
})

app.get('/*', (req, res) => {
        res.redirect('/');
})


app.listen(3005, () => {
	console.log('listening on port 3005')
})