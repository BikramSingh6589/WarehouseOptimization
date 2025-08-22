// Requires ----------------------------------------------------------------------------------------------------------
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const dotenv = require('dotenv').config();

// Custom Require ------------------------------------------------------------------------------------------------------------
const db = require('./db.js');
const mailer = require('./mailer.js');
const session = require('./session.js');

//Routes Include ----------------------------------------------------------------------------------------------------

const signInRoutes = require('./routes/signinroutes.js');
const signUpRoutes = require('./routes/signuproutes.js');
const makeInv = require('./routes/makeInv.js');
const manageInv = require('./routes/manageInv.js');
const addingProduct  = require('./routes/addingProduct.js');
const retrieveProduct = require('./routes/retrieveProduct.js');
const productGetter = require('./routes/productRouter.js');
const verifyOtp = require('./routes/VerificationOtpRoute.js');


// Middleware ---------------------------------------------------------------------------------------------------------------
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
// app.set("views", path.join(process.cwd(), "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session);
app.set("views", path.join(__dirname, "../views"));




// Routes ----------------------------------------------

app.use('/',signUpRoutes);
app.use('/signin',signInRoutes);
app.use('/makeInv',makeInv);
app.use('/manageInv',manageInv);
app.use('/submit-batch',addingProduct);
app.use('/retrieve-product',retrieveProduct);
app.use('/product',productGetter);
app.use('/verify-otp',verifyOtp)




// ----------------------------------------------------------------------------------------------
// Home,Warehouse and Storage Route 
// ----------------------------------------------------------------------------------------------

app.get("/home", (req, res) => {
  const addedProduct = req.session.addedProduct || false;
  const warehouseMsg = req.session.warehouseMsg || false;
  req.session.warehouseMsg = null;
  req.session.addedProduct = null;
  const name = req.session.name;
  const email = req.session.email;
  const cname = req.session.companyName;
  const rack = req.session.rackId;
  const bin = req.session.BinId;
 
  res.render("home",{addedProduct,warehouseMsg,name,email,cname,rack,bin});

  console.log("warehouseMsg:", req.session.warehouseMsg, "addedProduct:", req.session.addedProduct);


});


app.get("/warehouse", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT warehouse_id, name, usable_space FROM warehouse WHERE company_name = $1",
      [req.session.companyName]
    );

    
    const warehouses = result.rows.map((row, index) => ({
      sno: index + 1,
      name: row.name,
      usable_space: row.usable_space,
      id: row.warehouse_id,
    }));
    res.render("warehousese", { warehouses });
  } catch (err) {
    console.error("Error fetching warehouses:", err);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/storage",(req,res)=>{
  res.render("underConstruction.ejs");
})


// Listen ---------------------------------------------------------------------------------------------

// app.listen(process.env.PORT ||3000, () => {
//   console.log("Server is Running at Port 3000");
// });



module.exports = app;