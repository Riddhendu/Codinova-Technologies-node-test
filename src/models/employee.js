const mongoose = require ("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const employeeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        
    },
    doj:{
        type:Date,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }],
   
    departmentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Department'
    },
    
    
})

employeeSchema.methods.getAuthToken = async function(){
    const employee = this
    const token = jwt.sign({_id:employee._id.toString()},"thisismypassword")
    employee.tokens = employee.tokens.concat({token})
    await employee.save()
    return token;
}
employeeSchema.statics.findByCredentials= async(email,password)=>{
    const employee = await Employee.findOne({email})
    if(!employee){
        throw new Error('No employee is found')
    }
    const ismatch = await bcrypt.compare(password,employee.password)
    if(!ismatch){
        throw new Error('Password does not match')
    }
    return employee
}

employeeSchema.pre('save',async function(next){
    const employee = this
    if(employee.isModified('password')){
        employee.password = await bcrypt.hash(employee.password,8)
    }
    next()
})

const Employee = mongoose.model('Employee',employeeSchema)

module.exports= Employee;