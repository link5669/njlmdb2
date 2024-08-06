import jsPDF from "jspdf"
import invoice from "./invoice.png"
import { useEffect, useState } from "react";
import axios from "axios";

const InvoiceMailedNo = () => {
    const [inv, setInv] = useState("")

    function pdf() {
        axios.get("http://localhost:5002/invMailedNo", { params: { inv: inv } }).then((e) => {
            let data = e.data[0]
            console.log(e)
            var doc = new jsPDF();
            doc.addImage(invoice, "png", 0, 0, 210, 297);
            let namestr = data.FirstName + " " + data.LastName + ", " + data.Title
            if (data.CompanyAll != null) namestr += data.CompanyAll + "\n"
            if (data.Addr1All != null) namestr += data.Addr1All+ "\n"
            if (data.Addr2All != null) namestr += data.Addr2All+ "\n"
            if (data.CityStateAll != null) namestr += data.CityStateAll
            doc.text(namestr, 35, 65)
            doc.text(`S${inv}`, 85, 55)
            doc.text(data.SemTitle, 13, 92)
            doc.text(data.SemDate.split("T")[0], 91, 87)
            doc.setFontSize(10)
            doc.text(String(data.NumofReg), 123, 106)
            doc.text(String(data.Cost), 123, 111)
            doc.text(String(data.Total), 123, 115)
            doc.text(String(Number(data.AmtPd1) + Number(data.AmtPd2)), 179, 106)
            let check = ""
            if (data.Chk1 != null) check += data.Chk1
            if (data.Chk2 != null) check += data.Chk2
            doc.text(check, 179, 111)
            doc.text(String(data.Ovrpymt), 173, 115)
            doc.setFontSize(18)
            doc.text(Number(data.AmtPd1) + Number(data.AmtPd2) > data.Total ? "Refund Enclosed:" : "Balance Due:", 90, 130)
            doc.text(data.RefundDue > 1 ? data.RefundDue : data.BalDue, 130, 130)
            doc.text(data.PersonalCheck != 1 ? "PAYMENT-PERSONAL CHECK" : "", 100, 140)
            doc.setFontSize(12)
            doc.text(namestr, 100,200)
            doc.text(`S${inv}`, 150,236)
            doc.text(data.InvDate.split("T")[0], 150,240)
            doc.text(data.PO, 150,244)
            doc.text(Number(data.AmtPd1) + Number(data.AmtPd2) > data.Total ? "Refund Enclosed:" : "Balance Due:", 115, 250)
            doc.text(data.RefundDue > 1 ? data.RefundDue : data.BalDue , 145, 250)

            doc.save("invNo.pdf")
        })
    }

    return (<>
        <input onChange={(e) => setInv(e.target.value)} value={inv}></input>
        <button onClick={pdf}>print</button></>
    )
}

export default InvoiceMailedNo