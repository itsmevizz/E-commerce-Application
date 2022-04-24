var express = require("express");
const { request, response } = require("../app");
const productHelpers = require("../helpers/product-helpers");
var router = express.Router();
var productHelper = require("../helpers/product-helpers");
const userHeplers = require("../helpers/user-heplers");
var userRouter = require('../routes/users')

/* GET users listing. */
router.get("/", function (req, res, next) {
  if (req.session.admin) {
    res.redirect("admin/view-products");
  }
  {
    res.render("admin/admin-login", { adminlogin: true, err: req.session.err });
    req.session.err = false;
  }
});

router.get("/view-products", function (req, res, next) {
  if (req.session.admin) {
    productHelpers.getAllProducts().then((products) => {
      res.render("admin/view-products", { admin: true, products });
    });
  } else {
    res.redirect("/admin");
  }
});
router.get("/add-product", (req, res) => {
  if (req.session.admin) {
    res.render("admin/add-product", {
      admin: true,
      failed: req.flash.failed,
      success: req.flash.success,
    });
    req.flash.success = false;
    req.flash.failed = false;
  } else {
    res.redirect("/admin");
  }
});
router.post("/add-product", (req, res) => {
  if (req.body.Name && req.body.Price && req.files.Image) {
    productHelper.addProduct(req.body, () => {
      let id = req.body._id;
      req.flash.success = "Product added successfully";
      res.redirect("/admin/add-product");
      if (req.files) {
        let image = req.files.Image;
        image.mv("./public/product-images/" + id + ".jpg");
      }
    });
  } else {
    req.flash.failed = "Not Be Empty";
    res.redirect("/admin/add-product");
  }
});
router.get("/delete-product/:id", (req, res) => {
  let productId = req.params.id;
  console.log(productId);
  productHelpers.deleteProduct(productId).then((response) => {
    res.redirect("/admin");
  });
});

router.get("/edit-product/:id", async (req, res) => {
  if (req.session.admin) {
    let product = await productHelpers.getProDetails(req.params.id);
    console.log(product);
    res.render("admin/edit-product", { admin: true, product });
  } else {
    res.redirect("/admin");
  }
});
router.post("/edit-product/:id", (req, res) => {
  // console.log(req.params.product._id);
  productHelpers.updateProduct(req.params.id, req.body).then((response) => {
    let id = req.params.id;
    console.log(response);
    res.redirect("/admin/view-products");
    if (req.files) {
      let image = req.files.Image;
      image.mv("./public/product-images/" + id + ".jpg");
    }
  });
});
router.get("/all-users", (req, res) => {
  if (req.session.admin) {
    userHeplers.getAllUsers().then((users) => {
      res.render("admin/all-users", { admin: true, users });
    });
  } else {
    res.redirect("/admin");
  }
});
router.get("/delete-user/:id", (req, res) => {
  let userId = req.params.id;
  console.log(userId);
  userHeplers.deleteUser(userId).then((response) => {
    res.redirect("/admin/all-users");
  });
});

const credential = {
  username: "admin",
  password: "admin",
};
router.get("/admin-login", (req, res) => {
  console.log("hihi");
  if (req.session.admin) {
    res.redirect("/admin/view-products");
  } else {
    res.render("admin/admin-login");
  }
});

//login user............
router.post("/adminlogin", (req, res) => {
  if (
    req.body.User == credential.username &&
    req.body.Password == credential.password
  ) {
    req.session.admin = req.body.User;
    if (req.session.admin) {
      res.redirect("/admin/view-products");
    }
  } else {
    if (req.body.User == "" || req.body.Password == "") {
      req.session.err = "Username and password must not be empty";
      res.redirect("/admin");
    } else {
      req.session.err = "Invalid Username or Password";
      res.redirect("/admin");
    }
  }
});
router.post("/adminlogout", (req, res) => {
  req.session.admin = null;
  res.redirect("/admin");
});
router.get("/add-user", (req, res) => {
  if (req.session.admin) {
    res.render("admin/add-user", {
      admin: true,
      success: req.session.success,
      failed: req.session.failed,
    });
    req.session.success = false;
    req.session.failed = false;
  } else {
    res.redirect("/admin");
  }
});
router.post("/add-user", (req, res) => {
  if (req.body.Name && req.body.Email && req.body.Password) {
    userHeplers.addUsers(req.body).then((response) => {
      if (response) {
        req.session.success = "User Added Successfully";
        res.redirect("/admin/add-user");
      } else {
        req.session.failed = "Email Already Exists";
        res.redirect("/admin/add-user");
      }
    });
  }else{
    req.session.failed = "Please Fill"
    res.redirect('/admin/add-user')
  }
});
router.get("/edit-user", async (req, res) => {
  if (req.session.admin) {
    let user = await userHeplers.getUserDetails(req.query.id);
    console.log(user);
    res.render("admin/edit-user", { admin: true,user,edited: req.flash.edited,
    });
    req.flash.edited = false;
  } else {
    res.redirect("/admin");
  }
});
router.post("/edit-user", (req, res) => {
  // console.log(req.params.product._id);
  userHeplers.editUser(req.query.id, req.body).then((response) => {
    let id = req.query.id;
    console.log("ok macha");
    req.flash.edited = "Edited Successfully";
    res.redirect("/admin/edit-user");
  });
});

module.exports = router;
