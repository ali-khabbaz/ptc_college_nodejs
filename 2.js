const http = require('http'),
    url = require('url'),
    qs = require('querystring');

// sample request http://localhost/?name=asghar&age=30&interests=nothing&job=student_:)

/* 
sample response

<html>
    <body>
        <h1>
            my name is asghar, 
i am at 30 years old,
interested in nothing,
i am a student_:) 
        </h1>
    </body>
</html>


*/

const server = http.createServer((req, res) => {
    const urlParts = url.parse(req.url, true),
        urlParams = urlParts.query;
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