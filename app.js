const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/json')

const fs = require("fs");
const chat = require("./gemini");
const { appendToSheet, readSheet } = require('./utils');

const welcomeMsg = fs.readFileSync(`${process.cwd()}/messages/welcome.txt`, "utf-8");
const stockMsg = fs.readFileSync(`${process.cwd()}/messages/stock.txt`, "utf-8");
const consultasMsg = fs.readFileSync(`${process.cwd()}/messages/consultas.txt`, "utf-8");
const promptGPT = fs.readFileSync(`${process.cwd()}/messages/promptGPT.txt`, "utf-8");
const reservarMsg = fs.readFileSync(`${process.cwd()}/messages/reservar.txt`, "utf-8");
const menuMsg = fs.readFileSync(`${process.cwd()}/messages/menu.txt`, "utf-8");

const sanClementeMsg = fs.readFileSync(`${process.cwd()}/messages/sanClemente.txt`, "utf-8");
const barilocheMsg = fs.readFileSync(`${process.cwd()}/messages/bariloche.txt`, "utf-8");
const cataratasMsg = fs.readFileSync(`${process.cwd()}/messages/cataratas.txt`, "utf-8");
const marDelPlataMsg = fs.readFileSync(`${process.cwd()}/messages/marDelPlata.txt`, "utf-8");
const termasMsg = fs.readFileSync(`${process.cwd()}/messages/termas.txt`, "utf-8");
const gualeguaychuAPMsg = fs.readFileSync(`${process.cwd()}/messages/AP/gualeguaychu.txt`, "utf-8");

let currentGlobalState = true;


const historialFlow = addKeyword("Reservas")
.addAnswer("Estas son las reservas", null, async (ctx, {flowDynamic}) => {
    const responde = await readSheet();
    const data = responde.map(reserva => reserva.join(": ")).slice(1);
    const reservasString = data.join("\n")
    console.log(reservasString);
    await flowDynamic(reservasString)
})

const barilocheFlow = addKeyword(EVENTS.ACTION)
.addAnswer(barilocheMsg, {delay: 1000, media: "https://drive.google.com/drive/folders/1JL4Q151HipolcoPzW9n3UmOSzB5-j-M5?usp=drive_link/images/Bariloche/Bariloche.jpeg"})
.addAnswer(reservarMsg, {capture: true}, async (ctx, {gotoFlow, globalState, state}) => {

    //console.log("Bari");
    try {
        
        if(!Array(reservarMsg)[0].includes(ctx.body)){
            return fallBack("Elija una opción válida")
        }
    
        switch(ctx.body){
            case "1":
                await state.update({destino: "Bariloche"})
                return gotoFlow(reservarElegidoFlow);
            
            case "2":
                return gotoFlow(stockFlow);
            
        }
    } catch (error) {
        console.log(error)
    }
})

const cataratasFlow = addKeyword(EVENTS.ACTION)
.addAnswer(cataratasMsg, {media: "/images/Cataratas/Cataratas.jpeg"})
.addAnswer(reservarMsg, {capture: true}, async (ctx, {gotoFlow, globalState, state}) => {

    try {
        if(!Array(reservarMsg)[0].includes(ctx.body)){
            return fallBack("Elija una opción válida")
        }
    
        switch(ctx.body){
            case "1":
                await state.update({destino: "Cataratas"})
                return gotoFlow(reservarElegidoFlow);
            
            case "2":
                return gotoFlow(stockFlow);
            
        }
    } catch (error) {
        console.log(error)
    }
})

const marDelPlataFlow = addKeyword(EVENTS.ACTION)
.addAnswer(marDelPlataMsg, {media: `/images/Mar del Plata/Mar del Plata.jpeg`})
.addAnswer(reservarMsg, {capture: true}, async (ctx, {gotoFlow, globalState, state}) => {

    if(!Array(reservarMsg)[0].includes(ctx.body)){
        return fallBack("Elija una opción válida")
    }

    switch(ctx.body){
        case "1":
            await state.update({destino: "Mar del Plata"})
            return gotoFlow(reservarElegidoFlow);
        
        case "2":
            return gotoFlow(stockFlow);
        
    }
})

const merloFlow = addKeyword(EVENTS.ACTION)
.addAnswer()

const sanRafaelFlow = addKeyword(EVENTS.ACTION)
.addAnswer()

