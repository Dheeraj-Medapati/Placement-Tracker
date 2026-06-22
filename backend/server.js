const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const verifyToken = require("./middleware/auth");
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Database Connection Failed",
    });
  }
});

app.get("/profile", verifyToken, (req, res) => {

    res.json({
        message: "Protected Route",
        user: req.user
    });

});

app.post("/register", async (req, res) => {
    try {
        
        const { name, email, password } = req.body;


        // Check if email already exists
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        //Hashing password
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            "INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING *",
            [name, email, hashedPassword]
        );

        res.json({
            message: "User Registered",
            user: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error registering user"
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        // User not found
        if (result.rows.length === 0) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Login Successful",
            token
        });


    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

app.get("/applications", verifyToken, async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT *
             FROM applications
             WHERE user_id = $1
             ORDER BY id DESC`,
            [req.user.id]
        );

        res.json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
});

app.post("/applications", verifyToken, async (req, res) => {
    try {

        const { company_name, role } = req.body;

        const result = await pool.query(
            `INSERT INTO applications
             (user_id, company_name, role)
             VALUES($1,$2,$3)
             RETURNING *`,
            [
                req.user.id,
                company_name,
                role
            ]
        );

        res.status(201).json({
            message: "Application Added",
            application: result.rows[0]
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

app.put("/applications/:id", verifyToken, async (req, res) => {
    try {

        const { status } = req.body;
        const applicationId = req.params.id;

        const result = await pool.query(
            `UPDATE applications
             SET status = $1
             WHERE id = $2
             AND user_id = $3
             RETURNING *`,
            [
                status,
                applicationId,
                req.user.id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.json({
            message: "Application Updated",
            application: result.rows[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
});


app.delete("/applications/:id", verifyToken, async (req, res) => {
    try {

        const applicationId = req.params.id;

        const result = await pool.query(
            `DELETE FROM applications
             WHERE id = $1
             AND user_id = $2
             RETURNING *`,
            [
                applicationId,
                req.user.id
            ]
        );

        if(result.rows.length === 0){
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.json({
            message: "Application Deleted",
            application: result.rows[0]
        });

    } catch(err){

        console.error(err);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
});

app.get("/stats", verifyToken, async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT status, COUNT(*) as count
             FROM applications
             WHERE user_id = $1
             GROUP BY status`,
            [req.user.id]
        );

        let stats = {
            total: 0,
            applied: 0,
            oa: 0,
            interview: 0,
            offer: 0,
            rejected: 0
        };

        result.rows.forEach(row => {

            const status = row.status.toLowerCase();

            stats.total += parseInt(row.count);

            if (stats.hasOwnProperty(status)) {
                stats[status] = parseInt(row.count);
            }
        });

        res.json(stats);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
});


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});