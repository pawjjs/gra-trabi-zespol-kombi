export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const useApiRequest = async (method, path, data) => 
{
  const url = `${BASE_URL}${path}`
  const { user } = storeToRefs(useFirebase())

  return fetch(url, 
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