const db = require('../db.js');


const retrieveProduct = async( req,res)=>{
      const productName = req.body.productName;
      const q = parseInt(req.body.quannn);
      console.log(q);
      if (isNaN(q) || q <= 0) {
        return res.status(400).send("Invalid quantity entered.");
      }
    
      try {
        const result = await db.query(
          `SELECT bin_id, rack_id, quantity FROM products
           WHERE name = $1 AND warehouse = $2 AND company_name = $3 LIMIT 1`,
          [productName, req.session.warehouseName, req.session.companyName]
        );
    
        if (result.rows.length > 0) {
          const { bin_id, rack_id, quantity } = result.rows[0];
    
          if (quantity >= q) {
            const newQuantity = quantity - q;
            if(newQuantity>0){
            await db.query(
              `UPDATE products
               SET quantity = $1
               WHERE name = $2 AND warehouse = $3 AND company_name = $4`,
              [newQuantity, productName, req.session.warehouseName, req.session.companyName]
            );
          }
          else{
             await db.query(
          `DELETE FROM products
           WHERE name = $1 AND warehouse = $2 AND company_name = $3`,
          [productName, req.session.warehouseName, req.session.companyName]
        );
          }
          const capacity = result.rows.length ? result.rows[0].capacity : null;
            res.render("managingInv", {
              rackName: rack_id,
              binName: bin_id,
              warehouseName: req.session.warehouseName,
              capacity
            
            });
          } else {
            res.send(`Not enough stock. Available: ${quantity}, Requested: ${q}`);
          }
    
        } else {
          res.send(`❌ Product "${productName}" not found.`);
        }
      } catch (err) {
        console.error("Error retrieving or updating product:", err);
        res.status(500).send("Internal Server Error");
      }
}

module.exports = retrieveProduct;