import sha512 from 'crypto-js/sha512';
import hmacSha512 from 'crypto-js/hmac-sha512';

export default class HexSignature {
  static signature({secret: secret, nonce: nonce, body: body, method: method, requestUri: requestUri}) {
    const hashNonceBody = sha512(`${nonce}${body}`).toString();
    const request = `${method.toUpperCase()}${requestUri}${hashNonceBody}`;
    return hmacSha512(request, secret).toString();
  }
}

