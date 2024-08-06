import jsPDF from "jspdf"
import { useEffect, useState } from "react";
import axios from "axios";
import header from "./header.png"

const SignInSheet = () => {
    const [date, setDate] = useState("")

    function pdf() {
        axios.get("http://localhost:5002/signInSheet", { params: { date: date } }).then((e) => {
            let data = e.data
            console.log(data)
            var doc = new jsPDF();
            doc.addImage(header, "png", 5, 5, 80, 20);
            doc.setFontSize(9)
            doc.text("Municipality/Company                                                                   Contact                                       Signature             League Use Only", 10, 50)
            for (let i = 0; i < data.length; i++) {
                console.log(data[i])
                doc.text(`${data[i].CompanyAll}`, (10 ), 60+ (7 * i))
                doc.text(`${data[i].LastN}, ${data[i].FirstN}`, 100, 60+ (7 * i))
                doc.text(`_______________________________________________________________________________________________________________________________`, 10, 62+ (7 * i))
            }
            doc.text(`Total for ${data[0].SemTitle}: ${data.length}`,20,(67+(data.length*7)))
            doc.setFontSize(20)
            doc.text(data[0].SemTitle,10,40)
            doc.text("Seminar Registration Sign In Sheet",100,18)
            doc.save("signin.pdf")
        })
    }

    return (
        <>
            <p>set date: FORMAT YYYY-MM-DD</p>
            <input onChange={(e) => setDate(e.target.value)} value={date}></input>
            <button onClick={pdf}>print</button>
        </>
    )
}

export default SignInSheet