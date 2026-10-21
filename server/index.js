import express, { request, response } from 'express';
import { firebaseConfig }  from './firebase.js';
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

import { useRegisterFirebaseUser } from './hooks/useRegisterFirebaseUser.js';
import { useLoginFirebaseUser } from './hooks/useLoginFirebaseUser.js';

const app = express();
app.use(express.json());//Middleware ability thats gives POST data as JSON's
//Parsowanie ciała żądania w formacie JSON:

//Serwowanie statycznych plików:
//app.use(express.static('public'));

/*app.use((err, req, res, next) => 
{
  res.status(500).json({
    message: err.message
  });
});*/

app.get('/api/firebase-config', (request, response) => 
{
    response.json(firebaseConfig);
});


app.post('/api/firebase/register', async (request, response) => 
{
  const name = request.body.form_nick;
  const email = request.body.form_email;
  const password = request.body.form_password;
  try
  {
    await useRegisterFirebaseUser(name,email,password); 
    response.status(201).json({ ok: true });
  }
  catch(err)
  {
    return response.status(500).json({
      message: typeof err === 'string' ? err : err?.message || 'Something went wrong',
    });
  }
});

app.post('/api/firebase/login', async (request, response) => {
  const email = request.body.form_email;
  const password = request.body.form_password;
  try 
  {
    await useLoginFirebaseUser(email,password);
    response.status(200).json({ ok: true });
  } 
  catch (err) 
  {
    return response.status(500).json({
      message: typeof err === 'string' ? err : err?.message || 'Something went wrong',
    });
  }
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