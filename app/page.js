'use client'
import Image from "next/image";
import {useState, useEffect} from 'react';
import {firestore} from '@/firebase';
import {Box, Typography} from '@mui/material';
import {collection, getDocs, query} from 'firebase/firestore'

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
  }
  // runs at the beginning of page load, and that is it
  useEffect(() => {
    updateInventory()
  }, [])
  return (
    <Box>
      <Typography variant="h1">Inventory Management</Typography>
      {
        inventory.forEach((item) => {
          console.log(item)
          return (
            <Box>
            {item.name}
            {item.count}
            </Box>
          )
        })
      }
    </Box>
    )
}
