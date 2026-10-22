---
title: Kolam Maker
description: Draw your own kolam on a grid of dots, with 4-fold rotational symmetry, and watch a pulli kolam demo trace one line around every dot.
image: /sims/ch11-kolam-maker/ch11-kolam-maker.png
og:image: /sims/ch11-kolam-maker/ch11-kolam-maker.png
status: implemented
---

# Kolam Maker

<iframe src="main.html" height="682px" width="100%" scrolling="no"></iframe>

[Run the Kolam Maker MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A **kolam** is a line drawing made with rice flour on the ground outside a home, drawn fresh each morning by many women in Tamil Nadu and across South India, and by Tamil families in Sri Lanka and around the world. Many kolams start with a grid of dots called *pulli*. The artist then draws lines that loop around the dots without touching them.

This MicroSim gives you a square of dark, swept "ground" and a grid of white dots. It starts with a demo pulli kolam already drawn. On a 5 x 5 grid, the demo is one single unbroken line that loops around all 25 dots. Press **Trace demo** to watch it being drawn.

Then draw your own. With **4-fold symmetry** switched on, every line you draw is copied three more times, turned a quarter, a half and three quarters of the way around the center (the small gold circle). That's rotational symmetry, the same kind you see in many kolams and rangolis.

The demo is computed, not stored as a picture. It uses a "mirror curve": diagonal lines pass through the gaps between dots and bounce off the edge of the grid. On odd-sized grids (3 x 3, 5 x 5, 7 x 7), the sim also adds a few inner "walls," always in sets of four placed symmetrically, which join all the loops into one line. On even-sized grids, the same rules give several separate closed loops.

## How to Use

1. Look at the demo on the 5 x 5 grid. Follow the line with your finger. Does it ever touch a dot? Does it ever end?
2. Press **Trace demo** to watch the line drawn from start to finish. Press **Pause** to stop partway.
3. Press **Clear**, then draw your own lines with your mouse or finger. Keep your lines in the spaces between dots.
4. Watch how each stroke appears four times around the gold center point. Untick **4-fold symmetry** and draw again to compare.
5. Change the grid from 3 x 3 to 7 x 7 dots. On which grid sizes does the demo use one line, and on which does it use several loops?
6. Pick a different ink color, finish a design you like, and press **Save** to download it as a picture.

## Learning Objective

Students will be able to create a symmetric dot-grid design and explain how the grid of dots and rotational symmetry guide the drawing of a kolam.

**Bloom level:** Create (design, construct), supported by Understand (explain).

## Iframe Embed Code

```html
<iframe src="https://aaryavvatts-lab.github.io/south-asian-culture-textbook/sims/ch11-kolam-maker/main.html" height="682px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12 (art, geometry, world cultures, ethnic studies, or a South Asian student club meeting)

**Duration:** 20 to 25 minutes

**Activity:**

1. (3 min) Show the demo. Ask: "How do you think the artist planned this?" Point out the dots.
2. (5 min) Students press **Trace demo** on the 3 x 3 and 5 x 5 grids and describe in their own words the two rules the line follows (it goes around the dots without ever touching them, and it bounces back at the edge).
3. (8 min) With 4-fold symmetry on, students design their own kolam on a 5 x 5 grid. Then they turn symmetry off and try to copy their design by hand.
4. (4 min) Pairs compare designs and identify the center of rotation and the four repeated parts.
5. (3 min) Optional: draw a real kolam with chalk on the sidewalk using a dot grid, then share a saved image with the club.

**Assessment questions:**

1. What are the dots (pulli) for in a pulli kolam?
2. What does "4-fold rotational symmetry" mean? How many times does each line appear?
3. Why might a kolam artist prefer one continuous line that never ends?
4. The demo uses one line on 5 x 5 dots but four separate loops on 4 x 4 dots. Describe what you notice.
5. How is a kolam different from a rangoli made with colored powder?

## Related Chapter

[Chapter 11: Art, Architecture, and Craft](../../chapters/11-art-architecture-craft/index.md)
