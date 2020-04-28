import React, { useState, useEffect } from 'react';
import './App.css';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import Alert from './components/Alert';
import { v4 as uuidv4 } from 'uuid';

// const initialExpenses = [
//     {id: uuidv4(), charge:'Rent', amount:1000},
//     {id: uuidv4(), charge:'Car Payment', amount:4000},
//     {id: uuidv4(), charge:'Credit Card', amount:2000}
// ];

const initialExpenses = localStorage.getItem("expense") 
? JSON.parse(localStorage.getItem("expense"))
: [];

function App() {
    const [expenses, setExpenses] = useState(initialExpenses)
    const [charge, setCharge] = useState('')
    const [amount, setAmount] = useState('')
    const [alert, setAlert] = useState({show:false})
    const [edit, setEdit] = useState(false)
    const [id, setId] = useState(0)
    useEffect(() => {
        localStorage.setItem("expense", JSON.stringify(expenses))
    })
    const handleCharge = e => {
        // console.log(`Charge : ${e.target.value}`)
        setCharge(e.target.value)
    }
    const handleAmount = e => {
        // console.log(`Amount : ${e.target.value}`)
        setAmount(e.target.value)
    }
    //handle alert
    const handleAlert = ({type, text}) => {
        // console.log(`Alert : ${e.target.value}`)
        setAlert({show:true, type, text})
        setTimeout(() => {
            setAlert({show:false})
        },3000)
    }
    const handleSubmit = e => {
        e.preventDefault()
        // console.log(`Charge : ${charge}, ` + `Amount : ${amount}`)
        if (charge !== '' && amount > 0) {
            if (edit) {
                let tempExpenses = expenses.map(item => {
                    return item.id === id ? {...item, charge, amount} : item
                })
                setExpenses(tempExpenses)
                setEdit(false)
                setId(0)
                handleAlert({type: 'success', text: 'Item Updated.'})
            } else {
                const singleExpense = {id: uuidv4(), charge, amount}
                setExpenses([...expenses, singleExpense])
                handleAlert({type: 'success', text: 'New Item Added.'})
            }
            setCharge('')
            setAmount('')
        } else {
            handleAlert({type: 'danger', text: 'All Fields Are Required or Amount Can\'t be Zero.'})
        }
    }
    const clearItems = () => {
        // console.log("Cleared All Items")
        setExpenses([])
        handleAlert({type: 'danger', text: 'All Items Deleted.'})
    }
    const handleDelete = (id) => {
        // console.log(`Item Delete : ${id}`)
        let tempExpenses = expenses.filter(item => item.id !== id)
        // console.log(tempExpenses)
        setExpenses(tempExpenses)
        handleAlert({type: 'danger', text: 'Item Deleted.'})
    }
    const handleEdit = (id) => {
        // console.log(`Item Edit : ${id}`)
        // expenses.map(item => {
        //     if (item.id === id) {
        //         setEdit(true)
        //         setCharge(item.charge)
        //         setAmount(item.amount)
        //     }
        // })
        let expense = expenses.find(item => item.id === id)
        let {charge, amount} = expense
        setEdit(true)
        setCharge(charge)
        setAmount(amount)
        setId(id)
    }
    return (
        <>
            {alert.show && <Alert type={alert.type} text={alert.text}/>}
            <Alert />
            <h1>Budget Calculator</h1>
            <main className="App">
                <ExpenseForm charge={charge} amount={amount} handleAmount={handleAmount} handleCharge={handleCharge} handleSubmit={handleSubmit} edit={edit}/>
                <ExpenseList expenses={expenses} handleDelete={handleDelete} handleEdit={handleEdit} clearItems={clearItems}/>
            </main>
            <h1>
                Total Spending : <span className="total">$ {expenses.reduce((acc, curr) => {
                    return (acc += parseInt(curr.amount))
                }, 0)}</span>
            </h1>
        </>
    );
}

export default App;
