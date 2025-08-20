const db = require('../db.js');

const products = async (req,res)=>{
    try {
    const result = await db.query(
      "SELECT * FROM products WHERE warehouse = $1",
      [req.session.warehouseName]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("No products found for this warehouse.");
    }

    res.render("productList", {
      products: result.rows,
      warehouse: req.session.warehouseName
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = products;