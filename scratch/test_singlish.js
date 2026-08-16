const Singlish = {
  vowels: {
    'aae': 'ඈ', 'aey': 'ඈ', 'aa': 'ආ', 'ae': 'ඇ', 'ah': 'ආ',
    'ii': 'ඊ', 'ee': 'ඊ', 'ea': 'ඒ', 'ei': 'ඒ',
    'uu': 'ඌ', 'oo': 'ඌ', 'oe': 'ඕ',
    'ai': 'ඓ', 'ay': 'ඓ', 'au': 'ඖ', 'ou': 'ඖ',
    'a': 'අ', 'i': 'ඉ', 'u': 'උ', 'e': 'එ', 'o': 'ඔ'
  },

  consonantStrokes: {
    'aae': 'ෑ', 'aey': 'ෑ', 'aa': 'ා', 'ae': 'ැ', 'ah': 'ා',
    'ii': 'ී', 'ee': 'ී', 'ea': 'ේ', 'ei': 'ේ',
    'uu': 'ූ', 'oo': 'ූ', 'oe': 'ෝ',
    'ai': 'ෛ', 'ay': 'ෛ', 'au': 'ෞ', 'ou': 'ෞ',
    'i': 'ි', 'u': 'ු', 'e': 'ෙ', 'o': 'ො',
    'a': ''
  },

  consonants: {
    'n-g': 'ඟ', 'n-d': 'ඬ', 'n-j': 'ඦ', 'm-b': 'ඹ',
    'ch': 'ච', 'c': 'ච', 'chh': 'ඡ',
    'sh': 'ෂ', 'shh': 'ශ', 'sj': 'ශ',
    'th': 'ත', 'Th': 'ඨ', 'dh': 'ද', 'Dh': 'ඪ',
    'kh': 'ඛ', 'gh': 'ඝ', 'jh': 'ඣ', 'ph': 'ඵ', 'bh': 'භ',
    'gn': 'ඥ', 'kn': 'ඤ',
    'k': 'ක', 'g': 'ග', 'j': 'ජ',
    't': 'ට', 'T': 'ට', 'd': 'ඩ', 'D': 'ඩ',
    'n': 'න', 'N': 'ණ', 'p': 'ප', 'b': 'බ', 'm': 'ම',
    'y': 'ය', 'r': 'ර', 'l': 'ල', 'L': 'ළ',
    'v': 'ව', 'w': 'ව', 's': 'ස', 'S': 'ශ',
    'h': 'හ', 'f': 'ෆ', 'x': 'ක්ස්', 'z': 'ස්'
  },

  toSinhala(input) {
    if (!input) return '';
    let str = input.toLowerCase();
    let result = '';
    let i = 0;

    while (i < str.length) {
      if (!/[a-z]/.test(str[i])) {
        result += str[i];
        i++;
        continue;
      }

      // Double consonants (e.g. tt, pp, kk, nn, ll, mm, ss)
      if (i + 1 < str.length && str[i] === str[i + 1] && !'aeiou'.includes(str[i])) {
        let ch = str[i];
        let baseCon = this.consonants[ch];
        if (baseCon) {
          result += baseCon + '්';
          i++;
          continue;
        }
      }

      // Nasal + consonant combinations (like 'mb' -> 'ම්බ', 'nd' -> 'න්ඩ්', 'nth' -> 'න්ත්', 'nt' -> 'න්ට්', 'ng' -> 'න්ග්')
      if (i + 1 < str.length && (str[i] === 'm' || str[i] === 'n') && !'aeiou'.includes(str[i + 1])) {
        let nCon = str[i] === 'm' ? 'ම්' : 'න්';
        let sub = str.substr(i + 1);
        let nextCon = '';
        let nextLen = 0;
        for (let l = 3; l >= 1; l--) {
          if (l <= sub.length && this.consonants[sub.substr(0, l)]) {
            nextCon = this.consonants[sub.substr(0, l)];
            nextLen = l;
            break;
          }
        }
        if (nextCon) {
          result += nCon;
          i += 1;
          continue;
        }
      }

      // Match consonant
      let con = '';
      let conLen = 0;
      for (let l = 3; l >= 1; l--) {
        if (i + l <= str.length) {
          let sub = str.substr(i, l);
          if (this.consonants[sub]) {
            con = this.consonants[sub];
            conLen = l;
            break;
          }
        }
      }

      if (con) {
        i += conLen;
        let stroke = null;
        let strokeLen = 0;
        for (let l = 3; l >= 1; l--) {
          if (i + l <= str.length) {
            let sub = str.substr(i, l);
            if (this.consonantStrokes[sub] !== undefined) {
              stroke = this.consonantStrokes[sub];
              strokeLen = l;
              break;
            }
          }
        }

        if (stroke !== null) {
          result += con + stroke;
          i += strokeLen;
        } else {
          result += con + '්';
        }
      } else {
        // Stand-alone vowel
        let vow = '';
        let vowLen = 0;
        for (let l = 3; l >= 1; l--) {
          if (i + l <= str.length) {
            let sub = str.substr(i, l);
            if (this.vowels[sub]) {
              vow = this.vowels[sub];
              vowLen = l;
              break;
            }
          }
        }

        if (vow) {
          result += vow;
          i += vowLen;
        } else {
          result += str[i];
          i++;
        }
      }
    }

    return result;
  },

  toPhonetic(str) {
    if (!str) return '';
    const cMap = {
      'ක': 'k', 'ඛ': 'k', 'ග': 'g', 'ඝ': 'g', 'ඞ': 'ng', 'ඟ': 'ng',
      'ච': 'ch', 'ඡ': 'ch', 'ජ': 'j', 'ඣ': 'j', 'ඤ': 'n', 'ඥ': 'gn', 'ඦ': 'nj',
      'ට': 't', 'ඨ': 't', 'ඩ': 'd', 'ඪ': 'd', 'ණ': 'n', 'ඬ': 'nd',
      'ත': 'th', 'ථ': 'th', 'ද': 'd', 'ධ': 'd', 'න': 'n', 'ඳ': 'nd',
      'ප': 'p', 'ඵ': 'p', 'බ': 'b', 'භ': 'b', 'ම': 'm', 'ඹ': 'mb',
      'ය': 'y', 'ර': 'r', 'ල': 'l', 'ළ': 'l', 'ව': 'w',
      'ශ': 'sh', 'ෂ': 'sh', 'ස': 's', 'හ': 'h', 'ෆ': 'f',
      'අ': 'a', 'ආ': 'a', 'ඇ': 'ae', 'ඈ': 'ae', 'ඉ': 'i', 'ඊ': 'i',
      'උ': 'u', 'ඌ': 'u', 'ඍ': 'ru', 'එ': 'e', 'ඒ': 'e', 'ඓ': 'ai',
      'ඔ': 'o', 'ඕ': 'o', 'ඖ': 'au'
    };

    const vMap = {
      '්': '',
      'ා': 'a', 'ැ': 'ae', 'ෑ': 'ae',
      'ි': 'i', 'ී': 'i', 'ු': 'u', 'ූ': 'u',
      'ෘ': 'ru', 'ෲ': 'ru',
      'ෙ': 'e', 'ේ': 'e', 'ෛ': 'ai',
      'ො': 'o', 'ෝ': 'o', 'ෞ': 'au',
      'ං': 'n'
    };

    let out = '';
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      const next = str[i + 1];

      if (cMap[ch]) {
        out += cMap[ch];
        if (next && vMap[next] !== undefined) {
          out += vMap[next];
          i++;
        } else if (next === '්') {
          i++;
        } else if (!'අආඇඈඉඊඋඌඍඑඒඓඔඕඖ'.includes(ch)) {
          out += 'a';
        }
      } else {
        out += ch;
      }
    }
    return out;
  },

  normalize(str) {
    if (!str) return '';
    return str.toLowerCase()
      .replace(/[\s\-_.,/()"']/g, '')
      .replace(/wire|wayer|vayar|wayar/g, 'wair')
      .replace(/pipe|paip|payip|paippa/g, 'paip')
      .replace(/cement|simenthi|siminthi|simenti/g, 'siminti')
      .replace(/thinner|thinar|tinar|tinur/g, 'tinar')
      .replace(/aena|ana|aeni|ani/g, 'aena')
      .replace(/ph/g, 'f')
      .replace(/th/g, 't')
      .replace(/dh/g, 'd')
      .replace(/sh/g, 's')
      .replace(/ch/g, 'c')
      .replace(/kh/g, 'k')
      .replace(/gh/g, 'g')
      .replace(/bh/g, 'b')
      .replace(/v/g, 'w')
      .replace(/([a-z0-9])\1+/g, '$1') // collapse duplicate letters (e.g. nn -> n, pp -> p)
      .replace(/y/g, '')
      .replace(/[er|ar|or|ur]/g, 'ar')
      .replace(/[ei]/g, 'i')
      .replace(/[ou]/g, 'u')
      .replace(/[aāäæ]/g, 'a');
  },

  stripSinhalaStrokes(str) {
    if (!str) return '';
    return str
      .replace(/[්ාැෑිීුූෘෲෙේෛොෝෞං]/g, '')
      .replace(/ඇ|ඈ/g, 'අ')
      .replace(/ඊ/g, 'ඉ')
      .replace(/ඌ/g, 'උ')
      .replace(/ඒ/g, 'එ')
      .replace(/ඕ/g, 'ඔ')
      .replace(/ණ/g, 'න')
      .replace(/ළ/g, 'ල')
      .replace(/ශ|ෂ/g, 'ස');
  },

  matchSingleWord(target, word) {
    if (!word) return true;
    const q = word.trim().toLowerCase();
    const t = target.trim().toLowerCase();

    // 1. Direct contains
    if (t.includes(q)) return true;

    // 2. Transliterate query to Sinhala
    const qSinhala = this.toSinhala(q);
    if (qSinhala && t.includes(qSinhala)) return true;

    // 3. Base Sinhala stripped strokes
    const tStripped = this.stripSinhalaStrokes(t);
    const qStripped = this.stripSinhalaStrokes(qSinhala);
    if (tStripped && qStripped && tStripped.includes(qStripped)) return true;

    // 4. Phonetic English direct contains
    const tPhonetic = this.toPhonetic(t);
    if (tPhonetic && tPhonetic.includes(q)) return true;

    // 5. Normalized phonetic match
    const tNorm = this.normalize(tPhonetic || t);
    const qNorm = this.normalize(q);
    if (tNorm && qNorm && tNorm.includes(qNorm)) return true;

    // 6. Word-by-word within target
    const words = t.split(/[\s\-/,.]+/);
    for (const w of words) {
      if (!w) continue;
      const wPhonetic = this.toPhonetic(w);
      const wNorm = this.normalize(wPhonetic || w);
      if (wNorm && qNorm && (wNorm.includes(qNorm) || wNorm.startsWith(qNorm))) return true;
    }

    return false;
  },

  match(target, query) {
    if (!query) return true;
    if (!target) return false;

    const q = query.trim().toLowerCase();
    const t = target.trim().toLowerCase();

    if (t.includes(q)) return true;

    // Multi-word query support (e.g. "6mm ana", "pvc pipe", "viduli wayer")
    const qWords = q.split(/\s+/).filter(Boolean);
    if (qWords.length > 1) {
      return qWords.every(w => this.matchSingleWord(t, w));
    }

    return this.matchSingleWord(t, q);
  }
};

// Tests
const items = [
  'සිමෙන්ති (50kg)',
  '6mm ඇණ',
  'PVC පයිප්ප 1/2"',
  'විදුලි වයර් (2.5mm)',
  'සායම් (Enamel 1L)',
  'කම්බි (18 Gauge)',
  'තිනර් (500ml)'
];

const queries = [
  'siminthi',
  'simenthi',
  'simenti',
  'cement',
  'ana',
  'aena',
  '6mm ana',
  '6mm aena',
  'pvc',
  'paippa',
  'paip',
  'pipe',
  'pvc pipe',
  'widuli',
  'viduli',
  'wayer',
  'vayar',
  'wire',
  'viduli wayer',
  'sayam',
  'saayam',
  'kambi',
  'thinar',
  'thinner',
  'tinur'
];

console.log('=== ACCURACY TEST RESULTS ===');
queries.forEach(q => {
  const matches = items.filter(it => Singlish.match(it, q));
  console.log(`"${q}" =>`, matches);
});
