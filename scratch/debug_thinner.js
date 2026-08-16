console.log('qNorm:', Singlish.normalize('thinner'));
console.log('tPhonetic:', Singlish.toPhonetic('තිනර් (500ml)'));
console.log('tNorm:', Singlish.normalize(Singlish.toPhonetic('තිනර් (500ml)')));
console.log('includes:', Singlish.normalize(Singlish.toPhonetic('තිනර් (500ml)')).includes(Singlish.normalize('thinner')));
