'use client'
import Image from "next/image";
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, Typography, Stack, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { collection, getDocs, query, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import DeleteIcon from '@mui/icons-material/Delete'; // Correctly import DeleteIcon

export default function Home() {
  // State variables for managing inventory, modal open state, and item name input
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState(''); // Initial state when the application opens
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  // Updating from Firebase
  // Making async to ensure fetching code is non-blocking
  const updateInventory = async () => {
    // Creating a snapshot of the data that exists in the database
    const snapshot = query(collection(firestore, 'inventory')); // 'inventory' is the name in Firebase database
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    // For each doc, add it to inventory list
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  // Add an item to the inventory
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      // If exists, add 1 to quantity
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      // If not, set quantity to 1
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  
  // Remove an item from the inventory
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  // Runs at the beginning of page load
  useEffect(() => {
    updateInventory();
  }, []);

  // Functions to handle modal open and close states
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  
  return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
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
                  setItemName(e.target.value);
                }}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
  
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleOpen}>
            Add New Item
          </Button>
          {/* Search Box */}
          <TextField
            variant="outlined"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Stack>
  
        <Box border="1px solid #333">
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
          {inventory
            .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())) // Filter inventory based on search term
            .map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#f0f0f0"
                padding={5}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="h3" color="#333" textAlign="center">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography
                    variant="h5"
                    color="#333"
                    textAlign="right"
                    sx={{
                      fontFamily: 'Arial, sans-serif',
                      fontWeight: 'bold',
                    }}
                  >
                    Quantity: {quantity}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                      addItem(name);
                    }}
                  >
                    Add Item
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => {
                      removeItem(name);
                    }}
                  >
                    Delete Item
                  </Button>
                </Stack>
              </Box>
            ))}
        </Stack>
      </Box>
  );
}
