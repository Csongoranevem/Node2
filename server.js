const express = require('express')

const app = express()

let users = 
[
    {id: 1, name: 'Béla', age: '18', gender: 'male'},
    {id: 2, name: 'Lajos', age: '17', gender: 'male'},
    {id:3, name: 'Héra', age: '22', gender: 'female'}
]

//Endpointok
app.get('/', (req, res) => {
  res.send('Bajai SZC Türr István Technikum - 13.A szoft')
})

app.get('/users', (req, res) => {
    res.send(users)
  })
  
  app.get('/user1', (req, res) => {
    let user1 = users.find(u => u.id == 1)
    res.send("első: "+user1.name)
  })
  

app.listen(3000)

