import type { LangCode } from "./i18n";
import { langOf } from "./triple";
import type { DocSection } from "./copy-pages";

type Pack<T> = Record<LangCode, T>;

function pick<T>(pack: Pack<T>, lang: string): T {
  return pack[langOf(lang)] ?? pack.en;
}

const privacy: Pack<DocSection[]> = {
  en: [
    {
      h: "Who we are",
      p: "THIRTY FOUR / Thirty Four Global (“we”, “the house”) is the controller of personal data collected through thirtyfourglobal.com and related checkout, WhatsApp, and email channels. For data requests write the house email or WhatsApp.",
    },
    {
      h: "What we collect",
      p: "Identity and contact details you give us (name, email, phone, delivery address). Order contents, payment method choice, and messages you send. Technical data such as IP address, browser, device, and pages viewed. Bag and wishlist contents stored on your device. Account identifiers if you create an account. We do not ask for card numbers on this site; card payments, when enabled, are handled by Stripe.",
    },
    {
      h: "Why we use it",
      p: "To fulfil a contract: pack and ship orders, confirm stock, handle returns, and answer WhatsApp or email. Legitimate interests: keep the shop secure, prevent fraud, improve the catalogue. Consent: newsletter mail, and analytics or advertising pixels only when those tools are switched on and you have not refused them. Legal obligation: invoices, tax, and consumer-law records.",
    },
    {
      h: "Sharing",
      p: "We do not sell personal data. We share what a processor needs to do its job: hosting (Vercel), payments (Stripe, when configured), product analytics (PostHog, after you accept analytics cookies), email or SMS delivery if those keys are set, and carriers for the parcel. WhatsApp is Meta’s service; messages you send there follow Meta’s terms as well as ours.",
    },
    {
      h: "Where it is stored",
      p: "Servers may be outside your country, including the EU and the United States. Where we transfer data internationally we rely on the processor’s appropriate safeguards and keep collection to what the order requires.",
    },
    {
      h: "How long we keep it",
      p: "Orders and invoices are kept as long as tax and consumer law require. Newsletter addresses until you unsubscribe. Guest bag data lives in your browser until you clear it. Account records until you ask us to close the account, subject to legal retention.",
    },
    {
      h: "Your rights",
      p: "Depending on where you live (including the EU/EEA and UK), you may request access, correction, deletion, restriction, objection, or portability of your data, and you may withdraw consent at any time. You may complain to your local supervisory authority. To exercise a right, email the house with “Data request” in the subject. We will answer within one month unless the law allows more time.",
    },
    {
      h: "Children",
      p: "Kids pieces are sold to adults. We do not knowingly collect data from children under 16 for marketing.",
    },
    {
      h: "Cookies",
      p: "See the Cookie Policy for categories, consent, and how to refuse non-essential cookies.",
    },
  ],
  "fa-AF": [
    {
      h: "ما کی هستیم",
      p: "THIRTY FOUR / Thirty Four Global («ما»، «خانه») کنترل‌کننده داده‌های شخصی جمع‌آوری‌شده از طریق thirtyfourglobal.com و کانال‌های تکمیل خرید، واتساپ و ایمیل است. برای درخواست داده به ایمیل خانه یا واتساپ بنویسید.",
    },
    {
      h: "چه جمع می‌کنیم",
      p: "هویت و تماس که می‌دهید (نام، ایمیل، تلفن، نشانی تحویل). محتوای سفارش، انتخاب روش پرداخت، و پیام‌هایی که می‌فرستید. داده فنی مانند آی‌پی، مرورگر، دستگاه و صفحات دیده‌شده. محتوای کیف و علاقه‌مندی روی دستگاه شما. شناسه حساب اگر حساب بسازید. شماره کارت در این سایت نمی‌پرسیم؛ پرداخت کارت، وقتی روشن باشد، با استرایپ است.",
    },
    {
      h: "چرا استفاده می‌کنیم",
      p: "برای اجرای قرارداد: بسته‌بندی و ارسال، تأیید موجودی، مرجوعی، پاسخ واتساپ یا ایمیل. منافع مشروع: امنیت فروشگاه، جلوگیری از تقلب، بهبود کاتالوگ. رضایت: خبرنامه، و پیکسل تحلیل یا تبلیغ فقط وقتی ابزار روشن باشد و رد نکرده باشید. الزام قانونی: فاکتور، مالیات، سوابق قانون مصرف‌کننده.",
    },
    {
      h: "اشتراک",
      p: "داده شخصی نمی‌فروشیم. آنچه پردازنده برای کارش نیاز دارد شریک می‌شویم: میزبانی (Vercel)، پرداخت (استرایپ، وقتی پیکربندی شود)، تحلیل محصول (PostHog، پس از پذیرش کوکی تحلیل)، ارسال ایمیل یا پیامک اگر کلید باشد، و حامل بسته. واتساپ خدمت متا است؛ پیام آنجا شرایط متا و ما را دارد.",
    },
    {
      h: "کجا ذخیره می‌شود",
      p: "سرورها ممکن است بیرون کشور شما باشند، از جمله اتحادیه اروپا و آمریکا. در انتقال بین‌المللی به ضمانت مناسب پردازنده تکیه می‌کنیم و جمع را به نیاز سفارش محدود می‌کنیم.",
    },
    {
      h: "چقدر نگه می‌داریم",
      p: "سفارش و فاکتور تا الزام مالیات و قانون مصرف‌کننده. نشانی خبرنامه تا لغو اشتراک. داده کیف مهمان در مرورگر می‌ماند تا پاک کنید. سوابق حساب تا بخواهید ببندید، با حفظ قانونی.",
    },
    {
      h: "حقوق شما",
      p: "بسته به محل زندگی (از جمله اتحادیه اروپا/منطقه اقتصادی اروپا و بریتانیا) می‌توانید دسترسی، اصلاح، حذف، محدودیت، اعتراض یا انتقال داده بخواهید و رضایت را هر وقت پس بگیرید. می‌توانید به مرجع نظارتی محل شکایت کنید. برای اعمال حق، با موضوع «درخواست داده» ایمیل کنید. ظرف یک ماه پاسخ می‌دهیم مگر قانون وقت بیشتر بدهد.",
    },
    {
      h: "کودکان",
      p: "قطعات کودک به بزرگسال فروخته می‌شود. دانسته از کودکان زیر ۱۶ سال برای بازاریابی داده جمع نمی‌کنیم.",
    },
    {
      h: "کوکی",
      p: "سیاست کوکی را برای دسته‌ها، رضایت، و رد کوکی غیرضروری ببینید.",
    },
  ],
  ps: [
    {
      h: "موږ څوک یو",
      p: "THIRTY FOUR / Thirty Four Global («موږ»، «کور») د هغو شخصي معلوماتو کنټرول کوونکی دی چې له thirtyfourglobal.com او د پېرود، واتساپ او برېښنالیک چینلونو راټولېږي. د معلوماتو غوښتنې لپاره د کور برېښنالیک یا واتساپ ته ولیکئ.",
    },
    {
      h: "څه راټولوو",
      p: "هويت او اړیکه چې راکوئ (نوم، برېښنالیک، تلیفون، د تحویلۍ پته). د سپارښتنې منځپانګه، د تادیې لاره، او پیامونه. تخنیکي معلومات لکه آی‌پي، براوزر، وسیله او لیدل شوې پاڼې. د کڅوړې او خوښو منځپانګه پر وسیله. د حساب پېژندنه که حساب جوړ کړئ. دلته د کارت شمېر نه غواړو؛ د کارت تادیه، کله چې پرانیستل شي، له سترایپ سره ده.",
    },
    {
      h: "ولې یې کاروو",
      p: "د قرارداد پوره کولو لپاره: بسته او لېږد، موجودي تایید، ستنېدنه، واتساپ یا برېښنالیک ځواب. مشروع ګټې: د پلورنځي امنیت، د درغلۍ مخنیوی، د کاتالوگ ښه والی. رضایت: خبرپاڼه، او د تحلیل یا اعلان پیکسل یوازې کله چې وسیله بل وي او رد کړي نه وي. قانوني مکلفیت: بیل، مالیه، د مصرف‌کوونکي قانون سوابق.",
    },
    {
      h: "شریکول",
      p: "شخصي معلومات نه پلورو. هغه څه شریک کوو چې پروسسر یې د کار لپاره اړتیا لري: کوربه (Vercel)، تادیه (سترایپ)، د محصول تحلیل (PostHog، پس له د کوکي منلو)، برېښنالیک یا اس‌ام‌اس که کیلي وي، او د بستې وړونکی. واتساپ د میټا خدمت دی؛ هلته پیام د میټا او زموږ شرطونه لري.",
    },
    {
      h: "چېرته ساتل کېږي",
      p: "سرورونه ممکن ستاسو له هېواد بهر وي، په شمول د اروپا اتحادیې او امریکا. په نړیوال لېږد کې د پروسسر پر مناسبو ضمانتونو تکیه کوو او راټولول د سپارښتنې اړتیا ته محدود ساتو.",
    },
    {
      h: "څومره ساتو",
      p: "سپارښتنې او بیلونه تر ماليې او د مصرف‌کوونکي قانون پورې. د خبرپاڼې پته تر ګډون لغوه. د مېلمه کڅوړه په براوزر کې پاتې کېږي تر پاکولو. د حساب سوابق تر هغه چې وتړئ، د قانوني ساتنې سره.",
    },
    {
      h: "ستاسو حقونه",
      p: "د استوګنې له مخې (په شمول د اروپا/EEA او بریتانیا) کولای شئ لاسرسی، سمون، حذف، محدودیت، اعتراض یا لېږد وغواړئ او رضایت هر وخت بیرته واخلئ. کولای شئ محلي ناظر ته شکایت وکړئ. د حق لپاره، د «د معلوماتو غوښتنه» موضوع سره برېښنالیک وکړئ. په یوه میاشت کې ځواب ورکوو پرته له دې چې قانون نور وخت ورکړي.",
    },
    {
      h: "ماشومان",
      p: "د ماشومانو ټوټې لویانو ته پلورل کېږي. په پوهه له ۱۶ کالو کم ماشومانو څخه د بازارموندنې لپاره معلومات نه راټولوو.",
    },
    {
      h: "کوکیز",
      p: "د کوکي تګلاره وګورئ د کټګوریو، رضایت، او د نااړینو کوکیو د رد لپاره.",
    },
  ],
};

