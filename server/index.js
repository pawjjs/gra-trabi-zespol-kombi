import express from 'express';
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import { WebSocketServer } from 'ws';
import http from 'node:http';
import { readFileSync } from "node:fs";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from 'firebase-admin/auth';

import { firebaseConfig }  from './firebase.js';
import { useRegisterFirebaseUser } from './hooks/useRegisterFirebaseUser.js';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({server:server});

// <Middleware>:
app.use(express.json());//Ability thats gives POST data as JSON's. Parsing request body in JSON format:

const spec = YAML.parse(
  readFileSync(new URL("./openapi.yaml", import.meta.url), "utf8")
);
app.use("/machines-api-docs", swaggerUi.serve, swaggerUi.setup(spec));//API Documentation

// <WebSockets>:
wss.on("connection", (client) => {
	client.send("Hello World")
	client.on("message",(n)=>{
		console.log(n);
		client.send(n); //send you n back :P
	})
})

// <EndPoints>:
app.get('/api/firebase-config', (request, response) => 
{
  if(!firebaseConfig){
    response.status(404).json({ error: "Cannot reach firebase configuration" })
  }
  else{
    response.status(200).json(firebaseConfig);
  }
});

//Server side - claimtoken
app.post('/api/firebase-claim-token', async (request, response) => 
{
  if (!request.headers.authorization?.startsWith('Bearer ')) 
  {
    response.status(401).json({ error: "Missing Auth Token" });
    console.log("Missing Auth Token");
    return ;
  }
  const token = request.headers.authorization.slice(7);
  //console.log(request.body);  x:8

  const firebaseApp = initializeApp(firebaseConfig);
  const user = await getAuth().verifyIdToken(token).catch(() => null);
  if (!user) 
  {
    response.status(401).json({ error: "Invalid Token in header" })
    return
  }
  response.json({ email: user.email })
})

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

//app.use((req, res, next) => {
//  console.log("Not Found : 404")
//  res.status(404);
//});
////////////////////////////////////////////////////////////////////////////////////////////////////
server.listen(process.env.NODE_PORT, () => console.log('API: http://localhost:'+process.env.NODE_PORT));


// <Notes/OtherStuff>:

/**
import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
initializeApp( ... )

app.post('/siema', async (req, res) => {
  if (!req.headers.authorization?.startsWith('Bearer ')) {
    res.status(401).json({ error: "Brak tokenu" })
    return
  }

  const token = req.headers.authorization.slice(7)

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
 * 
 */



//Serwowanie statycznych plików:
//app.use(express.static('public'));

/*app.use((err, req, res, next) => 
{
  res.status(500).json({
    message: err.message
  });
});*/
