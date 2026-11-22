import { storeToRefs } from "pinia";
import { useFirebase } from "../store/firebase.js";
import {until} from '@vueuse/core';

export const BASE_URL = 'http://localhost:'+import.meta.env.VITE_NODE_PORT || 'http://localhost:3000';

export const useApiRequest = async (method, path, data) => 
{
  const store = useFirebase();
  const { user,isAuthReady } = storeToRefs(store);
  await until(isAuthReady).toBe(true);

  return fetch(path, {
    method,
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': 'application/json',
      //Add token when user is logged
      ...(user.value && { 'Authorization':  `Bearer ${await user.value.getIdToken()}` })
    }
  }).then(response => response.json())
}