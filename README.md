# HardwarePOS — Hardware කඩේ සඳහා POS පද්ධතිය

Hardware (කඩේ) සාප්පුවක් සඳහා නිර්මාණය කළ, සරලවම browser එකේ ක්‍රියාත්මක වන, සම්පූර්ණ POS (Point of Sale) පද්ධතියක්. Server එකක්, ඉන්ටර්නෙට් සම්බන්ධතාවයක්, හෝ install කිරීමක් අවශ්‍ය නොවේ.

## ✅ ඇතුළත් වන ප්‍රධාන කාර්යයන්

1. **භාණ්ඩ එකතු කිරීම (Items)** — නම, වර්ගය, ඒකකය, ගැනුම් මිල, විකුණුම් මිල, තොග ප්‍රමාණය, reorder level එකක් සමඟ භාණ්ඩ එකතු/සංස්කරණය/ඉවත් කිරීම.
2. **නායට ගනුදෙනුකරුවන් (Customers / Credit)** — නම, දුරකථනය, ලිපිනය වැනි විස්තර සමඟ ගනුදෙනුකරුවන් එකතු කිරීම, එක් එක් අයගේ නායට ශේෂය (balance) automatic ලෙස track කිරීම, සහ ගෙවීම් වාර්තා කිරීම (ledger history එකක් සමඟ).
3. **විකුණුම් / බිල්පත (Sale/Billing)** — භාණ්ඩ සොයා කරත්තයට එකතු කර, කැෂ් හෝ නායට ලෙස බිල්පත සකසා, receipt එකක් print කිරීම. විකුණුමකින් පසු තොග ප්‍රමාණය automatic ලෙස අඩු වේ.
4. **තොග වාර්තාව (Stock)** — සියලුම භාණ්ඩවල වර්තමාන තොගය සහ තොග වටිනාකම එක් තැනකින් බැලීම.
5. **අඩු තොග (Low Stock alerts)** — reorder level එකට වඩා අඩු වූ භාණ්ඩ ස්වයංක්‍රීයව හඳුනාගෙන, dashboard එකේ සහ sidebar එකේ badge එකකින් පෙන්වයි.
6. **විකුණුම් ඉතිහාසය (Sales history)** — සියලුම පසුගිය බිල්පත් බැලීම, filter කිරීම, සහ වැරදි බිල්පතක් අවලංගු කිරීම (එවිට තොගය සහ නායට ශේෂය නැවත සකසනු ලැබේ).
7. **Backup / Restore** — දත්ත JSON file එකක් ලෙස download කර ගැනීම සහ ඕනෑම වේලාවක restore කිරීම.

## 🚀 පටන් ගන්නා විදිය

1. මෙම ZIP file එක ඔබේ computer එකේ ෆෝල්ඩරයකට extract කරන්න.
2. **`index.html`** file එක double-click කර ඕනෑම browser එකකින් (Chrome, Edge, Firefox) විවෘත කරන්න.
3. ඒ තමයි — install කිරීමක්, internet එකක්, server එකක් අවශ්‍ය නැහැ!

> **Tip:** Desktop එකේ `index.html` file එකට shortcut එකක් හදාගත්තොත් කඩේ POS එක ලෙස ලේසියෙන් access කරගන්න පුළුවන්.

## 💾 දත්ත ගබඩා වන්නේ කොහෙද?

සියලුම දත්ත (භාණ්ඩ, ගනුදෙනුකරුවන්, විකුණුම්) ඔබේ browser එකේ `localStorage` එකේ ගබඩා වේ — එනම් ඔබේ computer එකේම, local ව. ඒ කියන්නේ:

- **Internet අවශ්‍ය නැත** — offline ලෙසත් සම්පූර්ණයෙන් ක්‍රියාත්මක වේ.
- **Private** — දත්ත කිසිම server එකකට යවන්නේ නැත.
- ⚠️ Browser history/cache clear කළහොත්, හෝ වෙනත් computer/browser එකකින් access කළහොත් දත්ත පෙනෙන්නේ නැත. **එබැවින් "සැකසුම්" පිටුවෙන් නිතර Backup file එකක් download කරගෙන තියාගන්න** (උදා: සතියකට වරක්). අවශ්‍ය වූ විට එම file එකෙන්ම restore කරගත හැක.

## 🖥️ තවත් computer එකකට / අලුතින් install කරගන්නේ කෙසේද?

1. මෙම ෆෝල්ඩරය (හෝ ZIP එක) අලුත් computer එකට copy කරන්න.
2. `index.html` විවෘත කරන්න.
3. පරණ computer එකේ "සැකසුම්" → "Backup Download" කරගත් file එක, අලුත් computer එකේ "සැකසුම්" → "Backup Restore" කරන්න.

## 🧾 බිල්පතක් සකසන ආකාරය (Quick Guide)

1. Sidebar එකේ **"විකුණුම් / බිල්පත"** ක්ලික් කරන්න.
2. Search box එකෙන් භාණ්ඩය සොයා ක්ලික් කර කරත්තයට එකතු කරන්න (quantity වෙනස් කළ හැක).
3. ගෙවීම් ක්‍රමය තෝරන්න — **කැෂ්** හෝ **නායට** (නායට නම් ගනුදෙනුකරු තෝරන්න).
4. "බිල්පත සම්පූර්ණ කරන්න" ක්ලික් කරන්න → receipt එක print කළ හැක.

## 🔧 Technical Notes (Developers සඳහා)

- Pure HTML/CSS/JavaScript — කිසිම framework එකක් හෝ build step එකක් අවශ්‍ය නැත.
- `js/db.js` — data layer (localStorage CRUD operations).
- `js/views.js` — සියලුම screens (Dashboard, Sale, Items, Stock, Customers, History, Settings).
- `js/ui.js` — toast/modal helper functions.
- `js/app.js` — routing/app controller.
- ඕනෑම text editor එකකින් (VS Code වගේ) විවෘත කර, ඔබට අවශ්‍ය පරිදි වර්ණ/logo/features වෙනස් කරගත හැක.

ඔබේ කඩේ සාර්ථක වේවා! 🛠️
