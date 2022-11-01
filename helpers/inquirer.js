import inquirer from 'inquirer';
import colors from 'colors';

const preguntas = [
    {
        type : "list",
        name : "option",
        message : "¿Qué desea hacer?",
        choices : [
            {
                value : 1,
                name : `${"1.".green} Buscar ciudad`
            },
            {
                value : 2,
                name : `${"2.".green} Historial`
            },
            {
                value : 0,
                name : `${"0.".green} Salir`
            },
        ] 
    }
]

const inquirerMenu = async()=>{
    console.clear()
    console.log("=========================".green)
    console.log("  Seleccione una opcion".white)
    console.log("========================= \n".green)

    const { option } = await inquirer.prompt(preguntas)

    return option
}

const pausa = async()=>{
    console.log("\n")

    await inquirer.prompt([
        {
            type : "input",
            name : "Enter",
            message : `Presione ${"ENTER".green} para continuar`
        }
    ])
}

const leerInput = async(msg)=>{
    console.clear()
    const pregunta = [
        {
            type : "input",
            name : "desc",
            message : msg,
            validate(value){
                if(value.length === 0 || value === " "){
                    return "Por favor ingrese un valor"
                }
                return true
            }
        }
    ]

    const {desc} = await inquirer.prompt(pregunta)
    return desc
}

const listarLugares = async(lugares = [])=>{
    console.clear()
    const opciones = lugares.map( (lugar, indice) =>{
        return{
            value : {
                id : lugar.id,
                nombre : lugar.nombre,
                lng : lugar.lng,
                lat : lugar.lat
            },
            name : `${indice + 1}. `.green + `${lugar.nombre}`
        }
    })

    opciones.unshift({
        value : 0,
        name : "0. ".green + "Cancelar \n"
    })

    const preguntas = [
        {
            type : "list",
            name : "id",
            message : "Seleccione el lugar".yellow,
            choices : opciones
        }
    ]

    const lugar = await inquirer.prompt(preguntas)
    return lugar.id
}


export { inquirerMenu, pausa, leerInput, listarLugares }