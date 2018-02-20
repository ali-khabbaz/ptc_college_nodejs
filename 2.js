const http = require('http'),
    url = require('url'),
    qs = require('querystring');

const server = http.createServer((req, res) => {
    const urlParts = url.parse(req.url, true),
        urlParams = urlParts.query;
    let {
        name,
        age,
        interests,
        job
    } = urlParams;
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write(`<html>
    <body>
        <h1>
            ${displayPerson(urlParams)}
        </h1>
    </body>
    </html>
`);
    res.end();
});

server.listen(80, () => {
    console.log('listening');
});


function displayPerson({
    name = '__',
    age = '00',
    interests = '__',
    job = '__'
}) {
    return `my name is ${name}, 
i am at ${age} years old,
interested in ${interests},
i am a ${job} `;
}