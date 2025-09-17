const express = require('express')
const router = express.Router()

const { users, saveUser, getNextId, EmailExists } = require('../utils/store')


router.get('/', (_req, res) => {
    res.send(users)
})

router.get('/user1', (_req, res) => {
    let user1 = users.find(u => u.id == 1)
    res.send(user1.name)
})

router.post('/registration', (req, res) => {
    let data   = req.body
    data.id = getNextId()
    if (EmailExists(data.email)) {
    return res.status(400).send({msg: 'Létező fiók'})
    }

    users.push(data)

    res.send(users)
    saveUser()


})

router.delete('/:id', (req, res) => {
    let id = req.params.id
    let idx = users.findIndex(user => user.id == id)
    if (idx > -1) {
    users.splice(idx, 1)
    saveUser()
    return res.send('Törölve')
    }
    return res.send('Nincs ilyen adat')

    
})

router.patch('/users/:id', (req, res) => {
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

router.post('/login', (req, res) => {
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

router.patch('/:id', (req, res) => {
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

router.post('/registration', (req, res) => {
let data   = req.body
if (EmailExists(data.email)) {
    return res.status(400).send({msg: 'Létező e-mail cím'})
}

return res.status(200)
})
  
module.exports = router 
  
  