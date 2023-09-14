const { app, BrowserWindow, ipcMain } = require('electron');
const appExp = require('express')();

require('dotenv').config();
const controller = require("./NodeJS/api/controller/controller")

//coneccion mongo
const db = require("./NodeJS/db");
const { json } = require('express');
db(process.env.mongoDB);

let win
//crea la ventana
const createWindow = () => {
    win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences:{
        contextIsolation: false,
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        enableRemoteModule: true
    },
    })    
  
  win.loadFile('./NodeJS/public/index.html')//carga el HTML
  
  // Escuchar un evento desde la ventana renderizada
  ipcMain.on("start", async (event, data) => {
    try{               
      const res = await controller.start();
      if(res){
        const sendData = JSON.parse(res)
        event.sender.send("refresh", sendData)
      }      
    }catch(err){
      console.log(err)
    }       
  })
  ipcMain.on("ingreso-caja", async (event, data) => {        
    const res = await controller.ingreso(data);
    event.sender.send("recarguemos");
 })
 ipcMain.on("load-caja-anterior", async (event, fecha) => {
  try{
    const res = await controller.findCajaAnterior(fecha);
    const sendRes = JSON.parse(res)
    event.sender.send("load-caja-anterior-res", sendRes)
  }catch(err){
    console.log(err)
  }
})
ipcMain.on("control-depositos", (event, data) => {        
  win.loadFile('./NodeJS/public/depositos-mensuales.html')//carga el HTML
})
ipcMain.on("control-mes-deposito", async (event, fecha) => {
  try{
    const res = await controller.findMes(fecha)
    const sendRes = JSON.parse(res)
    event.sender.send("control-mes-deposito-res", sendRes)
  }catch(err){
    console.log(err)
  }
})
ipcMain.on("volver-main", (event, data) => {        
  win.loadFile('./NodeJS/public/index.html')//carga el HTML
})
}
//espera que se carguen los procesos para abrir la ventana
  app.whenReady().then(() => {
    createWindow()
  })

  
//cierra los procesos cuando todas las ventanas se cerraron
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })