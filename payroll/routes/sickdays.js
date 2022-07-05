var express = require('express')
var conn= require('../lib/db')
var router= express.Router()

router.get('/',(req, res)=>{
    if(req.session.supreg===true || req.session.supacc===true){

        let sql="SELECT * FROM pay_periods"
        conn.query(sql,(err,rows)=>{
        res.render("sickdays",{
            page_title: 'Serhant Construction Admin',
            layout: 'layouts/adminlayout',
            cycle: rows,
            })
        })
    }
    else{
        res.redirect('/')
    }
})


router.post('/update',(req, res)=>{
    if(req.session.supreg===true || req.session.supacc===true){

        let id=req.body.empId
        let sql=`SELECT e.id AS eId, e.f_name AS f_name, e.l_name AS l_name, pp.pay_period AS pay_period, ts.hours_worked AS hours_worked, ts.overtime AS overtime, ts.sick_days AS sick_days, ts.payment_status AS payment_status FROM employees e, time_sheets ts, pay_periods pp WHERE ts.pay_period_id = pp.id AND ts.employee_id = e.id AND ts.employee_id="${id}" AND ts.pay_period_id="${req.body.pp}"`
        conn.query(sql,(err,rows)=>{
            if(err) throw err
            if(rows.length>0){
                let paycheck = `SELECT pp.id AS pId, pp.pay_period AS pay_period, ts.id AS tId, ts.hours_worked AS work_hours ,ts.base_pay AS base_pay FROM pay_periods pp, time_sheets ts WHERE pp.id = ts.pay_period_id AND ts.employee_id ="${id}"`
                conn.query(paycheck,(err,pay)=>{
                    if(err) throw err
                    sickdays=rows[0].sick_days /8
                    res.render('sickdaysupdat',{
                        page_title:"Serhant Construction Admin",
                        layout: "layouts/adminlayout",
                        emp:rows[0],
                        pay:pay[0],
                        sickdays:sickdays
                    })
                })
            }
            else{
                res.redirect('/sickdays')
            }
            
        })
    }
    else{
        res.redirect('/')
    }
})


router.post('/update/sickdays',(req, res)=>{
    if(req.session.supreg===true || req.session.supacc===true){

        let sql=`SELECT * FROM time_sheets ts WHERE ts.id="${req.body.tid}"`
        conn.query(sql,(err, results)=>{
            if(err) throw err
            let sql=`SELECT * FROM  employees WHERE id = "${results[0].employee_id}"`
            conn.query(sql,(err,eRows)=>{
                let dep_id = eRows[0].department_id
                if(err) throw err
                let dep=`SELECT * FROM departments WHERE id = "${dep_id}"`
                conn.query(dep,(err,dRows)=>{
                    if(err) throw err
                    let overtime=0;
                    let sick_days=req.body.days*8;
                    let work_hours= results[0].hours_worked - sick_days;
                    let salary = work_hours * dRows[0].pay_per_hour;
                    let overtimeS = overtime * (dRows[0].pay_per_hour * 1.5);
                    let total = salary + overtimeS;

                    if(work_hours > dRows[0].work_hours){
                        overtime = work_hours - dRows[0].work_hours;
                }
                    let data={
                        hours_worked: work_hours,
                        overtime: overtime,
                        sick_days: sick_days,
                        overtime_pay: overtimeS,
                        base_pay: salary,
                        total_pay: total,
                    }
                    let update=`UPDATE time_sheets SET ? WHERE id = "${req.body.tid}"`
                    conn.query(update, data,(err, results)=>{
                        res.redirect('/dep')
                    })
                })
            })
        })
    }
    else{
        res.redirect('/')
    }
})

module.exports = router;