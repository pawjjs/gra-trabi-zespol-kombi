import express from 'express';

const app = express();
const PLAYER_COLOR = '#1dfa00';

//app.get('/', (req, res) => 
//{
//    res.json({ message: 'Siema siema' });
//});

app.get('/api/hello', (req, res) => 
{
    res.json({ message: 'Siema siema' });
});
app.get('/api/goodbye', (req, res) => 
{
    res.json({ message: 'Goodbye World' })
});
app.get('/api/game', (req, res) => 
{
    res.json({ message: 'Spadłeś', playerColor: PLAYER_COLOR });
});

app.listen(3000, () => console.log('API: http://localhost:3000'));