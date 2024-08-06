import jsPDF from "jspdf"
import { useState } from "react";
import axios from "axios";
import header from "./header.png"
import { formatDate } from "../../utilities";

const SeminarReport = () => {
    //should there be more registrations?
    const [date, setDate] = useState("")

    function pdf() {
        axios.get("http://localhost:5002/reportQuery", { params: { date: date } }).then((e) => {
            let data = e.data
            console.log(data)
            var doc = new jsPDF();
            doc.addImage(header, "png", 5, 5, 80, 20);
            doc.setFontSize(9)
            let prev = {}
            let yPosition = 35
            let page = 0
            doc.setFontSize(20)
            doc.text("Seminar Report", 100, 18)
            doc.setFontSize(12)

            for (let i = 0; i < data.length; i++) {
                // Check if we need to add a new page before adding content
                if (yPosition > 270) { // 270mm instead of 297mm to leave some margin
                    doc.addPage()
                    page++
                    yPosition = 35 // Reset yPosition for the new page
                }

                if (prev != data[i]) {
                    doc.setFontSize(12)
                    doc.text(`${data[i].SemTitle}`, 10, yPosition)
                    yPosition += 6
                    doc.setFontSize(9)
                    doc.text(`${formatDate(data[i].SemDate.split("T")[0])}`, 10, yPosition)
                    yPosition += 4
                    doc.text(`                      Registrants    Total             AmtPd1           BalDue           Ovrpymt`, 10, yPosition)
                    yPosition += 4
                }

                doc.setFontSize(9)
                doc.text(`Seminar Cost`, 10, yPosition)
                doc.text(`${data[i].NumOfReg}`, 34, yPosition)
                doc.text(`${data[i].Total}`, 50, yPosition)
                doc.text(`$${data[i].AmtPd1}`, 70, yPosition)
                doc.text(`$${data[i].BalDue}`, 90, yPosition)
                doc.text(`$${data[i].Ovrpymt}`, 110, yPosition)

                yPosition += 7 // Increment yPosition for the next line

                prev = data[i]
            }

            

            doc.save("semreport.pdf")
        })
    }

    return (
        <>
            {/* <p>set date:</p>
            <input onChange={(e) => setDate(e.target.value)} value={date}></input> */}
            <button onClick={pdf}>print</button>
        </>
    )
}

export default SeminarReport