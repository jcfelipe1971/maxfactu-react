import express from 'express';
import cors from 'cors';
import firebird from 'node-firebird';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/clientes', (req, res) => {
    firebird.attach({
        host: process.env.FIREBIRD_HOST,
        port: process.env.FIREBIRD_PORT,
        database: process.env.FIREBIRD_DATABASE,
        user: process.env.FIREBIRD_USER,
        password: process.env.FIREBIRD_PASSWORD
    }, (err, db) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query('SELECT * FROM CLIENTES', (err, result) => {
            db.detach();
            if (err) return res.status(500).json({ error: err.message });
            res.json(result);
        });
    });
});

app.listen(4000, () => console.log('Backend en puerto 4000'));
