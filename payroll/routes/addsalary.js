var express = require('express');
var conn  = require('../lib/db');
var router = express.Router();

router.get('/',(req,res)=>{
    if(req.session.supacc===true   || req.session.account===true){
        let sql="SELECT * FROM pay_periods"
        conn.query(sql,(err,rows)=>{
            res.render('addsalary',{
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


router.post('/addform',(req,res)=>{
    if(req.session.supacc===true   || req.session.account===true){

        let id=req.body.empId
        let sql=`SELECT e.id AS eId, e.f_name AS f_name, e.l_name AS l_name, pp.pay_period AS pay_period, ts.hours_worked AS hours_worked, ts.overtime AS overtime, ts.sick_days AS sick_days, ts.payment_status AS payment_status FROM employees e, time_sheets ts, pay_periods pp WHERE ts.pay_period_id = pp.id AND ts.employee_id = e.id AND ts.employee_id="${id}" AND ts.pay_period_id="${req.body.payP}"`
        conn.query(sql,(err,rows)=>{
            console.log(rows)
            if(err) throw err
            if(rows.length<=0){
                let getinfo=`SELECT e.id AS eId, e.f_name AS f_name, e.l_name AS l_name, ts.hours_worked AS hours_worked, ts.overtime AS overtime, ts.sick_days AS sick_days, ts.payment_status AS payment_status FROM employees e, time_sheets ts WHERE e.id="${id}"`
                conn.query(getinfo,(err,erows)=>{
                    if(err) throw err
                    let sql=`SELECT * FROM pay_periods WHERE id = "${req.body.payP}"`
                    conn.query(sql,(err,ppRows)=>{
                        if(err) throw err
                        res.render('addsalaryform',{
                            page_title:"Serhant Construction Admin",
                            layout: "layouts/adminlayout",
                            emp:erows[0],
                            pp:ppRows,
                        })
                    })
                })
            }
            if(rows.length>0){
                res.redirect('/addsalary')
            }
            
        })
    }
    else{
        res.redirect('/')
    }
})


router.post('/add',(req,res)=>{
    if(req.session.supacc===true   || req.session.account===true){
        let sql=`SELECT * FROM  employees WHERE id = "${req.body.eId}"`
        conn.query(sql,(err,eRows)=>{
            if(err) throw err
            let dep_id = eRows[0].department_id
            let dep=`SELECT * FROM departments WHERE id = "${dep_id}"`
            conn.query(dep,(err,dRows)=>{
                let overtime=0;
                let sick_days= req.body.days*8;
                let work_hours= req.body.hours - sick_days;

                if(work_hours > dRows[0].work_hours){
                    overtime = work_hours - dRows[0].work_hours;
                }

                let data={
                    hours_worked: work_hours,
                    overtime: overtime,
                    sick_days:sick_days,
                    employee_id:req.body.eId,
                    pay_period_id:req.body.addpPay,
                    payment_status:"paid"
                }
                let time="INSERT INTO time_sheets SET ?"
                conn.query(time, data,(err,tresults)=>{
                    if(err) throw err
                    let slip=`SELECT emp.id AS eId, emp.f_name AS f_name, emp.l_name AS l_name, pp.pay_period, ts.hours_worked AS hours, ts.overtime AS overtime, d.pay_per_hour, d.departmnet_name AS dep FROM time_sheets ts, employees emp, pay_periods pp, departments d WHERE emp.id="${req.body.eId}" AND d.id = emp.department_id AND ts.employee_id = emp.id AND ts.pay_period_id = pp.id AND ts.id="${tresults.insertId}"`

                    conn.query(slip,(err,sresults)=>{
                        if(err) throw err
                        let salary = sresults[0].hours * sresults[0].pay_per_hour;
                        let overtimeS = sresults[0].overtime * (sresults[0].pay_per_hour * 1.5);
                        let total = salary + overtimeS;

                        let pay=`UPDATE time_sheets SET overtime_pay = "${overtimeS}", base_pay = "${salary}", total_pay = "${total}"`
                        conn.query(pay,(err, payInfo)=>{
                            if(err) throw err
                            res.render('payslip',{
                                page_title:"Serhant Construction Admin",
                                layout: "layouts/adminlayout",
                                payslip:sresults[0],
                                totalSalary:total,
                                beforOver:salary,
                                over:overtimeS
                            })
                        })
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