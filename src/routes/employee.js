const express = require('express')
const Employee = require('../models/employee')
const Department = require('../models/department')
const Project = require('../models/project')
const auth = require('../middleware/auth')


const router = new express.Router()

// Register an employee///

router.post('/employee/register',async(req,res)=>{
    try {
        const employee = new Employee(req.body)
        await employee.save()
        const token = await employee.getAuthToken()
        res.send({employee,token}).status(200)
        
    } catch (error) {
        res.send(error).status(404)
    }
   
})
/// login  employee ////

router.post('/employee/login',async(req,res)=>{
    try {
        const employee = await Employee.findByCredentials(req.body.email,req.body.password)
        const token = await employee.getAuthToken()
        res.send({employee,token}).status(200)
    } catch (error) {
        res.send(error).status(404)
    }
})

/// get employees ///

router.get('/employee/get',async(req,res)=>{
    try {
        const employee = await Employee.aggregate([

            {$lookup:{ from: 'departments', localField:'departmentId', 
              foreignField:'_id',as:'departmentId'}},
              {
                $unwind:{
                  path:'$departmentId', 
                  preserveNullAndEmptyArrays : true
                }
              }
              
      ])
        res.send(employee).status(200)
        
    } catch (error) {
        res.send(error).status(404)
    }
})
/// register a project  ///
   router.post('/project/register', async(req,res)=>{
    try {
        const project = new Project(req.body)
        await project.save()
        res.send(project).status(200)
        
    } catch (error) {
        res.send(error).status(404)
    }
   })

// get projets ///
router.get('/projects',auth,async(req,res)=>{
    try {
        let limit = 10;
       let page=0;
        let skip=0;
        const project = await Project.aggregate([

            {$lookup:{ from: 'employees', localField:'employeeId', 
              foreignField:'_id',as:'employeeId'}},
              {
                $unwind:{
                  path:'$employeeId', 
                  preserveNullAndEmptyArrays : true
                }
              },{
                $lookup:{
                    from: "departments", 
                    localField: "employeeId.departmentId", 
                    foreignField: "_id",
                    as: "employeeId.departmentId"
                }
            
              
            },
            { 
                '$facet'    : {
                metadata: [ { $count: "total" }, { $addFields: { page:  page+1,limit:limit } } ],
                data: [ { $skip: parseInt(skip) }, { $limit: parseInt(limit) } ] // add projection here wish you re-shape the docs
                 } 
            }

      ])
        res.send(project).status(200)
        
    } catch (error) {
        res.send(error).status(404)
    }
})

// for post department//
router.post('/department/register',async(req,res)=>{
    try {
        const department = new Department(req.body)
        await department.save()
        res.send(department).status(200)
    } catch (error) {
        res.send(error).status(404)
    }
})
module.exports=router