const carlosPazFlow = addKeyword(EVENTS.ACTION)
.addAnswer()

const gualeguaychuFlow = addKeyword(EVENTS.ACTION)
.addAnswer()

const macachinFlow = addKeyword(EVENTS.ACTION)
.addAnswer()

const gesellFlow = addKeyword(EVENTS.ACTION)
.addAnswer()

const tigreFlow = addKeyword(EVENTS.ACTION)
.addAnswer()

const termasFlow = addKeyword(EVENTS.ACTION)
.addAnswer("Estas son nuestras opciones de termas")
.addAnswer(gualeguaychuAPMsg, {delay: 1000, media: `/images/Termas/Gualeguaychu-AP.jpeg`})
.addAnswer("También podés disfrutar de las Termas Marinas", {delay: 1000, media: `/images/Termas/SanClemente-TourOeste.jpeg`})
.addAnswer(termasMsg, {capture: true}, async (ctx, {gotoFlow, state}) => {
    
    if(!Array(termasMsg)[0].includes(ctx.body)){
        return fallBack("Elija un destino válido")
    }

    const options = {
        1: "Gualeguaychu de AP",
        2: "San Clemente de Tour Oeste"
    }

    const selected = options[ctx.body];

    await state.update({destino: selected});
})
.addAnswer(reservarMsg, {capture: true}, async (ctx, {gotoFlow, flowDynamic}) => {

    if(!Array(reservarMsg)[0].includes(ctx.body)){
        return fallBack("Elija una opción válida")
    }

    switch(ctx.body){
        case "1":
            
            return gotoFlow(reservarElegidoFlow);
        
        case "2":
            await flowDynamic("Volviendo al menú rincipal")
            return gotoFlow(flujoSecundario);
        
    }
})

// const playaFlow = addKeyword(EVENTS.ACTION)
// .addAnswer(sanClementeMsg, {delay: 1000, media: `${process.cwd()}/images/SanClemente/sanClemente.jpeg`})
// .addAnswer("Visita Mundo Marino", {delay: 1000, media: `${process.cwd()}/images/SanClemente/mundoMarino.jpeg`})
// .addAnswer("También podés disfrutar de las Termas Marinas", {delay: 1000, media: `${process.cwd()}/images/SanClemente/termasSanClemente.jpeg`})
// .addAnswer(reservarMsg, {capture: true}, async (ctx, {gotoFlow, globalState, state}) => {
//     switch(ctx.body){
//         case "Si":
//             await state.update({destino: "San Clemente"})
//             return gotoFlow(reservarFlow);
        
//         case "No":
//             return await globalState.update({encendido: false});
        
//     }
// })

const reservarElegidoFlow = addKeyword(EVENTS.ACTION)
.addAnswer("¿Cuál es tu nombre?", {capture: true}, async (ctx, {gotoFlow, state, fallBack})=> {
    const regex = /^[a-zA-Z]+$/

    if(!regex.test(ctx.body)){
        return fallBack("Ingrese un nombre válido");
    }
    await state.update({nombre: ctx.body})
    await state.update({telefono: ctx.from})
})
.addAnswer("¿Cuál es tu apellido?", {capture: true}, async (ctx, {gotoFlow, state, fallBack})=> {
    const regex = /^[a-zA-Z]+$/

    if(!regex.test(ctx.body)){
        return fallBack("Ingrese un apellido válido");
    }
    await state.update({apellido: ctx.body})
    
})
.addAnswer("¿Cuál es tu fecha de nacimiento?\nEn formato dd-mm-aaaa", {capture: true, delay: 1500},  async (ctx, {state, fallBack}) => {
    const regex = /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/

    if(!regex.test(ctx.body)){
        return fallBack("Ingrese una fecha válida")
    }

    await state.update({nacimiento: ctx.body})
})
.addAnswer("¿Cuál es tu número de documento?", {capture: true, delay: 1500},  async (ctx, {state, fallBack}) => {
    const regex = /^[\d]{1,3}\.?[\d]{3,3}\.?[\d]{3,3}$/

    if(!regex.test(ctx.body)){
        return fallBack("Ingrese un número válido")
    }
    await state.update({documento: ctx.body})
})
.addAnswer("Registrando tus datos...", {delay: 2500}, async (ctx, {endFlow, gotoFlow, state, flowDynamic, globalState})=> {
    const nombre = await state.get("nombre");
    const apellido = await state.get("apellido");
    const destino = await state.get("destino");
    const telefono = await state.get("telefono").slice(3);
    const nacimiento = await state.get("nacimiento");
    const documento = await state.get("documento");
    const response = await appendToSheet([[nombre, apellido, destino, telefono, nacimiento, documento]])
    if(response.status === 200){
        await flowDynamic(`Un representante se comunicará con vos para finalizar la reserva.`)
        //await globalState.update({encendido: false})
        currentGlobalState = false;
        return endFlow()
    }
    //console.log(response)

})


