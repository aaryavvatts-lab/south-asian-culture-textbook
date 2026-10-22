# Roots & Rivers: Project Instructions

*Roots & Rivers: An Interactive Guide to South Asian Cultures for High School Students* is a free, open, interactive textbook. It teaches the geography, history, faiths, languages, festivals, food, arts, family life and present-day countries of South Asia, plus the South Asian diaspora. It is written for high schoolers who want to understand their own heritage and for friends who are curious about it. There are 22 chapters, each with a MicroSim, a quiz and references, plus a learning graph, glossary, FAQ, appendices, a teacher guide, a club kit and an oral history project.
Created by Aaryav Sharma. Built with Dan McCreary's intelligent-textbook framework. Made for use in the EVHS South Asian Student Association (Eastview High School, Apple Valley, Minnesota) and any school or club that wants it.

Read `Materials/textbook-design-principles.md` before generating any chapter content.

## Audience and voice
- **Primary readers:** high school students, grades 9-12. Many are second-generation South Asian Americans who grew up with some traditions but never learned the "why". Many others are their friends, with no background at all. Assume zero prior knowledge.
- **Secondary readers:** social studies and ethnic studies teachers, South Asian student club leaders, parents.
- **Reading level:** Flesch-Kincaid grade 8-10. Short sentences. Define every term the first time, in plain words, before or alongside its original-language name.
- **Tone:** curious, warm, respectful, precise. Like a well-read older cousin, not a tour guide and not a lecturer. Never exoticize ("mystical", "exotic", "ancient wisdom", "land of contrasts" are banned). Never preach.
- **Words from South Asian languages:** the first time a key term appears, give it in its original script, a simple English respelling with the stressed syllable in capitals, and its meaning. Example: Diwali (दीवाली, *dee-VAH-lee*), "row of lamps". After that, use the common English spelling. Use the script of the language the word comes from (Bengali words in Bengali script, Urdu words in Urdu/Nastaliq, Tamil in Tamil, and so on). If you are not certain of a script spelling, verify it (Wiktionary entries are acceptable for spelling) or leave the script out. Never guess script.
- No em dashes or en dashes in prose. Use commas, periods, colons or parentheses. Ranges are written "1858 to 1947" or "1858-1947" with a plain hyphen only in tables.

## Accuracy rules (non-negotiable)
1. **Never invent statistics, studies, quotes, dates or citations.** Every number and date has a real, linked source you opened. Preferred sources: Encyclopaedia Britannica, UNESCO World Heritage and Intangible Cultural Heritage lists, World Bank and UN data, national census and government sites, Pew Research Center, Library of Congress, The British Library, Smithsonian, museum collections (The Met, British Museum, V&A), university outreach centers (South Asia institutes), peer-reviewed scholarship, Asia Society, SAADA. Wikipedia only as a lead to primary sources, at most 3 per references page. If you cannot confirm a fact, remove it or soften it to a well-established general statement.
2. **Zara, Ben and every interview or family scenario are fictional.** Real people are only clearly identified historical or public figures, described factually.
3. **Respect and neutrality (see "Sensitivity rules" below).** Every Ask Your Elders section ends with exactly this line in italics: *"Every family does it a little differently, and there is no wrong answer here."*
4. **Time-sensitive facts** (populations, laws, statistics, leaders, records, "largest") are stated exactly, with their year, as of October 2026.
5. **Never quote song lyrics, poems or sacred texts at length.** At most one short line (under 15 words) per source, attributed. Prefer paraphrase and links. Ancient texts in old public-domain translations may be quoted briefly with attribution.
6. **Open sources we may adapt with attribution:** see `Materials/sources.md`. Never copy text from any source.
7. Every MicroSim must run without console errors.

## Sensitivity rules (this book's safety rules)
- **No ranking.** Never call one faith, country, language, cuisine or community better, older-and-therefore-better, purer or more authentic than another.
- **Disputed territory.** Kashmir, Aksai Chin and other contested areas are described as disputed, with each side's position stated briefly and neutrally. **MicroSims never draw official national borders.** Maps are schematic: tile maps, labeled dots, abstract regions, or rivers and mountain ranges only, with the caption "Schematic map, not to scale. Not an official depiction of borders."
- **Contested history.** Present scholarly debates as debates, with the evidence (for example the Indo-Aryan migration: describe the linguistic and genetic evidence that most scholars accept for migration over centuries, note that the older "invasion" model is rejected, and note that some in India dispute migration). Never present "Aryan invasion" as fact.
- **Partition, 1971, the Sri Lankan civil war, communal violence:** factual, humane, with sourced numbers given as ranges where scholars give ranges. Name suffering on all sides. No graphic detail.
- **Caste:** a historical and continuing social system; discrimination by caste is illegal in India (Constitution Article 17 abolished "untouchability") and in other places it exists. Never stereotype or name communities as "low" or "high". The term "Harijan" appears only as a historical term with the explanation that many Dalits reject it. Use "Dalit" and "Adivasi" respectfully.
- **Religion:** describe beliefs as "many Hindus believe", "in Sikh tradition", never as the book's own claims, and never as mere myth. Practices vary; say so. No faith is described as violent or backward.
- **Food, dress and customs:** "many families", "in some regions". Never "all Indians eat" or "Pakistanis always".
- **Coverage beyond India.** India is large, but every theme chapter (1-16, 21-22) must include specific, named examples from at least four of the eight countries, and must mention Pakistan, Bangladesh and Sri Lanka at least once each. Nepal, Bhutan, the Maldives and Afghanistan should appear wherever relevant.
- **Language names.** Use the names communities use: Bangla/Bengali, Odia (not Oriya), Mumbai (with "formerly Bombay" once), Kolkata, Chennai, Myanmar, Sri Lanka (Ceylon before 1972).
- **Health claims.** Ayurveda, Unani, yoga: describe as traditions and their history. Never claim they cure disease. Add "not medical advice" where health practices come up.