const terms: Pack<DocSection[]> = {
  en: [
    {
      h: "Agreement",
      p: "These terms govern use of thirtyfourglobal.com and purchases from THIRTY FOUR / Thirty Four Global. By browsing, placing an order, or creating an account you accept them. Consumer-protection rules in your country sit alongside these terms and prevail where they are mandatory.",
    },
    {
      h: "The house",
      p: "Contact the house email and WhatsApp, Atelier 34, Shahr-e-Naw, Kabul. The website, domain, hosting, design files, and source belong to THIRTY FOUR.",
    },
    {
      h: "Accounts and guests",
      p: "You may browse, fill a bag, and check out as a guest. An account is optional and is offered at checkout. You are responsible for the accuracy of the address and contact details you give. Do not share atelier (staff) passwords.",
    },
    {
      h: "Orders",
      p: "An order is accepted when we confirm it by email or WhatsApp. Stock is reduced when checkout succeeds. If a piece has sold through between bag and confirmation, we offer a recut date or a refund. We may refuse an order that looks fraudulent or cannot be fulfilled.",
    },
    {
      h: "Price and payment",
      p: "Prices are set in USD. EUR and GBP are display conversions at a house rate. The charge currency is confirmed before payment. Pay on delivery, bank transfer, and WhatsApp orders are available now. Card checkout via Stripe is offered only when keys are configured.",
    },
    {
      h: "Delivery",
      p: "Kabul delivery is complimentary. Other Afghan cities and international parcels are quoted at checkout. Risk on Kabul hand delivery stays with the house until the door. Otherwise risk passes when the carrier collects, except where consumer law says otherwise. Customs on international parcels are the customer’s unless we agree in writing.",
    },
    {
      h: "Returns and refunds",
      p: "Unworn pieces with tags may be returned within 14 days of delivery. Sale leftovers marked as final are not refundable except for fault. EU/UK consumers may have a longer statutory cooling-off period; we will honour that where it applies. Refunds follow the original method within 10 working days of the piece arriving back.",
    },
    {
      h: "Intellectual property",
      p: "The 34 mark, photographs, copy, and code on this site are owned by THIRTY FOUR or used with permission. You may not copy the catalogue for another shop.",
    },
    {
      h: "Liability",
      p: "We are responsible for the cloth we send and for packing it properly. We are not responsible for delays once a parcel is with a carrier, for your internet connection, or for losses we could not reasonably foresee. Nothing here limits liability for fraud, death, or personal injury caused by negligence, or any right that cannot be limited by law.",
    },
    {
      h: "Privacy",
      p: "Personal data is handled as described in the Privacy Policy and Cookie Policy.",
    },
    {
      h: "Changes",
      p: "We may update these terms. The date on the page is the version that applies to new orders.",
    },
  ],
  "fa-AF": [
    {
      h: "توافق",
      p: "این شرایط استفاده از thirtyfourglobal.com و خرید از THIRTY FOUR را اداره می‌کند. با گشت، سفارش یا ساخت حساب می‌پذیرید. قواعد حمایت مصرف‌کننده کشور شما کنار این شرایط است و جایی که اجباری باشد مقدم است.",
    },
    {
      h: "خانه",
      p: "با ایمیل خانه و واتساپ تماس بگیرید، آتلیه ۳۴، شهرنو، کابل. وب‌سایت، دامنه، میزبانی، فایل طراحی و منبع از آن THIRTY FOUR است.",
    },
    {
      h: "حساب و مهمان",
      p: "می‌توانید بگردید، کیف پر کنید و به‌عنوان مهمان خرید کنید. حساب اختیاری است و در تکمیل خرید پیشنهاد می‌شود. صحت نشانی و تماس با شماست. گذرواژه آتلیه (کارکنان) را شریک نکنید.",
    },
    {
      h: "سفارش",
      p: "سفارش وقتی پذیرفته می‌شود که با ایمیل یا واتساپ تأیید کنیم. موجودی با موفقیت تکمیل خرید کم می‌شود. اگر قطعه میان کیف و تأیید تمام شود، تاریخ برش دوباره یا بازپرداخت می‌دهیم. ممکن است سفارش مشکوک یا غیرقابل اجرا را رد کنیم.",
    },
    {
      h: "قیمت و پرداخت",
      p: "قیمت به دلار است. یورو و پوند تبدیل نمایشی با نرخ خانه است. ارز شارژ پیش از پرداخت تأیید می‌شود. پرداخت هنگام تحویل، انتقال بانکی و سفارش واتساپ اکنون موجود است. پرداخت کارت با استرایپ فقط وقتی کلید پیکربندی شود.",
    },
    {
      h: "تحویل",
      p: "ارسال کابل رایگان است. سایر شهرهای افغانستان و بسته‌های بین‌المللی در تکمیل خرید گفته می‌شود. خطر تحویل دستی کابل تا در با خانه است. وگرنه خطر وقتی حامل گرفت منتقل می‌شود، جز جایی که قانون مصرف‌کننده خلاف بگوید. گمرک بین‌المللی با مشتری است مگر کتبی توافق شود.",
    },
    {
      h: "مرجوعی و بازپرداخت",
      p: "قطعات نپوشیده با برچسب تا ۱۴ روز پس از تحویل مرجوع می‌شود. باقی‌مانده فروش نهایی جز برای عیب بازپرداخت نمی‌شود. مصرف‌کنندگان اتحادیه اروپا/بریتانیا ممکن است مهلت قانونی بلندتر داشته باشند؛ جایی که اعمال شود رعایت می‌کنیم. بازپرداخت با روش اصلی ظرف ۱۰ روز کاری پس از رسیدن قطعه.",
    },
    {
      h: "مالکیت فکری",
      p: "نشان ۳۴، عکس، متن و کد این سایت از آن THIRTY FOUR است یا با اجازه استفاده می‌شود. کاتالوگ را برای فروشگاه دیگر رونویسی نکنید.",
    },
    {
      h: "مسئولیت",
      p: "مسئول پارچه‌ای هستیم که می‌فرستیم و بسته‌بندی درست آن. مسئول تأخیر پس از سپردن به حامل، اتصال اینترنت شما، یا زیان پیش‌بینی‌ناپذیر نیستیم. هیچ چیز اینجا مسئولیت تقلب، مرگ یا آسیب بدنی از غفلت، یا حقی که قانون محدود نکند را کم نمی‌کند.",
    },
    {
      h: "حریم خصوصی",
      p: "داده شخصی چنانکه در سیاست حریم خصوصی و سیاست کوکی آمده رسیدگی می‌شود.",
    },
    {
      h: "تغییرات",
      p: "ممکن است این شرایط را به‌روز کنیم. تاریخ صفحه نسخه سفارش‌های تازه است.",
    },
  ],
  ps: [
    {
      h: "تړون",
      p: "دا شرطونه د thirtyfourglobal.com کار او د THIRTY FOUR پېرود اداره کوي. په لیدلو، سپارښتنه یا حساب جوړولو یې منئ. د ستاسو د هېواد د مصرف‌کوونکي ساتنې قواعد تر څنګ دي او چېرته چې اجباري وي مقدم دي.",
    },
    {
      h: "کور",
      p: "د کور برېښنالیک او واتساپ ته اړیکه ونیسئ، آتلیه ۳۴، ښارنو، کابل. وېب‌پاڼه، ډومین، کوربه، ډیزاین فایل او سرچینه د THIRTY FOUR دي.",
    },
    {
      h: "حساب او مېلمه",
      p: "کولای شئ وګورئ، کڅوړه ډکه کړئ او د مېلمه په توګه پېرود وکړئ. حساب اختیاري دی او په پېرود بشپړولو کې وړاندیز کېږي. د پتې او اړیکې سم والی ستاسو دی. د آتلیه (کارکوونکو) پټنوم مه شریکوه.",
    },
    {
      h: "سپارښتنې",
      p: "سپارښتنه هغه وخت منل کېږي چې په برېښنالیک یا واتساپ یې تایید کړو. موجودي کله چې پېرود بریالی شي کمه کېږي. که ټوټه د کڅوړې او تایید تر منځ خلاصه شي، د بیا پرې‌کښ نېټه یا بیرته ورکړه وړاندې کوو. ممکن درغله یا نه‌پوره کېدونکې سپارښتنه رد کړو.",
    },
    {
      h: "بیه او تادیه",
      p: "بیې په ډالر دي. یورو او پونډ د کور په نرخ ښودنه ده. د چارج اسعار مخکې له تادیې تاییدېږي. د تحویلۍ پر مهال تادیه، بانکي لېږد او واتساپ سپارښتنه اوس شته. د کارت پېرود له سترایپ یوازې کله چې کیلي تنظیم شي.",
    },
    {
      h: "تحویلي",
      p: "د کابل لېږد وړیا دی. نور افغان ښارونه او نړیوالې بستې په پېرود بشپړولو کې ویل کېږي. د کابل لاسي تحویلۍ خطر تر دروازې د کور دی. بل ډول خطر کله چې وړونکی واخلي لېږدول کېږي، پرته له دې چې د مصرف‌کوونکي قانون بل ووايي. د نړیوالو بستو ګمرک د پیرودونکي دی پرته له لیکلي توافق.",
    },
    {
      h: "ستنېدنه او بیرته ورکړه",
      p: "نه‌اغوستل شوې ټوټې د ټګ سره په ۱۴ ورځو کې ستنیږي. د خرڅلاو پاتې نهايي پرته له عیب نه ستنیږي. د اروپا/بریتانیا مصرف‌کوونکي ممکن اوږد قانوني مهلت ولري؛ چېرته چې پلی کېږي یې منو. بیرته ورکړه د اصلي طریقې سره په ۱۰ کاري ورځو کې پس له رسېدو.",
    },
    {
      h: "فکري ملکیت",
      p: "د ۳۴ نښه، عکسونه، متن او کوډ د THIRTY FOUR دي یا په اجازه کارېږي. کاتالوگ د بل پلورنځي لپاره مه کاپي کوئ.",
    },
    {
      h: "مسؤلیت",
      p: "د هغې جامې مسؤل یو چې لېږو او د سمې بستې. د وړونکي له اخیستو وروسته ځنډ، ستاسو انټرنټ، یا نه اټکل کېدونکي زیان مسؤل نه یو. هیڅ دلته د درغلۍ، مرګ یا د غفلت له امله بدني زیان، یا هغه حق چې قانون یې محدود نه‌کړي مسؤلیت نه کموي.",
    },
    {
      h: "محرمیت",
      p: "شخصي معلومات لکه څنګه چې په د محرمیت تګلاره او د کوکي تګلاره کې دي رسیدگی کېږي.",
    },
    {
      h: "بدلونونه",
      p: "ممکن دا شرطونه تازه کړو. د پاڼې نېټه د نویو سپارښتنو نسخه ده.",
    },
  ],
};

