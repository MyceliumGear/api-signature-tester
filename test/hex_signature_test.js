import test from 'tape';
import HexSignature from '../src/js/hex_signature';

test('signature creating', t => {
  t.plan(1);

  // let nonce = (new Date()).getTime * 1000;
  let nonce = 1;
  let data = {
    body: '',
    method: 'GET',
    requestUri: '/api/gateways',
    nonce: nonce,
    secret: 'some_secret'
  };
  let signature = HexSignature.signature(data);
  
  t.equal(signature, "9cf11534e009582f6783146d09a78bd9aebaf45f3d70ce3b6d010e431d99ebf4052e3eca001aec223a32d4295a116e567693251b620bf0b814abcc908ae7e51a");
});
