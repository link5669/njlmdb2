import jsPDF from "jspdf"
import { useEffect, useState } from "react";
import axios from "axios";
import header from "./header.png"

const PrintByInvNo = () => {
    const [inv, setInv] = useState("")
    const [personInfo, setPersonInfo] = useState([])
    const [registrantInfo, setRegistrantInfo] = useState("")
    const [seminarInfo, setSeminarInfo] = useState("")
    const [invDate, setInvDate] = useState("")
    const [poInfo, setPoInfo] = useState("")
    const [overpayment, setOverpayment] = useState(0)
    const [payment, setPayment] = useState(0)
    const [checks, setChecks] = useState("")
    const [personalCheck, setPersonalCheck] = useState("")
    const [total, setTotal] = useState(0)
    const [refund, setRefund] = useState(0)
    const [balDue, setBalDue] = useState(0)
    function printPDF() {
        axios.get("http://localhost:5002/getSeminarPersonInfo", { params: { inv: inv } }).then(a => {
            if (a.data[0].Municipality == null) {
                setPersonInfo([`${a.data[0].FirstName} ${a.data[0].LastName},${a.data[0].Title}`, a.data[0].CoMun, a.data[0].Address1])
            } else {
                axios.get("http://localhost:5002/getMunicipalityInfo", { params: { munid: a.data[0].MunID } }).then(r => {
                    setPersonInfo([`${a.data[0].FirstName} ${a.data[0].LastName},${a.data[0].Title}`, r.data[0].Municipality, r.data[0].MunAddr1])
                })
            }
            setSeminarInfo(`${a.data[0].SemTitle}, ${a.data[0].SemDate.split("T")[0]}, $${a.data[0].Cost}`)
            setInvDate(a.data[0].InvDate.split("T")[0])
            setPoInfo(a.data[0].PO)
            setPayment((Number(a.data[0].AmtPd1) + Number(a.data[0].AmtPd2)))
            setOverpayment((Number(a.data[0].AmtPd1) + Number(a.data[0].AmtPd2)) - Number(a.data[0].RefundDue))
            
            setRefund((Number(a.data[0].RefundDue)))
            setBalDue((Number(a.data[0].BalDue)))
            if (a.data[0].Chk1 != null)
                setChecks((a.data[0].Chk1 + "\n" + ((a.data[0].Chk2 != null) ? a.data[0].Chk2 : "")))
            setPersonalCheck(a.data[0].PersonalCheck == "1" ? "Payment-Personal Check" : "")
            axios.get("http://localhost:5002/getRegistrations", { params: { inv: inv } }).then(r => {
                let personString = ""
                for (let person in r.data) {
                    personString += `Registrant: ID${r.data[person].RegID} ${r.data[person].FirstN} ${r.data[person].LastN}, ${r.data[person].Title}\n`
                }
                setRegistrantInfo(personString)
                setTotal((Number(a.data[0].Cost)) * r.data.length)
            })
        })
    }



    useEffect(() => {
        console.log(payment, typeof (payment))
        if (personInfo.length != 3 && registrantInfo.length > 0) return
        var doc = new jsPDF();
        doc.setFontSize(12)
        doc.text(`                                                                                    INVOICE
                                                                                    222 West State Street, Trenton, NJ 08608
                                                                                    Contact Suzanne Delany, Ext 111
                                                                                    P: 609-695-3481 F: 609-695-5156
                                                                                    sdelany@njlm.org`, 20, 20)
        doc.text(`





${personInfo[0]}
${personInfo[1]}
${personInfo[2]}
`, 20, 20);
        doc.text(`





                                                                                    Billing Date: ${String(new Date()).split(" ").splice(0,3).join(" ")}
                                                                                    Payment Due Date: Payment Due 
                                                                                    Within 30 days of Receipt
                                                                                    Invoice #S${inv}
                                                                                    Balance Due: 
`, 20, 20);

        var generateData = function (amount) {
            var result = [];
            var data = {
                "Seminar Invoice and Confirmation": `Seminar Title, Date, and Registration Fee                                  Date Processed         
     
     `
            };
            for (var i = 0; i < amount; i += 1) {
                data.id = (i + 1).toString();
                result.push(Object.assign({}, data));
            }
            return result;
        };

        function createHeaders(keys) {
            var result = [];
            for (var i = 0; i < keys.length; i += 1) {
                result.push({
                    id: keys[i],
                    name: keys[i],
                    prompt: keys[i],
                    align: "left",
                    padding: 0
                });
            }
            return result;
        }

        var headers = createHeaders([
            "Seminar Invoice and Confirmation",
        ]);


        doc.table(15, 100, generateData(1), headers, { autoSize: true });
        doc.text(registrantInfo, 15, 140)
        doc.text(seminarInfo, 18, 125)
        doc.text(invDate, 135, 125)
        doc.text("Payment Information\nPO/Voucher #: " + poInfo, 15, 175)
        doc.text("Overpayment: $" + overpayment, 140, 195)
        doc.text("Payment Recieved: $" + payment, 140, 185)
        doc.text("Checks Recieved:" + checks, 140, 175)
        doc.text(personalCheck, 160, 175)
        doc.text(" . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", 0, 240)
        doc.text(`Invoice number: S${inv}`, 10, 245)
        doc.text(`Municipality Name: ${personInfo[1]}`, 10, 250)
        doc.text("Mail payments to:\nNJLM, 222 West State Street, Trenton, NJ 08608",10,255)
        doc.text("Payment Coupon\nFor billing details please see above",140,245)
        doc.setFontSize(10)
        doc.text("Payment Due Within 30 days of Receipt",140,260)
        doc.setFontSize(20)
        doc.text(payment > total ? "Refund Enclosed" : "Balance Due",140,265)
        doc.text(refund >= 1 ? String(refund) : String(balDue),140, 270)
        doc.addImage(header, "png", 5, 5, 80, 20);
        doc.save("invoice.pdf")
    }, [personInfo, registrantInfo, payment])

    return (
        <>
            <p>Enter INV number</p>
            <input onChange={(e) => setInv(e.target.value)} value={inv} />
            <button onClick={printPDF}>print</button>
        </>
    )
}

export default PrintByInvNo