const { promiseCallback } = require("express-fileupload/lib/utilities");
var db = require("../config/connection");
var collection = require("../config/collections");
const { response } = require("../app");
var objectId = require("mongodb").ObjectId;
module.exports = {
  addProduct: (product, callback) => {
    db.get()
      .collection("product")
      .insertOne(product)
      .then((data) => {
        callback(data);
      });
  },
  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      let product = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find()
        .toArray();
      resolve(product);
    });
  },
  deleteProduct: (productId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .deleteOne({ _id: objectId(productId) })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },
  getProductDetailes: (productId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .findOne({ _id: objectId(productId) })
        .then((product) => {
          resolve(product);
        });
    });
  },
  updateProduct: (productId, ProductDetailes) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .updateOne(
          { _id: objectId(productId) },
          {
            $set: {
              Name: ProductDetailes.Name,
              Description: ProductDetailes.Description,
              Price: ProductDetailes.Price,
              Category: ProductDetailes.Category,
            },
          }).then((response)=>{
            resolve()
          })
    });
  },
};
