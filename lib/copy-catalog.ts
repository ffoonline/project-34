import type { Product } from "./types";
import { langOf, tr, type Triple } from "./triple";

type ProductCopy = {
  name: Triple;
  description: Triple;
  story: Triple;
  fabric: Triple;
  care: Triple;
};

export const colorCopy: Record<string, Triple> = {
  Ink: { en: "Ink", "fa-AF": "جوهر", ps: "رنګ" },
  Camel: { en: "Camel", "fa-AF": "شتری", ps: "اوښی" },
  Bone: { en: "Bone", "fa-AF": "استخوانی", ps: "هډکی" },
  Sky: { en: "Sky", "fa-AF": "آسمانی", ps: "اسماني" },
  Stone: { en: "Stone", "fa-AF": "سنگی", ps: "ډبرین" },
  Olive: { en: "Olive", "fa-AF": "زیتونی", ps: "زیتوني" },
  Navy: { en: "Navy", "fa-AF": "سرمه‌ای", ps: "بحري" },
  Oxblood: { en: "Oxblood", "fa-AF": "عنابی", ps: "شرابي" },
  Charcoal: { en: "Charcoal", "fa-AF": "ذغالی", ps: "سکرو" },
  Ecru: { en: "Ecru", "fa-AF": "شیری", ps: "شیده‌يي" },
  Black: { en: "Black", "fa-AF": "سیاه", ps: "تور" },
  Ivory: { en: "Ivory", "fa-AF": "عاجی", ps: "عاج" },
  Sage: { en: "Sage", "fa-AF": "سبز مریم", ps: "شین خړ" },
  Clear: { en: "Clear", "fa-AF": "شفاف", ps: "روڼ" },
  Tobacco: { en: "Tobacco", "fa-AF": "تنباکو", ps: "تمباکو" },
  Sun: { en: "Sun", "fa-AF": "آفتابی", ps: "لمریز" },
  Default: { en: "Default", "fa-AF": "اصلی", ps: "اصلي" },
};

export const collectionCopy: Record<string, Triple> = {
  atelier: { en: "Atelier", "fa-AF": "آتلیه", ps: "آتلیه" },
  heritage: { en: "Heritage", "fa-AF": "میراث", ps: "میراث" },
  essentials: { en: "Essentials", "fa-AF": "ضروریات", ps: "اړین توکي" },
  "little-34": { en: "Little 34", "fa-AF": "کوچک ۳۴", ps: "کوچنی ۳۴" },
  signature: { en: "Signature", "fa-AF": "امضا", ps: "لاسلیک" },
};

export const cityCopy: Record<string, Triple> = {
  Kabul: { en: "Kabul", "fa-AF": "کابل", ps: "کابل" },
  Herat: { en: "Herat", "fa-AF": "هرات", ps: "هرات" },
  "Mazar-i-Sharif": { en: "Mazar-i-Sharif", "fa-AF": "مزار شریف", ps: "مزار شریف" },
  Kandahar: { en: "Kandahar", "fa-AF": "قندهار", ps: "کندهار" },
  Jalalabad: { en: "Jalalabad", "fa-AF": "جلال‌آباد", ps: "جلال‌آباد" },
  "Other Afghanistan": { en: "Other Afghanistan", "fa-AF": "سایر افغانستان", ps: "بله افغانستان" },
  International: { en: "International", "fa-AF": "بین‌المللی", ps: "نړیوال" },
};

