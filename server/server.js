const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

app.use(express.json());

// Montar las rutas
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/modules', require('./routes/modules'));
app.use('/api/v1/users', require('./routes/user.routes'));
app.use('/api/v1/roles', require('./routes/role.routes'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
