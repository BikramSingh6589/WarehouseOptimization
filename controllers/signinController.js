const db = require('../db.js');
const bcrypt = require('bcryptjs');

const get = (req,res)=>{
  const incorrectPass = req.session.incorrectPass || false;
  const userNotFound = req.session.userNotFound || false;
  req.session.incorrectPass = null;
  req.session.userNotFound = null;
  res.render("signin", { incorrectPass,userNotFound });
}

const post = async (req,res)=>{
    const { email, password } = req.body;
    
      try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
          email,
        ]);
    
        const user = result.rows[0];
        if (!user) {
          // console.log("User not Found");
          req.session.userNotFound = true;
          return res.redirect("/signin");
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          // console.log("Wrong Password");
          req.session.incorrectPass = true;
          return res.redirect("/signin");
        }
    
        req.session.name = user.name;
        req.session.email = user.email;
        req.session.companyName = user.company_name;
    
        res.redirect("/home");
      } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      }
}

module.exports = {get,post};