'use client'
import Image from "next/image";
import {useState, useEffect} from 'react';
import {firestore} from '@/firebase';
import {Box, Modal, Typography, Stack, TextField, Button, List, ListItem, ListItemText, IconButton} from '@mui/material';
import {collection, getDocs, query, doc, getDoc, setDoc, deleteDoc} from 'firebase/firestore';


export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('') // this is when the application opens for the first time 
 
  // Updating from firebase
  // making async is when fetching codes would not be blocked.
  const updateInventory = async () => {
    // creating a snapshot of the data that exist in the data base.
    const snapshot = query(collection(firestore, 'inventory')) // inventory is the name on firebase database name.
    const docs = await getDocs(snapshot)
    const inventoryList = []
    // every doc, we want to add it to inventory List
    docs.forEach((doc) => {
         inventoryList.push({
          name: doc.id,
          ...doc.data(),
         })
    })
    setInventory(inventoryList)
  } // updateInventory

  // add an Item.
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()){
      const { quantity } = docSnap.data()
      // if exists, add 1 to quantity
      await setDoc(docRef, {quantity : quantity + 1})
    } else {
      // if not, we add and set quantity to 1
      await setDoc(docRef, setDoc(docRef, {quantity: 1}))
    } // if-else
    await updateInventory()
  } // addItem

  // remove an Item.
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()){
      const {quantity} = docSnap.data()
      if(quantity == 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      } // if-else
    } // if
    await updateInventory()
  } // removeItem

  // runs at the beginning of page load, and that is it
  useEffect(() => {
    updateInventory()
  }, [])  
  
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box 
    width="100vw"
    height="100vh"
    display="flex"
    flexDirection="column"
    justifyContent="center"
    gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
        position="absolute"
        top="50%"
        left="50%"
        width={400}
        bgcolor="white"
        border="2px solid #000"
        boxShadow={24}
        p={4}
        display="flex"
        flexDirection="column"
        gap={3}
        sx={{
          transform: 'translate(-50%, -50%)',
        }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value)
            }} // onChange eventListener
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }} // onClick EventListener
            >
             Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained"
              onClick={() => {
              handleOpen()
            }}
      >
        Add New Item
      </Button>
      <Box border="1px solid #333"
      >
        <Box 
          width="800px" 
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color="#333">
            My Pantry Checklist:
          </Typography>
        </Box>
      </Box>
      <Stack width="800px" height="300px" spacing={2} overflow="auto">
        {
          inventory.map(({name, quantity}) => {
            <Box key={name} width="100%"
                minHeight="150px"
                display="flex"
                alignment="center"
                justifyContent="center"
                bgcolor="#f0f0f0"
                padding={5}
            >
             <Typography variant="h3" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color="#333" textAlign="center">
                Quantity: {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="contained" 
                  color="success"
                  onClick={() => {
                    addItem(name)
                  }} // onClick EventListener for Add Item Button
                  >
                  Add Item
                </Button>
                <Button variant="outlined" color="error"
                  onClick={() => {
                    removeItem(name)
                  }} // pmClick EventListener for Remove Item Button
                >
                  Delete Item
                </Button>
              </Stack>
            </Box>
          })
        }

      </Stack>
    </Box>
    )
}
