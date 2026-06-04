// lib/seoTopics.ts
// Single source of truth for every programmatic SEO page.
// Add a row here -> a new indexed page exists. No other file changes needed.

export type Intent = "high" | "medium" | "low";

export interface SeoTopic {
  slug: string;            // URL: /reading/[slug]
  intent: Intent;          // drives GA tagging + funnel copy
  category: string;        // GA event grouping (e.g. "manglik", "rashi_career")
  rashi?: string;          // optional, for sign-specific pages
  en: TopicLocale;
  hi: TopicLocale;
}

export interface TopicLocale {
  title: string;           // <title> + H1
  metaDescription: string; // <meta description>
  intro: string[];         // 2-3 paragraphs of genuine free value (satisfies Google)
  faqs: { q: string; a: string }[]; // FAQ schema = rich snippets
  ctaHeadline: string;     // the personalization trigger
  ctaSub: string;
}

// ---- The 12 rashis (sign) with Hindi names ----
export const RASHIS = [
  { key: "mesh", en: "Aries", hi: "मेष" },
  { key: "vrishabha", en: "Taurus", hi: "वृषभ" },
  { key: "mithun", en: "Gemini", hi: "मिथुन" },
  { key: "kark", en: "Cancer", hi: "कर्क" },
  { key: "simha", en: "Leo", hi: "सिंह" },
  { key: "kanya", en: "Virgo", hi: "कन्या" },
  { key: "tula", en: "Libra", hi: "तुला" },
  { key: "vrishchik", en: "Scorpio", hi: "वृश्चिक" },
  { key: "dhanu", en: "Sagittarius", hi: "धनु" },
  { key: "makar", en: "Capricorn", hi: "मकर" },
  { key: "kumbh", en: "Aquarius", hi: "कुंभ" },
  { key: "meen", en: "Pisces", hi: "मीन" },
] as const;

const YEAR = new Date().getFullYear() + (new Date().getMonth() >= 9 ? 1 : 0);
// Sept onward, people search next year. Auto-rolls so pages never go stale.

