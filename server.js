const express = require('express');
const server = express();

const db = require('./db');

//configurar arquivos estáticos (css, js, imagens)
server.use(express.static('public'));

//habilitar uso do req.body
server.use(express.urlencoded({extended: true}));

//configurações do nujucks
const nunjucks = require('nunjucks');
nunjucks.configure('views', {
    express: server,
    noCache: true
});

//server.get('/', function(req, res){
//    return res.sendFile(__dirname + '/index.html');
//});

server.get('/', function (req, res) {

    db.all(`SELECT * FROM ideas`, function (err, rows) {
        if (err){
            return res.send('erro no banco de dados');
        }

        const reverseIdeas = [...rows].reverse();

        let lastIdeas = [];

        for (let idea of reverseIdeas) {
            if (lastIdeas.length < 3) {
                lastIdeas.push(idea);
            }
        }

        return res.render('index.html', { ideas: lastIdeas });


        console.log(rows);
    });


});

server.get('/ideias', function (req, res) {

    db.all(`SELECT * FROM ideas`, function (err, rows) {
        if (err){
            return res.send('erro no banco de dados');
        }

        const reverseIdeas = [...rows].reverse();
    
        return res.render('ideias.html', { ideas: reverseIdeas });
        
    });

});

server.post('/', function(req, res){
    const query = `INSERT INTO ideas(
        image,
        title,
        category,
        description,
        link
    )  VALUES(?, ?, ?, ?, ?);`
    
    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link
    ];

    db.run(query, values, function(err){
        if (err){
            return res.send('erro no banco de dados');
        }
    });

    return res.redirect('/ideias');
});

server.listen(3000);