## Every chapter MUST include (in this order)
1. **Summary**, **Concepts Covered**, **Prerequisites**, then the `mascot-welcome`.
2. **Hook:** a short scene with Zara and Ben (section N.1), 1-3 paragraphs, ending on a question the chapter answers.
3. **Intuition first:** a familiar comparison before details.
4. **Core content:** numbered sections (N.2, N.3, ...) using every concept the learning graph assigns, bolding each concept label the first time it is defined.
5. **A "Whose Story?" box** somewhere in the core content: `!!! abstract "Whose Story?"` with 3-6 sentences showing how different communities, countries or historians tell the same thing differently.
6. **At least one MicroSim** (`#### Diagram:` block, p5.js).
7. **Ask Your Elders** (template below).
8. **Common Misconceptions:** 3-5 Myth/Reality pairs.
9. **Check Yourself:** 5 short questions with answers in collapsible blocks.
10. **Exercises:** 12, two per Bloom level (Remember, Understand, Apply, Analyze, Evaluate, Create).
11. **Key Takeaways:** 5-7 bullets, then the `mascot-celebration`.

## Ask Your Elders template (exact)

```markdown
## Ask Your Elders

!!! note "Your interview for this chapter"
    Talk with a parent, grandparent, aunt, uncle, family friend or community elder about <topic>. If you don't have a South Asian elder to ask, interview a club advisor, a local temple, mosque, gurdwara or cultural center volunteer, or a classmate's family (with permission). Ten minutes is enough.

**Before you start:** <one practical tip: ask permission to take notes or record, choose a quiet time, bring a photo or object>

**Questions to ask**

1. <warm-up question about their own memory>
2. <question>
3. <question>
4. <question>
5. <question about how it has changed, in their lifetime or after moving>
6. <question about what they hope you keep>

**Listen for:** <2-3 things in their answers that connect to this chapter's concepts, named with the exact concept labels>

**Save it:** Write down one quote or story in their words, with their permission. If they agree, you can share it with the [Roots & Rivers Story Archive](../../oral-history.md).

??? question "Your turn: compare two answers"
    <a short prompt asking the reader to compare their elder's answer with what the chapter says, or with a friend's interview>

*"Every family does it a little differently, and there is no wrong answer here."*
```

## Check Yourself format
```markdown
## Check Yourself

??? question "1. <question>"
    <answer, 1-3 sentences>
```

## Learning mascot: Mora the peacock
- **Who:** Mora (MOR-ah), a young Indian peafowl. The peacock has been India's national bird since 1963, the peacock motif runs through art and architecture across the region (the Mughal Peacock Throne, temple carvings, textiles, rangoli), and "mor" is the word for peacock in Hindi-Urdu, Punjabi and other languages. **Look:** deep blue body, green and gold tail with eye spots, a small crest, round friendly eyes, marigold-orange cheek accent.
- **Catchphrase:** "Every tradition has a story. Let's find it!"
- **Voice:** warm, curious, a little dramatic about colors and festivals, honest when something is hard or debated. Speaks in first person.
- **Admonition types:** `mascot-welcome` (exactly 1, chapter opening), `mascot-thinking` (1-3), `mascot-tip` (0-2), `mascot-warning` (0-2, for common confusions or sensitive points), `mascot-encourage` (0-2), `mascot-celebration` (0-1, end).
- **Rules:** at most 6 per chapter, never back-to-back, 1-3 sentences, never decorative.
- **Image placement:** in the body, never the title: `![Mora waving hello](../../img/mascot/welcome.png){ class="mascot-admonition-img" }`. Poses: neutral, welcome, thinking, tip, warning, encouraging, celebration (type `mascot-encourage` uses `encouraging.png`).

