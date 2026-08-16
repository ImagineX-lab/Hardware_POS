const Singlish = {
  normalize(str) {
    if (!str) return '';
    return str.toLowerCase()
      .replace(/[\s\-_.,/()"']/g, '')
      .replace(/([a-z0-9])\1+/g, '$1') // collapse duplicate letters first: thinner -> thiner, simmenti -> simenti
      .replace(/ph/g, 'f')
      .replace(/th/g, 't')
      .replace(/dh/g, 'd')
      .replace(/sh/g, 's')
      .replace(/ch/g, 'c')
      .replace(/kh/g, 'k')
      .replace(/gh/g, 'g')
      .replace(/bh/g, 'b')
      .replace(/v/g, 'w')
      .replace(/wire|wayer|vayar|wayar/g, 'wayar')
      .replace(/pipe|paip|payip|paippa/g, 'paip')
      .replace(/cement|simenthi|siminthi|simenti/g, 'siminti')
      .replace(/thinner|thinar|tinar|tinur/g, 'tinar')
      .replace(/y/g, '')
      .replace(/[ei]/g, 'i')
      .replace(/[ou]/g, 'u')
      .replace(/[aāäæ]/g, 'a')
      .replace(/([a-z0-9])\1+/g, '$1');
  }
};

console.log('thinner ->', Singlish.normalize('thinner'));
console.log('තිනර් phonetic ->', Singlish.normalize('thinar'));
