import type { LangCode } from "./i18n";
import { langOf } from "./triple";

export type DocSection = { h: string; p: string };
export type FaqItem = { q: string; a: string };
export type CollectionCopy = { title: string; kicker: string; story: string };

type Pack<T> = Record<LangCode, T>;

function pick<T>(pack: Pack<T>, lang: string): T {
  return pack[langOf(lang)] ?? pack.en;
}

const faq: Pack<FaqItem[]> = {
  en: [
    {
      q: "Where do you ship?",
      a: "Kabul delivery is complimentary. Other Afghan cities are a flat atelier rate. International parcels are open — the checkout already has a zone, and carriers can be swapped per market.",
    },
    {
      q: "How long does delivery take?",
      a: "Kabul: usually 1–2 working days. Other Afghan cities: 3–5. International: quoted when the parcel is packed, typically 7–14.",
    },
    {
      q: "Can I exchange a size?",
      a: "Yes, within 14 days if the piece is unworn, with tags. Kids pieces are drafted with a hidden centimetre; if it still fails, we exchange. See Terms.",
    },
    {
      q: "Which currencies can I pay in?",
      a: "The site displays USD, EUR, and GBP. Settlement today is in USD unless we agree otherwise on WhatsApp. More rails can be added without a redesign.",
    },
    {
      q: "Do you have Dari or Pashto?",
      a: "Yes. English, Dari, and Pashto live on the same house. Choose the language from the flag menu or the mobile sheet.",
    },
    {
      q: "How do I order on WhatsApp?",
      a: "WhatsApp and email sit together on Contact and in the footer. There is no chat button on the shop pages.",
    },
  ],
  "fa-AF": [
    {
      q: "به کجا می‌فرستید؟",
      a: "ارسال کابل رایگان است. سایر شهرهای افغانستان نرخ ثابت آتلیه دارند. بسته‌های بین‌المللی باز است — تکمیل خرید منطقه دارد و حامل در هر بازار عوض می‌شود.",
    },
    {
      q: "ارسال چقدر طول می‌کشد؟",
      a: "کابل: معمولاً ۱–۲ روز کاری. سایر شهرهای افغانستان: ۳–۵. بین‌المللی: هنگام بسته‌بندی گفته می‌شود، معمولاً ۷–۱۴.",
    },
    {
      q: "می‌توانم اندازه را عوض کنم؟",
      a: "بله، تا ۱۴ روز اگر قطعه نپوشیده و با برچسب باشد. قطعات کودک سانتی‌متر پنهان دارند؛ اگر باز هم نخورد، تعویض می‌کنیم. شرایط را ببینید.",
    },
    {
      q: "با کدام ارز می‌پردازم؟",
      a: "سایت دلار، یورو و پوند نشان می‌دهد. تسویه امروز به دلار است مگر در واتساپ خلاف آن توافق شود. ریل‌های بیشتر بدون طراحی دوباره افزوده می‌شود.",
    },
    {
      q: "دری یا پشتو دارید؟",
      a: "بله. انگلیسی، دری و پشتو در همین خانه زنده‌اند. زبان را از فهرست پرچم یا منوی موبایل برگزینید.",
    },
    {
      q: "چگونه در واتساپ سفارش دهم؟",
      a: "واتساپ و ایمیل با هم در تماس و پاورقی‌اند. دکمه گفتگو روی صفحات فروشگاه نیست.",
    },
  ],
  ps: [
    {
      q: "چېرته لېږئ؟",
      a: "د کابل لېږد وړیا دی. نور افغان ښارونه د آتلیه ثابت نرخ لري. نړیوالې بستې پرانیستې دي — پېرود بشپړول سیمه لري او وړونکی په هر بازار بدلېږي.",
    },
    {
      q: "لېږد څومره وخت نیسي؟",
      a: "کابل: معمولاً ۱–۲ کاري ورځې. نور افغان ښارونه: ۳–۵. نړیوال: کله چې بسته کېږي ویل کېږي، معمولاً ۷–۱۴.",
    },
    {
      q: "اندازه بدلولی شم؟",
      a: "هو، په ۱۴ ورځو کې که ټوټه نه‌اغوستل شوې وي، د ټګ سره. د ماشومانو ټوټې پټ سانتی‌متر لري؛ که لا هم ونه خوري، بدلوو. شرطونه وګورئ.",
    },
    {
      q: "په کومه اسعارو تادیه کوم؟",
      a: "پاڼه ډالر، یورو او پونډ ښيي. نن تسویه په ډالر ده پرته له دې چې په واتساپ بل توافق شي. نور ریلونه پرته له بیا ډیزاین زیاتېږي.",
    },
    {
      q: "دري یا پښتو لرئ؟",
      a: "هو. انګلیسي، دري او پښتو په همدغه کور کې ژوندي دي. ژبه د بیرغ له مینو یا د موبایل پاڼې وټاکئ.",
    },
    {
      q: "په واتساپ څنګه سپارښتنه وکړم؟",
      a: "واتساپ او برېښنالیک په اړیکه او فوټر کې سره ناست دي. پر پلورنځي پاڼو د خبرو تڼۍ نشته.",
    },
  ],
};

