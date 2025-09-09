const express = require('express')

const app = express()

const fs = require('fs')
const path = require('path')
var cors = require('cors')


app.use(cors())
app.use(express.json()) // json formátum megkövetelése
app.use(express.urlencoded({extended: true})) // req body-n keresztül adatátmenet

let users = [
    {name: "Jonatan", 
    email: "turr@turr.hu", 
    password: "12234"}
]
const USERS_FILE = path.join(__dirname, 'users.json')

//Endpointok
app.get('/', (req, res) => {
  res.send('Bajai SZC Türr István Technikum - 13.A szoft')
})

app.get('/users', (req, res) => {
    res.send(users)
  })
  
  app.get('/user1', (req, res) => {
    let user1 = users.find(u => u.id == 1)
    res.send(user1.name)
  })
  
  app.post('/users', (req, res) => {
    let data   = req.body
    data.id = getNextId()
    users.push(data)
    if (EmailExists(data.email)) {
      return res.status(400).send({msg: 'Létező fiók'})
    }
    res.send(users)
    saveUser()
  })

  app.delete('/users/:id', (req, res) => {
    let id = req.params.id
    let idx = users.findIndex(user => user.id == id)
    if (idx > -1) {
      users.splice(idx, 1)
      saveUser()
      return res.send('Törölve')
    }
    return res.send('Nincs ilyen adat')

    
  })

  app.patch('/users/:id', (req, res) => {
    let id = req.params.id
    let data   = req.body
    let idx = users.findIndex(user => user.id == id)
    if (idx > -1) {
      users[idx] = data
      users[idx].id = Number(id)
      saveUser()
      return res.send('Módosítva')
    }
    return res.send('Nincs ilyen adat')


  })

//res.status(200).send(body)

//loadUsers()
app.listen(3000)




function getNextId() {
  let maxIndex = 0
  let nexID = 1
    for (let i = 0; i < users.length; i++) {
        if (users[i].id > users[maxIndex].id) {
          maxIndex = i
          nextID = users[maxIndex].id
        }
      }

      return users[maxIndex].id + 1
    }


function loadUsers() {
  if (fs.existsSync(USERS_FILE)) {
    const raw = fs.readFileSync(USERS_FILE)
    try {
      users.JSON.parse(raw)
    } catch (err) {
      console.log('Hiba az adatok beolvasásában', err);
      users = []
    }
  }
  else{
    saveUser()
  }
}

function saveUser() {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users))
}


function EmailExists(email) {
  let exists = false
  users.forEach(user => {
    if (user.email == email) {
      exists = true
      return
    }
  })
}