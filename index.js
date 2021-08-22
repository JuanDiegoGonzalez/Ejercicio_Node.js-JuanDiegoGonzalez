/*
    Realizado por: Juan Diego Gonzalez Gomez - 201911031
*/

const fs = require('fs');
const http = require('http');
const axios = require('axios');

// Metodo que crea el archivo html segun el nombre que llega por parametro, y lo escribe
async function escribirHTML(nombre, data)
{
    // Se crea y escribe el archivo html usando el modulo fs
    let output = ""
    data.forEach(act => {
        output += act.toString() + "<br>";
    });
    fs.writeFileSync(nombre, output, 'utf8');
}

// Metodo que carga la informacion de los proveedores en el archivo proveedores.html
async function cargarProveedores()
{
    // Se obtienen los proveedores de la pagina web usando el modulo axios
    const proveedoresJSON = await axios.get('https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json');

    // Se obtiene la informacion requerida de los proveedores
    const dataProveedores = proveedoresJSON.data.map(function (act) {
        return [act.idproveedor, act.nombrecompania, act.nombrecontacto];
    })

    escribirHTML("proveedores.html", dataProveedores);
}

// Metodo que carga la informacion de los clientes en el archivo clientes.html
async function cargarClientes()
{
    // Se obtienen los clientes de la pagina web usando el modulo axios
    const clientesJSON = await axios.get('https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json');

    // Se obtiene la información requerida de los clientes
    const dataClientes = clientesJSON.data.map(function (act) {
        return [act.idCliente, act.NombreCompania, act.NombreContacto];
    })

    escribirHTML("clientes.html", dataClientes);
}

// Servidor web usando el modulo http
server = http.createServer(async function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    var url = req.url;
    if(url.includes('proveedores')){
        await cargarProveedores()
        res.end(fs.readFileSync('./proveedores.html', 'utf8', function (err, html) {
            response.end(html); 
        }));
    }
    else if(url.includes('clientes')){
        await cargarClientes()
        res.end(fs.readFileSync('./clientes.html', 'utf8', function (err, html) {
            response.end(html); 
        }));
    }
    else{
        res.write('Por favor ingresar a alguna de estas URLs:<br>');
        res.write('<a href="http://localhost:8081/api/proveedores">http://localhost:8081/api/proveedores</a><br>');
        res.write('<a href="http://localhost:8081/api/clientes">http://localhost:8081/api/clientes</a><br>');
        res.end()
    }
  }).listen(8081);
