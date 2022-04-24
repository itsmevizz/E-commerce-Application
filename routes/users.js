var express = require("express");
const { response, resource } = require("../app");
var router = express.Router();
var productHelper = require("../helpers/product-helpers");
var userHelpers = require("../helpers/user-heplers");

/* GET home page. */
router.get("/", (req, res) => {
  let user = req.session.user;
  console.log(user+'yoyoyoyyy');
  productHelper.getAllProducts().then((products) => {
    res.render("user/view-products", { products, user });
  });

});
router.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render("user/login", { 'loginErr': req.session.loginErr })
    req.session.loginErr = false;
  }
});
router.get("/signup", (req, res) => {
  if(!req.session.user){
    res.render("user/signup", { 'loginErr': req.session.loginErr })
    req.session.loginErr = false;
  }else{
    res.redirect('/')
  }
});
router.post("/signup", (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    if(response){
      req.session.user = response.user
      console.log('The name is '+ response.user);
      // req.session.user = true
      res.redirect('/')
    }else{
      req.session.loginErr = "Email Already Exists";
      res.redirect('/signup')
    }
  });
});
router.post("/login", (req, res) => {
  if(req.body.Email ||req.body.Password){
    userHelpers.doLogin(req.body).then((response) => {
      if (response.status) {
        req.session.user = response.user;
        // req.session.user = true;
        res.redirect("/");
      } else {
        req.session.loginErr = "Invallid Email or Password";
        res.redirect("/login");
      }
    });
  }else if(req.body.Email == ""|| req.body.Password ==""){
    req.session.loginErr = "Email and Password Must Not be Empty";
    res.redirect("/login");
  }

});
router.get("/logout", (req, res) => {
  req.session.user=null;
  res.redirect("/");
});

router.get('/cart',(req,res)=>{
  res.render('user/cart',{user:req.session.user})
})

module.exports = router; 
