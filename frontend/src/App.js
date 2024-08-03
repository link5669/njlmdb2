import React, { useState } from 'react';
import './index.css';
import axios from 'axios';
import DataTable from './components/DataTable';
import CancelAddForm from './components/forms/canceladdform';
import BarIDReport from './components/reports/BarIDReport';
import CancelSF from './components/reports/CancelSF';
import ControlCard from './components/forms/ControlCard';
import EnterOrders from './components/reports/EnterOrders';

const App = () => {
  const [data, setData] = useState([])
  const [invNum, setInvNum] = useState("")
  const [reportDate, setReportDate] = useState("")
  const [selectedForm, setSelectedForm] = useState(0)

  return (
    <div className="app">
      <p>Queries (click one):</p>
      <button onClick={() => {
        axios.get("http://localhost:5002/balDue").then((e) => {
          setData(e.data)
        })
      }}>BalDue</button>
      <button onClick={() => {
        axios.get("http://localhost:5002/balDue2New").then((e) => {
          setData(e.data)
        })
      }}>balDue2 - New</button>
      <button onClick={() => {
        axios.get("http://localhost:5002/cancelQForForm").then((e) => {
          setData(e.data)
        })
      }}>cancelQForForm</button>
      <button onClick={() => {
        axios.get("http://localhost:5002/invMailedNo").then((e) => {
          setData(e.data)
        })
      }}>invMailedNo</button>
      <button onClick={() => {
        axios.get("http://localhost:5002/invMailedYes").then((e) => {
          setData(e.data)
        })
      }}>invMailedYes</button>
      <div>
        <button onClick={() => {
          if (invNum == "") {
            alert("must enter invNum!")
          } else {
            axios.get(`http://localhost:5002/invPrintByInvQ?invNum=${invNum}`).then((e) => {
              setData(e.data)
            })
          }
        }}>invPrintByInvQ</button>
        <input value={invNum} onChange={(e) => setInvNum(e.target.value)}></input>
      </div>
      <button onClick={() => {
        axios.get("http://localhost:5002/mainQ").then((e) => {
          setData(e.data)
        })
      }}>mainQ</button>
      <button onClick={() => {
        axios.get("http://localhost:5002/listForSueQ").then((e) => {
          setData(e.data)
        })
      }}>listForSueQ</button>
      <button onClick={() => {
        axios.get("http://localhost:5002/labelsForSue").then((e) => {
          setData(e.data)
        })
      }}>labelsForSue</button>
      <button onClick={() => {
        axios.get("http://localhost:5002/miniRegYes").then((e) => {
          setData(e.data)
        })
      }}>miniRegYes</button>
      <div>
        <button onClick={() => {
          if (reportDate == "") {
            alert("set report date!")
          } else {
            axios.get("http://localhost:5002/miniReport").then((e) => {
              setData(e.data)
            })
          }
        }}>miniReport</button>
        <input value={reportDate} onChange={(e) => setReportDate(e.target.value)}></input>
      </div>
      <button onClick={() => {
        axios.get("http://localhost:5002/PAQ").then((e) => {
          setData(e.data)
        })
      }}>PAQ</button>
      <button onClick={() => {
        axios.get("http://localhost:5002/pymtInfoAll").then((e) => {
          setData(e.data)
        })
      }}>pymtInfoAll</button>
      <button onClick={() => {
        axios.get("http://localhost:5002/pymtInfoCurrent").then((e) => {
          setData(e.data)
        })
      }}>pymtInfoCurrent</button>
      <button onClick={() => {
        axios.get("http://localhost:5002/paymentRecieveReport").then((e) => {
          setData(e.data)
        })
      }}>paymentRecieveReport</button>
      <button onClick={() => {
        axios.get("http://localhost:5002/paymentPACLESentNo").then((e) => {
          setData(e.data)
        })
      }}>paymentPACLESentNo</button>
      <button onClick={() => {
        axios.get("http://localhost:5002/reconciliation").then((e) => {
          setData(e.data)
        })
      }}>reconciliation</button>
      <button onClick={() => {
        axios.get("http://localhost:5002/regQAll").then((e) => {
          setData(e.data)
        })
      }}>regQAll</button>
      <DataTable data={data} />
      <p>Forms:</p>
      <button onClick={() => setSelectedForm(1)}>Cancel/Add Form</button>
      <button onClick={() => setSelectedForm(2)}>BarID Report</button>
      <button onClick={() => setSelectedForm(3)}>CancelSF</button>
      <button onClick={() => setSelectedForm(4)}>ControlCard</button>
      <button onClick={() => setSelectedForm(5)}>Enter Orders</button>
      {selectedForm == 1 ?
        <CancelAddForm />
        : selectedForm == 2 ? <BarIDReport />
          : selectedForm == 3 ? <CancelSF />
            : selectedForm == 4 ? <ControlCard />
              : selectedForm == 5 ? <EnterOrders />
                :
                <></>}
    </div>
  );
};

export default App;