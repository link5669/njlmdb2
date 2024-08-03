import { useEffect, useState } from "react"
import DataTable from "../DataTable"
import axios from "axios"

const CancelSF = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        axios.get("http://localhost:5002/RegT").then((e) => {
            console.log(e.data)
            setData(e.data.map(item => ({
                name: item.RegID + "    " + item.FirstN + " " + item.LastN + "," + item.Title,
                cancelled: item.Cancelled === 1 ? "Cancelled" : null,
                comments: item.Cancelled === 1 ? item["Cancellation Comments"] : null
            })));
        })
    }, [])

    return (
        <>
            <DataTable data={data} />
        </>
    )
}

export default CancelSF