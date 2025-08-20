const db = require('../db.js');



function knapsack01(items, capacity) {
  const n = items.length;
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
  const weights = items.map(item => item.size * item.quant);
  const values = items.map(item => {
    if (item.priority === 'High') return 2;
    if (item.priority === 'Medium') return 1;
    return 0;
  });

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  const selected = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(items[i - 1]);
      w -= weights[i - 1];
    }
  }

  return selected;
}






const addingProduct = async (req,res)=>{
 const warehouse = req.session.warehouseName;
  const company = req.session.companyName;

  try {
    const allProducts = JSON.parse(req.body.products);
    if (!Array.isArray(allProducts) || allProducts.length === 0) {
      return res.send("No products received.");
    }

    await db.query("BEGIN");

    const binsRes = await db.query(
      `SELECT bin_id, capacity, current_load, rack_id
       FROM bins
       WHERE warehouse_id = (
         SELECT warehouse_id FROM warehouse WHERE name = $1 AND company_name = $2 LIMIT 1
       )
       ORDER BY bin_id`,
      [warehouse, company]
    );
    const bins = binsRes.rows;


    const totalCapacity = bins.reduce(
      (sum, bin) => sum + (bin.capacity - bin.current_load),
      0
    );
    const selectedProducts = knapsack01(allProducts, totalCapacity);
    const selectedNames = new Set(selectedProducts.map(p => p.name));
    const remainingProducts = allProducts.filter(p => !selectedNames.has(p.name));

  
    const insertProductIntoBin = async (product, bin, unitsToPlace, volumeToAdd) => {
      const priorityValue = (() => {
        const p = product.priority?.trim().toLowerCase();
        if (p === "high") return 2;
        if (p === "medium") return 1;
        return 0;
      })();

      await db.query(
        `INSERT INTO products (name, size, weight, quantity, priority, warehouse, company_name, bin_id, rack_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          product.name,
          product.size,
          product.weight,
          unitsToPlace,
          priorityValue,
          warehouse,
          company,
          bin.bin_id,
          bin.rack_id,
        ]
      );

      await db.query(
        "UPDATE bins SET current_load = current_load + $1 WHERE bin_id = $2",
        [volumeToAdd, bin.bin_id]
      );
    };
    for (const product of selectedProducts) {
      let remainingQty = product.quant;
      const unitVolume = product.size;

      for (const bin of bins) {
        const binStatus = await db.query(
          "SELECT capacity, current_load FROM bins WHERE bin_id = $1 FOR UPDATE",
          [bin.bin_id]
        );

        const { capacity, current_load } = binStatus.rows[0];
        const available = capacity - current_load;
        if (available >= unitVolume) {
          const unitsToPlace = Math.min(Math.floor(available / unitVolume), remainingQty);
          const volumeToAdd = unitsToPlace * unitVolume;

          await insertProductIntoBin(product, bin, unitsToPlace, volumeToAdd);

          remainingQty -= unitsToPlace;
          if (remainingQty === 0) break;
        }
      }

      if (remainingQty > 0) {
        await db.query("ROLLBACK");
        return res.send(`❌ Not enough space for product "${product.name}".`);
      }
    }

    // -----------------------------------
    // Handle Remaining Products (Fallback Strategy)
    // -----------------------------------
    for (const product of remainingProducts) {
      let remainingQty = product.quant;
      const unitVolume = product.size;

      for (let i = bins.length - 1; i >= 0 && remainingQty > 0; i--) {
        const bin = bins[i];
        const binStatus = await db.query(
          "SELECT capacity, current_load FROM bins WHERE bin_id = $1 FOR UPDATE",
          [bin.bin_id]
        );

        const { capacity, current_load } = binStatus.rows[0];
        const available = capacity - current_load;

        // ✅ Same Fix Applied Here
        if (available >= unitVolume) {
          const unitsToPlace = Math.min(Math.floor(available / unitVolume), remainingQty);
          const volumeToAdd = unitsToPlace * unitVolume;

          await insertProductIntoBin(product, bin, unitsToPlace, volumeToAdd);

          remainingQty -= unitsToPlace;
        }
      }

      if (remainingQty > 0) {
        await db.query("ROLLBACK");
        return res.send(
          `❌ Not enough space for product "${product.name}" (even across all bins).`
        );
      }
    }

    // -----------------------------------
    // Commit If All Insertions Succeed
    // -----------------------------------
    await db.query("COMMIT");
    res.redirect("/home");
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error in /submit-batch:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = addingProduct;