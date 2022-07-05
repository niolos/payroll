var express = require('express')
var conn= require('../lib/db')
var router= express.Router()

router.get('/',(req,res)=>{
    if(req.session.supreg===true){
        let roles="SELECT * FROM roles"
        conn.query(roles,(err,results)=>{
            if(err) throw err
            let dep="SELECT * FROM departments"
            conn.query(dep,(err, depdet)=>{
                res.render('addemp',{
                    layout: 'layouts/adminlayout',
                    page_title: 'Serhant Construction Admin',
                    emprole: results,
                    dep: depdet,
                })
            })
        })
    }
    else{
        res.redirect('/')
    }
})


router.post('/add',(req,res)=>{
    if(req.session.supreg===true){
        let data={
            f_name:req.body.fname,
            l_name:req.body.lname,
            department_id: req.body.dep,
            role_id: req.body.role,
            email:req.body.email,
            password: req.body.password,
        }
        let sql="INSERT INTO employees SET ?"
        conn.query(sql, data,(err,results)=>{
            if(err) throw err
            res.redirect('/dep')
        })
    }
    else{
        res.redirect('/')
    }
})

module.exports = router;