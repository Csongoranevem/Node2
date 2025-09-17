const express = require('express')
const router = express.Router()

const { stepData, saveStepData, getNextIdStepdata, users } = require('../utils/store')

//GET one step by ID
router.get('/GETall', (req, res) => {
  let response = stepData.filter(id => id.userID == req.body.userID)
  saveStepData()
  response.sort((a, b) => b.date - a.date)

  res.send(response)
})
//GET new stepData
router.post('/stepdataAdd', (req, res) => {
  let data = req.body
  data.id = getNextIdStepdata()
  stepData.push(data)
  saveStepData()

  res.send(stepData)
})
//PATCH step by ID
router.patch('/Update/:id', (req, res) => {
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
router.get('/Fill/:uid', (req, res)=> {
  let userId = req.params.uid;
  let idx = users.findIndex(user => user.id == userId);

  if (idx == -1){
      res.status(400).send({msg: 'Nincs ilyen felhasználó!'});
      return
  }

  res.send(stepData.filter(step => step.userID == userId));
})

//DELETE step by ID

router.delete('/Delete/:id', (req, res) => {
  let id = req.params.id
  let idx = stepData.findIndex(step => step.id == id)
  if (idx > -1) {
    stepData.splice(idx, 1)
    saveStepData()
    return res.send('Törölve')
  }
})


//DELETE all steps by userID
router.delete('/DeleteAll/:id', (req, res) => {
  let userID = req.params.id
  let idx = stepData.findIndex(step => step.userID == userID)
  if (idx > -1) {
    stepData = stepData.filter(step => step.userID != userID)
    saveStepData()
    return res.send('Törölve az összes adat')
  }
})


router.get('/steps/chartdata/:id', (_req, res) => {
  let userID = _req.params.id
  let userSteps = stepData.filter(step => step.userID == userID)
  let chartData = {}
  userSteps.forEach(step => {
    let date = new Date(step.date)
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    let key = `${year}-${month < 10 ? '0' + month : month}`
    if (!chartData[key]) {
      chartData[key] = 0
    }
    chartData[key] += step.steps
  })
  res.send(chartData)
})


module.exports = router