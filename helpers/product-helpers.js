const { promiseCallback } = require("express-fileupload/lib/utilities");
var db = require("../config/connection");
var collection = require('../config/collections')
module.exports = {
  addProduct: (product, callback) => {
    db.get()
      .collection("product")
      .insertOne(product)
      .then((data) => {
        callback(data);
      });
  },
  getAllProducts:()=>{
    return new Promise(async(resolve,reject)=>{
        let product =await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
        resolve(product)

    })  
  }
};
