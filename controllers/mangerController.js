    const { pool } = require('../config/dbConnection');

    // sales
    const salesStatus = async (req, res) => {
        try{
        const [result] = await pool.query(`
        SELECT SUM(total_amount), COUNT(*),
        created_at,
        status
        FROM orders
        GROUP BY created_at, status
        ORDER BY created_at 
        LIMIT 10
    `);
     res.status(201).json(result);
    }
    catch (err) {
    console.error(err);
    res.status(500).json({message: err.message});
}
    // console.log(result)
    return result;
    }
    // check order's status
    const orderStatus =async (req, res) =>{
        try{
        const [result] = await pool.query(`
        SELECT 
        status, COUNT(*) 
        FROM orders
        GROUP BY status
    `);
    res.status(201).json(result);
    // console.log(result)
    return result;
        }
    catch (err) {
    // console.error(err);
    res.status(500).json({message: err.message});
    }
    }
    // check user's login time
    const userStatus = async  (req, res)=> {
        try{
        const [result] = await pool.query(`
        SELECT role, COUNT(*), created_at
        FROM users
        GROUP BY role, created_at
        ORDER BY created_at DESC
        LIMIT 10
    `);
    res.status(201).json(result);
        // console.log(result)
        return result;
            }
        catch (err) {
        // console.error(err);
        res.status(500).json({message: err.message});
    }    

    }
    // products
    const productStatus = async (req,res)=> {
        try{   
            const [result] = await pool.query(`
                SELECT products.id, products.name, 
                COUNT(order_items.id),
                SUM(order_items.quantity)
                FROM products 
                JOIN order_items  ON products.id = order_items.product_id
                GROUP BY products.id
                LIMIT 10
            `);
        res.status(201).json(result);
                // console.log(result)
                return result;
            }
            catch (err) {
            // console.error(err);
            res.status(500).json({message: err.message});
    }
}

    module.exports = {
    salesStatus, orderStatus, userStatus, productStatus
    };
