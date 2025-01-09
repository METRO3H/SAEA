// db.js
import mysql from 'mysql2/promise'; // Importar la biblioteca mysql2 usando ES6

// Crear el pool de conexión
const pool = mysql.createPool({
  host: '172.30.46.0',
  user: 'admin',
  port: 3306,
  password: '201271', // Cambia por tu contraseña
  database: 'SAEA',     // Cambia por tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función base para manejar consultas
export async function Execute_Query(query, params = []) {
  let connection;

  try {
    connection = await pool.getConnection();
    const [results] = await connection.query(query, params);
    return results;
  } catch (error) {
    console.error('Error durante la consulta:', error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

// Función para obtener datos
export async function Fetch_Data(query, params = []) {
  return Execute_Query(query, params);
}

// Función para insertar o actualizar datos
export async function Modify_Data(query, params = []) {
  const results = await Execute_Query(query, params);
  return {
    affected_rows: results.affectedRows,
    insert_id: results.insertId
  };
}

// Función para borrar datos
export async function Delete_Data(query, params = []) {
  const results = await Execute_Query(query, params);
  return {
    affected_rows: results.affectedRows
  };
}

// Cerrar el pool
export async function Close_Pool() {
  await pool.end();
}
