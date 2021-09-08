// load the things we need
var express = require('express');
var app = express();
var tiempo=0;
var datos=[];
// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use( express.json());
// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
    var mascots = [
        { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012},
        { name: 'Tux', organization: "Linux", birth_year: 1996},
        { name: 'Moby Dock', organization: "Docker", birth_year: 2013}
    ];
    var tagline = "No programming concept is complete without a cute animal mascot.";

    res.render('pages/index', {
        mascots: mascots,
        tagline: tagline
    });
});

app.get('/formulario', (req, res) => {
    res.render('pages/formulario');
});

app.post('/accion', (req, res) => {
    const accion=req.body.accion;
    const numero=parseFloat(req.body.numero);
    console.log(`Accion ${accion} Numero: ${numero}`);
    datos.push({accion,numero,fecha: new Date()});
    console.log(datos);
    res.render('pages/accion', 
    {
        log: JSON.stringify(req.body)
    });
}); 
app.post('/api', (req, res) => {
    console.log(req.body);
    res.render('pages/accion', 
    {
        log: JSON.stringify(req.body)
    });
});
// about page
app.get('/about', (req, res) => {
    res.render('pages/about');
});

app.listen(8080, ()=>
 {
      console.log('8080 is the magic port')
      setInterval(incrementaTiempo, 1000);
 });

function incrementaTiempo()
{
    tiempo++;
    //console.log("Tiempo pasado: "+tiempo);
    
}