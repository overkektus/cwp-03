const net = require('net');
const fs = require('fs');
const port = 8124;
const string = 'QA';
const bad = 'DEC';
const good = 'ACK';

const client = new net.Socket();
let currentIndex = -1;
client.setEncoding('utf8');

let questions = [];
client.connect({port: port, host: '127.0.0.1'}, () => {
    fs.readFile("qa.json", (err, text) => {
        if (!err) {
            questions = JSON.parse(text);
            client.write(string);
        }
        else console.error(err);
    });
});

client.on('data', (data) => {
    if (data === bad)
        client.destroy();
    if (data === good)
        sendQuestion();
    else {
        let qst = questions[currentIndex];
        let answer = qst.good;
        console.log('\n' + qst.quest);
        console.log('Answer:' + data);
        console.log('Server:' + answer);
        console.log('Result:' + (data === answer ? 'It is a right answer': 'Bad answer'));
        sendQuestion();
    }
});

client.on('close', function () {
    console.log('Connection closed');
});



function sendQuestion() {
    if (currentIndex < questions.length -1) {
        let qst = questions[++currentIndex].quest;
        client.write(qst);
    }
    else
        client.destroy();
}