const express = require('express')
const employeeRouter = require('./routes/employee')
require('./db/mongoose')
const app = express()

const port = process.env.PORT || 5000
app.use(express.json())
app.use(employeeRouter)

app.listen(port,()=>{
    console.log(`port is running on ${port}`);
})