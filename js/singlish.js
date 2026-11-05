/* =========================================================
   HardwarePOS — Singlish to Sinhala & Phonetic Search Engine
   Supports:
   - Direct matching (English & Sinhala)
   - Real-time Singlish to Sinhala script transliteration (e.g. "siminthi" -> "සිමින්ති", "simenthi" -> "සිමෙන්ති")
   - Sinhala Unicode to phonetic Singlish matching (e.g. "සිමෙන්ති" matches "simenti", "siminthi", "cement")
   - Loose vowel & consonant phonetic matching (th/t, dh/d, v/w, sh/s, etc.)
   - Multi-word queries (e.g. "6mm ana", "pvc pipe", "viduli wayer")
   ========================================================= */

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
    let str = String(input).toLowerCase();
    let result = '';
    let i = 0;

    while (i < str.length) {
      if (!/[a-z]/.test(str[i])) {
        result += str[i];
        i++;
        continue;
      }

      // Check double consonants (e.g. tt, pp, kk, nn, ll, mm, ss)
      if (i + 1 < str.length && str[i] === str[i + 1] && !'aeiou'.includes(str[i])) {
        let ch = str[i];
        let baseCon = this.consonants[ch];
        if (baseCon) {
          result += baseCon + '්';
          i++;
          continue;
        }
      }

      // Check nasal + consonant combinations (like 'mb' -> 'ම්බ', 'nd' -> 'න්ඩ්', 'nth' -> 'න්ත්', 'nt' -> 'න්ට්', 'ng' -> 'න්ග්')
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

  _memoPhonetic: new Map(),
  _memoNormalize: new Map(),
  _memoStripped: new Map(),

  toPhonetic(str) {
    if (!str) return '';
    if (this._memoPhonetic.has(str)) return this._memoPhonetic.get(str);
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
    if (this._memoPhonetic.size > 2000) this._memoPhonetic.clear();
    this._memoPhonetic.set(str, out);
    return out;
  },

  normalize(str) {
    if (!str) return '';
    if (this._memoNormalize.has(str)) return this._memoNormalize.get(str);
    const res = str.toLowerCase()
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
      .replace(/([a-z0-9])\1+/g, '$1')
      .replace(/y/g, '')
      .replace(/[er|ar|or|ur]/g, 'ar')
      .replace(/[ei]/g, 'i')
      .replace(/[ou]/g, 'u')
      .replace(/[aāäæ]/g, 'a');
    if (this._memoNormalize.size > 2000) this._memoNormalize.clear();
    this._memoNormalize.set(str, res);
    return res;
  },

  stripSinhalaStrokes(str) {
    if (!str) return '';
    if (this._memoStripped.has(str)) return this._memoStripped.get(str);
    const res = String(str)
      .replace(/[්ාැෑිීුූෘෲෙේෛොෝෞං]/g, '')
      .replace(/ඇ|ඈ/g, 'අ')
      .replace(/ඊ/g, 'ඉ')
      .replace(/ඌ/g, 'උ')
      .replace(/ඒ/g, 'එ')
      .replace(/ඕ/g, 'ඔ')
      .replace(/ණ/g, 'න')
      .replace(/ළ/g, 'ල')
      .replace(/ශ|ෂ/g, 'ස');
    if (this._memoStripped.size > 2000) this._memoStripped.clear();
    this._memoStripped.set(str, res);
    return res;
  },

  matchSingleWord(target, word) {
    if (!word) return true;
    const q = String(word).trim().toLowerCase();
    const t = String(target).trim().toLowerCase();

    // 1. Direct substring match
    if (t.includes(q)) return true;

    // 2. Transliterate query to Sinhala and match
    const qSinhala = this.toSinhala(q);
    if (qSinhala && t.includes(qSinhala)) return true;

    // 3. Base Sinhala stripped strokes match
    const tStripped = this.stripSinhalaStrokes(t);
    const qStripped = this.stripSinhalaStrokes(qSinhala);
    if (tStripped && qStripped && tStripped.includes(qStripped)) return true;

    // 4. Phonetic English direct contains
    const tPhonetic = this.toPhonetic(t);
    if (tPhonetic && tPhonetic.includes(q)) return true;

    // 5. Normalized phonetic match (loose vowel/consonant equivalence)
    const tNorm = this.normalize(tPhonetic || t);
    const qNorm = this.normalize(q);
    if (tNorm && qNorm && (tNorm.includes(qNorm) || qNorm.includes(tNorm))) return true;

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

  indexItem(item) {
    if (!item) return '';
    if (item._searchIdx) return item._searchIdx;

    const name = String(item.name || '').toLowerCase();
    const barcode = String(item.barcode || '').toLowerCase();
    const cat = String(item.category || '').toLowerCase();
    const subCat = String(item.subCategory || '').toLowerCase();
    const desc = String(item.description || '').toLowerCase();

    const nameStripped = this.stripSinhalaStrokes(name);
    const namePhonetic = this.toPhonetic(name);
    const nameNorm = this.normalize(namePhonetic || name);
    const catPhonetic = this.toPhonetic(cat);
    const descPhonetic = this.toPhonetic(desc);

    // Fast indexed composite string + fast-lookup properties
    item._nameLower = name;
    item._barcodeLower = barcode;
    item._catLower = cat;
    item._searchIdx = `${name} ${barcode} ${cat} ${subCat} ${desc} ${nameStripped} ${namePhonetic} ${nameNorm} ${catPhonetic} ${descPhonetic}`;
    return item._searchIdx;
  },

  preIndexAll(items) {
    if (!Array.isArray(items)) return;
    for (let i = 0; i < items.length; i++) {
      this.indexItem(items[i]);
    }
  },

  _memoQuery: new Map(),

  prepareQuery(query) {
    if (!query) return null;
    const q = String(query).trim().toLowerCase();
    if (!q) return null;

    if (this._memoQuery.has(q)) {
      return this._memoQuery.get(q);
    }

    const words = q.split(/\s+/).filter(Boolean);
    const prepared = words.map(w => {
      const wSinhala = this.toSinhala(w);
      const wStripped = this.stripSinhalaStrokes(wSinhala);
      const wNorm = this.normalize(w);
      return {
        raw: w,
        sinhala: wSinhala,
        stripped: wStripped,
        norm: wNorm
      };
    });

    if (this._memoQuery.size > 500) this._memoQuery.clear();
    this._memoQuery.set(q, prepared);
    return prepared;
  },

  matchPrepared(item, preparedWords) {
    if (!preparedWords || !preparedWords.length) return true;
    if (!item) return false;

    // Fast path: check direct name / barcode substring before checking full composite index
    const name = item._nameLower !== undefined ? item._nameLower : String(item.name || '').toLowerCase();
    const barcode = item._barcodeLower !== undefined ? item._barcodeLower : String(item.barcode || '').toLowerCase();
    const idx = item._searchIdx || this.indexItem(item);

    for (let i = 0; i < preparedWords.length; i++) {
      const w = preparedWords[i];
      // 1. Direct match on item name or barcode (majority of queries hit here instantly)
      if (name.includes(w.raw) || (barcode && barcode.includes(w.raw))) continue;
      // 2. Direct Sinhala transliteration in name
      if (w.sinhala && name.includes(w.sinhala)) continue;
      // 3. Fallback to full composite indexed text
      if (idx.includes(w.raw)) continue;
      if (w.sinhala && idx.includes(w.sinhala)) continue;
      if (w.stripped && idx.includes(w.stripped)) continue;
      if (w.norm && idx.includes(w.norm)) continue;
      return false;
    }
    return true;
  },

  _lastQ: null,
  _lastPrepared: null,

  matchItem(item, query) {
    if (!query) return true;
    if (!item) return false;

    // Cache the prepared query so that inside array.filter(i => matchItem(i, q)),
    // query is prepared ONCE for the entire batch of items!
    if (this._lastQ !== query) {
      this._lastQ = query;
      this._lastPrepared = this.prepareQuery(query);
    }

    return this.matchPrepared(item, this._lastPrepared);
  },

  match(target, query) {
    if (!query) return true;
    if (!target) return false;

    const q = String(query).trim().toLowerCase();
    const t = String(target).trim().toLowerCase();

    if (t.includes(q)) return true;

    // Multi-word query support (e.g. "6mm ana", "pvc pipe", "viduli wayer")
    const qWords = q.split(/\s+/).filter(Boolean);
    if (qWords.length > 1) {
      return qWords.every(w => this.matchSingleWord(t, w));
    }

    return this.matchSingleWord(t, q);
  }
};

if (typeof module !== 'undefined') {
  module.exports = Singlish;
}
