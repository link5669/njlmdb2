import { useEffect, useState } from "react"
import DataTable from "../DataTable"
import axios from "axios"

const BarIDReport = () => {
    const [data, setData] = useState([])
    useEffect(() => {
        axios.get("http://localhost:5002/miniReport", { params: { date: "6/16/2017" } }).then((e) => {
            setData(e.data.map(item => ({FirstN: item.FirstN, LastN: item.LastN, Title: item.Title})))
            console.log(e.data)
        })
    },[])
    return (<>
        <h3>BarID</h3>
        {data.length != 0 || data[0] != undefined ? (
            <>
                <DataTable data={data} />
                {Date.now()}
            </>
        ) : <></>}
    </>)
}

export default BarIDReport