const cookies: Pack<DocSection[]> = {
  en: [
    {
      h: "What cookies are",
      p: "Cookies and similar storage (localStorage, sessionStorage) are small files or keys on your device. Some are required for the shop to work. Others measure visits or help ads. You can refuse non-essential cookies in your browser.",
    },
    {
      h: "Strictly necessary",
      p: "These keep the bag, currency, language, wishlist, guest flag, and atelier session. They do not require consent under EU rules because the shop cannot run without them.",
    },
    {
      h: "Functional",
      p: "Theme (light or dark) and language preference. These remember a choice you made. You can clear them in the browser; the site will fall back to defaults.",
    },
    {
      h: "Analytics",
      p: "Google Analytics loads only if a measurement ID is configured. PostHog product analytics loads after you choose “Accept all” on the cookie banner. Both are non-essential.",
    },
    {
      h: "Marketing",
      p: "Meta Pixel loads only if a pixel ID is configured. It may be used to measure ads and remarket. It is off until that ID exists. We do not run marketing cookies by default.",
    },
    {
      h: "Consent",
      p: "Necessary and functional storage is used to provide the shop you asked for. Analytics and marketing load only after you choose “Accept all”. “Necessary only” keeps the bag and checkout working and leaves measurement pixels off.",
    },
    {
      h: "More detail",
      p: "How we use personal data is in the Privacy Policy.",
    },
  ],
  "fa-AF": [
    {
      h: "کوکی چیست",
      p: "کوکی و ذخیره مشابه (localStorage، sessionStorage) فایل یا کلید کوچک روی دستگاه است. برخی برای کار فروشگاه لازم است. برخی بازدید را می‌سنجند یا به تبلیغ کمک می‌کنند. کوکی غیرضروری را در مرورگر می‌توانید رد کنید.",
    },
    {
      h: "کاملاً ضروری",
      p: "کیف، ارز، زبان، علاقه‌مندی، پرچم مهمان و نشست آتلیه را نگه می‌دارند. زیر قواعد اتحادیه اروپا رضایت نمی‌خواهند چون فروشگاه بدون آن‌ها نمی‌چرخد.",
    },
    {
      h: "کارکردی",
      p: "زمینه (روشن یا تاریک) و ترجیح زبان. انتخاب شما را به یاد می‌سپارند. در مرورگر پاک می‌شوند؛ سایت به پیش‌فرض برمی‌گردد.",
    },
    {
      h: "تحلیل",
      p: "گوگل آنالیتیکس فقط اگر شناسه اندازه‌گیری باشد بار می‌شود. تحلیل PostHog پس از «پذیرش همه» در نوار کوکی. هر دو غیرضروری‌اند.",
    },
    {
      h: "بازاریابی",
      p: "پیکسل متا فقط اگر شناسه پیکسل باشد بار می‌شود. ممکن است تبلیغ بسنجد و بازفروش کند. تا آن شناسه نباشد خاموش است. کوکی بازاریابی پیش‌فرض نداریم.",
    },
    {
      h: "رضایت",
      p: "ذخیره ضروری و کارکردی فروشگاهی را که خواستید فراهم می‌کند. تحلیل و بازاریابی فقط پس از «پذیرش همه». «فقط ضروری» کیف و خرید را نگه می‌دارد و پیکسل سنجش را خاموش می‌گذارد.",
    },
    {
      h: "جزئیات بیشتر",
      p: "چگونگی استفاده از داده شخصی در سیاست حریم خصوصی است.",
    },
  ],
  ps: [
    {
      h: "کوکي څه دي",
      p: "کوکي او ورته ذخیره (localStorage، sessionStorage) پر وسیله کوچني فایلونه یا کیلي دي. ځینې د پلورنځي کار لپاره اړین دي. ځینې لیدنې اندازه کوي یا اعلان سره مرسته کوي. نااړین کوکي په براوزر کې ردولی شئ.",
    },
    {
      h: "بشپړ اړین",
      p: "کڅوړه، اسعار، ژبه، خوښې، د مېلمه نښه او د آتلیه ناسته ساتي. د اروپا تر قواعدو رضایت نه غواړي ځکه پلورنځی پرته له دوی نه ګرځي.",
    },
    {
      h: "کارکړنه",
      p: "زمینه (روښانه یا تیاره) او د ژبې غوره توب. ستاسو انتخاب یاد ساتي. په براوزر کې پاکېږي؛ پاڼه اصلي ته ستنیږي.",
    },
    {
      h: "تحلیل",
      p: "Google Analytics یوازې که د اندازه کولو پېژندنه وي بارېږي. د PostHog تحلیل پس له «ټول ومنئ» پر کوکي پټۍ. دواړه نااړین دي.",
    },
    {
      h: "بازارموندنه",
      p: "د میټا پیکسل یوازې که د پیکسل پېژندنه وي بارېږي. ممکن اعلان اندازه کړي او بیا وپلوري. تر هغې پېژندنې بند دی. د بازارموندنې کوکي په اصل کې نه چلوو.",
    },
    {
      h: "رضایت",
      p: "اړینه او کارکړنیزه ذخیره هغه پلورنځی برابروي چې غوښتی یې. تحلیل او بازارموندنه یوازې پس له «ټول ومنئ». «یوازې اړین» کڅوړه او پېرود ساتي او د اندازه کولو پیکسل بند پرېږدي.",
    },
    {
      h: "نور تفصیل",
      p: "څنګه شخصي معلومات کاروو په د محرمیت تګلاره کې دي.",
    },
  ],
};

export function privacySections(lang: string) {
  return pick(privacy, lang);
}

export function termsSections(lang: string) {
  return pick(terms, lang);
}

export function cookiesSections(lang: string) {
  return pick(cookies, lang);
}
