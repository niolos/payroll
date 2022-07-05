var express = require('express');
var conn  = require('../lib/db');
var router = express.Router();

router.get('/',(req,res)=>{
    res.render('index',{
        page_title: 'Serhant Construction Login',
    })
})



router.post('/login',(req,res)=>{
    let sql=`SELECT * FROM employees WHERE email = "${req.body.email}" AND BINARY password = "${req.body.password}" AND role_id = 1 AND department_id = 4`
    conn.query(sql,(err,admincheck)=>{
        if(err) throw err
        if(admincheck.length <= 0){
            let sql=`SELECT * FROM employees WHERE email = "${req.body.email}" AND BINARY password = "${req.body.password}" AND role_id = 1 `
            conn.query(sql,(err, emp)=>{
                if(err) throw err
                if(emp.length <= 0){

                    let sql=`SELECT * FROM employees WHERE email = "${req.body.email}" AND BINARY password = "${req.body.password}" AND role_id = 2 AND department_id = 4`
                    conn.query(sql,(err, accountsup)=>{
                        if(err) throw err
                        if(accountsup.length <= 0){
                            let sql=`SELECT * FROM employees WHERE email = "${req.body.email}" AND BINARY password = "${req.body.password}" AND role_id = 2 `
                            conn.query(sql,(err, empsup)=>{
                                if(err) throw err
                                if(empsup.length <= 0){
                                    res.redirect('/')
                                }
                                else{
                                    req.session.supreg = true;
                                    req.session.eId = empsup[0].id;
                                    req.session.user = empsup[0].email;
                                    req.session.password = empsup[0].password;
                                    req.session.dep = empsup[0].department_id
                                    res.redirect('/dep');
                                } 
                            })
                        }
                        else{
                            req.session.supacc = true;
                            req.session.eId = accountsup[0].id;
                            req.session.user = accountsup[0].email;
                            req.session.password = accountsup[0].password;
                            req.session.depacc = accountsup[0].department_id
                            res.redirect('/admin');
                        }  
                    })
                }
                else{
                    req.session.regular = true;
                    req.session.eId = emp[0].id;
                    req.session.user = emp[0].email;
                    req.session.password = emp[0].password;
                    res.redirect('/paycycle');
                }
            })
        }
        else{
            req.session.account = true;
            req.session.eId = admincheck[0].id;
            req.session.user = admincheck[0].email;
            req.session.password = admincheck[0].password;
            res.redirect('/admin');
        }
    })

})

router.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
  });

module.exports = router;