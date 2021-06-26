const jwt = require('jsonwebtoken')
const Employee = require('../models/employee')


const auth = async (req,res,next)=>{
    try {
        const token = req.header("Authorization").replace('Bearer ','')
        const decoded = jwt.verify(token,"thisismypassword")
        const employee = await Employee.findOne({id:decoded._id,"tokens.token":token})
        if(!employee){
            throw new Error('Employee not exist')
        }
        req.token= token;
        req.employee= employee;
        next()
        
    } catch (error) {
        res.send(error).status(404)
    }
   
}

module.exports = auth