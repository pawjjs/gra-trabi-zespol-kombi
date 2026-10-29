import { storeToRefs } from "pinia";
import { useFirebase } from "../store/firebase.js";
import {until} from '@vueuse/core';

export const BASE_URL = 'http://localhost:'+import.meta.env.VITE_NODE_PORT || 'http://localhost:3000'

export const useApiRequest = async (method, path, data) => 
{
  //const url = `${BASE_URL}${path}`;
  /**
   *Access to fetch at 'http://localhost:3000/api/siema' from origin 'http://localhost:5173' has been blocked by CORS policy: 
   *Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
   */
  const store = useFirebase();
  const { user,isAuthReady } = storeToRefs(store);
  await until(isAuthReady).toBe(true);

  return fetch(path, 
  {
    method,
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': 'application/json',

      // Dodajemy również token gdy użytkownik jest zalogowany
      ...(user.value && { 'Authorization':  `Bearer ${await user.value.getIdToken()}` })
    }
  })
  .then(response => response.json())
}