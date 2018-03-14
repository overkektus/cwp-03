const net = require('net');
const fs = require('fs');
const port = 8124;
const clientString = 'QA';
const good = 'ACK';
const bad = 'DEC';
const logger = fs.createWriteStream('client_id.log');

let seed = 0;

const server = net.createServer((client) => {
    console.log('Client connected');
    client.setEncoding('utf8');

    client.on('data', (data, err) =>
    {
        if (err) console.error(err);
        else if (!err && data === clientString)
        {
            client.id = Date.now() + seed++;
            writeLog('Client #' + client.id + ' connected\n');
            client.write(data === clientString ? good : bad);
        }
        else if (!err && data !== clientString) {
            writeLog('Client #' + client.id + ' has asked: ' + data + '\n');
            let answer = generateAnswer();
            writeLog('Server answered to Client #' + client.id + ': ' + answer + '\n');
            client.write(answer);
        }
    });
    client.on('end', () =>
    {
        logger.write('Client #'+ client.id+ ' disconnected');
        console.log('Client disconnected')
    });
});
function writeLog(data)
{
    logger.write(data);
}
function generateAnswer()
{
    return Math.random() > 0.5 ? '1' : '0';
}
server.listen(port, () => {
    console.log(`Server listening on localhost: ${port}`);
});
