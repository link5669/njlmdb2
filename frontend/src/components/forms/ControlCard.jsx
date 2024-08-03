import { useEffect, useState } from "react"
import DataTable from "../DataTable"
import axios from "axios"

const ControlCard = () => {
    const [data, setData] = useState([])
    const [date, setDate] = useState("")
    
    return (
        <>
            <p>Enter date</p>
            <input type="date" onChange={(e) => setDate(e.target.value)} value={date} />
            <button  onClick={() => {
                axios.get('http://localhost:5002/signInSheet', { params: { date: date } }).then(e => {
                    console.log(e.data)
                    setData(e.data)
                })
            }}>submit</button>
            {data[0] != undefined && (
                <>
                    <p>Seminar Title</p>
                    {data[0].SemTitle}
                    <p>Seminar Date</p>
                    {data[0].SemDate}
                    <DataTable data={data} />
                    <h3>Total: {data.length}</h3>
                </>
            )}
        </>
    )
}

export default ControlCard