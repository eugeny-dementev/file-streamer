const utf8Decoder = new TextDecoder();

fetch('http://localhost:1337')
    .then(response => response.body.getReader())
    .then((reader) => {
        return new ReadableStream({
            start(controller) {
                return pump();
                function pump() {
                    return reader.read().then(({ done, value }) => {
                        if (done) {
                            controller.close();
                            return;
                        }

                        console.log('value:', utf8Decoder.decode(value));

                        controller.enqueue(value);
                        return pump();
                    })
                }
            }
        })
    })
    .catch(console.error);
