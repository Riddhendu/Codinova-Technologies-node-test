const mongoose = require ('mongoose');



const projectSchema = new mongoose.Schema({
      projectName:{
          type:String,
          required:true,
          trim:true
          
      },
      startDate:{
          type:Date,
          required:true,

      },
      endDate:{
        type:Date,
        required:true,
      },
      managerName:{
        type:String,
        required:true,
        trim:true
      },
      managerEmail:{
        type:String,
        required:true,
        trim:true
      },
     
      employeeId:[{
          type:mongoose.Schema.Types.ObjectId,
          ref:'Employee'
      }],

      
      
      
})


const Project = mongoose.model('Project',projectSchema)

module.exports= Project;