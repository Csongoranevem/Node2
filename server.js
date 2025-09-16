const express = require('express')

const app = express()

const fs = require('fs')
const path = require('path')
var cors = require('cors')
const e = require('cors')


app.use(cors())
app.use(express.json()) // json formátum megkövetelése
app.use(express.urlencoded({extended: true})) // req body-n keresztül adatátmenet

let users = []
const USERS_FILE = path.join(__dirname, 'users.json')



//Endpointok


//--------------------------------- U S E R E K --------------------------------------
app.get('/', (_req, res) => {
  res.send('Bajai SZC Türr István Technikum - 13.A szoft')
})

app.get('/users', (_req, res) => {
    res.send(users)
  })
  
  app.get('/user1', (_req, res) => {
    let user1 = users.find(u => u.id == 1)
    res.send(user1.name)
  })
  
  app.post('/users/registration', (req, res) => {
    let data   = req.body
    data.id = getNextId()
    if (EmailExists(data.email)) {
      return res.status(400).send({msg: 'Létező fiók'})
    }

    users.push(data)

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

  app.post('/users/login', (req, res) => {
    let {email, password} = req.body
    let loggedUser = {}
    users.forEach(user => {
      if (user.email == email && user.password == password) {
        loggedUser = user
        return
      }
    })
    res.send(loggedUser)
  })

app.patch('/users/:id', (req, res) => {
  let id = req.params.id
  let data = req.body

  let idx = users.findIndex(user => user.id == id)
  if (idx > -1) {
    users[idx] = { ...users[idx], ...data, id: Number(id) }
    saveUser()
    return res.send(users[idx])
  }
  return res.status(400).send('Nincs ilyen adat')
})

app.post('/users/registration', (req, res) => {
  let data   = req.body
  if (EmailExists(data.email)) {
    return res.status(400).send({msg: 'Létező e-mail cím'})
  }

  return res.status(200)
})



//---------------------------- LÉPÉSEK KEZELÉSE --------------------------------
let stepData = [{steps: 200}]
const STEPCOUNT_FILE = path.join(__dirname, 'stepdata.json')


//POST new steps by user

//GET one step by ID
app.get('/stepdataGETall', (req, res) => {
  let response = stepData.filter(id => id.userID == req.body.userID)
  saveStepData()

  res.send(response)
})
//GET new stepData
app.post('/stepdataAdd', (req, res) => {
  let data = req.body
  data.id = getNextIdStepdata()
  stepData.push(data)
  saveStepData()

  res.send(stepData)
})
//PATCH step by ID
app.patch('/stepdataUpdate/:id', (req, res) => {
  let id = req.params.id
  let data = req.body
  let idx = stepData.findIndex(step => step.id == id)
  if (idx > -1) {
    stepData[idx] = { ...stepData[idx], ...data, id: Number(id) 
  }
    saveStepData()
    }
})

//GET all steps by userID
app.get('/stepdataFill/:uid', (req, res)=> {
  let userId = req.params.uid;
  let idx = users.findIndex(user => user.id == userId);

  if (idx == -1){
      res.status(400).send({msg: 'Nincs ilyen felhasználó!'});
      return
  }

  res.send(stepData.filter(step => step.userID == userId));
})

//DELETE step by ID

app.delete('/stepdataDelete/:id', (req, res) => {
  let id = req.params.id
  let idx = stepData.findIndex(step => step.id == id)
  if (idx > -1) {
    stepData.splice(idx, 1)
    saveStepData()
    return res.send('Törölve')
  }
})


//DELETE all steps by userID
app.delete('/stepdataDeleteAll/:id', (req, res) => {
  let userID = req.params.id
  let idx = stepData.findIndex(step => step.userID == userID)
  if (idx > -1) {
    stepData = stepData.filter(step => step.userID != userID)
    saveStepData()
    return res.send('Törölve az összes adat')
  }
})



app.listen(3000)




function getNextId() {

  let maxIndex = 0
  let nexID = 1

  if (users.length == 0) {
    return nexID
  }
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
      
      users = JSON.parse(raw)
    } catch (err) {
      console.log('Hiba az adatok beolvasásában', err);
      users = []
    }
  }
  else{
    saveUser()
  }
}

function loadSteps() {
  if (fs.existsSync(STEPCOUNT_FILE)) {
    const raw = fs.readFileSync(STEPCOUNT_FILE)
    try {
      
      stepData = JSON.parse(raw)
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

function saveStepData() {
  fs.writeFileSync(STEPCOUNT_FILE, JSON.stringify(stepData))
}


function EmailExists(email) {
  return users.some(user => user.email === email)
}

function getNextIdStepdata() {

  let maxIndex = 0
  let nexID = 1

  if (stepData.length == 0) {
    return nexID
  }
    for (let i = 0; i < stepData.length; i++) {
        if (stepData[i].id > stepData[maxIndex].id) {
          maxIndex = i
          nextID = stepData[maxIndex].id
        }
      }


      return stepData[maxIndex].id + 1
    }

function getUserID(){

}

loadUsers()
loadSteps()