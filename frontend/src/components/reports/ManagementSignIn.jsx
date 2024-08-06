import jsPDF from "jspdf"
import { useEffect, useState } from "react";
import axios from "axios";
import header from "./header.png"

const ManagementSignIn = () => {
    const [date, setDate] = useState("")

    function pdf() {
        axios.get("http://localhost:5002/miniReport", { params: { date: date } }).then((e) => {
            let data = e.data
            console.log(data)
            var doc = new jsPDF();
            doc.addImage(header, "png", 5, 5, 80, 20);
            doc.setFontSize(9)
            for (let i = 0; i < data.length; i++) {
                console.log(data[i])
                doc.text(`${data[i].FirstN} ${data[i].LastN}, ${data[i].Title}`, (10 ), 50+ (10 * i))
                doc.text("Signature __________________________________________",110,50+ (10 * i))
            }
            doc.setFontSize(20)
            doc.text("Management Workshop Series",100,18)
            doc.save("signin.pdf")
        })
    }

    return (
        <>
            <p>set date:</p>
            <input onChange={(e) => setDate(e.target.value)} value={date}></input>
            <button onClick={pdf}>print</button>
        </>
    )
}

export default ManagementSignIn