const shipping: Pack<DocSection[]> = {
  en: [
    {
      h: "Zones",
      p: "Kabul hand delivery is complimentary. Other Afghan cities use a flat atelier rate. International parcels are quoted when the box is packed — the checkout already has the zone; the carrier can change without a redesign.",
    },
    {
      h: "Timing",
      p: "We pack after confirmation, not before. Kabul is usually one to two working days. Other Afghan cities typically three to five. International timing depends on the destination and is confirmed in writing — we will not invent a number here.",
    },
    {
      h: "Tracking",
      p: "Once a parcel leaves, you receive a tracking note by email or WhatsApp. Questions: contact the house.",
    },
  ],
  "fa-AF": [
    {
      h: "مناطق",
      p: "تحویل دستی کابل رایگان است. سایر شهرهای افغانستان نرخ ثابت آتلیه دارند. بسته‌های بین‌المللی هنگام بسته‌بندی قیمت می‌شوند — تکمیل خرید منطقه دارد؛ حامل بدون طراحی دوباره عوض می‌شود.",
    },
    {
      h: "زمان",
      p: "پس از تأیید می‌بندیم، نه پیش از آن. کابل معمولاً یک تا دو روز کاری است. سایر شهرهای افغانستان معمولاً سه تا پنج. زمان بین‌المللی به مقصد بستگی دارد و کتبی تأیید می‌شود — اینجا عدد نمی‌سازیم.",
    },
    {
      h: "پیگیری",
      p: "وقتی بسته رفت، یادداشت پیگیری به ایمیل یا واتساپ می‌رسد. پرسش: با خانه تماس بگیرید.",
    },
  ],
  ps: [
    {
      h: "سیمې",
      p: "د کابل لاسي تحویلي وړیا ده. نور افغان ښارونه د آتلیه ثابت نرخ لري. نړیوالې بستې کله چې بکس بسته شي نرخېږي — پېرود بشپړول سیمه لري؛ وړونکی پرته له بیا ډیزاین بدلېږي.",
    },
    {
      h: "وخت",
      p: "پس له تایید بسته کوو، مخکې نه. کابل معمولاً یوه تر دوه کاري ورځې وي. نور افغان ښارونه معمولاً درې تر پنځه. نړیوال وخت مقصد ته اړه لري او په لیک تاییدېږي — دلته شمېر نه جوړوو.",
    },
    {
      h: "تعقیب",
      p: "کله چې بسته ولاړه، د تعقیب یادښت په برېښنالیک یا واتساپ درکوي. پوښتنې: له کور سره اړیکه ونیسئ.",
    },
  ],
};

const returns: Pack<DocSection[]> = {
  en: [
    {
      h: "Eligibility",
      p: "Unworn pieces with tags may come back within 14 days of delivery. Fragrance opened past the seal is not returnable except for fault. Sale leftovers marked final follow the same fault rule.",
    },
    {
      h: "Process",
      p: "Write the atelier with your order number. We send a return note. Refunds follow the original method after the piece is checked in Kabul.",
    },
    {
      h: "Exchange",
      p: "Size exchanges inside Afghanistan are free if the counterpart is in stock. Kids pieces include a hidden centimetre; if it still fails, we exchange.",
    },
  ],
  "fa-AF": [
    {
      h: "شرایط",
      p: "قطعات نپوشیده با برچسب تا ۱۴ روز پس از تحویل برمی‌گردند. عطر بازشده پس از مهر جز برای عیب مرجوع نمی‌شود. باقی‌مانده فروش نهایی همان قاعده عیب را دارد.",
    },
    {
      h: "روند",
      p: "با شماره سفارش به آتلیه بنویسید. یادداشت مرجوعی می‌فرستیم. بازپرداخت پس از بررسی قطعه در کابل با همان روش اصلی است.",
    },
    {
      h: "تعویض",
      p: "تعویض اندازه داخل افغانستان رایگان است اگر همتا موجود باشد. قطعات کودک سانتی‌متر پنهان دارند؛ اگر باز هم نخورد، تعویض می‌کنیم.",
    },
  ],
  ps: [
    {
      h: "وړتیا",
      p: "نه‌اغوستل شوې ټوټې د ټګ سره په ۱۴ ورځو کې له تحویلۍ وروسته راګرځي. عطر چې مهر یې مات شوی وي پرته له عیب نه ستنیږي. د خرڅلاو پاتې نهايي همدا د عیب قاعده لري.",
    },
    {
      h: "بهیر",
      p: "د سپارښتنې شمېر سره آتلیه ته ولیکئ. د ستنېدو یادښت درلېږو. بیرته ورکړه پس له دې چې ټوټه په کابل کې وکتل شي د اصلي طریقې سره ده.",
    },
    {
      h: "بدلون",
      p: "د اندازې بدلون په افغانستان کې وړیا دی که سیال شته وي. د ماشومانو ټوټې پټ سانتی‌متر لري؛ که لا هم ونه خوري، بدلوو.",
    },
  ],
};

