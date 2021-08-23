/*
    Realizado por: Juan Diego Gonzalez Gomez - 201911031
*/

const fs = require('fs');
const http = require('http');
const axios = require('axios');

// Servidor web usando el modulo http
server = http.createServer(async function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    var url = req.url;
    if(url.includes('proveedores')){
        await cargarProveedores()
        res.end(fs.readFileSync('./proveedores.html', 'utf8'));
    }
    else if(url.includes('clientes')){
        await cargarClientes()
        res.end(fs.readFileSync('./clientes.html', 'utf8'));
    }
    else{
        res.write('Por favor ingresar a alguna de estas URLs:<br>');
        res.write('<a href="http://localhost:8081/api/proveedores">http://localhost:8081/api/proveedores</a><br>');
        res.write('<a href="http://localhost:8081/api/clientes">http://localhost:8081/api/clientes</a><br>');
        res.end()
    }
  }).listen(8081);

// Metodo que carga la informacion de los proveedores en el archivo proveedores.html
async function cargarProveedores()
{
    // Se obtienen los proveedores de la pagina web usando el modulo axios
    const proveedoresJSON = await axios.get('https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json');

    // Se obtiene la informacion requerida de los proveedores
    const dataProveedores = proveedoresJSON.data.map(function (act) {
        return [act.idproveedor, act.nombrecompania, act.nombrecontacto];
    })

    escribirHTML("proveedores", dataProveedores);
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

    escribirHTML("clientes", dataClientes);
}

// Metodo que crea el archivo html segun el nombre que llega por parametro, y lo escribe
async function escribirHTML(nombre, data)
{
    // Se cargan las partes base del html
    const baseHtml = fs.readFileSync('./base.html', 'utf8');
    htmlParts = baseHtml.split("Replace");

    // Se escribe la primera parte del html
    let output = htmlParts[0] + nombre + htmlParts[1];

    // Se agregan las filas de la tabla (informacion de proveedores/clientes)
    data.forEach(act => {
        output += `<tr>\n<td>${act[0]}</td>\n<td>${act[1]}</td>\n<td>${act[2]}</td>\n</tr>\n`
    });

    // Se escribe la ultima parte del html
    output += htmlParts[2];

    fs.writeFileSync(nombre + ".html", output, 'utf8');
}
