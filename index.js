// load the things we need
var express = require('express');
require('dotenv').config();
var app = express();

const port = process.env['PORT'] || 3000

var tiempo=0;
var datos=[];
const ids=new Map();
const valor= new Map();

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use( express.json());
// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
   
    res.render('pages/formulario',
    {
        id: req.query.id || "",
        log: ""
    });
});

app.post('/accion', (req, res) => {
    const accion=req.body.accion;
    const numero=parseFloat(req.body.numero);
    const id=req.body.id;
//    console.log(`Accion ${accion} Numero: ${numero}`);
    ids.set(id,new Date());
    var valorLocal= valor.get(id);
    if ( isNaN(valorLocal))
    {
        console.log("No existia valor local para este id");
        valorLocal=0;
    }
//    console.log("Valor local: "+valorLocal);
    datos.push({id, accion, numero, fecha: new Date()});
    switch (accion)
    {
        case "+":
            valorLocal+=numero;
            break;
        case "-":
             valorLocal-=numero;
             break;    
        case "*":
             valorLocal=valorLocal* numero;
             break;    
        case "/":
            if (numero==0)
            {
                res.render('pages/divide0'); 
                return;
            }   
            valorLocal=valorLocal  / numero;
            break;
        case "R":
            limpiar(id);
            res.render('pages/formulario',
            {
                id,
                log: "Reseteados valores para id: "+id
            });
            return;
    }
    valor.set(id,valorLocal);
    var resultado=valorLocal;
    let log="";

    //console.log( "Longitud datos: "+datos.length)
    for (v in datos)
    {
//        console.log("log es "+log);
//        console.log(v);
        if (datos[v].id==id)
            log +=  " "+datos[v].accion+ " "+ datos[v].numero;
    }
//    console.log("... log es "+log);
//    console.log(datos);
    res.render('pages/accion', 
    { 
        operacion: {id,accion,numero},
        log,
        resultado        
    });
}); 

// about page
app.get('/about', (req, res) => {
    res.render('pages/about');
});

app.listen(port, ()=>
 {
      console.log(`${port} is the magic port`)
      setInterval(incrementaTiempo,1000);
 });

function incrementaTiempo()
{
    tiempo++;
    //console.log("Hay "+ids.size+" ids");
    var fechaActual=new Date().getTime() - ( 1000 * 60);
    const iter=ids.keys();
    while (id= iter.next().value)
    {
        var yy=new Date();
        yy.getTime();
        var fecha=ids.get(id);
        if (fecha.getTime() < fechaActual)
        {
            console.log("A borrar: "+id);
            limpiar(id);
        }
        
    }
    //console.log("Tiempo pasado: "+tiempo);
    
}

function limpiar(id)
{
 console.log("Borrando id"+id);
 ids.delete(id);
 var b =valor.delete(id);
 datos = datos.filter( v => {
     //console.log(`v.id: ${v.id} id: ${id}`)
     v.id!=id
 } )
}