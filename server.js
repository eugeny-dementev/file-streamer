const vfs = require('vinyl-fs');
const through = require('through');
const http = require('node:http');

const server = http.createServer((req, res) => {
    try {
        vfs
            .src('./test-files/*')
            .pipe(through(
                function write(data) {
                   res.write(data.contents);
                    console.log(data.contents.toString());
                },
                function end() {
                    res.end();
                }
            ));

    } catch (e) {
        res.p();
    }
});

const PORT = 1337;

server.listen(PORT, () => {
    console.log('Sever started on port:', PORT);
});
