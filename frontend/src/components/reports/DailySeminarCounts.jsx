import { useEffect, useState } from "react"
import DataTable from "../DataTable"
import axios from "axios"

const DailySeminarCounts = () => {
    const [data, setData] = useState([])
    useEffect(() => {
        axios.get("http://localhost:5002/seminarCount").then(e => {
            setData(e.data)
        })
    })
    return (
        <DataTable data={data} />
    )
}

export default DailySeminarCounts