// ---------------------------------------------------------------------------
// HIGH INTENT — people in pain, searching for a solution. These convert best.
// ---------------------------------------------------------------------------
const highIntent: SeoTopic[] = [
  {
    slug: "manglik-dosha-remedies",
    intent: "high",
    category: "manglik",
    en: {
      title: `Manglik Dosha: Remedies, Effects & How to Check (${YEAR})`,
      metaDescription:
        "What is Manglik (Mangal) Dosha, how it affects marriage, and the remedies that actually help. Check your own chart free.",
      intro: [
        "Manglik Dosha (also called Mangal Dosha or Kuja Dosha) occurs when Mars sits in the 1st, 4th, 7th, 8th or 12th house of your birth chart. In Vedic astrology it is most closely associated with delays and tension in marriage, which is why it causes so much worry during matchmaking.",
        "The intensity is not the same for everyone. Mars in the 1st house behaves differently from Mars in the 12th, and the dosha is often cancelled (Manglik dosha bhang) by the position of the Moon, Jupiter, or the same dosha existing in the partner's chart. This is why a blanket label of 'Manglik' is misleading without looking at the actual chart.",
        "Traditional remedies include Kumbh Vivah, reciting the Mangal mantra, fasting on Tuesdays, and donating red items. But which remedy applies, and whether you even have an active dosha, depends entirely on your exact birth time and place.",
      ],
      faqs: [
        { q: "How do I know if I am Manglik?", a: "It depends on the placement of Mars in your birth chart, which requires your exact date, time and place of birth to calculate." },
        { q: "Can Manglik dosha be cancelled?", a: "Yes. Several planetary combinations cancel or reduce Manglik dosha, including certain positions of Jupiter and the Moon, or both partners being Manglik." },
        { q: "Is Manglik dosha a problem for marriage?", a: "Its real impact depends on intensity and cancellation factors in the full chart, not the label alone." },
      ],
      ctaHeadline: "Check if you are actually Manglik — free",
      ctaSub: "Enter your birth details to see your real Mars placement and whether the dosha is active or cancelled.",
    },
    hi: {
      title: `मांगलिक दोष: उपाय, प्रभाव और कैसे जांचें (${YEAR})`,
      metaDescription:
        "मांगलिक (मंगल) दोष क्या है, यह विवाह को कैसे प्रभावित करता है, और कौन से उपाय वास्तव में काम करते हैं। अपनी कुंडली मुफ्त में जांचें।",
      intro: [
        "मांगलिक दोष (मंगल दोष या कुज दोष) तब बनता है जब मंगल आपकी कुंडली के पहले, चौथे, सातवें, आठवें या बारहवें भाव में स्थित हो। वैदिक ज्योतिष में इसका सबसे गहरा संबंध विवाह में देरी और तनाव से माना जाता है।",
        "इसकी तीव्रता सबके लिए एक समान नहीं होती। पहले भाव का मंगल बारहवें भाव के मंगल से अलग फल देता है, और कई बार चंद्रमा, गुरु या साथी की कुंडली के कारण यह दोष भंग भी हो जाता है। इसलिए केवल 'मांगलिक' कह देना भ्रामक है।",
        "पारंपरिक उपायों में कुंभ विवाह, मंगल मंत्र जाप, मंगलवार का व्रत और लाल वस्तुओं का दान शामिल है। पर कौन सा उपाय लागू होगा, यह आपकी सटीक जन्म तिथि, समय और स्थान पर निर्भर करता है।",
      ],
      faqs: [
        { q: "मैं कैसे जानूं कि मैं मांगलिक हूं?", a: "यह आपकी कुंडली में मंगल की स्थिति पर निर्भर करता है, जिसके लिए सटीक जन्म तिथि, समय और स्थान आवश्यक है।" },
        { q: "क्या मांगलिक दोष भंग हो सकता है?", a: "हां, कई ग्रह-योग मांगलिक दोष को रद्द या कम कर देते हैं।" },
        { q: "क्या मांगलिक दोष विवाह में बाधा है?", a: "इसका वास्तविक प्रभाव पूरी कुंडली पर निर्भर करता है, केवल नाम पर नहीं।" },
      ],
      ctaHeadline: "जानें क्या आप वास्तव में मांगलिक हैं — मुफ्त",
      ctaSub: "अपनी जन्म जानकारी भरें और देखें कि आपका मंगल कहां है और दोष सक्रिय है या भंग।",
    },
  },
  {
    slug: "marriage-delay-astrology",
    intent: "high",
    category: "marriage_delay",
    en: {
      title: `Why Is My Marriage Getting Delayed? Astrology Answers (${YEAR})`,
      metaDescription:
        "Astrological reasons for delayed marriage — Saturn, Venus, 7th house afflictions — and what to do. Check your chart free.",
      intro: [
        "Marriage delay in Vedic astrology is usually traced to the 7th house (the house of partnership), its lord, and the planets Venus and Jupiter. When Saturn aspects the 7th house, marriage often comes later but tends to be stable.",
        "Other common factors are an afflicted 7th lord, the timing of your Venus or Jupiter dasha, and doshas like Manglik or Nadi. Many delays are simply a matter of dasha timing — the right planetary period hasn't begun yet.",
        "Knowing the cause changes the response. Sometimes the answer is a remedy; sometimes it's simply patience until a favourable dasha. Both require reading your actual chart.",
      ],
      faqs: [
        { q: "Which planet causes marriage delay?", a: "Saturn's influence on the 7th house is the most common, along with an afflicted 7th lord or Venus." },
        { q: "At what age will I marry as per astrology?", a: "This is estimated from your running dasha and the strength of the 7th house — it needs your full birth chart." },
        { q: "Can remedies speed up marriage?", a: "Remedies aim to strengthen favourable planets, but timing largely follows your dasha periods." },
      ],
      ctaHeadline: "See your marriage timing — free",
      ctaSub: "Enter your birth details for your 7th house analysis and current dasha period.",
    },
    hi: {
      title: `मेरी शादी में देरी क्यों हो रही है? ज्योतिष उत्तर (${YEAR})`,
      metaDescription:
        "विवाह में देरी के ज्योतिषीय कारण — शनि, शुक्र, सप्तम भाव — और उपाय। अपनी कुंडली मुफ्त जांचें।",
      intro: [
        "वैदिक ज्योतिष में विवाह में देरी का संबंध मुख्यतः सप्तम भाव, उसके स्वामी, तथा शुक्र और गुरु ग्रह से होता है। जब शनि सप्तम भाव को देखता है, तो विवाह देर से पर स्थिर होता है।",
        "अन्य कारणों में सप्तमेश का पीड़ित होना, शुक्र या गुरु की दशा का समय, और मांगलिक या नाड़ी दोष शामिल हैं। कई बार देरी केवल दशा के समय की बात होती है।",
        "कारण जानने से समाधान बदल जाता है। कभी उपाय चाहिए, कभी केवल शुभ दशा तक प्रतीक्षा। दोनों के लिए आपकी कुंडली देखना आवश्यक है।",
      ],
      faqs: [
        { q: "विवाह में देरी कौन सा ग्रह कराता है?", a: "सप्तम भाव पर शनि का प्रभाव सबसे आम कारण है।" },
        { q: "ज्योतिष अनुसार मेरी शादी किस उम्र में होगी?", a: "यह आपकी दशा और सप्तम भाव की शक्ति से आंका जाता है।" },
        { q: "क्या उपाय से विवाह जल्दी हो सकता है?", a: "उपाय शुभ ग्रहों को बल देते हैं, पर समय मुख्यतः दशा पर निर्भर करता है।" },
      ],
      ctaHeadline: "अपना विवाह समय देखें — मुफ्त",
      ctaSub: "जन्म जानकारी भरें और सप्तम भाव व वर्तमान दशा जानें।",
    },
  },
  {
    slug: "shani-sade-sati-remedies",
    intent: "high",
    category: "sade_sati",
    en: {
      title: `Shani Sade Sati: Effects & Remedies for Your Rashi (${YEAR})`,
      metaDescription:
        "Sade Sati meaning, the three phases, effects on each rashi, and remedies. Check if Sade Sati is running in your chart free.",
      intro: [
        "Sade Sati is the seven-and-a-half year period when Saturn transits the 12th, 1st and 2nd houses from your Moon sign. It is one of the most discussed and most feared transits in Vedic astrology.",
        "It moves in three phases — rising, peak and setting — and each affects different areas of life. Despite its reputation, Sade Sati is also a period of discipline and long-term growth, not only hardship. Its effect depends heavily on Saturn's strength in your chart.",
        "Common remedies include Saturn-related charity, the Shani mantra, Hanuman worship, and serving the needy. Which apply depends on your Moon sign and the current phase.",
      ],
      faqs: [
        { q: "How do I know if Sade Sati is running?", a: "It depends on where Saturn currently transits relative to your Moon sign, which needs your birth details." },
        { q: "Is Sade Sati always bad?", a: "No. It is a period of discipline and restructuring; outcomes depend on Saturn's strength and your karma." },
        { q: "What are the best Sade Sati remedies?", a: "Saturn charity, Shani and Hanuman worship, and ethical conduct are the most cited." },
      ],
      ctaHeadline: "Check your Sade Sati status — free",
      ctaSub: "Enter your birth details to see if Sade Sati is active and which phase you are in.",
    },
    hi: {
      title: `शनि साढ़े साती: आपकी राशि पर प्रभाव और उपाय (${YEAR})`,
      metaDescription:
        "साढ़े साती का अर्थ, तीन चरण, हर राशि पर प्रभाव और उपाय। जांचें कि आपकी कुंडली में साढ़े साती चल रही है या नहीं — मुफ्त।",
      intro: [
        "साढ़े साती वह साढ़े सात वर्ष की अवधि है जब शनि आपकी चंद्र राशि से बारहवें, पहले और दूसरे भाव से गुजरता है। यह वैदिक ज्योतिष का सबसे चर्चित गोचर है।",
        "यह तीन चरणों — आरोही, शिखर और अवरोही — में चलती है। डरावनी छवि के बावजूद, साढ़े साती अनुशासन और दीर्घकालिक विकास का समय भी है।",
        "सामान्य उपायों में शनि दान, शनि मंत्र, हनुमान उपासना और जरूरतमंदों की सेवा शामिल है। कौन सा लागू होगा यह राशि और चरण पर निर्भर करता है।",
      ],
      faqs: [
        { q: "कैसे जानें साढ़े साती चल रही है?", a: "यह शनि के वर्तमान गोचर और आपकी चंद्र राशि पर निर्भर करता है।" },
        { q: "क्या साढ़े साती हमेशा बुरी होती है?", a: "नहीं, यह अनुशासन और पुनर्निर्माण का समय है।" },
        { q: "साढ़े साती के सर्वोत्तम उपाय क्या हैं?", a: "शनि दान, शनि व हनुमान उपासना और नैतिक आचरण।" },
      ],
      ctaHeadline: "अपनी साढ़े साती स्थिति जांचें — मुफ्त",
      ctaSub: "जन्म जानकारी भरें और जानें साढ़े साती सक्रिय है या नहीं और कौन सा चरण।",
    },
  },
  {
    slug: "kundali-matching-for-marriage",
    intent: "high",
    category: "matching",
    en: {
      title: `Kundali Matching for Marriage Online — Guna Milan (${YEAR})`,
      metaDescription:
        "How Kundali matching works — Ashtakoot Guna Milan, the 36 gunas, Manglik check. Match two charts free online.",
      intro: [
        "Kundali matching (Guna Milan) compares two birth charts to assess marital compatibility. The most common system is Ashtakoot, which scores eight factors out of 36 gunas. A score above 18 is generally considered acceptable.",
        "But the guna score is only part of the picture. Manglik dosha compatibility, the strength of the 7th house in both charts, and Nadi dosha matter just as much. A high guna score with an unaddressed Nadi dosha is a weaker match than the number suggests.",
        "Doing this properly needs both partners' exact birth details. The score then tells you not just yes or no, but where the strengths and frictions will lie.",
      ],
      faqs: [
        { q: "What guna score is good for marriage?", a: "Above 18 out of 36 is generally acceptable; above 24 is considered very good." },
        { q: "Is Manglik matching necessary?", a: "Yes, Manglik status of both partners is checked alongside the guna score." },
        { q: "Can low guna marriages work?", a: "Yes, especially when doshas cancel out or other chart factors are strong." },
      ],
      ctaHeadline: "Match two kundalis — free",
      ctaSub: "Enter both partners' birth details for a full Guna Milan and Manglik compatibility check.",
    },
    hi: {
      title: `विवाह के लिए कुंडली मिलान ऑनलाइन — गुण मिलान (${YEAR})`,
      metaDescription:
        "कुंडली मिलान कैसे होता है — अष्टकूट गुण मिलान, 36 गुण, मांगलिक जांच। दो कुंडलियां मुफ्त मिलाएं।",
      intro: [
        "कुंडली मिलान (गुण मिलान) दो जन्म कुंडलियों की तुलना करके वैवाहिक अनुकूलता आंकता है। सबसे प्रचलित प्रणाली अष्टकूट है, जो 36 गुणों में से आठ कारकों को अंक देती है। 18 से अधिक अंक सामान्यतः स्वीकार्य माने जाते हैं।",
        "पर गुण अंक पूरी तस्वीर नहीं है। मांगलिक दोष अनुकूलता, दोनों कुंडलियों में सप्तम भाव की शक्ति और नाड़ी दोष भी उतने ही महत्वपूर्ण हैं।",
        "इसे सही तरीके से करने के लिए दोनों साथियों की सटीक जन्म जानकारी चाहिए।",
      ],
      faqs: [
        { q: "विवाह के लिए कितने गुण अच्छे हैं?", a: "36 में से 18 से अधिक स्वीकार्य; 24 से अधिक बहुत अच्छा।" },
        { q: "क्या मांगलिक मिलान आवश्यक है?", a: "हां, दोनों की मांगलिक स्थिति जांची जाती है।" },
        { q: "क्या कम गुण वाले विवाह सफल होते हैं?", a: "हां, विशेषकर जब दोष भंग हो जाएं।" },
      ],
      ctaHeadline: "दो कुंडलियां मिलाएं — मुफ्त",
      ctaSub: "दोनों की जन्म जानकारी भरें और पूरा गुण मिलान व मांगलिक जांच पाएं।",
    },
  },
];

