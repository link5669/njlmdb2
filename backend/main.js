const mysql = require('mysql2/promise');
const express = require('express');
const app = express();

// config for your database
const config = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'njlm'
};

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.get('/RegT', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config);
        const [rows, fields] = await connection.execute(`SELECT * from RegT;`);
        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
})

app.get('/balDue', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config);
        const [rows, fields] = await connection.execute(`SELECT AddressT.InvMailed, AddressT.INV, AddressT.InvDate, AddressT.MunID, AddressT.CoMun, AddressT.FirstName, AddressT.LastName, AddressT.Title, AddressT.Address1, AddressT.Address2, AddressT.City, AddressT.State, AddressT.ZipCode, AddressT.WorkPhone, AddressT.Xten, AddressT.FaxNumber, AddressT.EmailAddress, AddressT.SemTitle, AddressT.SemDate, MunT.Municipality, MunT.County, MunT.POBox, MunT.MunAddr1, MunT.MunAddr2, MunT.MunCity, MunT.MunState, MunT.MunZip, CoMun & "" & Municipality & " " & County AS CompanyAll, MunT.POBox AS POBAll, Address1 & "" & MunAddr1 & "" & POBox AS Addr1All, Address2 & "" & MunAddr2 AS Addr2All, City & "" & MunCity & " " & State & "" & MunState & " " & ZipCode & "" & MunZip AS CityStateAll, AddressT.PO, AddressT.NumOfReg, AddressT.Cost, NumOfReg*Cost AS Total, AddressT.AmtPd1, AddressT.Chk1, AddressT.DatePd1, AddressT.AmtPd2, AddressT.Chk2, AddressT.DatePd2, Total-AmtPd1-AmtPd2+RefundDue AS BalDue, AddressT.RemoveInv, If(AmtPd1+AmtPd2>Total,Total-AmtPd1+AmtPd2,0) AS Ovrpymt, AddressT.RefundDue, AddressT.Comments
FROM MunT RIGHT JOIN AddressT ON MunT.MunID = AddressT.MunID
WHERE (((AddressT.RemoveInv)=0)) LIMIT 50 OFFSET 0;;
  `);

        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/balDue2New', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config);
        const [rows, fields] = await connection.execute(`SELECT MainQ.InvMailed, MainQ.INV, MainQ.InvDate, MainQ.MunID, MainQ.CoMun, MainQ.FirstName, MainQ.LastName, MainQ.Title, MainQ.Address1, MainQ.Address2, MainQ.City, MainQ.State, MainQ.ZipCode, MainQ.WorkPhone, MainQ.Xten, MainQ.FaxNumber, MainQ.EmailAddress, MainQ.SemTitle, MainQ.SemDate, MainQ.Municipality, MainQ.County, MainQ.POBox, MainQ.MunAddr1, MainQ.MunAddr2, MainQ.MunCity, MainQ.MunState, MainQ.MunZip, MainQ.CompanyAll, MainQ.POBAll, MainQ.Addr1All, MainQ.Addr2All, MainQ.CityStateAll, MainQ.PO, MainQ.NumOfReg, MainQ.Cost, MainQ.Total, MainQ.AmtPd1, MainQ.Chk1, MainQ.DatePd1, MainQ.AmtPd2, MainQ.Chk2, MainQ.DatePd2, MainQ.BalDue, MainQ.Ovrpymt, MainQ.RefundDue, MainQ.Comments
FROM (SELECT 
    AddressT.InvMailed, 
    AddressT.INV, 
    AddressT.InvDate, 
    AddressT.MunID, 
    AddressT.CoMun, 
    AddressT.FirstName, 
    AddressT.LastName, 
    AddressT.Title, 
    AddressT.Address1, 
    AddressT.Address2, 
    AddressT.City, 
    AddressT.State, 
    AddressT.ZipCode, 
    AddressT.WorkPhone, 
    AddressT.Xten, 
    AddressT.FaxNumber, 
    AddressT.EmailAddress, 
    AddressT.SemTitle, 
    AddressT.SemDate, 
    MunT.Municipality, 
    MunT.County, 
    MunT.POBox, 
    MunT.MunAddr1, 
    MunT.MunAddr2, 
    MunT.MunCity, 
    MunT.MunState, 
    MunT.MunZip, 
    CONCAT(AddressT.CoMun, '', MunT.Municipality, ' ', MunT.County) AS CompanyAll, 
    MunT.POBox AS POBAll, 
    CONCAT(AddressT.Address1, '', MunT.MunAddr1, '', MunT.POBox) AS Addr1All, 
    CONCAT(AddressT.Address2, '', MunT.MunAddr2) AS Addr2All, 
    CONCAT(AddressT.City, '', MunT.MunCity, ' ', AddressT.State, '', MunT.MunState, ' ', AddressT.ZipCode, '', MunT.MunZip) AS CityStateAll, 
    AddressT.PO, 
    AddressT.NumOfReg, 
    AddressT.Cost, 
    AddressT.NumOfReg * AddressT.Cost AS Total, 
    AddressT.AmtPd1, 
    AddressT.Chk1, 
    AddressT.DatePd1, 
    AddressT.AmtPd2, 
    AddressT.Chk2, 
    AddressT.DatePd2, 
    (AddressT.NumOfReg * AddressT.Cost) - AddressT.AmtPd1 - AddressT.AmtPd2 + AddressT.RefundDue AS BalDue, 
    AddressT.Ovrpymt, 
    AddressT.RefundDue, 
    AddressT.Comments
FROM 
    MunT 
RIGHT JOIN 
    AddressT ON MunT.MunID = AddressT.MunID) AS MainQ
WHERE (((MainQ.BalDue)>=1)) LIMIT 50 OFFSET 0;;
  `);

        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/cancelQForForm', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config);
        const [rows, fields] = await connection.execute(`SELECT RegT.RegID, RegT.FirstN, RegT.LastN, RegT.Title, RegT.Cancelled, RegT.CancellationComments, RegT.INV
FROM RegT LIMIT 50 OFFSET 0;;
  `);

        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/invMailedNo', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config);
        const [rows, fields] = await connection.execute(`SELECT AddressT.InvMailed, AddressT.PersonalCheck, AddressT.INV, AddressT.InvDate, AddressT.MunID, AddressT.CoMun, AddressT.FirstName, AddressT.LastName, AddressT.Title, AddressT.Address1, AddressT.Address2, AddressT.City, AddressT.State, AddressT.ZipCode, AddressT.WorkPhone, AddressT.Xten, AddressT.FaxNumber, AddressT.EmailAddress, AddressT.SemTitle, AddressT.SemDate, MunT.Municipality, MunT.County, MunT.POBox, MunT.MunAddr1, MunT.MunAddr2, MunT.MunCity, MunT.MunState, MunT.MunZip, CoMun & "" & Municipality & " " & County AS CompanyAll, MunT.POBox AS POBAll, Address1 & "" & MunAddr1 AS Addr1All, Address2 & "" & MunAddr2 AS Addr2All, City & "" & MunCity & " " & State & "" & MunState & " " & ZipCode & "" & MunZip AS CityStateAll, AddressT.PO, AddressT.NumofReg, AddressT.Cost, NumofReg*Cost AS Total, AddressT.AmtPd1, AddressT.Chk1, AddressT.DatePd1, AddressT.AmtPd2, AddressT.Chk2, AddressT.DatePd2, Total-AmtPd1-AmtPd2+RefundDue AS BalDue, If(AmtPd1+AmtPd2>Total,Total-AmtPd1+AmtPd2,0) AS Ovrpymt, AddressT.RefundDue, AddressT.Comments, AddressT.state, AddressT.city, AddressT.zipcode
FROM MunT RIGHT JOIN AddressT ON MunT.MunID = AddressT.MunID
WHERE (((AddressT.InvMailed)=0)) LIMIT 50 OFFSET 0;;
  `);

        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/invMailedYes', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config);
        const [rows, fields] = await connection.execute(`SELECT AddressT.InvMailed, AddressT.PersonalCheck, AddressT.INV, AddressT.InvDate, AddressT.MunID, AddressT.CoMun, AddressT.FirstName, AddressT.LastName, AddressT.Title, AddressT.Address1, AddressT.Address2, AddressT.City, AddressT.State, AddressT.ZipCode, AddressT.WorkPhone, AddressT.Xten, AddressT.FaxNumber, AddressT.EmailAddress, AddressT.SemTitle, AddressT.SemDate, MunT.Municipality, MunT.County, MunT.POBox, MunT.MunAddr1, MunT.MunAddr2, MunT.MunCity, MunT.MunState, MunT.MunZip, CoMun & "" & Municipality & " " & County AS CompanyAll, MunT.POBox AS POBAll, Address1 & "" & MunAddr1 AS Addr1All, Address2 & "" & MunAddr2 AS Addr2All, City & "" & MunCity & " " & State & "" & MunState & " " & ZipCode & "" & MunZip AS CityStateAll, AddressT.PO, AddressT.NumofReg, AddressT.Cost, NumofReg*Cost AS Total, AddressT.AmtPd1, AddressT.Chk1, AddressT.DatePd1, AddressT.AmtPd2, AddressT.Chk2, AddressT.DatePd2, Total-AmtPd1-AmtPd2+RefundDue AS BalDue, If(AmtPd1+AmtPd2>Total,Total-AmtPd1+AmtPd2,0) AS Ovrpymt, AddressT.RefundDue, AddressT.Comments, AddressT.state, AddressT.city, AddressT.zipcode
FROM MunT RIGHT JOIN AddressT ON MunT.MunID = AddressT.MunID
WHERE (((AddressT.InvMailed)=1)) LIMIT 50 OFFSET 0;;
  `);

        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/invPrintByInvQ', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config);
        const [rows, fields] = await connection.execute(`SELECT AddressT.INV, AddressT.InvMailed, AddressT.InvDate, AddressT.MunID, AddressT.CoMun, AddressT.FirstName, AddressT.LastName, AddressT.Title, AddressT.PersonalCheck, AddressT.Address1, AddressT.Address2, AddressT.City, AddressT.State, AddressT.ZipCode, AddressT.WorkPhone, AddressT.Xten, AddressT.FaxNumber, AddressT.EmailAddress, AddressT.SemTitle, AddressT.SemDate, MunT.Municipality, MunT.County, MunT.POBox, MunT.MunAddr1, MunT.MunAddr2, MunT.MunCity, MunT.MunState, MunT.MunZip, CoMun & "" & Municipality & " " & County AS CompanyAll, MunT.POBox AS POBAll, Address1 & "" & MunAddr1 AS Addr1All, Address2 & "" & MunAddr2 AS Addr2All, City & "" & MunCity & " " & State & "" & MunState & " " & ZipCode & "" & MunZip AS CityStateAll, AddressT.PO, AddressT.NumOfReg, AddressT.Cost, NumOfReg*Cost AS Total, AddressT.AmtPd1, AddressT.Chk1, AddressT.DatePd1, AddressT.AmtPd2, AddressT.Chk2, AddressT.DatePd2, Total-AmtPd1-AmtPd2+RefundDue AS BalDue, AmtPd1+AmtPd2-RefundDue AS Ovrpymt, AddressT.RefundDue, AddressT.Comments
FROM MunT RIGHT JOIN AddressT ON MunT.MunID = AddressT.MunID
WHERE (((AddressT.INV)=${req.query.invNum})) LIMIT 50 OFFSET 0;;
  `);
        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/mainQ', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config);
        const [rows, fields] = await connection.execute(`SELECT 
    AddressT.InvMailed, 
    AddressT.INV, 
    AddressT.InvDate, 
    AddressT.MunID, 
    AddressT.CoMun, 
    AddressT.FirstName, 
    AddressT.LastName, 
    AddressT.Title, 
    AddressT.Address1, 
    AddressT.Address2, 
    AddressT.City, 
    AddressT.State, 
    AddressT.ZipCode, 
    AddressT.WorkPhone, 
    AddressT.Xten, 
    AddressT.FaxNumber, 
    AddressT.EmailAddress, 
    AddressT.SemTitle, 
    AddressT.SemDate, 
    MunT.Municipality, 
    MunT.County, 
    MunT.POBox, 
    MunT.MunAddr1, 
    MunT.MunAddr2, 
    MunT.MunCity, 
    MunT.MunState, 
    MunT.MunZip, 
    CONCAT(AddressT.CoMun, '', MunT.Municipality, ' ', MunT.County) AS CompanyAll, 
    MunT.POBox AS POBAll, 
    CONCAT(AddressT.Address1, '', MunT.MunAddr1, '', MunT.POBox) AS Addr1All, 
    CONCAT(AddressT.Address2, '', MunT.MunAddr2) AS Addr2All, 
    CONCAT(AddressT.City, '', MunT.MunCity, ' ', AddressT.State, '', MunT.MunState, ' ', AddressT.ZipCode, '', MunT.MunZip) AS \`City/StateAll\`, 
    AddressT.PO, 
    AddressT.NumOfReg, 
    AddressT.Cost, 
    AddressT.NumOfReg * AddressT.Cost AS Total, 
    AddressT.AmtPd1, 
    AddressT.Chk1, 
    AddressT.DatePd1, 
    AddressT.AmtPd2, 
    AddressT.Chk2, 
    AddressT.DatePd2, 
    (AddressT.NumOfReg * AddressT.Cost) - AddressT.AmtPd1 - AddressT.AmtPd2 + AddressT.RefundDue AS \`Bal Due\`, 
    AddressT.Ovrpymt, 
    AddressT.RefundDue, 
    AddressT.Comments
FROM 
    MunT 
RIGHT JOIN 
    AddressT ON MunT.MunID = AddressT.MunID
    LIMIT 50 OFFSET 0;
`);

        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});


