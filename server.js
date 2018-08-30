const express = require('express');
const fs = require('fs');
const yargs = require('yargs');
const app = express();
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator/check');

app.use(bodyParser.json());

/*
* Function that read products.json file and return a promise
*/
var fetchProductData = () => {
  return new Promise((resolve,reject) => {
      fs.readFile('./Data/products.json',function(err,data){
        if(err){
          reject('ERROR');
        }
        else {
          resolve(JSON.parse(data));
        }
      });
  });
}

/*
* Function that read bucket,json file and return a promise
*/
var fetchBucketData = () => {
  return new Promise((resolve,reject) => {
      try{
        fs.readFile('./Data/bucket.json',function(err,data){
          if(err){
            reject('ERROR');
          }
          else {
            resolve(JSON.parse(data));
          }
        });
      }catch(e){
        resolve([]);
      }
  });
}

/*
* Method that write  data to bucket.json
*/
var addToBucket = (data) => {
  fs.writeFile('./Data/bucket.json',JSON.stringify(data),function(err){
    if(err) {
      console.log("err");
    }
  });
}

/*
* Method that handle get request and send the products as reply
*/
app.get('/products',(req,res) => {
  fetchProductData().then((data) => {
    res.send(data);
    console.log(data,"DATA SUCCESS");
  });
});

/*
* Method to write to basket when user clicks add to cart
*/
app.post('/basket',[
  check('name').isAlpha(),
  check('id').isInt(),
  check('cost').isInt()
],(req,res) => {

  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
     var er = res.status(422).json({ errors: errors.array() });
     res.send('erorr');
     return er;
  }
  else{
    const { id, name, cost } = req.body;
      var singleProduct = {
        "id":id,
        "name":name,
        "cost":cost
      };
      fetchBucketData().then((data) => {
        data.push(singleProduct);
        addToBucket(data);
        console.log("--------------------------------\n\n",data);
      });
    }
});

/*
* Method to get data from the bucket and send it as reply
*/
app.get('/basket',(req,res) => {
  fetchBucketData().then((data)=> {
    res.send(data);
    console.log("**********************DATA SUCCESS",data);
  })
});

app.listen(3000);
