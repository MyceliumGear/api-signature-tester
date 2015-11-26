import CodeMirror from 'codemirror'
require('codemirror/mode/javascript/javascript')
require('codemirror/addon/edit/matchbrackets')
require('codemirror/addon/edit/closebrackets')
var jsonEditor;

function init () {
  const btn = document.getElementById("submitBtn");
  const editorSettings = {
    lineNumbers: true,
    viewportMargin: Infinity,
    matchBrackets: true,
    mode: {name: 'javascript', json: true}
  }
  const textArea = document.getElementById('jsonEditor')
  jsonEditor = CodeMirror.fromTextArea(textArea, editorSettings);
  btn.addEventListener('click', sendToAPI);
}

function sendToAPI (event) {
  event.preventDefault();

  const form = document.querySelector("form");

  fetch('/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      requestHost: form.requestHost.value,
      requestPath: form.requestPath.value,
      secret: form.secret.value,
      email: form.email.value,
      method: form.method.value,
      body: jsonEditor.getValue()
    })
  }).then(res => {
    return res.json()
  }) .then((result) => {
      document.getElementById('result').innerHTML = syntaxHighlight(result);
  }).catch((ex) => {
    console.log('parsing error: ', ex);
    document.getElementById('result').innerHTML = `Bad answer.`;
  });
}

function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function syntaxHighlight (json) {
    if (typeof json !== 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

init();
