require("dotenv").config()
const { GoogleGenerativeAI } = require("@google/generative-ai");



// Access your API key as an environment variable.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


async function chat(prompt, consulta, history) {
    // Choose a model that's appropriate for your use case.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: prompt}, {apiVersion: "v1beta"});
    
    const conversation = model.startChat({
        history
    })
    
    const result = await conversation.sendMessage(consulta);
    const response = result.response;
    const answ = response.text();
    
    
    //
    //console.log(history)
    
    return {answ, history};
}

module.exports = chat;

// require("dotenv").config()
// const { GoogleGenerativeAI } = require("@google/generative-ai");



// // Access your API key as an environment variable.
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



// async function chat(prompt, text, conversationHistory) {
//     // Choose a model that's appropriate for your use case.
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: prompt}, {apiVersion: "v1beta"});

//     //const formatPrompt = prompt;

//     const conversation = model.startChat({
//         history: [
//             {
//                 role: "user",
//                 parts: [{text}]
//             },
//             {
//                 role: "model",
//                 parts: [{text}]
//             }
//         ]
//     })

//     const result = await conversation.sendMessage(text);
//     const response = result.response;
//     const answ = response.text();

//     return answ;
// }

// module.exports = chat;