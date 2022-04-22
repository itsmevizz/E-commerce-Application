var express = require("express");
const { response } = require("../app");
var router = express.Router();
var productHelper = require("../helpers/product-helpers");
var userHelpers = require("../helpers/user-heplers");

/* GET home page. */
router.get("/", (req, res) => {
  let user = req.session.user;
  productHelper.getAllProducts().then((products) => {
    res.render("user/view-products", { products, user });
  });
});
router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.render("user/login", { 'loginErr': req.session.loginErr })
    req.session.loginErr = false;
  }
});
router.get("/signup", (req, res) => {
  res.render("user/signup");
});
router.post("/signup", (req, res) => {
  let id = req.body._id;
  userHelpers.doSignup(req.body).then((responce) => {
    console.log(responce);
  });
});
router.post("/login", (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.redirect("/");
    } else {
      req.session.loginErr = "Invallid Name or Password";
      res.redirect("/login");
    }
  });
});
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
router.get('/cart',(req,res)=>{
  res.render('user/cart')
})

module.exports = router;
