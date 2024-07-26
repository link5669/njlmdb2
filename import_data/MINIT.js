const mysql = require('mysql2/promise');
const fs = require('fs');
const csv = require('csv-parser');

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'njlm'
};

// Table name
const tableName = 'MINIT';

// Create table query
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
    MINId VARCHAR(255),
    InvM VARCHAR(255),
    RegIDM VARCHAR(255),
    Qt VARCHAR(255),
    Sessions VARCHAR(255),
    Course VARCHAR(255),
    DateM VARCHAR(255),
    Agency VARCHAR(255)
  )
`;

// Insert query
const insertQuery = `
  INSERT INTO ${tableName}
  (MINId, InvM, RegIDM, Qt, Sessions, Course, DateM, Agency)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

async function importCSV() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    await connection.query(createTableQuery);

    await new Promise((resolve, reject) => {
      fs.createReadStream('./all_tables/MINIT.txt')
        .pipe(csv({
          headers: ['MINId', 'InvM', 'RegIDM', 'Qt', 'Sessions', 'Course', 'DateM', 'Agency'],
          skipLines: 0 // Set this to 1 if your CSV has a header row
        }))
        .on('data', async (row) => {
          try {
            const values = [
              row.MINId,
              row.InvM,
              row.RegIDM,
              row.Qt,
              row.Sessions,
              row.Course,
              row.DateM,
              row.Agency
            ];
            await connection.query(insertQuery, values);
          } catch (error) {
            console.error('Error inserting row:', error);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    console.log('Data import completed successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (connection) await connection.end();
  }
}

importCSV();