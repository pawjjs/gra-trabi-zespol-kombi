import express from 'express';
import firebaseApp , { firebaseConfig }  from './firebase.js';
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase-admin/auth';

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

app.post('/siema', async (req, res) => 
{
  if (!req.headers.authorization?.startsWith('Bearer ')) 
  {
    res.status(401).json({ error: "Brak tokenu" });
    return;
  }
  const token = req.headers.authorization.slice(7);

  // Bierzemy użytkownika z firebase po tokenie 
  // (https://firebase.google.com/docs/auth/admin/verify-id-tokens#verify_id_tokens_using_the_firebase_admin_sdk, 
  // https://firebase.google.com/docs/reference/admin/node/firebase-admin.auth.baseauth.md#baseauthverifyidtoken, 
  // https://firebase.google.com/docs/reference/admin/node/firebase-admin.auth.decodedidtoken.md)
  const user = await getAuth().verifyIdToken(token)
    .catch(() => null)

  if (!user) {
    res.status(401).json({ error: "Niepoprawny token" })
    return
  }
  res.json({ email: user.email })
})



app.post('/api/firebase/login', async (request, response) => 
{
  /*
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
  }*/
});













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