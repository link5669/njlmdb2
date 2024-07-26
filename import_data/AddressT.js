const mysql = require('mysql2/promise');
const fs = require('fs');
const csv = require('csv-parser');
const moment = require('moment'); // Add moment.js to handle date formatting

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'njlm'
};

// CSV file path
const csvFilePath = './all_tables/AddressT.txt';

// Table name
const tableName = 'addresst';

// Define a mapping for the CSV columns to object properties
const csvHeaders = [
  'INV', 'InvDate', 'MunID', 'CoMun', 'FirstName', 'LastName', 'Title',
  'Address1', 'Address2', 'City', 'State', 'ZipCode', 'WorkPhone', 'Xten',
  'FaxNumber', 'EmailAddress', 'SemTitle', 'SemDate', 'InvMailed', 'PO',
  'NumOfReg', 'Cost', 'Total', 'AmtPd1', 'Chk1', 'DatePd1', 'AmtPd2', 'Chk2',
  'DatePd2', 'BalDue', 'Ovrpymt', 'RefundDue', 'Comments', 'RemoveInv', 'PersonalCheck'
];

async function importCSVToMySQL() {
  let connection;

  try {
    // Create database connection
    connection = await mysql.createConnection(dbConfig);

    // Create table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        INV INT,
        InvDate DATETIME,
        MunID VARCHAR(255),
        CoMun VARCHAR(255),
        FirstName VARCHAR(255),
        LastName VARCHAR(255),
        Title VARCHAR(255),
        Address1 VARCHAR(255),
        Address2 VARCHAR(255),
        City VARCHAR(255),
        State VARCHAR(255),
        ZipCode VARCHAR(255),
        WorkPhone VARCHAR(255),
        Xten INT,
        FaxNumber VARCHAR(255),
        EmailAddress VARCHAR(255),
        SemTitle VARCHAR(255),
        SemDate DATETIME,
        InvMailed BOOLEAN,
        PO VARCHAR(255),
        NumOfReg INT,
        Cost DECIMAL(10, 2),
        Total DECIMAL(10, 2),
        AmtPd1 DECIMAL(10, 2),
        Chk1 VARCHAR(255),
        DatePd1 DATETIME,
        AmtPd2 DECIMAL(10, 2),
        Chk2 VARCHAR(255),
        DatePd2 DATETIME,
        BalDue DECIMAL(10, 2),
        Ovrpymt DECIMAL(10, 2),
        RefundDue DECIMAL(10, 2),
        Comments TEXT,
        RemoveInv BOOLEAN,
        PersonalCheck BOOLEAN
      )
    `;

    await connection.execute(createTableQuery);
    console.log('Table created or already exists');

    // Read CSV file and insert data
    fs.createReadStream(csvFilePath)
      .pipe(csv({ headers: csvHeaders, skipLines: 1 })) // Skip the header line
      .on('data', async (row) => {

        const values = csvHeaders.map(header => {
            let value = row[header];
            if (value === undefined || value === '') {
              return null;
            }
            if (header === 'InvDate' || header === 'SemDate' || header === 'DatePd1' || header === 'DatePd2') {
              if (value) {
                value = moment(value, ['MM/DD/YYYY', 'M/DD/YYYY', 'MM/D/YYYY', 'M/D/YYYY']).format('YYYY-MM-DD HH:mm:ss');
                console.log(value)
              }
            }
            return value;
          });

          

        const insertQuery = `
          INSERT INTO ${tableName} VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?
          )
        `;

        await connection.execute(insertQuery, values);
      })
      .on('end', () => {
        console.log('CSV file successfully imported');
        connection.end();
      });

  } catch (error) {
    console.error('Error:', error);
    if (connection) {
      connection.end();
    }
  }
}

importCSVToMySQL();
