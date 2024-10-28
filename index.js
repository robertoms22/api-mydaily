const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? 'https://front-mydaily.vercel.app' // URL de tu frontend en producción
    : '*', // Permite cualquier origen en desarrollo
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
};


app.use(cors(corsOptions));
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

/**
 * Modelos de Mongoose
 */

// Esquema de usuario
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema, 'usuarios');

// Esquema y modelo de Daily
const dailySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
});
const Daily = mongoose.model('Daily', dailySchema);

// Esquema y modelo de Horas Extras
const horasExtrasSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  hours: { type: Number, required: true },
});
const HorasExtras = mongoose.model('HorasExtras', horasExtrasSchema);

// Esquema y modelo de Notas
const notasSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
});
const Notas = mongoose.model('Notas', notasSchema);

/**
 * Rutas
 */

// Ruta de login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    res.json({ message: 'Login exitoso', user: { email: user.email } });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Rutas para Daily
app.post('/daily', async (req, res) => {
  try {
    const newDaily = new Daily(req.body);
    await newDaily.save();
    res.status(201).json(newDaily);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear daily' });
  }
});

app.get('/daily', async (req, res) => {
  try {
    const dailies = await Daily.find();
    res.status(200).json(dailies);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener dailies' });
  }
});

app.put('/daily/:id', async (req, res) => {
  try {
    const updatedDaily = await Daily.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedDaily);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar daily' });
  }
});

app.delete('/daily/:id', async (req, res) => {
  try {
    await Daily.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Daily eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar daily' });
  }
});

// Rutas para Horas Extras
app.post('/horasextras', async (req, res) => {
  try {
    const newHorasExtras = new HorasExtras(req.body);
    await newHorasExtras.save();
    res.status(201).json(newHorasExtras);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear horas extras' });
  }
});

app.get('/horasextras', async (req, res) => {
  try {
    const horasExtras = await HorasExtras.find();
    res.status(200).json(horasExtras);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener horas extras' });
  }
});

app.put('/horasextras/:id', async (req, res) => {
  try {
    const updatedHorasExtras = await HorasExtras.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedHorasExtras);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar horas extras' });
  }
});

app.delete('/horasextras/:id', async (req, res) => {
  try {
    await HorasExtras.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Horas extras eliminadas' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar horas extras' });
  }
});

// Rutas para Notas
app.post('/notas', async (req, res) => {
  try {
    const newNota = new Notas(req.body);
    await newNota.save();
    res.status(201).json(newNota);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear nota' });
  }
});

app.get('/notas', async (req, res) => {
  try {
    const notas = await Notas.find();
    res.status(200).json(notas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener notas' });
  }
});

app.put('/notas/:id', async (req, res) => {
  try {
    const updatedNota = await Notas.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedNota);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar nota' });
  }
});

app.delete('/notas/:id', async (req, res) => {
  try {
    await Notas.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Nota eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar nota' });
  }
});

// Exportar la app para que funcione en Vercel
module.exports = app;
