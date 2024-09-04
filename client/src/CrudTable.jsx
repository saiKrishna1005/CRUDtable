import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';



const CrudTable = () => {
    const [users,setUsers] = useState([])
    const [filterUsers,setFilterUsers] = useState([])
    
    const [show, setShow] = useState(false);
    const handleClose = () => {getAllUsers(); setShow(false)};
    const handleShow = () => {setShow(true); setUserData({full_name:"",email:"",phone:"",city:""})};
    const [userData,setUserData] = useState({full_name:"",email:"",phone:"",city:""})


    const getAllUsers = async () => {
        await axios.get("http://localhost:8000/users").then((res)=>{
            setUsers(res.data)
            setFilterUsers(res.data)
        })
    }

    useEffect(()=>{ getAllUsers()},[])

    const handleSearchChange = (e) =>{ //search input box 
        const searchTerm = e.target.value.toLowerCase()
        const filteredusers = users.filter((user)=> 
        user.full_name.toLowerCase().includes(searchTerm) || 
        user.city.toLowerCase().includes(searchTerm)
        )
        setFilterUsers(filteredusers)

    }

    const handleDelete = async (id) =>{ // delete button
        const isConfirmed = window.confirm("sure delete?")
        if (isConfirmed){
            await axios.delete(`http://localhost:8000/users/${id}`).then((res)=>{
                setUsers(res.data)
                setFilterUsers(res.data)
            })
        }
    }
    const handleData = (e) => {
        setUserData({...userData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if  (userData.id) {
            await axios.patch(`http://localhost:8000/users/${userData.id}`,userData).then((res)=>{
                console.log(res)
            })       
        }
        await axios.post(`http://localhost:8000/users`,userData).then((res)=>{
            console.log(res)
        })
        handleClose();
        setUserData({full_name:"",email:"",phone:"",city:""})
    }

    const handleUpdateRecord = (user) =>{
        setUserData(user)
        setShow(true)
    }

  return (
    <>
        <div className="input-area">
            <input type="search" onChange={handleSearchChange} />
            <Button variant="primary" onClick={handleShow}>Add record</Button>{' '}
        </div>
        <Table striped>
            <thead>
                <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Edit</th>
                <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {
                    filterUsers && 
                    filterUsers.map((user)=>{
                        return (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.full_name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.city}</td>
                            <td><Button variant="success"
                            onClick={()=>{handleUpdateRecord(user)}}>Edit</Button>{' '}</td>
                            <td><Button variant="danger"
                            onClick={()=> handleDelete(user.id)}>Delete</Button>{' '}</td>
                        </tr>
                        )
                    })
                }               
            </tbody>
        </Table>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>{userData.id ? "update record": "add record"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">full_name</InputGroup.Text>
                    <Form.Control
                    placeholder="full_name"
                    aria-describedby="basic-addon1"
                    value={userData.full_name}
                    onChange={handleData}
                    name='full_name'

                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon2">email</InputGroup.Text>
                    <Form.Control
                    placeholder="email"
                    aria-describedby="basic-addon2"
                    value={userData.email}
                    onChange={handleData}
                    name='email'


                    />
                </InputGroup><InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon3">Phone</InputGroup.Text>
                    <Form.Control
                    placeholder="Phone"
                    aria-describedby="basic-addon3"
                    value={userData.phone}
                    onChange={handleData}
                    name='phone'


                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon4">city</InputGroup.Text>
                    <Form.Control
                    placeholder="city"
                    aria-describedby="basic-addon4"
                    value={userData.city}
                    onChange={handleData}
                    name='city'

                    />
                </InputGroup>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            
            <Button variant="primary" onClick={handleSubmit}>
                {userData.id ? "update user": "add user"}
            </Button>
            </Modal.Footer>
        </Modal>
    </>
  )
}

export default CrudTable


