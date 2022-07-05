var express = require('express');
var conn  = require('../lib/db');
var router = express.Router();

router.get('/',(req,res)=>{
    if(req.session.supacc===true   || req.session.account===true){

        let sql="SELECT e.id AS eId, e.f_name AS f_name, e.l_name AS l_name, pp.pay_period AS pay_period, ts.hours_worked AS hours_worked, ts.overtime AS overtime, ts.sick_days AS sick_days, ts.payment_status AS payment_status FROM employees e, time_sheets ts, pay_periods pp WHERE ts.pay_period_id = pp.id AND ts.employee_id = e.id" 
        conn.query(sql,(err,rows)=>{
            if(err) throw err
            res.render('admin',{
                page_title: 'Serhant Construction Admin',
                layout: "layouts/adminlayout",
                pay: rows
            })
        })
    }
    else{
        res.redirect('/')
    }
})

module.exports = router;