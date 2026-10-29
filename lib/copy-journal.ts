import { journal as englishJournal } from "./journal";
import { langOf, tr, type Triple } from "./triple";

export type LocalizedArticle = {
  slug: string;
  title: string;
  kicker: string;
  date: string;
  excerpt: string;
  readTime: string;
  image: string;
  body: string[];
};

type ArticleCopy = {
  title: Triple;
  kicker: Triple;
  excerpt: Triple;
  readTime: Triple;
  body: Triple[];
};

const articles: Record<string, ArticleCopy> = {
  "the-number-not-the-season": {
    title: {
      en: "The number, not the season",
      "fa-AF": "شماره، نه فصل",
      ps: "شمېر، نه موسم",
    },
    kicker: { en: "House notes", "fa-AF": "یادداشت خانه", ps: "د کور یادښتونه" },
    excerpt: {
      en: "We do not name drops after months. Thirty Four is a number you can keep. Cloth should outlast the campaign that sold it.",
      "fa-AF": "قطعات را به نام ماه نمی‌گذاریم. سی‌وچهار شماری است که می‌ماند. پارچه باید از کمپاین فروش زنده‌تر بماند.",
      ps: "ټوټې د میاشتو په نوم نه نوموو. دېرش څلور هغه شمېر دی چې پاتې کېږي. جامه باید له هغه کمپاین اوږده ژوند وکړي چې وپلورله.",
    },
    readTime: { en: "4 min", "fa-AF": "۴ دقیقه", ps: "۴ دقیقې" },
    body: [
      {
        en: "Fashion likes a calendar. We like a wardrobe that still works when the calendar has moved on. The house is called Thirty Four because a number does not expire, and because the first pattern block we kept — a coat, a shirt, a child’s hem — was marked 34 on the envelope.",
        "fa-AF": "مد تقویم دوست دارد. ما الماری‌ای را دوست داریم که وقتی تقویم رفته، هنوز کار کند. خانه سی‌وچهار نام دارد چون شماره منقضی نمی‌شود، و چون نخستین بلوک الگو که نگه داشتیم — پالتو، پیراهن، دامن کودک — روی پاکت ۳۴ بود.",
        ps: "فیشن کلیزه خوښوي. موږ هغه الماري خوښوو چې کله کلیزه تېره شي لا هم کار کوي. کور دېرش څلور نومېږي ځکه شمېر نه ختمېږي، او ځکه لومړی بڼه بلاک چې وساته — پالتو، کمیس، د ماشوم څنډه — پر پاکټ ۳۴ و.",
      },
      {
        en: "Kabul teaches patience. Dust, heat, a sudden cold. Cloth that only photographs well in a studio will fail on the street by Friday. So we cut with that Friday in mind: denser weaves, quieter colour, seams that can be let out once.",
        "fa-AF": "کابل صبر می‌آموزد. غبار، گرما، سرمای ناگهانی. پارچه‌ای که فقط در استودیو عکس خوب می‌دهد تا جمعه در خیابان می‌بازد. پس با همان جمعه می‌بریم: بافت فشرده‌تر، رنگ آرام‌تر، درزهایی که یک‌بار باز می‌شوند.",
        ps: "کابل صبر ښيي. دوړه، تودوخه، ناڅاپه ساړه. هغه جامه چې یوازې په سټوډیو کې ښه عکس ورکوي تر جمعې په کوڅه کې ماتېږي. نو هماغه جمعه په ذهن کې پرې کوو: کلک تار، ارام رنګ، درزونه چې یو ځل خلاصېږي.",
      },
      {
        en: "When we add footwear, bags, fragrance, they will sit in the same number. Not a new brand, not a louder one. The same house, more rooms.",
        "fa-AF": "وقتی کفش، کیف، عطر بیفزاییم، در همان شماره می‌نشینند. برند نو نیست، بلندتر هم نیست. همان خانه، اتاق‌های بیشتر.",
        ps: "کله چې بوټان، کڅوړې، عطر زیاتوو، په همدغه شمېر کې ناست وي. نوی برانډ نه، لوړ هم نه. همدا کور، نورې خونې.",
      },
    ],
  },
  "cloth-cut-for-kabul-light": {
    title: {
      en: "Cloth cut for Kabul light",
      "fa-AF": "پارچه برش‌شده برای نور کابل",
      ps: "د کابل رڼا لپاره پرې شوې جامه",
    },
    kicker: { en: "Atelier", "fa-AF": "آتلیه", ps: "آتلیه" },
    excerpt: {
      en: "Afternoon light here is pale and exacting. Ivory cannot be too yellow. Black cannot be cheap. We sample in the window, not under a ring light.",
      "fa-AF": "نور بعدازظهر اینجا کمرنگ و سخت‌گیر است. عاج نباید خیلی زرد باشد. سیاه نباید ارزان به‌نظر برسد. در پنجره می‌آزماییم، نه زیر نور حلقه.",
      ps: "دلته د ماسپښین رڼا سپکه او سخت‌ګیره ده. عاج باید ډېر زیړ نه وي. تور باید ارزانه نه ښکاري. په کړکۍ کې ازموو، نه د حلقې رڼا لاندې.",
    },
    readTime: { en: "5 min", "fa-AF": "۵ دقیقه", ps: "۵ دقیقې" },
    body: [
      {
        en: "The atelier window faces west. By four, the room is the colour of tea with too little milk. That is the light we trust. A camel coat that looks rich at noon can look dirty at four; we recut the dye lot until it does not.",
        "fa-AF": "پنجره آتلیه به غرب است. تا چهار، اتاق رنگ چای با شیر کم است. این نوری است که اعتماد می‌کنیم. پالتو شتری که ظهر غنی به‌نظر می‌رسد ساعت چهار ممکن است کثیف بنماید؛ رنگ را دوباره می‌بریم تا چنین نشود.",
        ps: "د آتلیه کړکۍ لویدیځ ته ده. تر څلورو، خونه د چای رنګ وي چې شیدې یې لږې وي. دا هغه رڼا ده چې باور پرې کوو. اوښی پالتو چې په غرمه شتمن ښکاري په څلورو کې ممکن خټکی ښکاره شي؛ رنګ بیا پرې کوو تر څو داسې نه وي.",
      },
      {
        en: "International sales will come. They should not require a different product — only a different shipping note. The cloth is already made to travel: unstructured jackets, silks that pack, children’s hems with a hidden centimetre.",
        "fa-AF": "فروش بین‌المللی می‌آید. محصول دیگری نمی‌خواهد — فقط یادداشت ارسال دیگر. پارچه از پیش برای سفر ساخته شده: کت بدون ساخت، ابریشم قابل بسته‌بندی، دامن کودک با سانتی‌متر پنهان.",
        ps: "نړیوال پلور به راشي. بل محصول نه غواړي — یوازې د لېږد بل یادښت. جامه له مخکې د سفر لپاره جوړه ده: ناجوړ کټونه، وريښم چې بسته کېږي، د ماشومانو څنډې د پټ سانتی‌متر سره.",
      },
      {
        en: "If you are reading this from London or Dubai, the same coat is on the rail. We will not invent a second Thirty Four for export.",
        "fa-AF": "اگر از لندن یا دبی می‌خوانید، همان پالتو روی ریل است. سی‌وچهار دومی برای صادرات نمی‌سازیم.",
        ps: "که دا له لندن یا دوبۍ لولئ، همدا پالتو پر ریل دی. د صادر لپاره دویم دېرش څلور نه جوړوو.",
      },
    ],
  },
  "how-we-size-little-34": {
    title: {
      en: "How we size Little 34",
      "fa-AF": "چگونه کوچک ۳۴ را اندازه می‌کنیم",
      ps: "کوچنی ۳۴ څنګه اندازه کوو",
    },
    kicker: { en: "Kids", "fa-AF": "کودکان", ps: "ماشومان" },
    excerpt: {
      en: "Children grow in jumps. We hide fabric in the cuff and keep the shoulder honest, so a coat can last two winters without looking borrowed.",
      "fa-AF": "کودکان جهشی رشد می‌کنند. در مچ پارچه پنهان می‌کنیم و شانه را راست نگه می‌داریم تا پالتو دو زمستان بماند بی‌آنکه عاریه‌ای بنماید.",
      ps: "ماشومان په ټوپ وده کوي. په مړوند کې جامه پټوو او اوږه رښتینې ساتو، چې پالتو دوه ژمي پاتې شي پرته له دې چې پور ښکاره شي.",
    },
    readTime: { en: "3 min", "fa-AF": "۳ دقیقه", ps: "۳ دقیقې" },
    body: [
      {
        en: "Little 34 is not adult cloth shrunk on a photocopier. The shoulder is redrawn. The pocket is placed where a hand actually is. The lining is cotton, because wool on a child’s neck is an argument you will lose.",
        "fa-AF": "کوچک ۳۴ پارچه بزرگسال کوچک‌شده با فتوکپی نیست. شانه دوباره کشیده می‌شود. جیب جایی است که دست واقعاً هست. آستر پنبه است، چون پشم روی گردن کودک بحثی است که می‌بازی.",
        ps: "کوچنی ۳۴ د لویانو جامه نه ده چې پر فتوکاپي راکښته شوې. اوږه بیا ایستل کېږي. جیب هلته دی چې لاس رښتیا وي. استر پنبه ده، ځکه وړۍ پر د ماشوم غاړه هغه بحث دی چې بایلئ یې.",
      },
      {
        en: "Every kids piece ships with a small card: how to let the hem, how to wash the knit, how to send it back if the size is wrong. Exchange is part of the garment.",
        "fa-AF": "هر قطعه کودک با کارت کوچک می‌آید: چگونه دامن را باز کنید، چگونه بافت را بشویید، چگونه اگر اندازه غلط بود برگردانید. تعویض بخشی از لباس است.",
        ps: "هر د ماشوم ټوټه د وړوکي کارت سره راځي: څنډه څنګه پرېږدئ، بافت څنګه ومینځئ، که اندازه ناسمه وه څنګه یې بیرته ولېږئ. بدلون د جامې برخه ده.",
      },
      {
        en: "Parents in Herat and in Vienna should be able to order the same coat. Sizing is in years, with a chest measurement on every product page. Guess less; keep the receipt.",
        "fa-AF": "والدین در هرات و وین باید همان پالتو را سفارش توانند. اندازه به سال است، با اندازه سینه در هر صفحه محصول. کمتر حدس بزنید؛ رسید را نگه دارید.",
        ps: "مور او پلار په هرات او ویانا کې باید همدا پالتو سپارښتنه کولی شي. اندازه په کلونو ده، د سینې اندازه پر هر محصول پاڼه. لږ اټکل وکړئ؛ رسېد وساتئ.",
      },
    ],
  },
};

export function localizeArticle(slug: string, lang: string): LocalizedArticle | undefined {
  const base = englishJournal.find((entry) => entry.slug === slug);
  const copy = articles[slug];
  if (!base || !copy) return undefined;
  const code = langOf(lang);
  return {
    slug: base.slug,
    image: base.image,
    date: base.date,
    title: copy.title[code],
    kicker: copy.kicker[code],
    excerpt: copy.excerpt[code],
    readTime: copy.readTime[code],
    body: copy.body.map((paragraph) => paragraph[code]),
  };
}

export function localizeJournal(lang: string) {
  return englishJournal
    .map((entry) => localizeArticle(entry.slug, lang))
    .filter((entry): entry is LocalizedArticle => Boolean(entry));
}

export function journalHaystack(slug: string) {
  const copy = articles[slug];
  if (!copy) return "";
  return [copy.title, copy.kicker, copy.excerpt, ...copy.body]
    .flatMap((item) => (Array.isArray(item) ? item : [item]))
    .flatMap((triple) => Object.values(triple as Triple))
    .join(" ")
    .toLowerCase();
}
