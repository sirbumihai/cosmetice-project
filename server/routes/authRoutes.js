import express from 'express';
import { connectToDatabase } from '../lib/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Încarcă variabilele de mediu din fișierul .env
dotenv.config();

const router = express.Router();

const tableIdMap = {
  client: 'client_id',
  categorii: 'categorie_id',
  comenzi: 'comanda_id',
  furnizori: 'furnizori_id',
  ingrediente: 'ingredient_id',
  produse: 'produs_id',
  produsecomenzi: 'comanda_id', // sau 'produs_id'
  produseingrediente: 'produs_id', // sau 'ingredient_id'
};

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM client WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO client (username, email, password) VALUES (?, ?, ?)', [username, email, hashPassword]);

    return res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM client WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong password' });
    }
    const token = jwt.sign({ id: rows[0].client_id }, process.env.JWT_SECRET, { expiresIn: '3h' });

    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }
    req.userId = decoded.id;
    next();
  });
};

router.get('/home', verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM client WHERE client_id = ?', [req.userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user: rows[0] });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.route('/dashboard/:table')
  .get(async (req, res) => {
    const { table } = req.params;
    try {
      const db = await connectToDatabase();
      const [rows] = await db.query(`SELECT * FROM ${table}`);
      return res.status(200).json(rows);
    } catch (err) {
      console.error(`Error fetching data from table: ${table}`, err);
      return res.status(500).json({ message: 'Server error' });
    }
  })
  .post(async (req, res) => {
    const { table } = req.params;
    const data = req.body;
    try {
      const db = await connectToDatabase();
      const columns = Object.keys(data).slice(1).join(', ');
      const values = Object.values(data).slice(1);
      const placeholders = values.map(() => '?').join(', ');
      const [result] = await db.query(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`, values);
      const idColumn = tableIdMap[table];
      const [newRow] = await db.query(`SELECT * FROM ${table} WHERE ${idColumn} = ?`, [result.insertId]);
      console.log(`Inserted data into table: ${table}`);
      return res.status(201).json(newRow[0]);
    } catch (err) {
      console.error(`Error inserting data into table: ${table}`, err);
      return res.status(500).json({ message: 'Server error' });
    }
  })
  .put(async (req, res) => {
    const { table } = req.params;

  // Extrage corect id-ul și restul datelor
  const { id: idObject, ...data } = req.body;
  const { id, ...restIdObject } = idObject; // Extrage id-ul și restul datelor din idObject
  const updateData = { ...restIdObject, ...data }; // Combină datele din restIdObject și data


  const idColumn = tableIdMap[table];
    if (!idColumn) {
      return res.status(400).json({ message: 'Invalid table name' });
    }

    try {
      const db = await connectToDatabase();
  
      // Construim clauza SET pentru interogarea SQL
      const setClause = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updateData);
      // Construim interogarea SQL
      const query = `UPDATE ${table} SET ${setClause} WHERE ${idColumn} = ?`;
  
      // Executăm interogarea SQL
      await db.query(query, [...values, id]);
  
      // Selectăm rândul actualizat pentru a-l returna în răspuns
      const [updatedRow] = await db.query(`SELECT * FROM ${table} WHERE ${idColumn} = ?`, [id]);
      console.log(`Updated data in table: ${table}`);
      return res.status(200).json(updatedRow[0]);
    } catch (err) {
      console.error(`Error updating data in table: ${table}`, err);
      return res.status(500).json({ message: 'Server error' });
    }
  })
  .delete(async (req, res) => {
    const { table } = req.params;
    let { id } = req.body;
    const idColumn = tableIdMap[table];
    if (!idColumn) {
      return res.status(400).json({ message: 'Invalid table name' });
    }
    //remove row- prefix
    //id = id.replace("row-", '');
    //id = Number(id);
    try {
      const db = await connectToDatabase();
      await db.query(`DELETE FROM ${table} WHERE ${idColumn} = ?`, [id]);
      console.log(`Deleted data from table: ${table}, ${idColumn} = ${id}`);
      return res.status(204).send();
    } catch (err) {
      console.error(`Error deleting data from table: ${table}`, err);
      return res.status(500).json({ message: 'Server error' });
    }
  });

export default router;