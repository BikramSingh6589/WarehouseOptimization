 const db = require('../db.js');

const get = async(req,res)=>{
     const { warehouseName } = req.query;
        const binName = req.session.binnid;
        const rackName = req.session.rackkid;
        const result = await db.query("SELECT capacity FROM bins LIMIT 1");
        const capacity = result.rows.length ? result.rows[0].capacity : null;
    
        if (warehouseName) {
          req.session.warehouseName = warehouseName;
        }
    
        console.log("Selected warehouse name:", req.session.warehouseName);
        
        res.render("managingInv", {
          warehouseName: req.session.warehouseName,
          binName,
          rackName,
          capacity
        }); 
}



module.exports = {get}