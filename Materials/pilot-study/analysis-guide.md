# Analysis Guide

This guide walks through the analysis step by step in Google Sheets. You don't need any software beyond a spreadsheet. It ends with how to report the results honestly.

**Decide your analysis before you look at the data.** This guide is your plan. Changing the plan after you see the results (for example, dropping questions that "didn't work") makes the results less trustworthy. If you must change something, say so in your report.

## 1. Enter and check the data

1. Open `data-template.csv` in Google Sheets (File > Import). Keep the file in a school account shared only with your advisor.
2. Add one row per code (`P01`, `P02` and so on). Never type a name.
3. For each test question (`pre_q1` to `post_q20`), enter the letter the student circled, or leave it blank if they skipped it.
4. Score each test with the answer key in `pre-post-test.md`: 1 point per correct answer. Enter totals in `pre_score` and `post_score` (0 to 20).
5. Enter survey answers: `pre_S1` to `post_S10` as 1 to 5; `pre_B1` to `post_B3` as No = 0, Once = 1, More than once = 2. Leave skipped answers blank.
6. **Double-check:** a second person re-scores five random tests. If any total disagrees, re-check every test.
7. Students who took only one test stay in the file but are left out of the paired analysis. Count them and report that number.

## 2. Describe the scores

For the students who took **both** tests:

- **n:** how many students took both tests
- **mean** (average) pre-test and post-test score
- **median** (middle value) of each, because with a small group one or two students can pull an average up or down
- **gain** for each student: post-test score minus pre-test score
- **mean gain** and **standard deviation (SD)** of the gains, which shows how much gains varied

### In Google Sheets

In the template, `pre_score` is column E and `post_score` is column F. Suppose your students are in rows 2 to 16. Add a new column at the far right called `gain`; if that's column CA, put this in CA2 and fill down:

| What | Formula |
|---|---|
| Gain for row 2 (fill down) | `=F2-E2` |
| n (students with both scores) | `=COUNT(CA2:CA16)` |
| Mean pre-test | `=AVERAGE(E2:E16)` |
| Mean post-test | `=AVERAGE(F2:F16)` |
| Median pre-test and post-test | `=MEDIAN(E2:E16)` and `=MEDIAN(F2:F16)` |
| Mean gain | `=AVERAGE(CA2:CA16)` |
| SD of gains | `=STDEV(CA2:CA16)` |
| Students who improved | `=COUNTIF(CA2:CA16,">0")` |
| Students who stayed the same | `=COUNTIF(CA2:CA16,0)` |
| Students who went down | `=COUNTIF(CA2:CA16,"<0")` |

Make sure every row in these ranges has **both** scores. The simplest way is to sort the sheet so complete rows are on top.

**A chart helps.** Make a pair of bars (mean pre, mean post) or a dot plot of each student's gain. Label the axes and write n on the chart.

## 3. Is the gain bigger than chance?

Each student took both tests, so the scores are **paired**. Use a paired method.

### Option A: Paired t-test

A paired t-test asks whether the average gain is bigger than random ups and downs would explain.

`=T.TEST(E2:E16, F2:F16, 2, 1)`

- `2` means two-tailed (we check for change in either direction).
- `1` means paired.
- The answer is a **p-value**. A p-value below 0.05 is often called "statistically significant", but it is not proof, and with a small group it can swing a lot. Report the exact p-value.

### Option B: Sign test (good for very small groups)

A sign test only looks at whether each student went up or down. Leave out students whose score didn't change. If `k` students improved out of `m` students whose score changed, a two-tailed p-value is:

`=MIN(1, 2*BINOM.DIST(MIN(k, m-k), m, 0.5, TRUE))`

Replace `k` and `m` with numbers or cell references. Example: if 9 of 11 changed students improved, use `=MIN(1, 2*BINOM.DIST(2, 11, 0.5, TRUE))`.

### Effect size

A p-value tells you how surprising the change would be if it were only chance. An **effect size** tells you how big the change is. For paired data:

`=AVERAGE(CA2:CA16)/STDEV(CA2:CA16)`

As a rough guide, about 0.2 is often called small, 0.5 medium and 0.8 large. Treat these labels loosely.

## 4. Item analysis

For each question, compute the percent of students who got it right on the pre-test and on the post-test. For example, if `pre_q1` is in column G and the correct answer is B:

`=COUNTIF(G2:G16,"B")/COUNTA(G2:G16)`

Look for:

- **Ceiling effects:** questions almost everyone got right on the pre-test can't show growth.
- **Questions that got worse:** they may be confusing, or the chapter may be unclear. Look closely and tell the book's author.
- **Chapters with the biggest gains:** use the chapter column in the answer key to group questions.

## 5. The survey

- For each item S1 to S10, report the mean and median before and after, and the percent who chose 4 or 5.
- For each item B1 to B3, report the percent who answered "Once" or "More than once" before and after. Remember that blanks are not zeros.
- Read the open answers (C1, C2). Group them into a few themes (for example, "sims helped", "games were fun", "too much reading"). Report how many answers fell in each theme. Quote one or two short answers only if they contain nothing that could identify anyone.

Survey answers are self-reports. They show how students *feel* about their knowledge and what they *say* they did, not what they actually know or did.

## 6. Report honestly

A good pilot report says what happened and what it can't show. Include:

1. **What you did:** chapters used, number of sessions, dates and setting (for example, "a high school club that meets monthly").
2. **Who took part:** n who took both tests, how many took only one, and how many declined. Don't describe participants by ethnicity, religion or any other detail the study didn't collect.
3. **Results:** mean and median pre and post scores, mean gain with its SD, how many improved, stayed the same or went down, the p-value and which test you used, and the effect size.
4. **Limits,** stated plainly:
    - **Small sample.** With 10 to 20 students, results can change a lot because of one or two people. Say "in this small group", not "students learn".
    - **No comparison group.** Scores might have gone up anyway, from taking the test twice, other classes, family or the news.
    - **Same test twice.** Students may remember questions from the pre-test.
    - **Volunteers.** Students who chose to join may be more interested than average.
    - **Who ran it.** If the researcher helped write the book, say so.
5. **What you'd do next:** for example, a comparison group using a different resource, a second version of the test for the post-test, or a delayed test a few months later.

**Words to use:** "scores increased", "in this group", "suggests", "a first look".
**Words to avoid:** "proves", "the book causes", "all students".

Never share raw data or any row of the spreadsheet outside your study team. Share group totals only.
