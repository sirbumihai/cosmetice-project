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
    const token = jwt.sign({ id: rows[0].client_id}, process.env.JWT_SECRET, { expiresIn: '3h' });

    console.log("Generated Token:", token); // Verificăm structura token-ului
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
  .get( async (req, res) => {
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
        SELECT produse.produs_id, produse.poza, produse.nume_produs, produse.pret, categorii.nume_categorie
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
router.get('/queries/products-categories', async (req, res) => {
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

// Interogare 2: Lista produselor și furnizorii acestora
router.get('/queries/products-suppliers', async (req, res) => {
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

// Interogare 3: Lista clienților și comenzile lor
router.get('/queries/clients-orders', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(`
      SELECT client.username, comenzi.comanda_id, comenzi.total
      FROM client
      JOIN comenzi ON client.client_id = comenzi.client_id;
    `);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Interogare 4: Produse și ingredientele lor
router.get('/queries/products-ingredients', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(`
      SELECT produse.nume_produs, ingrediente.nume_ingredient
      FROM produse
      JOIN produseingrediente ON produse.produs_id = produseingrediente.produs_id
      JOIN ingrediente ON produseingrediente.ingredient_id = ingrediente.ingredient_id;
    `);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Interogare 5: Clienții care au plasat comenzi în luna curentă
router.get('/queries/clients-current-month-orders', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(`
      SELECT client.username, comenzi.comanda_id, comenzi.data_comanda
      FROM client
      JOIN comenzi ON client.client_id = comenzi.client_id
      WHERE MONTH(comenzi.data_comanda) = MONTH(CURRENT_DATE())
      AND YEAR(comenzi.data_comanda) = YEAR(CURRENT_DATE());
    `);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Interogare 6: Produse dintr-o anumită categorie
router.get('/queries/products-by-category', async (req, res) => {
  const { category } = req.query;
  if (!category) {
    return res.status(400).json({ message: 'Missing category parameter' });
  }

  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(`
      SELECT produse.nume_produs, produse.pret
      FROM produse
      JOIN categorii ON produse.categorie_id = categorii.categorie_id
      WHERE categorii.nume_categorie = ?;
    `, [category]);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Interogare 7: Cele mai scumpe produse din fiecare categorie
router.get('/queries/most-expensive-products', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(`
      SELECT produse.nume_produs, categorii.nume_categorie, produse.pret
      FROM produse
      JOIN categorii ON produse.categorie_id = categorii.categorie_id
      WHERE produse.pret = (
        SELECT MAX(p2.pret)
        FROM produse p2
        WHERE p2.categorie_id = produse.categorie_id
      );
    `);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Interogare 8: Top 5 clienți după valoarea comenzilor totale
router.get('/queries/top-clients', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(`
      SELECT client.username, SUM(comenzi.total) AS total_comenzi
      FROM client
      JOIN comenzi ON client.client_id = comenzi.client_id
      GROUP BY client.username
      ORDER BY total_comenzi DESC
      LIMIT 5;
    `);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Interogare 9: Produse care nu au fost comandate niciodată
router.get('/queries/unsold-products', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(`
      SELECT produse.nume_produs
      FROM produse
      LEFT JOIN produsecomenzi ON produse.produs_id = produsecomenzi.produs_id
      WHERE produsecomenzi.produs_id IS NULL;
    `);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Interogare 10: Venit total pe lună
router.get('/queries/monthly-revenue', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(`
      SELECT MONTH(comenzi.data_comanda) AS luna, YEAR(comenzi.data_comanda) AS an, SUM(comenzi.total) AS venit_total
      FROM comenzi
      GROUP BY YEAR(comenzi.data_comanda), MONTH(comenzi.data_comanda)
      ORDER BY an DESC, luna DESC;
    `);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});


// Interogare 11: Comenzi plasate de clienți într-un anumit an
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

// 1. Veniturile generate de clienții fideli
router.get('/queries/loyal-customers-revenue', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(`
      SELECT cl.username, SUM(co.total) AS total_venituri
      FROM client cl
      JOIN comenzi co ON cl.client_id = co.client_id
      WHERE cl.client_id IN (
          SELECT client_id
          FROM comenzi
          GROUP BY client_id
          HAVING COUNT(comanda_id) > 1
      )
      GROUP BY cl.username
      ORDER BY total_venituri DESC;
    `);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 2. Produsele cel mai frecvent cumpărate împreună cu un anumit produs
router.get('/queries/products-bought-together', async (req, res) => {
  const { productName } = req.query;
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(`
      SELECT p.nume_produs, COUNT(pc2.produs_id) AS cumparari_impreuna
      FROM produsecomenzi pc1
      JOIN produsecomenzi pc2 ON pc1.comanda_id = pc2.comanda_id AND pc1.produs_id != pc2.produs_id
      JOIN produse p ON pc2.produs_id = p.produs_id
      WHERE pc1.produs_id = (
          SELECT produs_id
          FROM produse
          WHERE nume_produs = ?
      )
      GROUP BY p.nume_produs
      ORDER BY cumparari_impreuna DESC
      LIMIT 10;
    `, [productName]);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 3. Produse care au stoc scăzut dar sunt foarte populare
router.get('/queries/popular-low-stock', async (req, res) => {
  const { stockLimit } = req.query;
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(`
      SELECT p.nume_produs, p.stoc, COUNT(pc.produs_id) AS numar_cumparari
      FROM produse p
      JOIN produsecomenzi pc ON p.produs_id = pc.produs_id
      WHERE p.stoc < ?
      GROUP BY p.produs_id
      ORDER BY numar_cumparari DESC
      LIMIT 10;
    `, [stockLimit]);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 4. Produse dintr-o categorie cu cel mai mare discount oferit
router.get('/queries/top-discount-products', async (req, res) => {
  const { categoryName } = req.query;
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(`
      SELECT p.nume_produs, MAX(pc.discount) AS discount_maxim
      FROM produse p
      JOIN produsecomenzi pc ON p.produs_id = pc.produs_id
      JOIN categorii c ON p.categorie_id = c.categorie_id
      WHERE c.nume_categorie = ?
      GROUP BY p.nume_produs
      ORDER BY discount_maxim DESC
      LIMIT 5;
    `, [categoryName]);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 5. Cele mai populare produse bazate pe categorii selectate
router.get('/queries/top-products-by-category', async (req, res) => {
  const { categoryName } = req.query;
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(`
      SELECT p.nume_produs, COUNT(pc.comanda_id) AS numar_comenzi
      FROM produse p
      JOIN produsecomenzi pc ON p.produs_id = pc.produs_id
      WHERE pc.comanda_id IN (
          SELECT DISTINCT c.comanda_id
          FROM comenzi c
          JOIN produsecomenzi pc2 ON c.comanda_id = pc2.comanda_id
          JOIN produse p2 ON pc2.produs_id = p2.produs_id
          JOIN categorii cat ON p2.categorie_id = cat.categorie_id
          WHERE cat.nume_categorie = ?
      )
      GROUP BY p.nume_produs
      ORDER BY numar_comenzi DESC
      LIMIT 5;
    `, [categoryName]);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 6. Produse aflate în stoc limitat dar frecvent comandate
router.get('/queries/low-stock-frequent', async (req, res) => {
  const { stockLimit } = req.query;
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(`
      SELECT p.nume_produs, COUNT(pc.comanda_id) AS numar_comenzi
      FROM produse p
      JOIN produsecomenzi pc ON p.produs_id = pc.produs_id
      WHERE p.stoc < ?
      GROUP BY p.nume_produs
      HAVING numar_comenzi > (
          SELECT AVG(comenzi_count)
          FROM (
              SELECT COUNT(pc2.comanda_id) AS comenzi_count
              FROM produse p2
              JOIN produsecomenzi pc2 ON p2.produs_id = pc2.produs_id
              GROUP BY p2.produs_id
          ) AS comenzi_medii
      )
      ORDER BY numar_comenzi DESC;
    `, [stockLimit]);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 7. Categorii cu produse peste media globală a prețurilor
router.get('/queries/categories-above-average', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(`
      SELECT c.nume_categorie, MAX(p.pret) AS pret_maxim
      FROM categorii c
      JOIN produse p ON c.categorie_id = p.categorie_id
      WHERE p.pret > (
          SELECT AVG(pret)
          FROM produse
      )
      GROUP BY c.nume_categorie
      ORDER BY pret_maxim DESC;
    `);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;