export const productCopy: Record<string, ProductCopy> = {
  "north-wool-overcoat": {
    name: { en: "North Wool Overcoat", "fa-AF": "پالتو پشم شمال", ps: "د شمال وړۍ پالتو" },
    description: {
      en: "A long overcoat in dense wool, cut to sit clean over a shirt or knit. The shoulder is set, the hem is generous, and the cloth will take years of Kabul winters.",
      "fa-AF": "پالتوی بلند از پشم فشرده، برش‌شده تا روی پیراهن یا بافت پاک بنشیند. شانه ثابت است، دامن گشاده، و پارچه زمستان‌های کابل را سال‌ها تاب می‌آورد.",
      ps: "په کلکه وړۍ کې اوږد پالتو، داسې پرې‌کړل شوی چې پر کمیس یا بافت پاک کېني. اوږه ټینګه ده، څنډه پراخه، او جامه د کابل ژمي کلونه زغمي.",
    },
    story: {
      en: "Named for the road north of the city, where the air turns earlier than the calendar. The North coat is the first piece we cut each autumn.",
      "fa-AF": "نام از جاده شمال شهر، جایی که هوا زودتر از تقویم سرد می‌شود. پالتو شمال نخستین قطعه‌ای است که هر خزان می‌بریم.",
      ps: "د ښار د شمال د سړک په نوم، هلته چې هوا له کلیزې مخکې ساړه شي. د شمال پالتو هغه لومړۍ ټوټه ده چې هر مني یې پرې کوو.",
    },
    fabric: {
      en: "80% wool, 20% polyamide. Woven in a compact twill.",
      "fa-AF": "۸۰٪ پشم، ۲۰٪ پلی‌آمید. تویل فشرده.",
      ps: "۸۰٪ وړۍ، ۲۰٪ پولي‌اماید. کلک ټویل.",
    },
    care: {
      en: "Dry clean. Hang on a wide cedar hanger. Steam, do not iron the face.",
      "fa-AF": "خشکشویی. روی چوب‌لباس پهن سدر بیاویزید. بخار، روی پارچه اتو نکنید.",
      ps: "وچ پاکول. په پراخه سدر زنګون کې ځوړند کړئ. بخار، مخ مه اوسپنه کوئ.",
    },
  },
  "atelier-oxford-shirt": {
    name: { en: "Atelier Oxford Shirt", "fa-AF": "پیراهن آکسفورد آتلیه", ps: "د آتلیه اکسفورډ کمیس" },
    description: {
      en: "A straight oxford with a quiet collar and a slightly longer back. Meant to be worn open at the throat, or closed under the North coat.",
      "fa-AF": "آکسفورد راست با یقه آرام و پشت کمی بلندتر. برای گشودن در گلو، یا بستن زیر پالتو شمال.",
      ps: "سم اکسفورډ د ارامه یخن او لږ اوږد شا سره. د ستوني پر خلاصېدو، یا د شمال پالتو لاندې تړلو لپاره.",
    },
    story: {
      en: "The house shirt. We keep the pattern on the table so it can be recut without drama.",
      "fa-AF": "پیراهن خانه. الگو روی میز می‌ماند تا بدون هیاهو دوباره برش شود.",
      ps: "د کور کمیس. بڼه پر میز ساتو چې پرته له شور بیا پرې شي.",
    },
    fabric: {
      en: "100% cotton oxford, 140 gsm.",
      "fa-AF": "۱۰۰٪ پنبه آکسفورد، ۱۴۰ گرم.",
      ps: "۱۰۰٪ پنبه اکسفورډ، ۱۴۰ ګرام.",
    },
    care: {
      en: "Machine wash cold. Hang dry. Press on the reverse.",
      "fa-AF": "شستشوی ماشینی سرد. آویزان خشک کنید. از پشت اتو کنید.",
      ps: "په ساړه ماشین کې ومینځئ. ځوړند وچ کړئ. له شا اوسپنه کړئ.",
    },
  },
  "kabul-light-trouser": {
    name: { en: "Kabul Light Trouser", "fa-AF": "شلوار سبک کابل", ps: "د کابل سپک پتلون" },
    description: {
      en: "A high-rise trouser with a soft crease and a tapered but not skinny leg. Cut to clear a desert boot without catching.",
      "fa-AF": "شلوار کمر‌بلند با چین نرم و پای باریک اما نه لاغر. برش‌شده تا از بوت صحرا بگذرد و گیر نکند.",
      ps: "لوړې ملا پتلون د نرمې کرښې او تنګ خو نه نری پښې سره. داسې پرې شوی چې د صحرا بوټ تېر کړي، ونه نیسي.",
    },
    story: {
      en: "We named it for the pale dust that sits on the city at four in the afternoon.",
      "fa-AF": "نام از غبار کمرنگ شهر در ساعت چهار بعدازظهر.",
      ps: "د هغه سپکې دوړې په نوم چې په ماسپښین څلور بجو پر ښار ناسته وي.",
    },
    fabric: {
      en: "Wool-blend tropical, 240 gsm.",
      "fa-AF": "مخلوط پشم تروپیکال، ۲۴۰ گرم.",
      ps: "وړۍ مخلوط تروپیکال، ۲۴۰ ګرام.",
    },
    care: {
      en: "Dry clean. Hang by the waist, never the hem.",
      "fa-AF": "خشکشویی. از کمر بیاویزید، نه از دامن.",
      ps: "وچ پاکول. له ملا ځوړند کړئ، له څنډې مه.",
    },
  },
  "thirty-merino-knit": {
    name: { en: "Thirty Merino Knit", "fa-AF": "بافت مرینو سی", ps: "دېرش مرینو بافت" },
    description: {
      en: "A fine merino crew with a clean rib and enough weight to stand on its own under a coat.",
      "fa-AF": "مرینو نازک با کش ساده و وزنی که زیر پالتو خودش بایستد.",
      ps: "نازک مرینو د پاکې پټۍ سره او دومره وزن چې د پالتو لاندې پخپله ودرېږي.",
    },
    story: {
      en: "Thirty, not four — the knit we reach for on the days the atelier stays cold until noon.",
      "fa-AF": "سی، نه چهار — بافتی که روزهایی برمی‌داریم که آتلیه تا ظهر سرد می‌ماند.",
      ps: "دېرش، نه څلور — هغه بافت چې په هغو ورځو یې اخلو چې آتلیه تر غرمې سړه پاتې شي.",
    },
    fabric: {
      en: "100% extra-fine merino, 18.5 micron.",
      "fa-AF": "۱۰۰٪ مرینو فوق‌العاده نازک، ۱۸٫۵ میکرون.",
      ps: "۱۰۰٪ ډېر نازک مرینو، ۱۸٫۵ مایکرون.",
    },
    care: {
      en: "Hand wash cold. Dry flat. Never tumble.",
      "fa-AF": "شستشوی دستی سرد. صاف خشک کنید. هرگز خشک‌کن نکنید.",
      ps: "په لاس په ساړه ومینځئ. هوار وچ کړئ. هیڅکله ټمبل مه کوئ.",
    },
  },
  "desert-travel-blazer": {
    name: { en: "Desert Travel Blazer", "fa-AF": "کت سفر صحرا", ps: "د صحرا سفر بلیزر" },
    description: {
      en: "An unconstructed blazer in a dry cloth that packs without a crease lecture. Two buttons, patch pockets, nothing loud.",
      "fa-AF": "بلیزر بدون ساخت در پارچه خشک که بدون چین پرخاشگر بسته می‌شود. دو دکمه، جیب وصله، هیچ فریادی.",
      ps: "ناجوړ بلیزر په وچه جامه کې چې پرته له چین درس بسته کېږي. دوه تڼۍ، پیچ جیبونه، هیڅ شور نشته.",
    },
    story: {
      en: "Cut for the flight to Dubai and the walk back through Shahr-e-Naw the same week.",
      "fa-AF": "برش برای پرواز دبی و پیاده‌روی همان هفته در شهرنو.",
      ps: "د دوبۍ الوتنې او د هماغې اونۍ د ښارنو تګ لپاره پرې شوی.",
    },
    fabric: {
      en: "Wool-linen blend, unstructured canvas.",
      "fa-AF": "مخلوط پشم و کتان، کانواس بدون ساخت.",
      ps: "وړۍ-کتان مخلوط، ناجوړ کانواس.",
    },
    care: {
      en: "Steam. Dry clean only when needed.",
      "fa-AF": "بخار. خشکشویی فقط وقتی لازم است.",
      ps: "بخار. وچ پاکول یوازې کله چې اړتیا وي.",
    },
  },
  "column-silk-dress": {
    name: { en: "Column Silk Dress", "fa-AF": "پیراهن ستونی ابریشم", ps: "د وريښمو ستوني جامه" },
    description: {
      en: "A long column in washed silk with a single dart and a covered zipper. It falls. It does not fuss.",
      "fa-AF": "ستون بلند از ابریشم شسته با یک پنس و زیپ پوشیده. می‌افتد. جنجال نمی‌کند.",
      ps: "په مینځل شوې وريښمو کې اوږده ستنه، یوه پنسه او پوښل شوی زیپ. لوېږي. شور نه کوي.",
    },
    story: {
      en: "The dress we put on the rail when someone asks what Thirty Four looks like on a body.",
      "fa-AF": "پیراهنی که وقتی می‌پرسند سی‌وچهار روی بدن چگونه است، روی ریل می‌گذاریم.",
      ps: "هغه جامه چې کله څوک وپوښتي دېرش څلور پر بدن څنګه ښکاري، پر ریل یې ږدو.",
    },
    fabric: {
      en: "Washed silk crepe, 16 momme.",
      "fa-AF": "کرپ ابریشم شسته، ۱۶ مومه.",
      ps: "مینځل شوی وريښمین کریپ، ۱۶ مومه.",
    },
    care: {
      en: "Dry clean. Store hanging, not folded.",
      "fa-AF": "خشکشویی. آویزان نگه دارید، تا نکنید.",
      ps: "وچ پاکول. ځوړند یې وساتئ، مه یې تاوئ.",
    },
  },
  "cashmere-wrap-coat": {
    name: { en: "Cashmere Wrap Coat", "fa-AF": "پالتو پیچ کشمیر", ps: "د کشمیر تاو پالتو" },
    description: {
      en: "A wrap coat in cashmere-blend with a self belt and a deep collar. Weight without stiffness.",
      "fa-AF": "پالتو پیچ از مخلوط کشمیر با کمربند خود و یقه عمیق. وزن بدون سختی.",
      ps: "په کشمیر مخلوط کې تاو پالتو د خپل کمربند او ژور یخن سره. وزن پرته له سختۍ.",
    },
    story: {
      en: "Cut from the same mill as the North coat, then softened for a different shoulder.",
      "fa-AF": "از همان کارخانه پالتو شمال، سپس برای شانه‌ای دیگر نرم شده.",
      ps: "د شمال پالتو له هماغه کارخانې، بیا د بلې اوږې لپاره نرم شوی.",
    },
    fabric: {
      en: "70% wool, 20% cashmere, 10% polyamide.",
      "fa-AF": "۷۰٪ پشم، ۲۰٪ کشمیر، ۱۰٪ پلی‌آمید.",
      ps: "۷۰٪ وړۍ، ۲۰٪ کشمیر، ۱۰٪ پولي‌اماید.",
    },
    care: {
      en: "Dry clean. Rest 24 hours between wears.",
      "fa-AF": "خشکشویی. میان پوشیدن ۲۴ ساعت استراحت.",
      ps: "وچ پاکول. د اغوستلو تر منځ ۲۴ ساعته آرام.",
    },
  },
  "studio-knit-polo": {
    name: { en: "Studio Knit Polo", "fa-AF": "پولو بافت استودیو", ps: "د سټوډیو بافت پولو" },
    description: {
      en: "A short-sleeve knit polo with a fine rib collar. Worn with the Line Skirt or the Kabul Light Trouser.",
      "fa-AF": "پولو آستین‌کوتاه بافت با یقه کش نازک. با دامن خط یا شلوار سبک کابل.",
      ps: "لنډ آستین بافت پولو د نازکې پټۍ یخن سره. د خط دامان یا د کابل سپک پتلون سره.",
    },
    story: {
      en: "What the studio wears when the irons are on and the windows are open.",
      "fa-AF": "آنچه استودیو می‌پوشد وقتی اتوها روشن و پنجره‌ها باز است.",
      ps: "هغه چې سټوډیو یې اغوندي کله چې اوسپنې بلې او کړکۍ خلاصې وي.",
    },
    fabric: {
      en: "Cotton-silk knit.",
      "fa-AF": "بافت پنبه-ابریشم.",
      ps: "پنبه-وريښم بافت.",
    },
    care: {
      en: "Hand wash cold. Dry flat.",
      "fa-AF": "شستشوی دستی سرد. صاف خشک کنید.",
      ps: "په لاس په ساړه ومینځئ. هوار وچ کړئ.",
    },
  },
  "line-skirt": {
    name: { en: "Line Skirt", "fa-AF": "دامن خط", ps: "د کرښې دامان" },
    description: {
      en: "A midi skirt with a single inverted pleat and a hidden side zip. The line is the point.",
      "fa-AF": "دامن میدی با یک چین وارونه و زیپ پهلوی پنهان. خط اصل کار است.",
      ps: "میډي دامان د یوې سرچپه چینې او پټ اړخ زیپ سره. کرښه اصل ده.",
    },
    story: {
      en: "Drafted from a 1970s Kabul photograph, then taken in at the waist.",
      "fa-AF": "از عکس کابل دهه ۱۹۷۰، سپس از کمر جمع شده.",
      ps: "د ۱۹۷۰ لسیزې د کابل عکس څخه، بیا له ملا راټول شوی.",
    },
    fabric: {
      en: "Wool twill, 260 gsm.",
      "fa-AF": "تویل پشم، ۲۶۰ گرم.",
      ps: "وړۍ ټویل، ۲۶۰ ګرام.",
    },
    care: {
      en: "Dry clean. Hang from the waist loop.",
      "fa-AF": "خشکشویی. از حلقه کمر بیاویزید.",
      ps: "وچ پاکول. د ملا له کړۍ ځوړند کړئ.",
    },
  },
  "evening-blouse": {
    name: { en: "Evening Blouse", "fa-AF": "بلوز شب", ps: "د ماښام بلوز" },
    description: {
      en: "A silk blouse with a covered placket and a slight gather at the cuff. Evening without sequins.",
      "fa-AF": "بلوز ابریشم با پیش‌بند پوشیده و چین کم در مچ. شب بدون پولک.",
      ps: "وريښمین بلوز د پوښل شوي مخ او په مړوند کې لږه راټولېدنه. ماښام پرته له ځلېدونکو.",
    },
    story: {
      en: "For dinners that start late and rooms that still use lamp light.",
      "fa-AF": "برای شام‌هایی که دیر شروع می‌شود و اتاق‌هایی که هنوز چراغ رومیزی دارند.",
      ps: "د هغو ډوډیو لپاره چې ناوخته پیلېږي او هغو خونو چې لا هم څراغ کاروي.",
    },
    fabric: {
      en: "Silk georgette.",
      "fa-AF": "ژرژت ابریشم.",
      ps: "وريښمین جورجټ.",
    },
    care: {
      en: "Dry clean. Steam from the inside.",
      "fa-AF": "خشکشویی. از داخل بخار دهید.",
      ps: "وچ پاکول. له دننه بخار ورکړئ.",
    },
  },
  "little-house-coat": {
    name: { en: "Little House Coat", "fa-AF": "پالتو کوچک خانه", ps: "د کور وړوکی پالتو" },
    description: {
      en: "A child-scale wool coat with a storm flap and room in the sleeve for a season of growth.",
      "fa-AF": "پالتو پشم کودک با زبانه طوفان و جا در آستین برای یک فصل رشد.",
      ps: "د ماشوم اندازې وړۍ پالتو د طوفان فلپ او په آستین کې د یوې موسم ودې ځای سره.",
    },
    story: {
      en: "The North coat, drafted down without turning it into costume.",
      "fa-AF": "پالتو شمال، کوچک‌شده بدون آنکه لباس نمایش شود.",
      ps: "د شمال پالتو، راکښته پرې شوی پرته له دې چې ننداره شي.",
    },
    fabric: {
      en: "Wool blend with a cotton lining.",
      "fa-AF": "مخلوط پشم با آستر پنبه.",
      ps: "وړۍ مخلوط د پنبې استر سره.",
    },
    care: {
      en: "Dry clean. Brush after rain.",
      "fa-AF": "خشکشویی. پس از باران برس بزنید.",
      ps: "وچ پاکول. له باران وروسته برش کړئ.",
    },
  },
  "play-shirt-set": {
    name: { en: "Play Shirt Set", "fa-AF": "ست پیراهن بازی", ps: "د لوبې کمیس سیټ" },
    description: {
      en: "A two-piece cotton set: easy shirt and short, both with a hidden extra centimetre in the hem.",
      "fa-AF": "ست دو تکه پنبه: پیراهن آسان و شورت، هر دو با یک سانتی‌متر پنهان در دامن.",
      ps: "دوه ټوټه پنبې سیټ: اسانه کمیس او لنډ، دواړه په څنډه کې پټ اضافي سانتی‌متر لري.",
    },
    story: {
      en: "For courtyards, school gates, and the back seat of the family car.",
      "fa-AF": "برای حیاط، دروازه مکتب، و صندلی عقب موتر خانواده.",
      ps: "د انګړ، د ښوونځي دروازې، او د کورنۍ موټر شا چوکۍ لپاره.",
    },
    fabric: {
      en: "100% cotton poplin.",
      "fa-AF": "۱۰۰٪ پنبه پوپلین.",
      ps: "۱۰۰٪ پنبه پوپلین.",
    },
    care: {
      en: "Machine wash warm. Tumble low.",
      "fa-AF": "شستشوی ماشینی گرم. خشک‌کن ملایم.",
      ps: "په تود ماشین کې ومینځئ. ټیټ ټمبل.",
    },
  },
  "heritage-mini-trouser": {
    name: { en: "Heritage Mini Trouser", "fa-AF": "شلوار کوچک میراث", ps: "د میراث وړوکی پتلون" },
    description: {
      en: "A small version of the Kabul Light Trouser, with an elastic back and a proper front crease.",
      "fa-AF": "نسخه کوچک شلوار سبک کابل، با کش پشت و چین درست جلو.",
      ps: "د کابل سپک پتلون وړه بڼه، د شا لچک او سم مخکني چین سره.",
    },
    story: {
      en: "Siblings should look related, not matching.",
      "fa-AF": "خواهر و برادر باید خویشاوند به‌نظر برسند، نه جفت.",
      ps: "خویندي او وروڼه باید خپل ښکاره شي، نه جوړه.",
    },
    fabric: {
      en: "Cotton twill.",
      "fa-AF": "تویل پنبه.",
      ps: "پنبه ټویل.",
    },
    care: {
      en: "Machine wash cold. Warm iron.",
      "fa-AF": "شستشوی ماشینی سرد. اتوی گرم.",
      ps: "په ساړه ماشین کې ومینځئ. توده اوسپنه.",
    },
  },
  "soft-knit-pullover": {
    name: { en: "Soft Knit Pullover", "fa-AF": "پلیور بافت نرم", ps: "نرم بافت پلور" },
    description: {
      en: "A cotton knit with a rolled neck and sleeves that can be turned once. Soft enough for a school day.",
      "fa-AF": "بافت پنبه با یقه لوله و آستینی که یک‌بار برگردان می‌شود. نرم برای روز مکتب.",
      ps: "پنبه بافت د تاو یخن او آستینو سره چې یو ځل اړول کېږي. د ښوونځي ورځې لپاره نرم.",
    },
    story: {
      en: "The merino’s younger cousin — washable, stubborn about pilling.",
      "fa-AF": "پسر‌عموی جوان‌تر مرینو — قابل شستشو، سرسخت در برابر پرز.",
      ps: "د مرینو کشر تربور — مینځل کېدونکی، د وړیو پر وړاندې کلک.",
    },
    fabric: {
      en: "Organic cotton knit.",
      "fa-AF": "بافت پنبه ارگانیک.",
      ps: "عضوي پنبه بافت.",
    },
    care: {
      en: "Machine wash cold. Dry flat.",
      "fa-AF": "شستشوی ماشینی سرد. صاف خشک کنید.",
      ps: "په ساړه ماشین کې ومینځئ. هوار وچ کړئ.",
    },
  },
  "signature-34": {
    name: { en: "Signature 34", "fa-AF": "امضای ۳۴", ps: "لاسلیک ۳۴" },
    description: {
      en: "A quiet cedar and tea scent. Not a cloud — a room you walk back into.",
      "fa-AF": "عطر آرام سرو و چای. ابر نیست — اتاقی که به آن برمی‌گردی.",
      ps: "د سرو او چای ارامه بوی. ورېځ نه — خونه چې بیرته ورننوځې.",
    },
    story: {
      en: "The house scent. Sampled in west light, like the cloth.",
      "fa-AF": "عطر خانه. در نور غرب آزموده، مثل پارچه.",
      ps: "د کور بوی. په لویدیځ رڼا کې ازمول شوی، لکه جامه.",
    },
    fabric: {
      en: "Eau de parfum, 50 ml.",
      "fa-AF": "او دو پارفم، ۵۰ میلی‌لیتر.",
      ps: "او دو پارفم، ۵۰ ملي‌لیتر.",
    },
    care: {
      en: "Keep from heat and sun. Do not shake.",
      "fa-AF": "از گرما و آفتاب دور نگه دارید. تکان ندهید.",
      ps: "له تودوخې او لمر لرې وساتئ. مه یې خوځوئ.",
    },
  },
  "kabul-night": {
    name: { en: "Kabul Night", "fa-AF": "شب کابل", ps: "د کابل شپه" },
    description: {
      en: "Smoke, vetiver, and a dry rose. For after the atelier lights go down.",
      "fa-AF": "دود، وتیور، و گل سرخ خشک. برای بعد از خاموشی چراغ آتلیه.",
      ps: "لوګی، وتیور، او وچه ګلاب. د آتلیه د څراغونو له مړه کېدو وروسته.",
    },
    story: {
      en: "Cut as a counterpart to Signature 34 — darker, not louder.",
      "fa-AF": "مقابل امضای ۳۴ — تیره‌تر، نه بلندتر.",
      ps: "د لاسلیک ۳۴ سیال — تیاره، نه لوړ.",
    },
    fabric: {
      en: "Eau de parfum, 50 ml.",
      "fa-AF": "او دو پارفم، ۵۰ میلی‌لیتر.",
      ps: "او دو پارفم، ۵۰ ملي‌لیتر.",
    },
    care: {
      en: "Keep from heat and sun.",
      "fa-AF": "از گرما و آفتاب دور نگه دارید.",
      ps: "له تودوخې او لمر لرې وساتئ.",
    },
  },
  "atelier-tote": {
    name: { en: "Atelier Tote", "fa-AF": "کیف آتلیه", ps: "د آتلیه ټوټ" },
    description: {
      en: "A structured tote in dry leather. Holds a knit, a book, and nothing that rattles.",
      "fa-AF": "کیف ساخت‌دار از چرم خشک. بافت، کتاب، و هیچ چیز جغجغه‌دار.",
      ps: "په وچ چرم کې جوړ ټوټ. یو بافت، یو کتاب، او هیڅ شی چې غږ کوي نه.",
    },
    story: {
      en: "The bag the studio actually carries.",
      "fa-AF": "کیفی که استودیو واقعاً می‌برد.",
      ps: "هغه کڅوړه چې سټوډیو یې رښتیا وړي.",
    },
    fabric: {
      en: "Vegetable-tanned leather.",
      "fa-AF": "چرم دباغی گیاهی.",
      ps: "د بوټو رنګ شوی چرم.",
    },
    care: {
      en: "Wipe dry. Condition once a season.",
      "fa-AF": "خشک پاک کنید. هر فصل یک‌بار نرم کنید.",
      ps: "وچ پاک کړئ. په موسم کې یو ځل نرم کړئ.",
    },
  },
  "house-belt": {
    name: { en: "House Belt", "fa-AF": "کمربند خانه", ps: "د کور کمربند" },
    description: {
      en: "A thin leather belt with a quiet brass buckle. Made to disappear under a coat.",
      "fa-AF": "کمربند نازک چرم با سگک برنج آرام. ساخته تا زیر پالتو ناپدید شود.",
      ps: "نازک چرمي کمربند د ارامه برنج تڼۍ سره. جوړ شوی چې د پالتو لاندې ورک شي.",
    },
    story: {
      en: "Hardware we can recut without a new factory.",
      "fa-AF": "یراق‌آلاتی که بدون کارخانه جدید دوباره می‌بریم.",
      ps: "هغه اسباب چې پرته له نوې فابریکې یې بیا پرې کوو.",
    },
    fabric: {
      en: "Leather, brass.",
      "fa-AF": "چرم، برنج.",
      ps: "چرم، برنج.",
    },
    care: {
      en: "Wipe dry.",
      "fa-AF": "خشک پاک کنید.",
      ps: "وچ پاک کړئ.",
    },
  },
  "rf34-tailored-jacket": {
    name: { en: "Tailored Jacket", "fa-AF": "کت دوخته", ps: "ګنډل شوی کټ" },
    description: {
      en: "A two-button jacket with a satin lining and a set shoulder. Close at the waist, quiet at the lapel.",
      "fa-AF": "کت دو دکمه با آستر ساتن و شانه ثابت. نزدیک کمر، آرام در یقه.",
      ps: "دوه تڼۍ کټ د ساتن استر او ټینګې اوږې سره. پر ملا نږدې، پر یخن ارام.",
    },
    story: {
      en: "The jacket we put on the rail when someone asks what Thirty Four looks like at nine in the morning.",
      "fa-AF": "کتی که وقتی می‌پرسند سی‌وچهار ساعت نه صبح چگونه است، روی ریل می‌گذاریم.",
      ps: "هغه کټ چې کله څوک وپوښتي دېرش څلور په نهه بجو سهار څنګه ښکاري، پر ریل یې ږدو.",
    },
    fabric: {
      en: "Wool crepe, viscose lining.",
      "fa-AF": "کرپ پشم، آستر ویسکوز.",
      ps: "وړۍ کریپ، ویسکوز استر.",
    },
    care: {
      en: "Dry clean. Hang on a shaped hanger.",
      "fa-AF": "خشکشویی. روی چوب‌لباس شکل‌دار بیاویزید.",
      ps: "وچ پاکول. په جوړ زنګون کې ځوړند کړئ.",
    },
  },
  "house-cotton-tee": {
    name: { en: "House Cotton Tee", "fa-AF": "تی‌شرت پنبه خانه", ps: "د کور پنبه ټي" },
    description: {
      en: "A dense cotton crew with a bound neck and a hem that stays put. The colours we keep on the table.",
      "fa-AF": "تی‌شرت پنبه فشرده با یقه دوخته و دامنی که سر جایش می‌ماند. رنگ‌هایی که روی میز نگه می‌داریم.",
      ps: "کلک پنبه کریو د تړلي یخن او څنډې سره چې پر ځای پاتې کېږي. هغه رنګونه چې پر میز یې ساتو.",
    },
    story: {
      en: "Not a campaign piece. The shirt under the jacket, and sometimes the jacket itself.",
      "fa-AF": "قطعه کمپاین نیست. پیراهن زیر کت، و گاهی خود کت.",
      ps: "د کمپاین ټوټه نه ده. د کټ لاندې کمیس، او کله کټ پخپله.",
    },
    fabric: {
      en: "100% cotton jersey, 220 gsm.",
      "fa-AF": "۱۰۰٪ پنبه جرسی، ۲۲۰ گرم.",
      ps: "۱۰۰٪ پنبه جرسي، ۲۲۰ ګرام.",
    },
    care: {
      en: "Machine wash cold. Dry flat.",
      "fa-AF": "شستشوی ماشینی سرد. صاف خشک کنید.",
      ps: "په ساړه ماشین کې ومینځئ. هوار وچ کړئ.",
    },
  },
};

