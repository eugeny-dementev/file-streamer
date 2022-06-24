class Aggregator {
  constructor(splitter) {
    this.splitter = splitter;
    this.valuesSum = {};
  }

  parse(text) {
    return text
      .split('\r\n')
      .map(line => {
        const data = line.split(this.splitter);
        const [id1, id2, id3, value1, value2] = data;
        const dataChunk = {
          id1, id2, id3,
          value1: Number(value1),
          value2: Number(value2),
        }


        return dataChunk;
      });
  }

  aggregate(text) {
    this
      .parse(text)
      .forEach(({id1, id2, id3, value1, value2}) => {
        this.add('id1', id1, value1, value2);
        this.add('id2', id2, value1, value2);
        this.add('id3', id3, value1, value2);
      });
  }

  add(key, id, value1, value2) {
    if (this.valuesSum[key] && this.valuesSum[key][id]) {
      this.valuesSum[key][id]['value1'] += value1;
      this.valuesSum[key][id]['value2'] += value2;
    } else {
      this.valuesSum[key] = this.valuesSum[key] ? this.valuesSum[key] : {};
      this.valuesSum[key][id] = {
        value1: 0,
        value2: 0,
      }
    }
  }

  getSum() {
    return this.valuesSum;
  }
}

fetch('http://localhost:1337')
  .then(response => response.body.getReader())
  .then(async (reader) => {
    const utf8Decoder = new TextDecoder();

    const aggregator = new Aggregator(',');

    while (true) {
      const {done, value} = await reader.read();

      if (done) break;

      const text = utf8Decoder.decode(value);

      aggregator.aggregate(text);
    }

    return aggregator.getSum();
  })
  .then((result) => console.log('result:', result))
  .catch(console.error);
