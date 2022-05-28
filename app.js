var express = require('express');
var path = require('path');
var cors = require('cors');

var indexRouter = require('./routes/index');

const succursalesRouter = require('./routes/succursales')
const studentsRouter = require('./routes/students')

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'), {"index": "projet3.htm"}));
app.use(cors())

app.use('/', indexRouter);
app.use('/succursales', succursalesRouter); //1
app.use('/students', studentsRouter); //2


module.exports = app;
