import React, {useState, useEffect} from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Addcar from './Addcar'
import Editcar from './Editcar'

export default function Carlist() {
    const [cars, setCars] = useState([]);
    const [open, setOpen] = React.useState(false);

    useEffect(() => fetchData(), []);

    const fetchData = () => {
        fetch('http://carstockrest.herokuapp.com/cars')
        .then(response => response.json())
        .then(data => setCars(data._embedded.cars))
    }
    const deleteCar = (link) => {
        if (window.confirm('Are you sure?'))
        fetch(link, {method: 'DELETE'})
        .then(res => fetchData())
        .catch(err => console.error(err))
    }

    const saveCar = (car) => {
        fetch('http://carstockrest.herokuapp.com/cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(res => fetchData())
        .catch(err => console.error(err))

    }
    const updateCar = (car, link) => {
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(res => fetchData())
        .catch(err => console.error(err))
        
    }
    
    const handleClick = () => {
        setOpen(true);
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
    };

    const columns = [
      {
          Header: 'Brand',
          accessor: 'brand'
      },
      {
          Header: 'Model',
          accessor: 'model'
      },
      {
        Header: 'Color',
        accessor: 'color'
      },
      {
        Header: 'Year',
        accessor: 'year'
      },
      {
        Header: 'Price',
        accessor: 'price'
      },
      {
        filterable: false,
        sortable: false,
        width: 100,
        Cell: row => <Editcar updateCar={updateCar} car={row.original} />
      },
      {
          filterable: false,
          sortable: false,
          width: 100,
          accessor: '_links.self.href',
          Cell: row => <Button onClick={handleClick, handleClose}size="small" color="secondary"onClick={() => deleteCar(row.value)}>Delete</Button>
      }
      ]

    return (
        <div>
            <Addcar saveCar={saveCar}/>
            <ReactTable filterable={true} data={cars} columns={columns} />
            <Snackbar
              open={open}
              autoHideDuration={6000}
              onClose={handleClose}
              message="Succesfully deleted"
              
      />


        </div>
    )
};