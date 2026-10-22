---
title: Festival Wheel
description: A 12-month calendar wheel of South Asian festivals that shows why solar, lunisolar and lunar festival dates move in different ways.
image: /sims/ch07-festival-wheel/ch07-festival-wheel.png
og:image: /sims/ch07-festival-wheel/ch07-festival-wheel.png
status: implemented
---

# Festival Wheel

<iframe src="main.html" height="734px" width="100%" scrolling="no"></iframe>

[Run the Festival Wheel MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

The Festival Wheel is a 12-month calendar drawn as a circle, with 1 January at the top and the months running clockwise. Fourteen festivals and festival groups from across South Asia sit on the wheel: Pongal, Losar, Holi, Nowruz, Vaisakhi and Pohela Boishakh, Vesak, Onam, Navaratri and Dashain, Diwali and Tihar, Christmas, Ramadan, Eid al-Fitr, Eid al-Adha and Ashura.

Drag the **Year** slider from 1990 to 2060 and watch what happens. Festivals set by the sun (gold) stay in the same place. Festivals set by a lunisolar calendar (teal) jump back and forth by a few weeks but stay in the same season. Islamic festivals (orange), which follow a purely lunar calendar, slide about 11 days earlier every year and travel all the way around the wheel in about 33 years.

None of the moving dates are typed in. The sim calculates new and full moons from a standard astronomy formula (Jean Meeus, *Astronomical Algorithms*, chapter 49), then applies simple calendar rules: for example, Diwali falls on the new moon that ends the lunar month in which the sun enters Libra, and an Islamic month starts the day after the new crescent could first be seen in South Asia. For 2026 these rules give the same dates as the Government of India's holiday list for Eid al-Fitr (21 March), Buddha Purnima (1 May), Eid al-Adha (28 May, after the moon-sighting change), Muharram (26 June), Dussehra (20 October) and Diwali (8 November). Holi comes out one day early in 2026. Real dates can differ by a day because local calendars and moon sighting decide them.

## How to Use

1. Start with the year 2026. Click or tap any dot (or pick a festival from the menu) to read its date, where it is celebrated and why it moves.
2. Drag the **Year** slider one year at a time. Watch the gold dots, then the teal dots, then the orange dots.
3. Select **Eid al-Fitr** and read the orange line in the panel: it tells you next year's date and how many days earlier it is.
4. Press **Play years** to step through the years automatically. Press **Pause** to stop.
5. Keep **Show Islamic dates from the past 4 years** ticked to see faint dots trailing behind the Islamic festivals.
6. Switch the menu to **Color by faith** to see which traditions each festival belongs to. Several are shared by many faiths.

## Learning Objective

Students will be able to explain why solar festivals keep the same Gregorian date, lunisolar festivals move within a season, and Islamic lunar festivals move about 11 days earlier each year.

**Bloom level:** Understand (explain, compare).

## Iframe Embed Code

```html
<iframe src="https://aaryavvatts-lab.github.io/south-asian-culture-textbook/sims/ch07-festival-wheel/main.html" height="734px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9-12 (world history, world religions, ethnic studies, math connections, or a South Asian student club planning its calendar)

**Duration:** 20 minutes

**Activity:**

1. (3 min) Before opening the sim, students guess: "Will Diwali and Eid be on the same dates next year?"
2. (5 min) Students set the year to 2026 and record the dates of Vaisakhi, Holi and Eid al-Fitr. Then they move to 2027 and 2028 and record the same three festivals.
3. (5 min) Students sort the 14 markers into three groups: never moves, moves a little, moves a lot. They compare their groups with the color key.
4. (4 min) Students find the year when Eid al-Fitr falls in December, and the year when Ramadan comes back to roughly the same month as in 2026.
5. (3 min) Exit ticket: "In one or two sentences, explain to a club member why Eid is 'early' this year."

**Assessment questions:**

1. Which festivals on the wheel never move from their Gregorian date? What do they have in common?
2. Why does Holi always stay in spring even though it follows the moon?
3. Eid al-Fitr is on about 21 March 2026. About when will it fall in 2027, and why?
4. About how many years does it take Ramadan to move all the way around the calendar?
5. The sim says "about" for most dates. Give two reasons the real date can differ from the computed one.

## Related Chapter

[Chapter 7: Festivals Through the Year](../../chapters/07-festivals/index.md)
