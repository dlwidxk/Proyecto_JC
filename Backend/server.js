const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 2323;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        mensaje: 'Backend de Fórmula Exacta funcionando... Próximamente cambios... jiji'
    });
});

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});