// ---------------------------------------------------------------------------
// MEDIUM INTENT — generated per rashi (career + love). 12 x 2 = 24 pages.
// ---------------------------------------------------------------------------
function buildRashiTopic(
  r: (typeof RASHIS)[number],
  kind: "career" | "love"
): SeoTopic {
  if (kind === "career") {
    return {
      slug: `${r.key}-career-${YEAR}`,
      intent: "medium",
      category: "rashi_career",
      rashi: r.key,
      en: {
        title: `${r.en} (${r.hi}) Career Predictions ${YEAR}`,
        metaDescription: `${r.en} career horoscope ${YEAR} — job, business, promotion and money outlook. Get your personalised reading free.`,
        intro: [
          `${r.en} (${r.hi}) natives are entering ${YEAR} with shifting career dynamics driven by the transits of Jupiter and Saturn over key houses. This general outlook covers the broad themes for the sign.`,
          `Career results, however, are shaped far more by your running mahadasha and the strength of the 10th house in your personal chart than by sun-sign predictions. Two ${r.en} people in different dashas will have very different years.`,
          `Use the general guidance below as a backdrop, then read your own chart for the timing that actually applies to you.`,
        ],
        faqs: [
          { q: `Is ${YEAR} good for ${r.en} career?`, a: `It depends on your personal dasha and 10th house; the sign-level outlook is only a backdrop.` },
          { q: `Should ${r.en} change jobs in ${YEAR}?`, a: `Job-change timing is best judged from your dasha and transits over the 10th and 6th houses.` },
        ],
        ctaHeadline: `Get your personal ${r.en} career reading — free`,
        ctaSub: `Sign-level horoscopes are generic. Enter your birth details for your real 10th house and dasha analysis.`,
      },
      hi: {
        title: `${r.hi} (${r.en}) करियर भविष्यवाणी ${YEAR}`,
        metaDescription: `${r.hi} करियर राशिफल ${YEAR} — नौकरी, व्यापार, पदोन्नति और धन। अपना व्यक्तिगत विश्लेषण मुफ्त पाएं।`,
        intro: [
          `${r.hi} (${r.en}) राशि के जातक ${YEAR} में गुरु और शनि के गोचर से बदलते करियर अवसरों के साथ प्रवेश कर रहे हैं। यह सामान्य राशिफल राशि के व्यापक विषयों को बताता है।`,
          `परंतु करियर के परिणाम राशिफल से कहीं अधिक आपकी चल रही महादशा और दशम भाव की शक्ति से तय होते हैं। अलग-अलग दशा वाले दो ${r.hi} जातकों का वर्ष बहुत भिन्न होगा।`,
          `नीचे दिए सामान्य मार्गदर्शन को पृष्ठभूमि मानें, फिर अपनी कुंडली पढ़ें।`,
        ],
        faqs: [
          { q: `क्या ${YEAR} ${r.hi} करियर के लिए अच्छा है?`, a: `यह आपकी व्यक्तिगत दशा और दशम भाव पर निर्भर करता है।` },
          { q: `क्या ${r.hi} को ${YEAR} में नौकरी बदलनी चाहिए?`, a: `यह दशा और दशम/षष्ठ भाव के गोचर से तय होता है।` },
        ],
        ctaHeadline: `अपना व्यक्तिगत ${r.hi} करियर विश्लेषण पाएं — मुफ्त`,
        ctaSub: `राशिफल सामान्य होते हैं। जन्म जानकारी भरें और असली दशम भाव व दशा विश्लेषण पाएं।`,
      },
    };
  }
  // love
  return {
    slug: `${r.key}-love-life-${YEAR}`,
    intent: "medium",
    category: "rashi_love",
    rashi: r.key,
    en: {
      title: `${r.en} (${r.hi}) Love & Relationship Predictions ${YEAR}`,
      metaDescription: `${r.en} love horoscope ${YEAR} — relationships, marriage prospects and compatibility. Personalised reading free.`,
      intro: [
        `For ${r.en} (${r.hi}), ${YEAR} brings themes around the 5th house (romance) and 7th house (partnership), coloured by Venus's transits. This is the general picture for the sign.`,
        `Your actual love life is governed by Venus's placement, the condition of the 7th house, and your current dasha — not your sun sign alone. That is why two ${r.en} people can have opposite years in love.`,
        `Read the general outlook below, then check your own chart for what truly applies.`,
      ],
      faqs: [
        { q: `Is ${YEAR} good for ${r.en} love life?`, a: `It depends on your Venus placement and 7th house, not the sign alone.` },
        { q: `Will ${r.en} find love in ${YEAR}?`, a: `Timing is read from your dasha and 5th/7th house activity in your personal chart.` },
      ],
      ctaHeadline: `Get your personal ${r.en} love reading — free`,
      ctaSub: `Enter your birth details for your real 7th house and relationship timing.`,
    },
    hi: {
      title: `${r.hi} (${r.en}) प्रेम और रिश्ते भविष्यवाणी ${YEAR}`,
      metaDescription: `${r.hi} प्रेम राशिफल ${YEAR} — रिश्ते, विवाह संभावना और अनुकूलता। व्यक्तिगत विश्लेषण मुफ्त।`,
      intro: [
        `${r.hi} (${r.en}) के लिए ${YEAR} में पंचम भाव (प्रेम) और सप्तम भाव (साझेदारी) से जुड़े विषय शुक्र के गोचर के साथ उभरते हैं। यह राशि की सामान्य तस्वीर है।`,
        `आपका वास्तविक प्रेम जीवन शुक्र की स्थिति, सप्तम भाव और वर्तमान दशा से तय होता है, केवल राशि से नहीं।`,
        `नीचे का सामान्य राशिफल पढ़ें, फिर अपनी कुंडली जांचें।`,
      ],
      faqs: [
        { q: `क्या ${YEAR} ${r.hi} प्रेम जीवन के लिए अच्छा है?`, a: `यह शुक्र की स्थिति और सप्तम भाव पर निर्भर करता है।` },
        { q: `क्या ${r.hi} को ${YEAR} में प्यार मिलेगा?`, a: `समय आपकी दशा और पंचम/सप्तम भाव से पढ़ा जाता है।` },
      ],
      ctaHeadline: `अपना व्यक्तिगत ${r.hi} प्रेम विश्लेषण पाएं — मुफ्त`,
      ctaSub: `जन्म जानकारी भरें और असली सप्तम भाव व रिश्ते का समय जानें।`,
    },
  };
}

