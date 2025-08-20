 const db = require('../db.js');

const get = (req,res)=>{
    res.render("makeInv");
}

const post = async (req,res)=>{
    const warehouseName = req.body.warehouseName;
    const WidthWarehouse = parseFloat(req.body.WidthWarehouse);
    const lengthWarehouse = parseFloat(req.body.lengthWarehouse);
    const HeightWarehouse = parseFloat(req.body.HeightWarehouse);
    const numberOfRacks = parseInt(req.body.numberOfRacks);
    const WidthOfRacks = parseFloat(req.body.WidthOfRacks);
    const LengthOfRacks = parseFloat(req.body.LengthOfRacks);
    const HeightOfRacks = parseFloat(req.body.HeightOfRacks);
    const LengthOfBins = parseFloat(req.body.LengthOfBins);
    const WidthOfBins = parseFloat(req.body.WidthOfBins);
    const HeightOfBins = parseFloat(req.body.HeightOfBins);
    
    
      try {
        // Total volume of warehouse
        const usable = lengthWarehouse * WidthWarehouse * HeightWarehouse;
    
        // Volume of one rack and one bin
        const rackVolume = LengthOfRacks * WidthOfRacks * HeightOfRacks;
        const binVolume = LengthOfBins * WidthOfBins * HeightOfBins;
        req.session.load = binVolume;
        // Check if all racks can fit inside warehouse
        const totalRackVolume = numberOfRacks * rackVolume;
        if (totalRackVolume > usable) {
          return res.status(400).send(`You can only add a maximum of ${Math.floor(usable / rackVolume)} racks based on available warehouse space.`);
        }
    
        // How many bins fit in one rack?
        const binsPerRack = Math.floor(rackVolume / binVolume);
        if (binsPerRack < 1) {
          return res.status(400).send("Bin size is too large to fit even one inside a rack.");
        }
    
        // Total number of bins
        const totalBins = numberOfRacks * binsPerRack;
    
        // STEP 1: Insert warehouse
        const warehouseRes = await db.query(
          "INSERT INTO warehouse(name, company_name, length, width, height, usable_space) VALUES ($1, $2, $3, $4, $5, $6) RETURNING warehouse_id",
          [warehouseName, req.session.companyName, lengthWarehouse, WidthWarehouse, HeightWarehouse, usable]
        );
        const warehouse_id = warehouseRes.rows[0].warehouse_id;
    
        // STEP 2: Insert racks and bins
        const rackInsertPromises = [];
        const binInsertPromises = [];
    
        for (let i = 0; i < numberOfRacks; i++) {
          const rackName = `Rack ${i + 1}`;
          const rackResult = await db.query(
            "INSERT INTO racks(warehouse_id, name, length, width, height, number_of_bins) VALUES ($1, $2, $3, $4, $5, $6) RETURNING rack_id",
            [warehouse_id, rackName, LengthOfRacks, WidthOfRacks, HeightOfRacks, binsPerRack]
          );
          const rackId = rackResult.rows[0].rack_id;
    
          for (let j = 0; j < binsPerRack; j++) {
            binInsertPromises.push(
              db.query(
                "INSERT INTO bins(warehouse_id, length, width, height, capacity, current_load, rack_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
                [warehouse_id, LengthOfBins, WidthOfBins, HeightOfBins, binVolume, 0, rackId]
              )
            );
          }
        }
    
        await Promise.all(binInsertPromises);
        req.session.warehouseMsg = `Warehouse created with ${numberOfRacks} racks and ${totalBins} bins.`;
        res.redirect("/home");
      } catch (err) {
        console.error("Error creating warehouse:", err);
        res.status(500).send("An error occurred while creating the warehouse.");
      }
}

module.exports = {get,post}