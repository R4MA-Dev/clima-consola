import axios from "axios";
import fs from "node:fs"

class Busquedas {
    historial = [];

    constructor(){
        this.leerDB()
    }

    get paramsMapbox(){
        return{
            'access_token' : process.env.MAPBOX_KEY,
            'limit' : 5,
            'language' : 'es'
        }
    }

    get paramsOpenWeather(){
        return{
            'appid' : process.env.OPENW_KEY,
            'lang' : 'es',
            'units' : 'metric'
        }
    }

    async ciudad(lugar = ""){
        //Peticion HTTP
        try {
            const instance = axios.create({
                baseURL : `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params : this.paramsMapbox
            })

            const resp = await instance.get()
            const data = await resp.data

            return data.features.map(lugar =>({
                id : lugar.id,
                nombre : lugar.place_name_es,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }))

        } catch (error) {
            throw error
        }
    }

    async climaLugar(lat, lon){
        try {
            const instance = axios.create({
                baseURL : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
                params : this.paramsOpenWeather
            })

            const resp = await instance.get()
            const data = await resp.data

            return {
                temperatura : data.main.temp,
                minima : data.main.temp_min,
                maxima : data.main.temp_max,
                ambiente : data.weather[0].description
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    agregarHistorial(lugar = ""){

        if(this.historial.includes(lugar)){
            return;
        }
        this.historial = this.historial.splice(0,5)

        this.historial.unshift(lugar)

        this.guardarDB()
    }

    guardarDB(){
        fs.mkdirSync("./db",{recursive: true})
        fs.writeFileSync(`./db/history.json`, JSON.stringify(this.historial))
    }

    leerDB(){
        if(!fs.existsSync("./db/history.json")){
            return null;
        }else{
            const info = fs.readFileSync("./db/history.json", { encoding : "utf-8" })
            const data = JSON.parse(info)
    
            this.historial = [...data]
        }
    }
}


export default Busquedas