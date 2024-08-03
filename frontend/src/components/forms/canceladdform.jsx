import axios from "axios"
import DataTable from "../DataTable"
import { useEffect, useState } from "react"

const CancelAddForm = () => {
    useEffect(() => {
        axios.get()
    })

    const [data] = useState({})
    return (
        <>
            <h3>INVOICE INFORMATION</h3>
            <p>INV No.</p>
            <input></input>
            <p>Inv Date</p>
            <input></input>
            <p>Inv Mailed</p>
            <input></input>
            <h3>
                CONTACT INFORMATION
            </h3>
            <p>{data.companyAll}</p>
            <p>{data.firstName}</p>
            <p>{data.lastName}</p>
            <p>{data.workPhone}</p>
            <p>{data.xten}</p>
            <p>{data.faxNumber}</p>
            <p>{data.emailAddress}</p>
            <p>comments:</p>
            <input></input>
            <h3>SEMINAR INFORMATION</h3>
            <p>Seminar Title</p>
            <input></input>
            <p>SemDate</p>
            <input></input>
            <h3>ATTENDEES</h3>
            <DataTable/>
            <p># of Reg</p>
            <p>{data.numReg}</p>
            <p>Bal due:</p>
            <p>{data.balDue}</p>
            <p>Ovrpymt</p>
            <p>{data.ovrpymt}</p>
            <p>Refund Due:</p>
            <p>{data.refundDue}</p>
        </>
    )
}

export default CancelAddForm
