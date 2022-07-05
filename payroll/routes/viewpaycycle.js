var express = require('express');
var conn  = require('../lib/db');
var router = express.Router();

router.get('/',(req,res)=>{
    if(req.session.supreg===true || req.session.supacc===true || req.session.regular===true || req.session.account===true){

    res.render('viewpaycycle',{
        page_title:"Serhant Construction Admin",
        layout: "layouts/adminlayout",
    })
}
else{
    res.redirect('/')
}
})



module.exports = router;