import { useEffect, useState } from "react";
import DataTable from "../DataTable";
import Dropdown from "react-dropdown"
import axios from "axios";

const EnterOrders = () => {
    const [data, setData] = useState([])
    const [index, setIndex] = useState(0)
    const [subformData, setSubformData] = useState([])
    useEffect(() => {
        axios.get("http://localhost:5002/invMailedNo").then(e => {
            setData(e.data)
            console.log(e.data[0])
            axios.get("http://localhost:5002/enterOrders", { params: { inv: e.data[0].INV } }).then(a => {
                setSubformData(a.data)
            })
        })
    }, [])

    useEffect(() => {
        if (data[index] == undefined) {
            return
        }
        axios.get("http://localhost:5002/regT", { params: { inv: data[index].INV } }).then(e => {
            setSubformData(e.data)
            // console.log(e.data)
        })
    }, [index])

    const options = [
        'one', 'two', 'three'
    ];
    const defaultOption = options[0];

    return (
        <>
            {
                data[0] == undefined ? <p>loading...</p> : (
                    <>
                        <p>INV# {data[index].INV}</p>
                        <p>InvDate</p>
                        <input type="date"></input>
                        <p>Choose a municipality</p>
                        <Dropdown options={options} value={defaultOption} placeholder="Select an option" />;
                        <p>Key contact information</p>
                        <p>FirstName</p>
                        <input value={data[index].FirstName}></input>
                        <p>LastName</p>
                        <input value={data[index].LastName}></input>
                        <p>Title</p>
                        <input value={data[index].Title}></input>
                        <p>Work Phone</p>
                        <input value={data[index].WorkPhone} />
                        <p>Xten</p>
                        <input value={data[index].Xten} />
                        <p>Fax Number</p>
                        <input value={data[index].FaxNumber} />
                        <p>EmailAddress</p>
                        <input value={data[index].EmailAddress} />
                        <p>Enter Payment Information</p>
                        <p>PO#</p>
                        <input value={data[index].PO} />
                        <p>#of Reg</p>
                        <input value={data[index].NumofReg} />
                        <p>Cost1</p>
                        <input value={data[index].Cost} />
                        <p>Total</p>
                        <input value={data[index].Total} />
                        <p>AmtPd1</p>
                        <input value={data[index].AmtPd1} />
                        <p>Chk1</p>
                        <input value={data[index].Chk1} />
                        <p>DatePd1</p>
                        <input value={data[index].DatePd1} />
                        <p>AmtPd2</p>
                        <input value={data[index].AmtPd2} />
                        <p>Chk2</p>
                        <input value={data[index].Chk2} />
                        <p>DatePd2</p>
                        <input value={data[index].DatePd2} />
                        <p>Comments</p>
                        <input value={data[index].Comments} />
                        <p>Personal Check</p>
                        <input value={data[index].PersonalCheck ? true : false} type="checkbox" />
                        <p>InvMailed</p>
                        <input value={data[index].InvMailed} />
                        <p>Address Other Than Municipal</p>
                        <p>Co/Mun</p>
                        <input value={data[index].CoMun} />
                        <p>Address1</p>
                        <input value={data[index].Address1} />
                        <p>Address2</p>
                        <input value={data[index].Address2} />
                        <p>City</p>
                        <input value={data[index].City} />
                        <p>State</p>
                        <input value={data[index].State} />
                        <p>ZipCode</p>
                        <input value={data[index].zipcode} />
                        <p>Seminar Information</p>
                        <Dropdown options={options} value={defaultOption} placeholder="Select an option" />;

                        <p>SemDate</p>

                        <input />

                        <DataTable data={subformData}/>

                    </>
                )
            }
        </>
    )
}

export default EnterOrders