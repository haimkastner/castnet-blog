---
name: 'js-best-practices-config-ci-part-d'
title: 'הגדרת סביבת פיתוח ל-Node.JS – הגדרת תהליך אינטגרציה אוטומטית'
year: 10 ביולי 2021
color: '#8e7964'
trans: 'js-best-practices-config-ci-part-d'
id: 'js-best-practices-config-ci-part-d'
description:  מדריך הגדרת סביבת פרוייקט תקני ב-NODE.JS – חלק ד' – הגדרת תהליך אינטגרציה אוטומטית
---

----
> *הגדרת סביבת פיתוח ל-Node.JS*
>
> [חלק א'](/blog/js-best-practices-config-ts-part-a) – הגדרת פרוייקט TS
>
> [חלק ב'](/blog/js-best-practices-config-linter-part-b) – הגדרת לינטר
>
> [חלק ג'](/blog/js-best-practices-config-unit-tests-part-c) – הגדרת בדיקות יחידה
>
> <ins>[חלק ד'](/blog/js-best-practices-config-ci-part-d) – הגדרת תהליך אינטגרציה אוטומטית</ins>
----

<br>
<br>

הגענו בשעה טובה לחלק האחרון בו נראה איך לאגד את כל מבנה הפרוייקט לכדי 
מערכת פועלת המוודאת שכל הכנסת קוד תהיה תקינה ובהתאם לכללים ולא נשבר שום דבר, 
ובנוסף עושה דפלוי אם צריך  איך שצריך.

מערכת כזו נקראת `CI/CD` קיצור של אינטגרציה מתמשכת ותהליך דפלוי מתמשך ואוטומטי.

בחלק הזה אני אראה איך להגדיר את ה CI בסביבת GitHub Action המצויינת, 
כמובן העקרונות נכונים לכל שירות דומה ומתחרה.

אז דבר ראשון כמובן צריך חשבון ב-GitHub
ולהשתמש בו בתור שרת ה-Git
 של הפרוייקט 
(כן, אה?)

בחזרה לפרוייקט שלנו, ניצור את הנתיב הבא 
```bash
.github/workflows
```
ובו נוסיף קובץ בשם 
`prj_ci.yml`
או כל שם אחר בסיומת `yml` שעולה על דעתכם.

הקובץ הזה מגדיר ל-GitHub 
אוסף ג'ובים ובתוכו רשימת פקודות להריץ 
ב-bash
 בעזרתם נוכל להריץ את הטסטים, הלינטר, לשנות קבצים,
 ליצור releases
 בעצם כל מה שנרצה, הקונטקסט רץ בדוקר שכולו 
של הג'וב ופתוח לכל פקודה שאפשר לחשוב עליה.  

ניתן להריץ ג'ובים אוטומטית או ידנית, 
לפי בראנצים (למשל לאפשר דפלוי רק מה
 main branch),
 בקיצור אפשר לעשות בזה הככככלללל, וכמובן גם ליצור artifact עם תוצרים אם צריך.

כרגע לא ניגע בכל הטוב הזה, 
אלא נעשה ג'וב מאוד פשוט שבודק שהקוד שעומד להכנס אכן תקין מבחינת הלינטר והטסטים, 
שהבילד עבר בשלום 
ואת התוצרים נעלה לארטיפקטורי 
כך שנוכל לההשתמש הזה כל אימת שנרצה.
 
בשביל הג'וב הצנוע שלנו נשים את התוכן הבא, מומלץ בחום לקרוא את ההערות ולהבין מה "הולך" שם.
```yaml
name: JS-CI-EXAMPLE # The name of this flow

on: [push] # The triggers for this flows, set to be any code push 

jobs: # The jobs collection to run
  test: # The first job, the test, here we will make sure the new code was not breading the lint rule sand not breaking the tests.
    runs-on: ubuntu-latest # Run this test on ubuntu based environment
    strategy: 
      matrix: # Defined environment to run on, currently we want to run only on node v14
        node-version: [14.x] 
    steps: # The steps to run in order to test the new code in this job
    - uses: actions/checkout@v1  # The first step is to checkout the codebase from the repository (This is a build-in GitHub action, no extra info required)
    - name: Install node # The second step is to install Node 
      uses: actions/setup-node@v1 # Use build-in GitHub action for it
      with: # Use the version matrix to pass GitHub action the required versions
        node-version: ${{ matrix.node-version }}
    - name: Lint # The third step is to do the major logic, to validate the new code by the linter and to check the test
      run: | # The command to run, install the dependencies as they in the `packages.lock` and run the lint command
        npm ci 
        npm run lint
    - name: Test # The forth step in this job is to run the tests and to make sure all of them succeed
      run: |
        npm run test 
  build: # The second job is used to build the project then upload the results to the GitHub Actions artifactory.
    needs: test # Mark the build job, as 'test' job needed, so this job will starts only after all test succeeded 
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [14.x]
    steps:
    - uses: actions/checkout@v1 
    - name: Install node
      uses: actions/setup-node@v1
      with:
        node-version: ${{ matrix.node-version }}
    - name: Build # This step used to build the project
      run: |
        npm ci
        npm run build
    - uses: actions/upload-artifact@v2 # After the project has been built, upload the results to GitHub Actions the artifactory, (This a build-in GitHub action)
      with:
        name: lib # The name for the uploaded artifact
        path: dist # The path of the built project assets
```

אחרי שנדחוף את הקובץ הזה ל
-GitHub 
נוכל ללכת לטאב
 Actions בממשק הוובי של GitHub
ולראות את התקדמות התהליך

<image-responsive imageURL="blog/js-best-practices-config-ci-part-d/actions-1.jpg" />
<br>
<image-responsive imageURL="blog/js-best-practices-config-ci-part-d/actions-2.jpg" />
<br>

ובסיומו אם הכל הצליח נוכל לראות את הארטיפקט החדש ולהוריד אותו
(כמובן אפשר גם עם GitHub API)

<image-responsive imageURL="blog/js-best-practices-config-ci-part-d/actions-3.jpg" />
<br>


נחמד, נכון?

עכשיו בא ננצל את זה שיש לנו דו"ח מסודר על 
הטסטים כדי לקבל דשבורד יפה עם סטטיסטיקות כיסוי לפי זמן\בראנצ' 🧮

לצורך כך נתחבר ל- 
[coveralls.io](https://coveralls.io/)
עם חשבון ה-GitHub.

ניתן להם גישה לריפוסיטורי אותו אנו מעוניין להציג

<image-responsive imageURL="blog/js-best-practices-config-ci-part-d/coveralls-1.jpg" />

נחזור לקובץ ה-`prj_ci.yml` 
ונשנה את הטסט במקום להריץ
`npm run test` 
שיריץ 
`npm run cover` 
כך שיכין עבורנו את הדו"ח.


נוסיף Action step של coveralls 
שיודע לקחת את הדו"ח ולשלוח אליהם למערכת
 (זוכרים שנתנו להם גישה לריפוסיטורי הזה?)
```yaml
    - name: Publish to Coveralls # In this last step, the coveralls action will send the code coverage report to the Coveralls dashboard 
      uses: coverallsapp/github-action@v1.1.2 # Use the Coveralls ready to use action
      with:
        github-token: ${{ github.token }} # The job token in order to let Coveralls access to the job assets
```
עכשיו הג'וב המלא של הטסטים ייראה כך

```yaml
  test: # The first job, the test, here we will make sure the new code was not breading the lint rule sand not breaking the tests.
    runs-on: ubuntu-latest # Run this test on ubuntu based environment
    strategy: 
      matrix: # Defined environment to run on, currently we want to run only on node v14
        node-version: [14.x] 
    steps: # The steps to run in order to test the new code in this job
    - uses: actions/checkout@v1  # The first step is to checkout the codebase from the repository (This is a build-in GitHub action, no extra info required)
    - name: Install node # The second step is to install Node 
      uses: actions/setup-node@v1 # Use build-in GitHub action for it
      with: # Use the version matrix to pass GitHub action the required versions
        node-version: ${{ matrix.node-version }}
    - name: Lint # The third step is to do the major logic, to validate the new code by the linter and to check the test
      run: | # The command to run, install the dependencies as they in the `packages.lock` and run the lint command
        npm ci 
        npm run lint
    - name: Test # The forth step in this job is to run the tests and to make sure all of them succeed, use the cover script in order to generate the test cover report
      run: |
        npm run cover 
    - name: Publish to Coveralls # In this last step, the coveralls action will send the code coverage report to the Coveralls dashboard 
      uses: coverallsapp/github-action@v1.1.2 # Use the Coveralls ready to use action
      with:
        github-token: ${{ github.token }} # The job token in order to let Coveralls access to the job assets
```

ניתן לראות את הקובץ המלא כאן
[prj_ci.yml](https://github.com/haimkastner/js-project-best-practice/blob/main/.github/workflows/prj_ci.yml)


נדחוף את השינויים ל-GitHub ו... זהו.

נמתין בסבלנות שהג'וב ב-GitHub  יסתיים, 
ונוכל לראות את התוצאות בדשבורד של
 Coveralls 
 למשל במקרה של פרוייקט הדוגמה זה יהיה
 ה-URL הבא
[https://coveralls.io/github/haimkastner/js-project-best-practice](https://coveralls.io/github/haimkastner/js-project-best-practice)

<image-responsive imageURL="blog/js-best-practices-config-ci-part-d/coveralls-2.jpg" />

<br>

זהו הכל מוכן, 
נשאר רק להוסיף בדג'טים חמודים 
 הפרוייקט שיציגו את הסטטוס של הבילד ושל הכיסוי של הטסטים.

ניצור קובץ `README.md` ,אם לא קיים עדיין
ונכתוב בו ב-[markdown](https://www.markdownguide.org/)
כמה מילים על הפרוייקט שלנו.

זה המקום לכתוב למה הפרוייקט מיועד 
איך משתמשים בו ומידע שימושי 
ודוקומנטציה כללית על הפרוייקט.

לקובץ 
נוסיף בדג'ט שיציג את הסטטוס של הבילד והטסטים בברנצ' 
`main` (או כל בראנצ' אחר)

```markdown
[![Test & Build](https://github.com/<username>/<repo-name>/workflows/JS-CI-EXAMPLE/badge.svg?branch=main)](https://github.com/<username>/<repo-name>/actions)
```
ובדג'ט שיציג את הכיסוי של הטסטים 
```markdown
[![Coverage](https://coveralls.io/repos/github/<username>/<repo-name>/badge.svg?branch=main)](https://coveralls.io/github//<username>/<repo-name>/?branch=main)
```

במקרה של פרוייקט ההדגמה זה ייראה כך
```markdown
# js-project-best-practice

An example project with all best-practices boilerplate structure

[![Test & Build](https://github.com/haimkastner/js-project-best-practice/workflows/JS-CI-EXAMPLE/badge.svg?branch=main)](https://github.com/haimkastner/js-project-best-practice/actions)
[![Coverage](https://coveralls.io/repos/github/haimkastner/js-project-best-practice/badge.svg?branch=main)](https://coveralls.io/github/haimkastner/js-project-best-practice?branch=main)

Includes 
* TypeScript
* Linter (ESLint)
* Prettier 
* Unit Tests (Mocha & Chai)
* Continuous Integration (GitHub Actions)

The articles about it is available in [blog.castnet](https://blog.castnet.club/blog/js-best-practices-config-ts-part-a)
```

נדחוף את הקובץ ל-GitHub
 ועכשיו נוכל לראות את הבדג'טים מוצגים

<image-responsive imageURL="blog/js-best-practices-config-ci-part-d/readme-1.jpg" />
<br>


זהו. הכל מוכן.

ניתן לראות את הפרוייקט במלואו [js-project-best-practice](https://github.com/haimkastner/js-project-best-practice)

 כדאי מאוד להעמיק עוד יותר בכל הכלים ולהוציא מהם את המקסימום
אבל בשביל הבסיס של הבסיס נראה לי זה מספיק, 
תודה רבה שהייתים איתי עד כאן, היה מתיש אבל היי, שווה את ההשקעה 😎