## Running examples (fictional, details fixed)
- **Zara Hossain**, 15, a sophomore at Prairie Ridge High School (fictional) in a Twin Cities suburb, Minnesota. Her parents moved from Chattogram, Bangladesh, before she was born. Her family speaks Bangla (Bengali) at home and is Muslim. Her Nanu (maternal grandmother) lives with them and is her favorite person to ask about the past. Zara understands Bangla well but answers in English, which bothers her a little. She plays violin and is co-founding her school's South Asian Student Association.
- **Ben Lindqvist**, 15, Zara's best friend since 4th grade. Swedish and Norwegian heritage, Lutheran family, plays hockey, loves trying food, knows almost nothing about South Asia and asks the questions readers are afraid to ask. He is the first non-South Asian member of the club.
- **Friends they meet across chapters** (use sparingly, details fixed): **Arjun Reddy** (Telugu-speaking Hindu family from Hyderabad, India; does Kuchipudi), **Simran Kaur Gill** (Punjabi Sikh family, grandparents from Ludhiana, India; club treasurer), **Ayesha Qureshi** (Urdu-speaking family from Lahore, Pakistan; loves cricket), **Nima Sherpa** (family from Solukhumbu, Nepal), **Dilan Perera** (Sinhala-speaking Buddhist family from Kandy, Sri Lanka). Faculty advisor: **Ms. Okafor** (social studies teacher).

## Canonical values (must match everywhere; writers may add, with source, in their fact log)
- **The eight countries of South Asia** (the members of SAARC): Afghanistan, Bangladesh, Bhutan, India, the Maldives, Nepal, Pakistan, Sri Lanka. SAARC was founded in Dhaka on 8 December 1985 by seven countries; Afghanistan joined in 2007. (NTI: https://www.nti.org/education-center/treaties-and-regimes/south-asian-association-regional-cooperation-saarc/)
- **Populations, 2025, World Bank (SP.POP.TOTL, dataset updated October 2026):** India 1,463,865,525 (about 1.46 billion); Pakistan 255,219,554 (about 255 million); Bangladesh 175,686,899 (about 176 million); Afghanistan 43,844,111 (about 44 million); Nepal 29,618,118 (about 30 million); Sri Lanka 21,756,000 (about 22 million); Bhutan 796,682 (about 800,000); Maldives 529,676 (about 530,000). **Total of the eight: about 1.99 billion (2025)**, roughly one in four people on Earth. Always say "(2025, World Bank)". Note: the World Bank's own "South Asia" regional total is smaller because since mid-2025 it groups Afghanistan and Pakistan in a "Middle East, North Africa, Afghanistan and Pakistan" region. (https://data.worldbank.org/indicator/SP.POP.TOTL)
- **India's Eighth Schedule** lists **22** languages. (https://www.constitutionofindia.net/schedules/languages)
- **Independence dates:** Pakistan 14 August 1947 (the date Pakistan celebrates; the legal transfer under the Indian Independence Act was 15 August); India 15 August 1947; Sri Lanka (Ceylon) 4 February 1948; Bangladesh declared independence 26 March 1971 and the Liberation War ended 16 December 1971; the Maldives 26 July 1965. Nepal, Bhutan and Afghanistan were never formally colonized, with caveats: Nepal ceded territory to the East India Company under the 1816 Treaty of Sugauli; Bhutan agreed under the 1910 Treaty of Punakha to be guided by Britain in foreign relations; Afghanistan's foreign affairs were controlled by Britain until the 1919 Treaty of Rawalpindi. Writers verify any date they use.
- **The Constitution of India** came into effect on 26 January 1950 (Republic Day).
- **Language Martyrs' Day:** 21 February 1952 in Dhaka; UNESCO declared 21 February International Mother Language Day in 1999.
- **Mount Everest:** 8,848.86 m (29,031.7 ft), the 2020 joint China-Nepal measurement.
- **US population figures:** Pew Research Center fact sheets (2023 ACS data): about 5.2 million Indian Americans; about 680,000 Pakistani Americans. Writers must use Pew's current fact-sheet numbers with their year.

## Learning graph taxonomy codes
| Code | Meaning | Chapters |
|---|---|---|
| GEO | Land, water, climate, the region | 1 |
| ANC | Ancient history to about 550 CE | 2 |
| EMP | Empires, kingdoms and trade, about 600-1757 | 3 |
| MOD | Colonial rule, independence, Partition, 1971 | 4 |
| FAITH | Religions and spiritual practice | 5 |
| LANG | Languages, scripts, transliteration | 6, appendix |
| FEST | Festivals and calendars | 7, appendix |
| FOOD | Food and eating customs | 8 |
| ARTS | Music, dance, theater | 9, 10 |
| CRAFT | Visual art, architecture, craft, textiles, dress | 11, 12 |
| SOC | Family, kinship, social structure, life events | 13 |
| LIT | Stories and literature | 14 |
| POP | Cinema, sport, popular culture | 15 |
| IDEA | Science, mathematics, ideas | 16 |
| NATION | The eight present-day countries | 17-20 |
| DIAS | The diaspora | 21 |
| ID | Identity and community action | 22 |

## MkDocs notes
- Side navigation only (no `navigation.tabs`). Only the lead editor edits `mkdocs.yml`.
- Keep `.claude/`, `logs/`, `site/`, `.venv/` out of git. License CC BY-NC-SA 4.0.
- Paths contain spaces: quote every path in shell commands.
