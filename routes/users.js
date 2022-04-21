var express = require('express');
var router = express.Router();
var productHelper = require("../helpers/product-helpers");

/* GET home page. */
router.get('/',(req, res)=>{
    
    productHelper.getAllProducts().then((products) => {
      res.render("user/view-products", {products });
    });
  });
  router.get('/login',(req,res)=>{
    res.render('user/login')
  })

module.exports = router;
