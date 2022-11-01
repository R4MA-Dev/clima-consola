import colors from "colors"
import * as dotenv from 'dotenv'
dotenv.config()


import { inquirerMenu, leerInput, pausa, listarLugares } from "./helpers/inquirer.js"
import Busquedas from "./models/busquedas.js";


const main = async()=>{
    console.clear()

    const busquedas = new Busquedas()
    let opt;

    do{
        opt = await inquirerMenu()
        
        switch(opt){
            case 1:
                //Mostrar Mensaje
                const seleccion = await leerInput("Ciudad: ");

                //Buscar Lugares
                const lugares = await busquedas.ciudad(seleccion)

                //Seleccionar el lugar y añadirlo al historial
                const lugar = await listarLugares(lugares)
                if(lugar === 0){
                    continue;
                }
                busquedas.agregarHistorial(lugar.nombre)

                //Clima
                const clima = await busquedas.climaLugar(lugar.lat, lugar.lng)

                //Mostrar resultados
                console.clear()
                console.log("\n Información de la ciudad \n".green)
                console.log(` ${"Ciudad:".yellow} ${lugar.nombre}`)
                console.log(` ${"Latitud:".yellow} ${lugar.lat}`)
                console.log(` ${"Longitud:".yellow} ${lugar.lng}`)
                console.log(` ${"Temperatura:".yellow} ${clima.temperatura} Cº`)
                console.log(` ${"Minima:".yellow} ${clima.minima} Cº`)
                console.log(` ${"Maxima:".yellow} ${clima.maxima} Cº`)
                console.log(` ${"Ambiente:".yellow} ${clima.ambiente}`)
                break;

            case 2:
                console.clear()
                console.log(" Su historial \n")
                if(busquedas.historial.length === 0){
                    console.log(" El historial esta vacio".yellow)
                }else{
                    busquedas.historial.forEach((lugar, indice) =>{
                        console.log(` ${indice + 1}. `.green + `${lugar}`)
                    })
                }
                break;
        }

        if(opt !== 0){
            await pausa()
        }else{
            console.clear()
        }

    }while(opt !== 0)
}

main()