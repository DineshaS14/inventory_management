'use client';

import React, { useState } from "react";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Stack, TextField, Button, Box, Typography } from '@mui/material';

const gemini = new GoogleGenerativeAI('AIzaSyDnHoqWESoueZV7ct7B4Ej7dmvo2RT_7x0');

const GeminiSearch = ({ inventory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  const searchRecipes = async (query) => {
    try {
      const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Find recipes using ${query}`;
      const result = await model.generateContent(prompt);
      const recipesText = await result.response.text();
      return recipesText;
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  const handleSearch = async () => {
    const inventoryItems = inventory.map((item) => item.name);
    const query = inventoryItems.join(', ');
    const recipesText = await searchRecipes(query);
    setRecipes(recipesText.split('\n'));  // Assuming recipes are separated by new lines
  };

  return (
    <div>
      <Stack direction="row" spacing={2}>
        <TextField
          variant="outlined"
          placeholder="Search for recipes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search Recipes
        </Button>
      </Stack>
      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}
      <Box mt={2} p={2} border={1} borderColor="grey.400" borderRadius={2} sx={{ maxHeight: 300, overflow: 'auto' }}>
        <Typography variant="h6">Recipes:</Typography>
        <ul>
          {recipes.map((recipe, index) => (
            <li key={index}>{recipe}</li>
          ))}
        </ul>
      </Box>
    </div>
  );
};

export default GeminiSearch;