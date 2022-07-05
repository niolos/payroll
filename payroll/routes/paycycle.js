var express = require('express');
var conn  = require('../lib/db');
var router = express.Router();

router.get('/',(req,res)=>{
    if(req.session.supreg===true || req.session.supacc===true || req.session.regular===true || req.session.account===true){
        let sql="SELECT * FROM pay_periods"
        conn.query(sql,(err,rows)=>{
            res.render('paycycle',{
                page_title:"Serhant Construction Admin",
                layout: "layouts/adminlayout",
                cycle:rows
            })
        })
    }
    else{
        res.redirect('/')
    }
})

router.post('/view',(req,res)=>{
    if(req.session.supreg===true || req.session.supacc===true || req.session.regular===true || req.session.account===true){

        let id=req.body.empId
        let sql=`SELECT e.id AS eId, e.f_name AS f_name, e.l_name AS l_name, pp.pay_period AS pay_period, ts.hours_worked AS hours_worked, ts.overtime AS overtime, ts.sick_days AS sick_days, ts.payment_status AS payment_status FROM employees e, time_sheets ts, pay_periods pp WHERE ts.pay_period_id = pp.id AND ts.employee_id = e.id AND ts.employee_id="${id}" AND ts.pay_period_id="${req.body.payP}"`
        conn.query(sql,(err,rows)=>{
            if(err) throw err
            if(rows.length>0){
                res.render('viewpaycycle',{
                    page_title:"Serhant Construction Admin",
                    layout: "layouts/adminlayout",
                    emp:rows[0]
                })
            }
            else{
                res.redirect('/paycycle')
            }
            
        })
    }
    else{
        res.redirect('/')
    }
})

module.exports = router;