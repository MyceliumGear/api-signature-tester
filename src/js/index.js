import HexSignature from './hex_signature';

function init() {
  const btn = document.getElementById('submitBtn');
  const copyBtn = document.getElementById("copyToClipboard");
  btn.addEventListener("click", sendToAPI);
  copyBtn.addEventListener("click", copyToClipboard);
}

function sendToAPI(event) {
  event.preventDefault();

  const form = document.getElementsByName("requestData")[0];
  const nonce = (new Date).getTime() * 1000;
  const requestUri = `${form.requestHost.value}${form.requestPath.value}`;

  let cleanBody = form.body.value.replace(/\n/g, '');
  const preparedBody = JSON.stringify(cleanBody);
  let body;
          
  switch(form.method.value) {
  case 'POST': body = `POST -d ${preparedBody}`; break;
  case 'PATCH': body = `PATCH -d ${preparedBody}`; break;
  case 'GET':
  default:
    body = 'GET';
    cleanBody = "";
    break;
  }
  const signature = prepareSignature(form, cleanBody, nonce);
  const headers = `-H "Content-Type: application/json" -H "Accept: application/json" -H "X-Client: ${form.email.value}" -H "X-Nonce: ${nonce}" -H "X-Signature: ${signature}"`;
  const request = `curl -X ${body} ${headers} ${requestUri}`;
  
  document.getElementById("request").innerHTML = request;
}

function prepareSignature(form, cleanBody, nonce) {
  let sigData = { 
    method: form.method.value,
    requestUri: form.requestPath.value,
    secret: form.secret.value,
    nonce: nonce,
    body: cleanBody
  };
  return HexSignature.signature(sigData);
}

function copyToClipboard(event) {
  const textArea = document.getElementById("request");
  textArea.select();
  try {
    document.execCommand("copy");
  } catch(e) {
    alert('Oops, you have ancient browser. Upgrade it or copy manually');
  }
}

init();
