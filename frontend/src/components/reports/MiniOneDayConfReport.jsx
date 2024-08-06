import jsPDF from "jspdf"
import { useEffect, useState } from "react";
import axios from "axios";
import header from "./header.png"

const MiniOneDayConfReport = () => {
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
                doc.text(`${data[i].FirstN} ${data[i].LastN}, ${data[i].Title}`, (10 ), 50+ (7 * i))
                doc.text(`${data[i].Sessions}`, 100, 50+ (7 * i))
                doc.text(`${data[i].CompanyAll}`, 140, 50+ (7 * i))
            }
            doc.text(`Total for ${data[0].Sessions}: ${data.length}`,170,(57+(data.length*7)))
            doc.setFontSize(20)
            doc.text(data[0].Sessions,10,40)
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

export default MiniOneDayConfReport