import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { Button, FormControl, FormLabel, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography,  } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
export const Home = () => {

    const [table, setTable] = useState([])

    const [title, setTitle] = useState('');
    const [discription, setDiscription] = useState('')
    const [state, setState] = useState(true);
    
    const useStyles = makeStyles({
        table: {
            minWidth: 650,
        },
      });
    
    const classes = useStyles()

    React.useEffect(() => {
        loardJson();
    }, [])

    const saveJson =(e)=>{
        const todo = {title: title, discription:discription, state:state}
        fetch('http://localhost:8000/todos',{
            method:'Post',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(todo)
        }).then(()=>{
            setTitle("")
            setDiscription("")
            alert('Add new Todo')
            loardJson()       
        })  
    }
    const updateJson=(id,title,discription,state)=>{
        let v = true;
        if(state === true){
            v= false;
        }else{
            v= true;
        }
        const todo = {title: title, discription:discription,state:v}
        fetch('http://localhost:8000/todos'+'/'+id,{
        method:'PUT',
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(todo)
    }).then(()=>{
        loardJson();
    }).catch((err)=>{
        console.log(err.name)
    })
    }

    const deleteJson=(id)=>{
        fetch('http://localhost:8000/todos'+'/'+id,{
        method:'DELETE',
        headers:{"Content-Type":"application/json"},
    }).then(()=>{
        loardJson();
    }).catch((err)=>{
        console.log(err.name)
    })
    }

    const loardJson =()=>{
        fetch('http://localhost:8000/todos')
        .then( res =>{
            if(!res.ok){
                throw Error('URL not going to fetch datas!!')
            }
            return res.json()
        })
        .then( data =>{
            var v = [...data.reduce((map,obj)=> map.set(obj.title,obj), new Map())]
            setTable(v)
            
        })
        .catch( err =>{
          console.log(err)
        })
    }

  return <>
        <Grid
            container
            justify="center"
            alignItems="center"
            direction="column"
            spacing={5}
        >
            <AddTodos 
                title={title} 
                discription={discription} 
                setTitle={setTitle} 
                setDiscription={setDiscription} 
                setState={setState} 
                saveJson={saveJson} 
            />
        </Grid>
        <br/>
        <Grid
            container
            justify="center"
            alignItems="center"
            direction="column"
            style={{ minHeight: "70vh" }}
            spacing={5}
        >
            <Grid item style={{ border: "0.2px solid gray" }}>
                <LoardTable
                    classes={classes}
                    table={table}
                    updateJson={updateJson}
                    deleteJson={deleteJson}
                />
            </Grid>    
        </Grid> 
        </>;
};

const LoardTable =({classes, table, updateJson,deleteJson})=>{
    return(
        <>
        <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Discriprion</TableCell>
                            <TableCell>States</TableCell>
                            <TableCell align="right">Update States</TableCell>
                            <TableCell align="right">Delete</TableCell>
                        </TableRow>
                    </TableHead>
                        <TableBody >
                           {
                               table.map((todo)=>{
                                   console.log(todo)
                                   return <TableRow>
                                            <TableCell>{todo[1].id}</TableCell>
                                            <TableCell>{todo[1].title}</TableCell>
                                            <TableCell>{todo[1].discription}</TableCell>
                                            <TableCell>{todo[1].state?<FormLabel style={{background:"#03fc7b", width:75}}>Active</FormLabel>:<FormLabel style={{background:"#fc5e03", width:75}}>Deactive</FormLabel>}</TableCell>
                                            <TableCell>
                                                <Button variant="outlined" color="inherit" 
                                                    onClick={()=>{updateJson(todo[1].id,todo[1].title,todo[1].discription,todo[1].state)}}>
                                                    Update
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="outlined" color="secondary" startIcon={<DeleteIcon />}
                                                    onClick={()=>{deleteJson(todo[1].id)}}>
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                               })
                           }         
                        </TableBody>
                </Table>
            </TableContainer>     
        </>
    )
}


const AddTodos =({title, discription, setTitle, setDiscription, setState, saveJson})=>{
    return(
            <>
                <Grid item>
                    <Typography variant="h5" color="primary">
                        Add Todo's
                    </Typography>
                </Grid>
                <Grid item style={{ border: "0.2px solid gray" }}>
                    <Grid container direction="column" alignItems="center" justify="center">
                    <TextField
                    variant="outlined"
                    label="Title"
                    fullWidth
                    style={{ marginBottom: "2em" }}
                    value={title}
                    onChange={(e)=>{setTitle(e.target.value)}}
                    />

                    <TextField
                    variant="outlined"
                    label="Description"
                    fullWidth
                    style={{ marginBottom: "2em" }}
                    value={discription}
                    onChange={(e)=>{setDiscription(e.target.value)}}
                    />

                    <FormControl style={{minWidth: 120, paddingBottom: 10}}>
                    <InputLabel >Select States</InputLabel>
                    <Select
                        fullWidth
                        onChange={(e)=>{setState(e.target.value)}}
                    >
                        <MenuItem value={0}>--Select--</MenuItem>
                        <MenuItem value={true}>Active</MenuItem>
                        <MenuItem value={false}>Inactive</MenuItem>
                    </Select>
                    </FormControl>
                    <Button size="large" variant="contained" color="primary"
                        onClick={()=>{saveJson()}}
                    >
                    Save
                    </Button>
                    </Grid>
                </Grid>
            </>
        )
}