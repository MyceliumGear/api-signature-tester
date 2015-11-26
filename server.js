var sha512 = require('crypto-js/sha512'),
    hmacSha512 = require('crypto-js/hmac-sha512'),
    express = require('express'),
    bodyParser = require('body-parser'),
    Client = require('node-rest-client').Client;

var app = express();
app.use(express.static('build'));
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/request', (req, res) => {
  // error handling
  if (req.body.requestHost === '') {
    res.status(400).end();
    return;
  }

  var client = new Client()
  const nonce = (new Date()).getTime() * 1000;

  const uri = `${req.body.requestHost}${req.body.requestPath}`;
  console.log(req.body);
  const headers = {
    "Content-Type": "application/json",
    "X-Client": req.body.email,
    "X-Nonce": nonce,
    "X-Signature": prepareSignature(req.body, nonce)
  }

  const args = {
    headers: headers,
    data: req.body.body
  }

  switch (req.body.method) {
  case 'POST':
    client.post(uri, args, (data, response) => {
      res.send(data)
    })
    break;
  case 'PATCH':
    client.patch(uri, args, (data, response) => {
      res.send(data)
    })
    break;
  case 'GET':
  default:
    client.get(uri, args, (data, response) => {
      res.send(data)
    })
    break;
  }
})

function prepareSignature (body, nonce) {
  const sigData = {
    method: body.method,
    requestUri: body.requestPath,
    secret: body.secret,
    nonce: nonce,
    body: body.body
  };
  return signature(sigData);
}

function signature (args) {
  const secret = args.secret,
        nonce = args.nonce,
        body = args.body,
        method = args.method,
      requestUri = args.requestUri;
  const hashNonceBody = sha512(`${nonce}${body}`).toString();
  const request = `${method.toUpperCase()}${requestUri}${hashNonceBody}`;
  return hmacSha512(request, secret).toString();
}

var server = app.listen(8800, () => {
  var host = server.address().address;
  var port = server.address().port;

  console.log(`Server started at http://${host}:${port}`)
})

