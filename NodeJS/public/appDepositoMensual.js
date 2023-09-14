const { ipcRenderer } = require('electron');

document.querySelector("#fecha-anterior-año").value = new Date().getFullYear()

ipcRenderer.send("control-mes-deposito", crearFecha())
ipcRenderer.on("control-mes-deposito-res", (event, res) => ingresarDatos(res))



function ingresarDatos(dataMes) {
    console.log(dataMes)
    let table =  document.querySelector(".table");
    document.querySelector(".load").innerHTML = " ";      
    table.innerHTML = `<table class="table table-hover">
    <thead>
        <tr>
            <th scope="col">CHEQUE
                <tr>
                    <tbody class="tableCheque">
                        <td scope="col">FECHA</th>
                        <td scope="col">CLIENTE</th>
                        <td scope="col">MONTO</th>
                    </tbody>
                </tr>
            </th>
            <th scope="col">ICBC
                <tr>
                    <tbody class="tableICBC">
                        <td scope="col">FECHA</th>
                        <td scope="col">CLIENTE</th>
                        <td scope="col">MONTO</th>
                    </tbody>
                </tr>
            </th>
            <th scope="col">SANTANDER
                <tr>
                    <tbody class="tableSantander">
                        <td scope="col">FECHA</th>
                        <td scope="col">CLIENTE</th>
                        <td scope="col">MONTO</th>
                    </tbody>
                </tr>
            </th>
            <th scope="col">MERCADOPAGO
                <tr>
                    <tbody class="tableMercadoPago">
                        <td scope="col">FECHA</th>
                        <td scope="col">CLIENTE</th>
                        <td scope="col">MONTO</th>
                    </tbody>
                </tr>
            </th>
            <th scope="col">Transferencias Minorista
                <tr>
                    <tbody class="tableMinorista">
                        <td scope="col">MONTO</th>
                    </tbody>
                </tr>
            </th>
        </tr>
    </thead>        
    </table>`
    dataMes.forEach(data => {
        if(data.depositos_mercadopago){
            data.depositos_mercadopago.forEach( e => {
                document.querySelector(".tableMercadoPago").innerHTML += `
                <tr><td>${data.fecha}</td><td>cliente: ${e.cliente} <td> monto: <b>${e.monto}</b></td><tr>
                `;
            })
        }
    
        if(data.cheques.length > 0){            
            data.cheques.forEach( e => {
                document.querySelector(".tableCheque").innerHTML += `
                <tr><td>${data.fecha}</td><td>cliente: ${e.cliente} <td> monto: <b>${e.monto}</b></td><tr>
                `;
            })            
        }
        if(data.transferencias_ICBC.length > 0){

            data.transferencias_ICBC.forEach( e => {
                document.querySelector(".tableICBC").innerHTML += `
                <tr><td>${data.fecha}</td><td>cliente: ${e.cliente} <td> monto: <b>${e.monto}</b></td><tr>
                `;
            })            
        }
        if(data.transferencias_Santander != null){
            data.transferencias_Santander.forEach( e => {
                document.querySelector(".tableSantander").innerHTML += `
                <tr><td>${data.fecha}</td><td>cliente: ${e.cliente}</td><td> monto: <b>${e.monto}</b></td><tr>
                `;
            })  
        }
        if(data.transferencias_minorista != null){
            data.transferencias_minorista.forEach( e => {
                document.querySelector(".tableMinorista").innerHTML += `
                <tr><td>${data.fecha}</td><td>transferencia: ${e}</b></td><tr>
                `;
            })  
        }
 })
}


function crearFecha() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;        
    const fecha = dd + '/' + mm + '/' + yyyy;
    return fecha;
}

//CONSULTA DEPOSITOS ANTERIORES
//BUSCAR CAJAS ANTERIORES
document.querySelector(".allBody").addEventListener("click", (event) => {
    const mouse = event.target;
    if(mouse.classList.contains("boton-caja-anterior")){
        
        let mes = document.querySelector("#fecha-anterior-mes").value
        const anio = document.querySelector("#fecha-anterior-año").value
        
        if(mes.length == 1){
            mes = "0" + mes
        }

        const fecha = "null" + "/" + mes + "/" + anio
        
        console.log(fecha)

        if(mes && anio){
                        
            alert("BUSCANDO MES ANTERIOR") 
            ipcRenderer.send("control-mes-deposito", fecha)
        }else{
            alert("FALTA INGRESAR UN DATO")
        }
    }
})

document.querySelector(".boton-volver").addEventListener("click", () => {
    ipcRenderer.send("volver-main")
})