// ---------------------------------------------------------------------------
// LOW INTENT — volume/ad traffic, top of funnel. Daily horoscope per rashi.
// ---------------------------------------------------------------------------
function buildDailyTopic(r: (typeof RASHIS)[number]): SeoTopic {
  return {
    slug: `${r.key}-daily-horoscope`,
    intent: "low",
    category: "rashi_daily",
    rashi: r.key,
    en: {
      title: `${r.en} (${r.hi}) Daily Horoscope — Today's Rashifal`,
      metaDescription: `${r.en} daily horoscope and rashifal — love, career, health and lucky colour for today.`,
      intro: [
        `${r.en} (${r.hi}) daily horoscope gives the general mood of the day for the sign, based on the Moon's transit and current planetary positions.`,
        `Daily horoscopes describe the sign-wide weather. Your personal day is shaped by your running dasha and transits over your own chart, which is why a personalised reading is far more accurate.`,
      ],
      faqs: [
        { q: `What is today's horoscope for ${r.en}?`, a: `The daily outlook reflects the Moon's transit for the sign; your personal day needs your chart.` },
        { q: `What is the lucky colour for ${r.en} today?`, a: `Lucky colours are tied to the day's planetary ruler and your personal chart.` },
      ],
      ctaHeadline: `Go beyond the daily horoscope — free`,
      ctaSub: `Daily rashifal is generic. Enter your birth details for a reading based on your actual chart.`,
    },
    hi: {
      title: `${r.hi} (${r.en}) दैनिक राशिफल — आज का राशिफल`,
      metaDescription: `${r.hi} दैनिक राशिफल — आज का प्रेम, करियर, स्वास्थ्य और शुभ रंग।`,
      intro: [
        `${r.hi} (${r.en}) दैनिक राशिफल चंद्रमा के गोचर और वर्तमान ग्रह स्थिति के आधार पर दिन का सामान्य भाव बताता है।`,
        `दैनिक राशिफल राशि-स्तर का मौसम बताता है। आपका व्यक्तिगत दिन आपकी दशा और कुंडली के गोचर से बनता है, इसलिए व्यक्तिगत विश्लेषण कहीं अधिक सटीक होता है।`,
      ],
      faqs: [
        { q: `${r.hi} का आज का राशिफल क्या है?`, a: `दैनिक राशिफल राशि के लिए चंद्र गोचर दर्शाता है; व्यक्तिगत दिन के लिए कुंडली चाहिए।` },
        { q: `${r.hi} के लिए आज शुभ रंग क्या है?`, a: `शुभ रंग दिन के ग्रह स्वामी और आपकी कुंडली से जुड़ा होता है।` },
      ],
      ctaHeadline: `दैनिक राशिफल से आगे जाएं — मुफ्त`,
      ctaSub: `दैनिक राशिफल सामान्य है। जन्म जानकारी भरें और अपनी असली कुंडली आधारित विश्लेषण पाएं।`,
    },
  };
}

// ---- Assemble everything ----
export const SEO_TOPICS: SeoTopic[] = [
  ...highIntent,
  ...RASHIS.map((r) => buildRashiTopic(r, "career")),
  ...RASHIS.map((r) => buildRashiTopic(r, "love")),
  ...RASHIS.map((r) => buildDailyTopic(r)),
];

export function getTopic(slug: string): SeoTopic | undefined {
  return SEO_TOPICS.find((t) => t.slug === slug);
}

export function getAllSlugs(): string[] {
  return SEO_TOPICS.map((t) => t.slug);
}