export function productName(slug: string, lang: string, fallback: string) {
  const copy = productCopy[slug];
  return copy ? tr(copy.name, lang) : fallback;
}

export function colorLabel(name: string, lang: string) {
  const pack = colorCopy[name];
  return pack ? tr(pack, lang) : name;
}

export function collectionLabel(slug: string, lang: string) {
  const pack = collectionCopy[slug];
  return pack ? tr(pack, lang) : slug;
}

export function cityLabel(name: string, lang: string) {
  const pack = cityCopy[name];
  return pack ? tr(pack, lang) : name;
}

export function localizeProduct(product: Product, lang: string): Product {
  const copy = productCopy[product.slug];
  const code = langOf(lang);
  if (!copy) {
    return {
      ...product,
      colors: product.colors.map((color) => ({ ...color, name: colorLabel(color.name, code) })),
    };
  }
  return {
    ...product,
    name: copy.name[code],
    description: copy.description[code],
    story: copy.story[code],
    fabric: copy.fabric[code],
    care: copy.care[code],
    colors: product.colors.map((color) => ({ ...color, name: colorLabel(color.name, code) })),
  };
}

export function productSearchText(product: Product) {
  const copy = productCopy[product.slug];
  const localized = copy
    ? Object.values(copy.name)
        .concat(Object.values(copy.description), Object.values(copy.fabric))
        .join(" ")
    : "";
  return [product.name, product.description, product.collection, product.category, product.subcategory, product.fabric, localized]
    .join(" ")
    .toLowerCase();
}
