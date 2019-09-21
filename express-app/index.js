const express = require('express')
const {connectDb, Application} = require('./mongo')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express();
const port = process.env.PORT || 4000;
const router = express.Router();

app.use(bodyParser.json())

router.post('/applications', async (req,res) => {
  console.log(req.body)
  
  const {
    text,
    success,
    drug,
    indication,
    ethicCommittee,
    hrecDate,
    apsDate,
  } = req.body
  const application = await Application.create({
    text,
    success,
    drug,
    indication,
    ethicCommittee,
    hrecDate,
    apsDate,
  }).catch(error => {res.status(500).send(error)})
  res.status(200).send(application)
})

router.get('/applications', async (req,res) => {
  const applications = await Application.find()
  res.send(applications)
})

router.get('/applications/:id', async (req,res) => {
  const application = await Application.findOne({_id: req.params.id})
  if (application){
    res.status(200).send(application)
  } else {
    res.sendStatus(404)
  }
})

router.get('/', async (req, res) => {
  res.send('This is the home page')
})

app.use(router)

connectDb().then( async () => {
  app.listen(port, () =>
    console.log(`Listening on port ${port}!`),
  );
});

