const db = require('../db.js');


const get = (req,res)=>{
     if (!req.session.tempUser || !req.session.tempUser.useremail) {
    return res.redirect("/"); 
  }
  let err;
  if(req.session.msg == 1){
    err = "Invalid Otp";
  }
  req.session.msg = 0;
  res.render("verify-otp.ejs", {
    error : err,
    name: req.session.tempUser.useremail 
  });
}

const post = async (req,res)=>{
 const { otp } = req.body;

  if (otp === req.session.tempUser.otp) {
    try {
      await db.query(
      "INSERT INTO users (name, email, password, company_name) VALUES ($1, $2, $3, $4)",
      [req.session.tempUser.username, req.session.tempUser.useremail, req.session.tempUser.pass, req.session.tempUser.companyName]
    );
     res.redirect("/signin");

    } catch (error) {
      console.error("Error completing registration:", error);
      res.status(500).send("Server Error");
    }
  } else {
    req.session.msg = 1;
    res.redirect("/verify-otp");
    
  }
}

module.exports = {get,post};