
const cowsay = require("cowsay");


const appName = "Жумайсымба";
const startMessage = "Приложение «" + appName + "» запущено!";
const endMessage = "Работа приложения «" + appName + "» завершена.";

function showMessage(text) {
  console.log(cowsay.say({ text: text }));
}


console.log(cowsay.say({ text: startMessage }));


showMessage("Добро пожаловать в Жумайсымба!");
showMessage("Подбираем уход...");
showMessage("До свидания!");

console.log(cowsay.think({ text: endMessage }));