// const consultaFlow = addKeyword(EVENTS.ACTION)
// .addAnswer(consultasMsg , 
//     {capture: true},
//     async (ctx, {gotoFlow, flowDynamic}) => {
        
//         const prompt = promptGPT;
//         const consulta = ctx.body;
//         let answer = await chat(prompt, consulta);
        
//         await flowDynamic(answer);
//         return gotoFlow(otraConsultaFlow)
        
//     }
// )

const recomendacionFlow = addKeyword(EVENTS.ACTION)
.addAnswer("Recomendando destino...")
.addAction(async (ctx, {gotoFlow}) => {
    return gotoFlow(consultaFlow);
})

let history = [];

const consultaFlow = addKeyword(EVENTS.ACTION)
.addAction( async (ctx, {gotoFlow, flowDynamic}) => {
        
    const prompt = promptGPT;
    const consulta = "Recomendame un destino para ir de vacaciones y decime porqué sería bueno ir.";
    let answer = await chat(prompt, consulta, history);

    let result = answer.answ

    console.log(answer.history[1].parts)
    
    await flowDynamic(result);
    await flowDynamic("¿Te gustaría otra sugerencia?");
    //return gotoFlow(consultaFlow)

})
.addAction( {capture: true}, async (ctx, {gotoFlow, flowDynamic}) => {

    let capitalized = ctx.body[0].toUpperCase() + ctx.body.slice(1);

    switch(capitalized){
        case "Si":
            return gotoFlow(recomendacionFlow);
        case "No":
            await flowDynamic("Volviendo al menú principal...")
            return gotoFlow(menuFlow);
    }
})

const decidirFlujo = addKeyword(EVENTS.WELCOME)
.addAction(async (ctx, {gotoFlow}) => {
    if(currentGlobalState){
        return gotoFlow(flujoPrincipal)
    }

    return gotoFlow(flujoSecundario);
})

const flujoPrincipal = addKeyword(EVENTS.ACTION)
.addAnswer(welcomeMsg, {delay: 1500}, async (ctx, {gotoFlow}) => {
    return gotoFlow(menuFlow);
})

const menuFlow = addKeyword(EVENTS.ACTION)
.addAnswer(menuMsg, {capture: true, delay: 1500}, async (ctx, {endFlow, gotoFlow, globalState}) => {
    try{
        // const currentGlobalState = globalState.getMyState();
        console.log(currentGlobalState);
        
        if(!currentGlobalState){
            return endFlow();
        }
        
        if(!Array(menuMsg)[0].includes(ctx.body)){
            return fallBack("Elija una opción válida")
        }
        switch(ctx.body){
            case "1":
                return gotoFlow(stockFlow)
            case "2":
                return gotoFlow(reservarFlow)
            case "3":
                return gotoFlow(recomendacionFlow)
        }
    }catch(err){
        console.log(err);
    }
})

const flujoSecundario = addKeyword(EVENTS.ACTION)
.addAnswer("¡Bienvenido de vuelta!")
.addAnswer(menuMsg, {capture: true, delay: 1500}, async (ctx, {endFlow, gotoFlow, globalState}) => {
    try{
        // const currentGlobalState = globalState.getMyState();
        console.log(currentGlobalState);
        
        currentGlobalState = true;

        if(!currentGlobalState){
            return endFlow();
        }
        
        if(!Array(menuMsg)[0].includes(ctx.body)){
            return fallBack("Elija una opción válida")
        }
        switch(ctx.body){
            case "1":
                return gotoFlow(stockFlow)
            case "2":
                return gotoFlow(reservarFlow)
        }
    }catch(err){
        console.log(err);
    }
})
        
