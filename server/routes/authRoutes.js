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

  router.get('/queries/orders-clients', async (req, res) => {
    try {
      const db = await connectToDatabase();
      const [rows] = await db.query(`
        SELECT comenzi.comanda_id, comenzi.data_comanda, comenzi.total, client.username, client.email
        FROM comenzi
        JOIN client ON comenzi.client_id = client.client_id;
      `);
      return res.status(200).json(rows);
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.get('/queries/products-categories', async (req, res) => {
    try {
      const db = await connectToDatabase();
      const [rows] = await db.query(`
        SELECT produse.produs_id, produse.nume_produs, produse.pret, categorii.nume_categorie
        FROM produse
        JOIN categorii ON produse.categorie_id = categorii.categorie_id;
      `);
      return res.status(200).json(rows);
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.get('/queries/products-suppliers', async (req, res) => {
    try {
      const db = await connectToDatabase();
      const [rows] = await db.query(`
        SELECT produse.produs_id, produse.nume_produs, produse.pret, furnizori.nume_furnizor, furnizori.contact_email
        FROM produse
        JOIN furnizori ON produse.furnizori_id = furnizori.furnizori_id;
      `);
      return res.status(200).json(rows);
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.get('/queries/orders-products', async (req, res) => {
    try {
      const db = await connectToDatabase();
      const [rows] = await db.query(`
        SELECT comenzi.comanda_id, comenzi.data_comanda, produse.nume_produs, produsecomenzi.cantitate, produsecomenzi.pret_unitar
        FROM comenzi
        JOIN produsecomenzi ON comenzi.comanda_id = produsecomenzi.comanda_id
        JOIN produse ON produsecomenzi.produs_id = produse.produs_id;
      `);
      return res.status(200).json(rows);
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.get('/queries/products-ingredients', async (req, res) => {
    try {
      const db = await connectToDatabase();
      const [rows] = await db.query(`
        SELECT produse.produs_id, produse.nume_produs, ingrediente.nume_ingredient
        FROM produse
        JOIN produseingrediente ON produse.produs_id = produseingrediente.produs_id
        JOIN ingrediente ON produseingrediente.ingredient_id = ingrediente.ingredient_id;
      `);
      return res.status(200).json(rows);
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.get('/queries/orders-clients-products', async (req, res) => {
    try {
      const db = await connectToDatabase();
      const [rows] = await db.query(`
        SELECT comenzi.comanda_id, comenzi.data_comanda, client.username, client.email, produse.nume_produs, produsecomenzi.cantitate, produsecomenzi.pret_unitar
        FROM comenzi
        JOIN client ON comenzi.client_id = client.client_id
        JOIN produsecomenzi ON comenzi.comanda_id = produsecomenzi.comanda_id
        JOIN produse ON produsecomenzi.produs_id = produse.produs_id;
      `);
      return res.status(200).json(rows);
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  });

// Interogare 1: Lista produselor și categoriile lor
router.get('/queries/products-categories-simple', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(`
      SELECT produse.nume_produs, categorii.nume_categorie
      FROM produse
      JOIN categorii ON produse.categorie_id = categorii.categorie_id;
    `);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Interogare 2: Comenzi plasate de clienți într-un anumit an
router.get('/queries/orders-by-year', async (req, res) => {
  const { year } = req.query; // Parametru din query string
  if (!year) {
    return res.status(400).json({ message: 'Missing year parameter' });
  }

  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(`
      SELECT client.username, comenzi.comanda_id, comenzi.total, YEAR(comenzi.data_comanda) AS an
      FROM comenzi
      JOIN client ON comenzi.client_id = client.client_id
      WHERE YEAR(comenzi.data_comanda) = ?;
    `, [year]);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Interogare 3: Lista produselor și furnizorii acestora
router.get('/queries/products-suppliers-simple', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(`
      SELECT produse.nume_produs, furnizori.nume_furnizor
      FROM produse
      JOIN furnizori ON produse.furnizori_id = furnizori.furnizori_id;
    `);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});
// Interogare 1: Produsele cu cel mai mare stoc din fiecare categorie
router.get('/queries/top-stock-per-category', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(`
      SELECT p.nume_produs, c.nume_categorie, p.stoc
      FROM produse p
      JOIN categorii c ON p.categorie_id = c.categorie_id
      WHERE p.stoc = (
        SELECT MAX(stoc)
        FROM produse
        WHERE categorie_id = p.categorie_id
      );
    `);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Interogare 2: Suma totală a comenzilor pe categorii într-o anumită perioadă
router.get('/queries/total-sales-by-category', async (req, res) => {
  const { startDate, endDate } = req.query; // Parametri pentru perioada

  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Missing startDate or endDate parameter' });
  }

  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(`
      SELECT c.nume_categorie, SUM(pc.cantitate * pc.pret_unitar) AS suma_totala
      FROM produsecomenzi pc
      JOIN produse p ON pc.produs_id = p.produs_id
      JOIN categorii c ON p.categorie_id = c.categorie_id
      JOIN comenzi co ON pc.comanda_id = co.comanda_id
      WHERE co.data_comanda BETWEEN ? AND ?
      GROUP BY c.nume_categorie
      HAVING suma_totala > 10;
    `, [startDate, endDate]);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Interogare 3: Clienții cu cele mai mari comenzi plasate
router.get('/queries/top-clients', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(`
      SELECT client.username, MAX(comenzi.total) AS comanda_maxima
      FROM comenzi
      JOIN client ON comenzi.client_id = client.client_id
      GROUP BY client.username
      ORDER BY comanda_maxima DESC
      LIMIT 5;
    `);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;