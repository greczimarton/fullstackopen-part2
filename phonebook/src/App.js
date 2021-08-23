import React, {useState, useEffect} from 'react'
import personService from './services/Person'

const Filter = ({filterName, handleNameChange}) => {
    return (
        <div>
            Filter by name: <input value={filterName} onChange={handleNameChange}/>
        </div>
    )
}

const AddForm = ({addNewNameToPersons,newName ,newNumber, handleNameChange, HandleNumberChange}) => {
    return (
        <form onSubmit={addNewNameToPersons}>
            <div>
                Name: <input value={newName} onChange={handleNameChange}/>
            </div>
            <div>
                Number: <input value={newNumber} onChange={HandleNumberChange}/>
            </div>
            <div>
                <button type="submit">Add</button>
            </div>
        </form>
    )
}

const Numbers = ({persons, filterName,handleDelete}) => {
    if (filterName.length === 0){
        return (
            <div>
                {persons.map(person =>
                    <li key={person.id}>
                        <Person person={person} handleDelete={handleDelete}/>
                        <hr/>
                    </li>
                )}
            </div>
        )
    }
    else{
        return (
            <div>
                {persons.filter(t => t.name.toLowerCase().includes(filterName)).map(person =>
                    <li key={person.id}>
                        <Person person={person} handleDelete={handleDelete}/>
                        <hr/>
                    </li>)}
            </div>
        )
    }
}

const Person = ({person, handleDelete}) => {
    return (
        <div>
            <p>{person.name}: {person.number}</p>
            <button onClick={() => handleDelete(person)}>Delete</button>
        </div>
    )
}

const Notification = ({message,error}) => {
    if (message === null){
        return null
    }
    if (error) {
        return (
            <ErrorNotification message={message}/>
        )

    }
    else{
        return (
            <AddNotification message={message}/>
        )
    }
}

const ErrorNotification = ({message}) => {
    const errorStyle = {
        color: 'red',
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px',
        marginTop: '10px'
    }
    return (
        <div style={errorStyle}>
            {message}
        </div>
    )
}

const AddNotification = ({message}) => {
    const errorStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px',
        marginTop: '10px'

    }
    return (
        <div style={errorStyle}>
            {message}
        </div>
    )
}

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filterName, setNewFilterName] = useState('')
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        console.log("effect")
        personService
            .getAll()
            .then(response => {
                console.log("promise fulfilled")
                setPersons(response)
            })
    },[])

    console.log("person fetched: ",persons.length)


    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const HandleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const HandleFilterNameChange = (event) => {
        setNewFilterName(event.target.value)
    }


    const addNewNameToPersons = (event) => {
        event.preventDefault()

        const newPerson =
            {
                name: newName,
                number: newNumber
            }
        if (persons.some(t => t.name === newName) === false) {
            personService
                .create(newPerson)
                .then(response => {
                    setPersons(persons.concat(response))
                    setNewName('')
                    setNewNumber('')
                    setMessage(`Added ${response.name} with number ${response.number}`)
                    setError(false)
                    setTimeout(() => {
                        setMessage(null)
                    },5000)
                })
                .catch(error => {
                    console.log(error.response.data.error)
                    setError(true)
                    setMessage(error.response.data.error)
                    setTimeout(() => {
                        setMessage(null)
                    }, 15000)
                })
        }
        else {
            window.confirm(`${newName} is already added to phonebook. Replace the old number with the new one?`)
            const person = persons.find(t => t.name === newName)
            const changedPerson = {...person, number: newNumber}
            personService
                .update(person.id,changedPerson)
                .then(returnedPerson => {
                    setPersons(persons.map(person => person.id !== changedPerson.id ? person : returnedPerson))
                    setNewName('')
                    setNewNumber('')
                    setError(false)
                    setMessage(`${person.name}'s number has been updated. New number: ${returnedPerson.number}!`)
                    setTimeout(() => {
                        setMessage(null)
                    },15000)
                })
                .catch(error => {
                    console.log(error.response.data.error)
                    setError(true)
                    setMessage(error.response.data.error)
                    //setPersons(persons.filter(t => t.id !== changedPerson.id))
                    setTimeout(() => {
                        setMessage(null)
                    }, 15000)
                })
        }
    }

    const handleDelete = (person) => {
        personService
            .deletePerson(person)
            .then(() => {
                setPersons(persons.filter(t => t.id !== person.id))
            })
            .catch(error => {
                    setError(true)
                    setMessage(`The person '${person.name}' was already deleted from the server.`)
                    setTimeout(() => {
                        setMessage(null)
                    }, 2500)
                }
            )
    }


    return (
        <div>
            <h2>Phonebook</h2>
            <Filter newFilterName={filterName} handleNameChange={HandleFilterNameChange}/>
            <Notification message={message} error={error}/>
            <h3>Add new</h3>
            <AddForm newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} HandleNumberChange={HandleNumberChange} addNewNameToPersons={addNewNameToPersons} />
            <h2>Numbers</h2>
            <Numbers persons={persons} filterName={filterName} handleDelete={handleDelete}/>
        </div>
    );
}

export default App;