app.get('/listForSueQ', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config);
        const [rows, fields] = await connection.execute(`SELECT LIST_FOR_SUE.ID, LIST_FOR_SUE.FirstName, LIST_FOR_SUE.LastName, LIST_FOR_SUE.Title, LIST_FOR_SUE.Municipality, LIST_FOR_SUE.County, LIST_FOR_SUE.Address, LIST_FOR_SUE.CityStateZip, LIST_FOR_SUE.labels
FROM LIST_FOR_SUE LIMIT 50 OFFSET 0;
  `);

        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/labelsForSue', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config);
        const [rows, fields] = await connection.execute(`SELECT LIST_FOR_SUE.ID, LIST_FOR_SUE.FirstName, LIST_FOR_SUE.LastName, LIST_FOR_SUE.Title, LIST_FOR_SUE.Municipality, LIST_FOR_SUE.County, LIST_FOR_SUE.Address, LIST_FOR_SUE.CityStateZip, LIST_FOR_SUE.labels
FROM LIST_FOR_SUE
WHERE (((LIST_FOR_SUE.labels)="x")) LIMIT 50 OFFSET 0;
  `);

        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/enterOrders', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config);
        console.log(req.query.inv)
        const [rows, fields] = await connection.execute(`SELECT * FROM RegT WHERE INV = ${req.query.inv}`);
        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/seminarCount', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config);
        console.log(req.query.inv)
        const [rows, fields] = await connection.execute(`SELECT 
    AddressT.SemTitle,
    AddressT.SemDate,
    COUNT(*) AS SeminarCount
FROM 
    AddressT
LEFT JOIN 
    MunT ON MunT.MunID = AddressT.MunID
WHERE 
    AddressT.SemDate >= '2024-01-01'
GROUP BY 
    AddressT.SemTitle, AddressT.SemDate
ORDER BY 
    AddressT.SemDate, AddressT.SemTitle;`);
        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/getSeminarPersonInfo', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config);
        console.log(req.query.inv)
        const [rows, fields] = await connection.execute(`SELECT * FROM addressT WHERE INV = ${req.query.inv}`);
        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/getRegistrations', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config);
        console.log(req.query.inv)
        const [rows, fields] = await connection.execute(`SELECT * FROM regt WHERE INV = "${req.query.inv}"`);
        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/getMunicipalityInfo', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config);
        console.log(req.query.inv)
        const [rows, fields] = await connection.execute(`SELECT * FROM munt WHERE MUNID = "${req.query.munid}"`);
        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/miniRegYes', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config);
        const [rows, fields] = await connection.execute(`SELECT RegT.INV, RegT.RegID, RegT.FirstN, RegT.LastN, RegT.Title, RegT.BarID, RegT.Mini, RegT.Cancelled, RegT.CancellationComments, MINIT.Qty, MINIT.Sessions, MINIT.Course, MINIT.RegIDM, MINIT.DateM, MINIT.Agency
FROM RegT LEFT JOIN MINIT ON RegT.RegID = MINIT.RegIDM
WHERE (((RegT.Mini)=1)) LIMIT 50 OFFSET 0;
  `);

        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/miniReport', async (req, res) => {
    try {
        console.log(req.query.date)
        const connection = await mysql.createConnection(config);
        const [rows, fields] = await connection.execute(`SELECT RegT.INV, MainQ.CompanyAll, MainQ.CoMun, RegT.RegID, RegT.FirstN, RegT.LastN, RegT.Title, RegT.BarID, RegT.Mini, RegT.Cancelled, RegT.CancellationComments, MINIT.Qty, MINIT.Sessions, MINIT.Course, MINIT.RegIDM, MINIT.DateM 
FROM (
    SELECT AddressT.InvMailed, AddressT.INV, AddressT.InvDate, AddressT.MunID, AddressT.CoMun, AddressT.FirstName, AddressT.LastName, AddressT.Title, AddressT.Address1, AddressT.Address2, AddressT.City, AddressT.State, AddressT.ZipCode, AddressT.WorkPhone, AddressT.Xten, AddressT.FaxNumber, AddressT.EmailAddress, AddressT.SemTitle, AddressT.SemDate, MunT.Municipality, MunT.County, MunT.POBox, MunT.MunAddr1, MunT.MunAddr2, MunT.MunCity, MunT.MunState, MunT.MunZip, 
           CONCAT(AddressT.CoMun, '', MunT.Municipality, ' ', MunT.County) AS CompanyAll, 
           MunT.POBox AS POBAll, 
           CONCAT(AddressT.Address1, '', MunT.MunAddr1, '', MunT.POBox) AS Addr1All, 
           CONCAT(AddressT.Address2, '', MunT.MunAddr2) AS Addr2All, 
           CONCAT(AddressT.City, '', MunT.MunCity, ' ', AddressT.State, '', MunT.MunState, ' ', AddressT.ZipCode, '', MunT.MunZip) AS \`City / StateAll\`, 
           AddressT.PO, AddressT.NumOfReg, AddressT.Cost, AddressT.NumOfReg * AddressT.Cost AS Total, 
           AddressT.AmtPd1, AddressT.Chk1, AddressT.DatePd1, AddressT.AmtPd2, AddressT.Chk2, AddressT.DatePd2, 
           (AddressT.NumOfReg * AddressT.Cost) - AddressT.AmtPd1 - AddressT.AmtPd2 + AddressT.RefundDue AS \`Bal Due\`, 
           AddressT.Ovrpymt, AddressT.RefundDue, AddressT.Comments 
    FROM MunT RIGHT JOIN AddressT ON MunT.MunID = AddressT.MunID
) AS MainQ 
INNER JOIN RegT ON MainQ.INV = RegT.INV
LEFT JOIN MINIT ON RegT.RegID = MINIT.RegIDM 
WHERE RegT.Mini = 1 AND MINIT.DateM = "${req.query.date} 0:00:00" LIMIT 50 OFFSET 0;
  `);
        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/PAQ', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config);
        const [rows, fields] = await connection.execute(`SELECT RegT.BarID, RegT.INV, RegT.RegID, RegT.FirstN, RegT.LastN, RegT.Title, RegT.Mini, RegT.Cancelled, RegT.CancellationComments, MINIT.Qty, MINIT.Sessions, MINIT.Course, MINIT.RegIDM, MINIT.DateM, MINIT.Agency
FROM RegT LEFT JOIN MINIT ON RegT.RegID = MINIT.RegIDM
WHERE (((RegT.BarID)>="1")) LIMIT 50 OFFSET 0;
  `);

        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/pymtInfoAll', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config);
        const [rows, fields] = await connection.execute(`SELECT 
    AddressT.InvMailed, 
    AddressT.INV, 
    AddressT.InvDate, 
    AddressT.MunID, 
    AddressT.CoMun, 
    AddressT.FirstName, 
    AddressT.LastName, 
    AddressT.Title, 
    AddressT.Address1, 
    AddressT.Address2, 
    AddressT.City, 
    AddressT.State, 
    AddressT.ZipCode, 
    AddressT.WorkPhone, 
    AddressT.Xten, 
    AddressT.FaxNumber, 
    AddressT.EmailAddress, 
    AddressT.SemTitle, 
    AddressT.SemDate, 
    MunT.Municipality, 
    MunT.County, 
    MunT.POBox, 
    MunT.MunAddr1, 
    MunT.MunAddr2, 
    MunT.MunCity, 
    MunT.MunState, 
    MunT.MunZip, 
    CONCAT(AddressT.CoMun, '', MunT.Municipality, ' ', MunT.County) AS CompanyAll, 
    MunT.POBox AS POBAll, 
    CONCAT(AddressT.Address1, '', MunT.MunAddr1) AS Addr1All, 
    CONCAT(AddressT.Address2, '', MunT.MunAddr2) AS Addr2All, 
    CONCAT(AddressT.City, '', MunT.MunCity, ' ', AddressT.State, '', MunT.MunState, ' ', AddressT.ZipCode, '', MunT.MunZip) AS CityStateAll, 
    AddressT.PO, 
    AddressT.NumofReg, 
    AddressT.Cost, 
    AddressT.NumOfReg * AddressT.Cost AS Total, 
    AddressT.AmtPd1, 
    AddressT.Chk1, 
    AddressT.DatePd1, 
    AddressT.AmtPd2, 
    AddressT.Chk2, 
    AddressT.DatePd2, 
    (AddressT.NumOfReg * AddressT.Cost) - AddressT.AmtPd1 - AddressT.AmtPd2 + AddressT.RefundDue AS \`Bal Due\`, 
    AddressT.AmtPd1 + AddressT.AmtPd2 - AddressT.RefundDue AS Ovrpymt, 
    AddressT.RefundDue, 
    AddressT.Comments
FROM 
    AddressT 
    LEFT JOIN MunT ON AddressT.MunID = MunT.MunID
WHERE 
    AddressT.DatePd1 >= '2022-07-01' AND AddressT.DatePd1 <= '2023-06-30' LIMIT 50 OFFSET 0;
  `);

        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/pymtInfoCurrent', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config);
        const [rows, fields] = await connection.execute(`SELECT 
    AddressT.InvMailed, 
    AddressT.INV, 
    AddressT.InvDate, 
    AddressT.MunID, 
    AddressT.CoMun, 
    AddressT.FirstName, 
    AddressT.LastName, 
    AddressT.Title, 
    AddressT.Address1, 
    AddressT.Address2, 
    AddressT.City, 
    AddressT.State, 
    AddressT.ZipCode, 
    AddressT.WorkPhone, 
    AddressT.Xten, 
    AddressT.FaxNumber, 
    AddressT.EmailAddress, 
    AddressT.SemTitle, 
    AddressT.SemDate, 
    MunT.Municipality, 
    MunT.County, 
    MunT.POBox, 
    MunT.MunAddr1, 
    MunT.MunAddr2, 
    MunT.MunCity, 
    MunT.MunState, 
    MunT.MunZip, 
    CONCAT(AddressT.CoMun, '', MunT.Municipality, ' ', MunT.County) AS CompanyAll, 
    MunT.POBox AS POBAll, 
    CONCAT(AddressT.Address1, '', MunT.MunAddr1) AS Addr1All, 
    CONCAT(AddressT.Address2, '', MunT.MunAddr2) AS Addr2All, 
    CONCAT(AddressT.City, '', MunT.MunCity, ' ', AddressT.State, '', MunT.MunState, ' ', AddressT.ZipCode, '', MunT.MunZip) AS \`City / StateAll\`, 
    AddressT.PO, 
    AddressT.NumOfReg, 
    AddressT.Cost, 
    AddressT.NumOfReg * AddressT.Cost AS Total, 
    AddressT.AmtPd1, 
    AddressT.Chk1, 
    AddressT.DatePd1, 
    AddressT.AmtPd2, 
    AddressT.Chk2, 
    AddressT.DatePd2, 
    (AddressT.NumOfReg * AddressT.Cost) - AddressT.AmtPd1 - AddressT.AmtPd2 + AddressT.RefundDue AS \`Bal Due\`, 
    IF(AddressT.AmtPd1 + AddressT.AmtPd2 > (AddressT.NumOfReg * AddressT.Cost), 
       (AddressT.NumOfReg * AddressT.Cost) - AddressT.AmtPd1 + AddressT.AmtPd2, 
       NULL) AS Ovrpymt, 
    AddressT.RefundDue, 
    AddressT.Comments
FROM 
    AddressT 
    LEFT JOIN MunT ON AddressT.MunID = MunT.MunID LIMIT 50 OFFSET 0;
  `);

        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/paymentRecieveReport', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config);
        const [rows, fields] = await connection.execute(`SELECT 
    PymtInfoAll.INV,
    PymtInfoAll.CompanyAll,
    PymtInfoAll.PO,
    PymtInfoAll.NumOfReg,
    PymtInfoAll.Cost,
    PymtInfoAll.Total,
    PymtInfoAll.DatePd1,
    PymtInfoAll.Chk1,
    PymtInfoAll.AmtPd1,
    PymtInfoAll.Chk2,
    PymtInfoAll.AmtPd2,
    PymtInfoAll.BalDue,
    PymtInfoAll.RefundDue
FROM
    (SELECT 
        AddressT.InvMailed,
            AddressT.INV,
            AddressT.InvDate,
            AddressT.MunID,
            AddressT.CoMun,
            AddressT.FirstName,
            AddressT.LastName,
            AddressT.Title,
            AddressT.Address1,
            AddressT.Address2,
            AddressT.City,
            AddressT.State,
            AddressT.ZipCode,
            AddressT.WorkPhone,
            AddressT.Xten,
            AddressT.FaxNumber,
            AddressT.EmailAddress,
            AddressT.SemTitle,
            AddressT.SemDate,
            MunT.Municipality,
            MunT.County,
            MunT.POBox,
            MunT.MunAddr1,
            MunT.MunAddr2,
            MunT.MunCity,
            MunT.MunState,
            MunT.MunZip,
            CONCAT(AddressT.CoMun, '', MunT.Municipality, ' ', MunT.County) AS CompanyAll,
            MunT.POBox AS POBAll,
            CONCAT(AddressT.Address1, '', MunT.MunAddr1) AS Addr1All,
            CONCAT(AddressT.Address2, '', MunT.MunAddr2) AS Addr2All,
            CONCAT(AddressT.City, '', MunT.MunCity, ' ', AddressT.State, '', MunT.MunState, ' ', AddressT.ZipCode, '', MunT.MunZip) AS CityStateAll,
            AddressT.PO,
            AddressT.NumofReg,
            AddressT.Cost,
            AddressT.NumOfReg * AddressT.Cost AS Total,
            AddressT.AmtPd1,
            AddressT.Chk1,
            AddressT.DatePd1,
            AddressT.AmtPd2,
            AddressT.Chk2,
            AddressT.DatePd2,
            (AddressT.NumOfReg * AddressT.Cost) - AddressT.AmtPd1 - AddressT.AmtPd2 + AddressT.RefundDue AS BalDue,
            AddressT.AmtPd1 + AddressT.AmtPd2 - AddressT.RefundDue AS Ovrpymt,
            AddressT.RefundDue,
            AddressT.Comments
    FROM
        AddressT
    LEFT JOIN MunT ON AddressT.MunID = MunT.MunID
    WHERE
        AddressT.DatePd1 >= '2022-07-01'
            AND AddressT.DatePd1 <= '2023-06-30') AS PymtInfoAll
WHERE
    PymtInfoAll.Chk1 > '1' LIMIT 50 OFFSET 0;
  `);

        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/paymentPACLESentNo', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config);
        const [rows, fields] = await connection.execute(`SELECT 
    PAQ.Agency, 
    PAQ.BarID, 
    AddressT.INV, 
    AddressT.MunID, 
    AddressT.CoMun, 
    AddressT.FirstName, 
    AddressT.LastName, 
    AddressT.Title, 
    AddressT.SemTitle, 
    AddressT.SemDate, 
    CoMun & "" & Municipality & " " & County AS CompanyAll, 
    AddressT.Cost, 
    AddressT.AmtPd1, 
    PAQ.RegID, 
    PAQ.FirstN, 
    PAQ.LastN, 
    PAQ.Title
FROM 
    (AddressT 
    LEFT JOIN MunT ON AddressT.MunID = MunT.MunID) 
    INNER JOIN 
    (SELECT 
        RegT.BarID, 
        RegT.INV, 
        RegT.RegID, 
        RegT.FirstN, 
        RegT.LastN, 
        RegT.Title, 
        RegT.Mini, 
        RegT.Cancelled, 
        RegT.CancellationComments, 
        MINIT.Qty, 
        MINIT.Sessions, 
        MINIT.Course, 
        MINIT.RegIDM, 
        MINIT.DateM, 
        MINIT.Agency
    FROM 
        RegT 
        LEFT JOIN MINIT ON RegT.RegID = MINIT.RegIDM
    WHERE 
        RegT.BarID >= '1') AS PAQ 
    ON AddressT.INV = PAQ.INV LIMIT 50 OFFSET 0;
  `);

        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/reconciliation', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config);
        const [rows, fields] = await connection.execute(`SELECT 
    AddressT.InvMailed,
    AddressT.INV,
    AddressT.InvDate,
    AddressT.MunID,
    AddressT.CoMun,
    AddressT.FirstName,
    AddressT.LastName,
    AddressT.Title,
    AddressT.Address1,
    AddressT.Address2,
    AddressT.City,
    AddressT.State,
    AddressT.ZipCode,
    AddressT.WorkPhone,
    AddressT.Xten,
    AddressT.FaxNumber,
    AddressT.EmailAddress,
    AddressT.SemTitle,
    AddressT.SemDate,
    MunT.Municipality,
    MunT.County,
    MunT.POBox,
    MunT.MunAddr1,
    MunT.MunAddr2,
    MunT.MunCity,
    MunT.MunState,
    MunT.MunZip,
    CoMun & '' & Municipality & ' ' & County AS CompanyAll,
    MunT.POBox AS POBAll,
    Address1 & '' & MunAddr1 & '' & POBox AS Addr1All,
    Address2 & '' & MunAddr2 AS Addr2All,
    City & '' & MunCity & ' ' & State & '' & MunState & ' ' & ZipCode & '' & MunZip AS CityStateAll,
    AddressT.PO,
    AddressT.NumofReg,
    AddressT.Cost,
    NumOfReg * Cost AS Total,
    AddressT.AmtPd1,
    AddressT.Chk1,
    AddressT.DatePd1,
    AddressT.AmtPd2,
    AddressT.Chk2,
    AddressT.DatePd2,
    Total - AmtPd1 - AmtPd2 + RefundDue AS BalDue,
    AddressT.Ovrpymt,
    AddressT.RefundDue,
    AddressT.Comments
FROM
    MunT
        RIGHT JOIN
    AddressT ON MunT.MunID = AddressT.MunID
WHERE
    (((AddressT.DatePd1) >= '2020-01-07 00:00:00'
        AND (AddressT.DatePd1) <= '2020-09-30 00:00:00')) LIMIT 50 OFFSET 0;
  `);

        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/regQAll', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config);
        const [rows, fields] = await connection.execute(`SELECT RegT.INV, RegT.RegID, RegT.FirstN, RegT.LastN, RegT.Title, RegT.BarID, RegT.Mini, RegT.Cancelled, RegT.CancellationComments, RegT.MGT, MINIT.Qty, MINIT.Sessions, MINIT.Course, MINIT.RegIDM, MINIT.DateM
FROM RegT LEFT JOIN MINIT ON RegT.RegID = MINIT.RegIDM LIMIT 50 OFFSET 0;
  `);

        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/signInSheet', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config);
        const [rows, fields] = await connection.execute(`
            SELECT 
    MainQ.SemTitle, 
    RegT.INV, 
    MainQ.SemDate, 
    MainQ.CompanyAll, 
    RegT.RegID, 
    RegT.FirstN, 
    RegT.LastN, 
    RegT.Title, 
    RegT.Email, 
    MainQ.Cost, 
    MainQ.PO AS \`PO#\`, 
    MainQ.Chk1, 
    MainQ.Chk2, 
    RegT.Cancelled, 
    RegT.CancellationComments AS \`Cancellation Comments\`, 
    AddressT.EmailAddress
FROM 
    (SELECT 
        AddressT.INV, 
        AddressT.SemTitle, 
        AddressT.SemDate, 
        AddressT.Cost, 
        AddressT.PO, 
        AddressT.Chk1, 
        AddressT.Chk2,
        CONCAT(AddressT.CoMun, '', MunT.Municipality, ' ', MunT.County) AS CompanyAll
    FROM 
        AddressT
    LEFT JOIN 
        MunT ON MunT.MunID = AddressT.MunID
    ) AS MainQ 
INNER JOIN 
    RegT ON MainQ.INV = RegT.INV
INNER JOIN 
    AddressT ON AddressT.INV = RegT.INV
WHERE 
    MainQ.SemDate = "${req.query.date} 0:00:00"
    AND RegT.Cancelled = 0;
  `);

        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(5002, () => {
    console.log('Server is running on port 5002');
});