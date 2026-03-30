const axios = require('axios');
const key = process.env.VITE_OPENROUTER_API_KEY;
console.log('ENV key exists', !!key);
axios.post('https://openrouter.ai/v1/chat/completions', {
  model: 'o4-mini',
  messages: [{ role: 'user', content: 'Teste rápido' }],
}, {
  headers: {
    Authorization: `Bearer ${key || 'undefined'}`,
    'Content-Type': 'application/json',
  },
})
  .then((r) => {
    console.log('ok', r.status, r.data);
  })
  .catch((e) => {
    if (e.response) {
      console.error('HTTP', e.response.status, e.response.data);
    } else {
      console.error('ERR', e.message);
    }
  });
