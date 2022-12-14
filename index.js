import colors from "colors"
import * as dotenv from 'dotenv'
dotenv.config()


import { inquirerMenu, leerInput, pausa, listarLugares, listarHistorial } from "./helpers/inquirer.js"
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
                busquedas.mostrarResultados(lugar, clima)

                break;

            case 2:
                console.clear()
                console.log(" Su historial \n")
                if(busquedas.historial.length === 0){
                    console.log(" El historial esta vacio".yellow)
                }else{
                    //Mostrar y seleccionar un lugar del historial
                    const lugarH = await listarHistorial(busquedas.historial)
                    if(lugarH === 0){
                        continue;
                    }else{
                        //Buscar el lugar seleccionado con la API
                        const lugarHEncontrado = await busquedas.ciudad(lugarH)

                        //Filtrar entre todos los lugares el que coincida con el del historial y tomar los datos
                        const lugarHFiltrado = lugarHEncontrado.find(lugar => lugar.nombre === lugarH)

                        //Tomar los datos del lugar filtrado para darselos a la API del clima
                        const lugarHClima = await busquedas.climaLugar(lugarHFiltrado.lat, lugarHFiltrado.lng)

                        //Mostrar Resultados
                        busquedas.mostrarResultados(lugarHFiltrado, lugarHClima)
                    }
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