console.log('Server Start... ');
const porta = 3000
const portaDB = 3001

//banco = bancoTeste
//usuario = Paulo
//Senha = 123456pc

//Iniciando o express
const express = require('express')
const app = express()

//Iniciando o body-parse
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

//Iniciando mongoDB
const MongoClient = require('mongodb').MongoClient 
//Transforma uma string em um id MongoDB
const ObjectId = require('mongodb').ObjectID

const uri = "mongodb+srv://Paulo:123456pc@bancoteste-vux9e.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(uri, (err, client) => {
  
    if (err) return console.log('\nPaulo@Server.JS >> Erro MongoDB(1): ' + err.name + '\n\tMensagem de erro: ' + err.errmsg)
    
    db = client.db('bancoteste')
    
    app.listen(portaDB, () => console.log("\nPaulo@Server.JS >> MongoDB Working at " + portaDB + ' ...') )

})

//Configurando o servidor na porta 3000
app.listen(porta, () => console.log('\nPaulo@Server.JS >> servidor rodando na porta ' + porta + '\n') )

//Configurando a view engine para usar html
app.set('view engine', 'ejs')

//Renderizar o index.ejs
app.get('/', (req, res) => res.render('index.ejs') );

app.get('/', (req, res) => {
    var cursor = db.collection('data').find()
})

app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', { data: results })

    })
})

app.get('/editar', (req, res) => {
    res.render('editar.ejs')
})

app.get('/editar', (req, res) => {
    res.render('deletar.ejs')
})

//Salvar os dados no banco
app.post('/show', (req, res) => {
    db.collection('data').save(req.body, (err, result) => {
        if (err) return console.log('\nPaulo@Server.JS >> Erro MongoDB(2): ' + err.name + '\n\tMensagem de erro: ' + err.errmsg)
        console.log('\nPaulo@Server.JS >> Salvo no banco de dados')
        
        db.collection('data').find().toArray((err, result) => {
            console.log(result)
        })
        console.log("\n###  Entrou .post linha 62   ###\n")
        
        res.redirect('/show')
    })
})

//gerenciando a rota /editar/:id e pegando o id da url
app.route('/editar/:id').get((req, res) =>{
    var id = req.params.id
    db.collection('data').find(ObjectId(id)).toArray((err, result)=>{
        if (err) return res.send(err)
        res.render('editar.ejs', { data: result })

    })
}).post((req, res) => {
    var id = req.params.id
    var name = req.body.name
    var surname = req.body.surname
    var cpf = req.body.cpf
    var celular = req.body.celular
    var idade = req.body.idade
    var peso = req.body.peso
    var exercicio = req.body.exercicio
    var genero = req.body.genero
    var msg = req.body.msg
    var email = req.body.email


    console.log("\n###  Entrou .post linha 85   ###\n")
    //atualizando o bd
    db.collection('data').updateOne({ _id: ObjectId(id)}, {
        $set: {
            id : id,
            name : name,
            surname : surname,
            cpf : cpf,
            celular : celular,
            idade : idade,
            peso : peso,
            exercicio : exercicio,
            genero : genero,
            msg : msg,
            email: email
        }
        
    },
    (err, result) => {
        if(err) return res.send(err)
        res.redirect('/show')
        console.log('Paulo@Server.js >> Dados atualizados com sucesso no banco dde dados')
    } )

})

app.route('/deletar/:id').get((req, res) => {
    var id = req.params.id

    db.collection('data').deleteOne({ _id: ObjectId(id) }, (err, result)=>{
        if (err) return res.send(500, err)
        console.log("Paulo@Server.js >> Item deletado")
        res.redirect('/show')
    })
})

