const express = require("express")
const users = require("./sample.json")
const cors = require("cors")
const fs = require("fs")

const app = express()
app.use(express.json())
const port = 8000
app.use( cors ({
    origin:" http://localhost:5173",
    methods: ["GET",'POST','PATCH','DELETE']
}))

//display all users
app.get("/users",(req,res)=>{
    return res.json(users)
})
app.post("/users",(req,res)=>{
    let {full_name, email, phone, city } = req.body
    if (!full_name || !email || !phone || !city) {
        res.status(400).send({message : "All fields required"})
    } 
    let id = Date.now()
    users.push({id,full_name,email,phone,city})
    fs.writeFile("./sample.json",JSON.stringify(users),(err,data)=>{
        return res.json({message: "user detail add success"})
    })
})

app.patch("/users/:id",(req,res)=>{
    let id = Number(req.params.id)
    let {full_name, email, phone, city } = req.body
    if (!full_name || !email || !phone || !city) {
        res.status(400).send({message : "All fields required"})
    } 

    let index = users.findIndex((user)=> user.id == id)
    users.splice(index, 1, {...req.body})
    fs.writeFile("./sample.json",JSON.stringify(users),(err,data)=>{
        return res.json({message: "user detail update success"})
    })
})
//delete user detail
app.delete("/users/:id",(req,res)=>{
    let id = Number(req.params.id)
    let filteredUsers = users.filter((user)=> user.id!==id)
    fs.writeFile("./sample.json",JSON.stringify(filteredUsers),(err,data)=>{
        return res.json (filteredUsers)
    })
})
app.listen(port,(err)=>{
    console.log(`App runs in ${port}`)
})