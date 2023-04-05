
const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())

//Ejemplo uso de middleware morgan:
//morgan.token('ruta', function(req, res) {
  //return req.hostname;
  //return req.path
//});

//Usaremos morgan en la peticion Post tal y como pide el ejercicio:
app.use(morgan(':method :ruta :status :res[content-length] - :response-time ms :data'))


let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      },
      {
        "name": "manolo",
        "number": "333",
        "id": 13
      }
]


app.get('/', (req, res) => {   
   res.end('index-phonebook ')    
})

app.get('/api/persons', (req, res)=>{
  //res.send(persons)

   //Si queremos la salida tal y como pone en el tutorial:
    let str ="[<br>" 
    for   (let i=0; i<persons.length; i++){
        let keys = Object.keys(persons[i])
        let values = Object.values(persons[i])
           str += ' - {<br>'
           for(let j=0; j<keys.length; j++){
                if(keys[j]==="id"){
                    str+= ` ${keys[j]}: ${values[j]} ,<br>`           
                }else{
                    str+= ` ${keys[j]}: "${values[j]}" ,<br>`           
                }           
           } 
           str+='},<br>'
    } 
    res.send(str)    
})

app.get('/info', (request, response) => {  
 
  const info = `Phonebook has info for ${persons.length} people`
  const date = new Date()    
  response.send(`<p>${info}</p><p>${date}}</p>`)
})


app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person=>person.id===id)
  if(person){
    response.json(person)    
  }else{
    response.status(204).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)
    const personas = persons.filter(person=>person.id!==id)
    if(personas){
      response.json(personas)
    }else{
      response.status(204).end()
    }
})


//Generate a new id for the phonebook entry with the Math.random function. 
//Use a big enough range for your random values so that the likelihood of creating duplicate ids is small.
const getId = () => Math.floor(Math.random()*5000)


const checkName =(name) =>{
  return persons.find(person=>person.name ===name)
}

const morganLogger = () =>{
  //Ver si se puede hacer con parametros en una unica funcion. 
  morgan.token('ruta', function(req, res) {
    //return req.hostname;
    return req.path
  });
  morgan.token('data', (req, res)=>{
    return JSON.stringify(req.body)
  })
}


app.post('/api/persons',(request,response)=>{ 

  const body = request.body
  console.log(body)
  const name = body.name  
  if(!body.name || !body.number){
    response.status(400).json({ error: 'name or number missing' })
  }
  else if (checkName(name)){
    response.status(400).json({ error: 'name must be unique '})
  }
  else{
    let person ={
      name:body.name,
      number:body.number,
      id:getId()
    }
    persons = persons.concat(person)
    //persons.push(person)
    //console.log(persons)
    response.send(persons) 
    //Tambien imprimimos lo que piden en el ejercicio. No se si estara mal pero sale la solucion correcta.
    morganLogger()
  }
})


const PORT = 3001
app.listen(PORT,()=>{
    console.log(`listening at port ${PORT}`)
})