var express = require("express");
const { request, response } = require("../app");
const productHelpers = require("../helpers/product-helpers");
var router = express.Router();
var productHelper = require("../helpers/product-helpers");

/* GET users listing. */
router.get("/", function (req, res, next) {
  productHelpers.getAllProducts().then((products) => {
    res.render("admin/view-products", { admin: true, products });
  });
});
router.get("/add-product", (req, res) => {
  res.render("admin/add-product");
});
router.post("/add-product", (req, res) => {
  productHelper.addProduct(req.body, () => {
    let image = req.files.Image;
    let id = req.body._id;
    image.mv("./public/product-images/" + id + ".jpg", (err, done) => {
      if (!err) {
        res.render("admin/add-product");
      } else {
        console.log(err);
      }
    });
  });
});
router.get("/delete-product/:id", (req, res) => {
  let productId = req.params.id
  console.log(productId);
  productHelpers.deleteProduct(productId).then((response)=>{
    res.redirect('/admin/')
  })
});

router.get('/edit-product/:id',async(req,res)=>{
  let product =await productHelpers.getProductDetailes(req.params.id)
   console.log(product);
  res.render('admin/edit-product',{product})
})
router.post('/edit-product/:id',(req,res)=>{
  console.log(req.params.productId);
  productHelpers.updateProduct(req.params.id,req.nody).then(()=>{
    res.redirect('/admin')
  })

})

module.exports = router;
