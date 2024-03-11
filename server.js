// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Usar el middleware CORS
app.use(cors());

// Configurar bodyParser para analizar solicitudes JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/usuarios', {
    useNewUrlParser: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
    console.log('Conexión exitosa a la base de datos MongoDB');
});

// Definir un esquema y un modelo para los datos
const usuarioSchema = new mongoose.Schema({
    nombre: String,
    correo: String,
    contrasena: String,
});
const Usuario = mongoose.model('Usuario', usuarioSchema);

// Ruta para manejar la solicitud de guardar un nuevo usuario desde el frontend
app.post('/usuarios', async (req, res) => {
    try {
        const { nombre, correo, contrasena } = req.body;
        const nuevoUsuario = new Usuario({ nombre, correo, contrasena });
        await nuevoUsuario.save();
        res.status(201).json({ mensaje: 'Usuario creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor al registrar usuario' });
    }
});

// Ruta para manejar las solicitudes de obtener todos los usuarios
app.get('/listar-usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find({}, 'nombre correo contrasena'); // Obtener solo nombre y correo
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor al obtener usuarios' });
    }
});

// Ruta de bienvenida para manejar las solicitudes GET a la ruta raíz
app.get('/', (req, res) => {
    res.send('¡Bienvenido al servidor de ejemplo con MongoDB y Express!');
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});