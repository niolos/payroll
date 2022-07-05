var express = require('express')
var conn= require('../lib/db')
var router= express.Router()

router.get('/',(req,res)=>{
    if(req.session.supacc===true   || req.session.supreg===true){
        if(req.session.supacc===true){
            var depart =req.session.depacc
        }
        if(req.session.supreg===true){
            var depart = req.session.dep
        }
        let sql=`SELECT emp.id AS id, emp.f_name AS f_name, emp.l_name AS l_name, d.departmnet_name AS department_name, r.roles_name AS roles_name FROM employees emp, departments d, roles r WHERE emp.department_id = d.id AND r.id = emp.role_id AND emp.department_id ="${depart}"`
        conn.query(sql,(err,results)=>{
            if(err) throw err
            console.log(results)
            res.render('dep',{
                layout: "layouts/adminlayout",
                page_title: "Serhant Construction Admin",
                rows:results
            })
        })
    }
    else{
        res.redirect('/')
    } 
})

module.exports = router;