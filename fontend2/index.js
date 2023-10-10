const express = require("express")
const app = express()
const fs = require('fs');
const csv = require('csv-parser');
const bodyParser = require('body-parser'); 
const customer_brands = require("./customer_product_brands.json")


app.use(express.static('public'))
app.set('view engine','ejs')
app.use(bodyParser.json());
require('dotenv').config();

const port = process.env.PORT || 3000; // Use port 3000 if PORT is not defined








// Specify the path to your CSV file
const csvFilePath = './brands.csv';
var new_product_list = []
const dataArray = [];
const priceArray = [];
const customer_id = [];
const associationRules = require('./rules')
const product_categories = require('./categories')




fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    // This function will be called for each row in the CSV file
    dataArray.push(row.name);
  })
  .on('end', () => {
    // All data has been read and parsed into an array
    for(var i in dataArray){
        priceArray.push(Math.floor(Math.random() * (100 - 10 + 1)) + 10)
    }
  })
  .on('error', (error) => {
    console.error(error);
  });




  fs.createReadStream('./customers.csv')
  .pipe(csv())
  .on('data', (row) => {
    // This function will be called for each row in the CSV file
    customer_id.push(row.name);
  })
  .on('end', () => {
    console.log(customer_id)
  })
  .on('error', (error) => {
    console.error(error);
  });

function predictConsequent(array){
  const targetAntecedent = array;

  // Function to check if two arrays have the same elements, regardless of order
  function arraysHaveSameElements(arr1, arr2) {
      if (arr1.length !== arr2.length) return false;
      const sortedArr1 = arr1.slice().sort();
      const sortedArr2 = arr2.slice().sort();
      return sortedArr1.every((item, index) => item === sortedArr2[index]);
  }

  // Filter rules that have the same antecedent as the targetAntecedent
  const matchingRules = associationRules.filter((rule) =>
      arraysHaveSameElements(targetAntecedent, rule.antecedents)
  );

  // Extract complementary items from the matching rules
  const complementaryItems = new Set();
  matchingRules.forEach((rule) => {
      rule.consequents.forEach((item) => {
          if (!arraysHaveSameElements(targetAntecedent, item)) {
              complementaryItems.add(item);
          }
      });
  });
  return Array.from(complementaryItems);

}


for(i in associationRules){
  for(j in associationRules[i].antecedents){
    if(new_product_list.includes(associationRules[i].antecedents[j])){
      console.log("its there")
    }else{
      new_product_list.push(associationRules[i].antecedents[j]);
    }
  }
  
}



app.get('/',function(req,res){
  res.render('login')
})


app.get('/home',function(req,res){
  var id = req.query.id
  if(customer_id.includes(id)){
    for(key in customer_brands){
      if(customer_brands[key].customer_label.toString()==id.toString()){
        new_product_list = customer_brands[key].product_brand
        break;
      }
    }
    const data  = {
        productList :new_product_list,
        priceList:priceArray,
        categories: product_categories
    }
    res.render("index",data)
  }else{
    res.render("error")
  }
  
})



app.get('/checkout',function(req,res){
    random_items =[]
    for(var i=0;i<5;i++){
      random_items.push(dataArray[(Math.floor(Math.random() * dataArray.length))])
    }
    const total = 0;
    const itemList = []
    var data =JSON.parse(req.query.jsonData)
     for(var i in data.data){
      itemList.push(data.data[i].name)
    }
   
    var checkout_data ={
      productList : predictConsequent(itemList),
      priceList  : priceArray,
      allLitst : dataArray,
      itemList : itemList,
      random : random_items,
      categories: product_categories

    }
    res.render('checkout',checkout_data)
})




app.listen(port,()=>console.log("server started on port ",port))