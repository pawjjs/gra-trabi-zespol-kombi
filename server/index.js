import express from 'express';
import { firebaseConfig }  from './firebase.js';
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { useAuth } from "./hooks/useAuth.js";

const app = express();

app.get('/api/firebase-config', (request, response) => 
{
    response.json(firebaseConfig);
});
app.get('/api/firebase-auth', (request , response) => 
{
    response.json(useAuth());
});








app.get('/api/hello', (req, res) => 
{
    res.json({ message: 'Siema siema' });
});
app.get('/api/goodbye', (req, res) => 
{
    res.json({ message: 'Goodbye World' })
});

const PLAYER_COLOR = '#1dfa00';
app.get('/api/game', (req, res) => 
{
    res.json({ message: 'Spadłeś', playerColor: PLAYER_COLOR });
});

app.listen(3000, () => console.log('API: http://localhost:3000'));