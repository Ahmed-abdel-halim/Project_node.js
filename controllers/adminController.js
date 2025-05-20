    const { pool } = require('../config/dbConnection');
const { all } = require('../routes/authRouters');

    // view
    //--> sales
    const categories = async (req, res) => {
        try{
        const [result] = await pool.query(`
        SELECT * 
        FROM categories
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
    // --> check order's status
    const orders = async (req, res) =>{
        try{
        const [result] = await pool.query(`
        SELECT * 
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
    // --> check user's login time
    const carts = async  (req, res)=> {
        try{
        const [result] = await pool.query(`
        SELECT *
        FROM order_items
        GROUP BY order_id
        ORDER BY quantity ASC
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
    //--> products
    const payments = async (req,res)=> {
        try{   
            const [result] = await pool.query(`
                SELECT *
                FROM payments 
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
    // view (user)
    const allUser = async (req,res)=> {
            try{   
                const [users] = await pool.query(`
                    SELECT *
                    FROM users 
                    ORDER BY created_at DESC 
                `);
            res.status(201).json(users);
                    // console.log(users)
                    return users;
                }
                catch (err) {
                // console.error(err);
                res.status(500).json({message: err.message});
        }
    }

    // user by id
        const user = async (req,res)=> {
            try{   
                const id = req.params.id;
                const [user] = await pool.query(`
                    SELECT *
                    FROM users 
                    WHERE id = ?`, id);

                    res.status(201).json(user);
                    // console.log(users)
                    return user;
                }
                catch (err) {
                // console.error(err);
                res.status(500).json({message: err.message});
        }
    }
    // reviews
    const getReviews = async (req,res)=> {
        try{   
            const [reviews] = await pool.query(`
                select r.*,
                u.id, u.name, u.role,
                p.id, p.name
                FROM  reviews r
                join products p on p.id = r.product_id
                join users u on u.id = r.user_id
                GROUP BY rating
                order by created_at
            `);
            res.status(201).json(reviews);
                    // console.log(result)
                    return reviews;
                }
            catch (err) {
            // console.error(err);
            res.status(500).json({message: err.message});
    }
}
    //update reviews 
    // doesn't work
    const review = async (req,res)=> {
            try{   
                const id = req.params.id;
                const [review] = await pool.query(`
                update reviews SET 
                rating = "7" WHERE id = ?`, id);
                    res.status(201).json(review);
                    // console.log(users)
                    return review;
                }
                catch (err) {
                // console.error(err);
                res.status(500).json({message: err.message});
        }}

  



    module.exports = {
    categories, orders, carts, payments, allUser, getReviews, user, review
    };