const collections: Pack<Record<string, CollectionCopy>> = {
  en: {
    "new-season": {
      title: "New Season",
      kicker: "On the rail",
      story: "The current cut. Nothing held back for a louder month.",
    },
    essentials: {
      title: "Essentials",
      kicker: "The house shirt",
      story: "Pieces we recut without a campaign.",
    },
    signature: {
      title: "Fragrance Edit",
      kicker: "Signature",
      story: "Two scents. The rest of the cabinet can wait.",
    },
    "little-34": {
      title: "Little 34",
      kicker: "Kids",
      story: "Grown cloth, honest shoulders, a hidden centimetre in the hem.",
    },
  },
  "fa-AF": {
    "new-season": {
      title: "فصل تازه",
      kicker: "روی ریل",
      story: "برش کنونی. چیزی برای ماه بلندتر نگه نداشته‌ایم.",
    },
    essentials: {
      title: "ضروریات",
      kicker: "پیراهن خانه",
      story: "قطعاتی که بدون کمپاین دوباره می‌بریم.",
    },
    signature: {
      title: "ویرایش عطر",
      kicker: "امضا",
      story: "دو عطر. بقیه کابینت می‌تواند صبر کند.",
    },
    "little-34": {
      title: "کوچک ۳۴",
      kicker: "کودکان",
      story: "پارچه بزرگ، شانه راست، سانتی‌متر پنهان در دامن.",
    },
  },
  ps: {
    "new-season": {
      title: "نوی موسم",
      kicker: "پر ریل",
      story: "اوسنی پرې‌کښ. د لوړې میاشتې لپاره هیڅ نه دی ساتل شوی.",
    },
    essentials: {
      title: "اړین توکي",
      kicker: "د کور کمیس",
      story: "ټوټې چې پرته له کمپاین یې بیا پرې کوو.",
    },
    signature: {
      title: "د عطر انتخاب",
      kicker: "لاسلیک",
      story: "دوه بویونه. پاتې الماري انتظار کولی شي.",
    },
    "little-34": {
      title: "کوچنی ۳۴",
      kicker: "ماشومان",
      story: "لویه جامه، رښتینې اوږې، په څنډه کې پټ سانتی‌متر.",
    },
  },
};

export function faqItems(lang: string) {
  return pick(faq, lang);
}

export function shippingSections(lang: string) {
  return pick(shipping, lang);
}

export function returnsSections(lang: string) {
  return pick(returns, lang);
}

export function collectionCopyFor(slug: string, lang: string): CollectionCopy | undefined {
  return pick(collections, lang)[slug];
}

export const aboutExtra: Pack<{ whyTitle: string; whyBody: string; firstTitle: string; firstBody: string }> = {
  en: {
    whyTitle: "Why 34",
    whyBody:
      "The first pattern envelope we refused to throw away was marked 34. A coat, a shirt, a child’s hem. The number survived the season, so the house took it. T.F.G34 is the stamp; THIRTY FOUR is the name you say in a shop.",
    firstTitle: "Afghanistan first",
    firstBody:
      "We sample in Kabul light and ship from here. International sales are not a different product — they are a different label on the same box. Dari and Pashto are living languages on this house, beside English.",
  },
  "fa-AF": {
    whyTitle: "چرا ۳۴",
    whyBody:
      "نخستین پاکت الگو که نینداختیم ۳۴ داشت. پالتو، پیراهن، دامن کودک. شماره از فصل جان به در برد، خانه آن را گرفت. T.F.G34 مهر است؛ THIRTY FOUR نامی است که در فروشگاه می‌گویی.",
    firstTitle: "افغانستان نخست",
    firstBody:
      "در نور کابل می‌آزماییم و از اینجا می‌فرستیم. فروش بین‌المللی محصول دیگر نیست — برچسب دیگر روی همان جعبه است. دری و پشتو زبان‌های زنده این خانه‌اند، کنار انگلیسی.",
  },
  ps: {
    whyTitle: "ولې ۳۴",
    whyBody:
      "لومړی د بڼې پاکټ چې مو ونه غورځاوه ۳۴ و. پالتو، کمیس، د ماشوم څنډه. شمېر له موسم وژغورل شو، کور یې واخیست. T.F.G34 مهر دی؛ THIRTY FOUR هغه نوم دی چې په پلورنځي کې یې وایې.",
    firstTitle: "افغانستان لومړی",
    firstBody:
      "په د کابل رڼا کې ازموو او له دې ځایه لېږو. نړیوال پلور بل محصول نه دی — پر همدغه بکس بل لیبل دی. دري او پښتو د دې کور ژوندۍ ژبې دي، د انګلیسي تر څنګ.",
  },
};

export function aboutExtraCopy(lang: string) {
  return pick(aboutExtra, lang);
}