const stockFlow = addKeyword(EVENTS.ACTION)
.addAnswer("¿Qué destino te gustaría consultar hoy?")
.addAnswer(stockMsg, { capture: true, delay: 1500}, async (ctx, {gotoFlow, flowDynamic, fallBack})=>{
    
    try {
        console.log(Array(stockMsg));
        
        if(!Array(stockMsg)[0].includes(ctx.body)){
            return fallBack("Elija un destino válido")
        }
    
        const options = {
            1: barilocheFlow,
            2: cataratasFlow,
            3: marDelPlataFlow,
            /*4: merloFlow,
            5: sanRafaelFlow,
            6: carlosPazFlow,
            7: gualeguaychuFlow,
            8: macachinFlow,
            9: gesellFlow,
            10: tigreFlow,*/
            11: termasFlow
        }
        console.log(ctx.body)
        return gotoFlow(options[ctx.body]);
    } catch (error) {
        console.log(error)
    }
})

const reservarFlow = addKeyword(EVENTS.ACTION)
.addAnswer("¿Cuál es tu nombre?", {capture: true}, async (ctx, {gotoFlow, state, fallBack})=> {
    const regex = /^[a-zA-Z]+$/

    if(!regex.test(ctx.body)){
        return fallBack("Ingrese un nombre válido");
    }
    await state.update({nombre: ctx.body})
    await state.update({telefono: ctx.from})
})
.addAnswer("¿Cuál es tu apellido?", {capture: true}, async (ctx, {gotoFlow, state, fallBack})=> {
    const regex = /^[a-zA-Z]+$/

    if(!regex.test(ctx.body)){
        return fallBack("Ingrese un apellido válido");
    }
    await state.update({apellido: ctx.body})
    
})
.addAnswer(["¿Cuál es el destino?", stockMsg], {capture: true}, async (ctx, {gotoFlow, state, flowDynamic})=> {
    
    if(!Array(stockMsg)[0].includes(ctx.body)){
        return fallBack("Elija un destino válido")
    }
    
    const options = {
        1: "Bariloche",
        2: "Cataratas",
        3: "Mar del Plata",
        4: "Merlo",
        5: "San Rafael",
        6: "Villa Carlos Paz",
        7: "Gualeguaychu",
        8: "Macachin",
        9: "Gesell",
        10: "Tigre",
        11: "Termas"
    }

    const selected = options[ctx.body]

    if(selected === "Termas"){
        return gotoFlow(termasFlow);
    }
    
    await state.update({destino: selected})
    
})
.addAnswer("¿Cuál es tu fecha de nacimiento?\nEn formato dd-mm-aaaa", {capture: true, delay: 1500},  async (ctx, {state, fallBack}) => {
    const regex = /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/

    if(!regex.test(ctx.body)){
        return fallBack("Ingrese una fecha válida")
    }

    await state.update({nacimiento: ctx.body})
})
.addAnswer("¿Cuál es tu número de documento?", {capture: true, delay: 1500},  async (ctx, {state, fallBack}) => {
    const regex = /^[\d]{1,3}\.?[\d]{3,3}\.?[\d]{3,3}$/

    if(!regex.test(ctx.body)){
        return fallBack("Ingrese un número válido")
    }
    await state.update({documento: ctx.body})
})
.addAnswer("Registrando tus datos...", {delay: 2500}, async (ctx, {endFlow, gotoFlow, state, flowDynamic, globalState})=> {
    const nombre = await state.get("nombre");
    const apellido = await state.get("apellido");
    const destino = await state.get("destino");
    const telefono = await state.get("telefono").slice(3);
    const nacimiento = await state.get("nacimiento");
    const documento = await state.get("documento");
    const response = await appendToSheet([[nombre, apellido, destino, telefono, nacimiento, documento]])
    if(response.status === 200){
        await flowDynamic(`Un representante se comunicará con vos para finalizar la reserva.`)
        //await globalState.update({encendido: false})
        currentGlobalState = false;
        return endFlow()
    }
    //console.log(response)

})


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([
        decidirFlujo,
        flujoPrincipal, stockFlow,
        recomendacionFlow, menuFlow,
        consultaFlow, barilocheFlow, 
        cataratasFlow, marDelPlataFlow, 
        merloFlow, sanRafaelFlow, 
        carlosPazFlow, gualeguaychuFlow, 
        macachinFlow, gesellFlow, 
        tigreFlow, termasFlow,
        historialFlow, reservarFlow,
        reservarElegidoFlow
    ])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
