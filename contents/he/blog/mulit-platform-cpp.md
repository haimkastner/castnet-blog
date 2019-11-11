---
name: 'mulit-platform-cpp'
title: פרוייקט ++C/C חוצה פלטפורמות
year: 8 בנובמבר 2019
color: '#8e7964'
trans: 'soon'
id: 'mulit-platform-cpp'
description: הבנת תהליך בניית פרוייקט ++C/C משלב כתיבת הקוד ועד ההרצה והדיבאג בבסיס קוד אחד חוצה פלטפורמות
---


### הקדמה, או למי המאמר הזה מיועד
המאמר הזה מיועד עבורך, 
התוכניתן שיודע לכתוב קוד, 
מכיר את הבסיס, אבל מתקשה - כמו כולנו - לעשות את האקסטרה-מייל 
לבנות את הפרויקט כהלכה. 
אם גם לך, כמו כולנו, חסר את ה-Know how,
תצטרף. 
אני מקווה שבסוף תצא עם עוד ידע פרקטי ומעשי לפיתוח טוב יותר.

## חלק א': מה הסיפור?

כידוע לשפת ++C/C (להלן ++C)
ישנם קומפיילרים לכמעט כל מערכת הפעלה קיימת. 
כך שישנו פוטנציאל אדיר לכתיבת קוד פעם אחת ושימוש בתוצרים בכל מערכת קיימת. 

אממה, 
ברוב הקורסים והמדריכים של ++C
1מה שמסבירים זה משהו בסגנון: 

פתח פרוייקט ++C ב- Visual Studio
תכתוב קצת קוד Hello World ב-++C
ו….. להריץ.
וזהו הכל עובד, ורץ על מקומו בשלום.

מה הבעיה בזה? 
שזה יותר מדי קל… תכל'ס, 
הלומד הטרי לא מבין או מתעמק בכך שהוא בעצם כבול למבנה פרויקט של מיקרוסופט 
שכרגע קיים רק ל-Windows,
או כמה מורכב אפילו להחליף את הקומפיילר 
(=קומפיילר או מהדר בגדול: התכנה שממירה את הקוד ובונה קוד מכונה מותאם לריצה ספציפית לסביבה המבוקשת) 
או את הלינקר 
(=לינקר או מקשר: התכנה שלוקחת את קוד המכונה שנוצר ויוצרת ממנו קובץ מוכן להרצה או שימוש).


אם ננסה לפרק את החלקים של תהליך הפיתוח, 
משלב כתיבת הקוד ועד הרצת התכנה, 
נגיע כנראה לכך:
- כתיבת הקוד עצמו, כמובן.
- בחירת IDE, כלומר באיזה עורך טקסט/קוד נשתמש.
- יצירת Build System,
 כלומר הגדרת קבצי הפרויקט, מהי נקודת ההתחלה של הריצה, מאיפה להביא ספריות וכו' וכו'.
- בחירת והרצת הקומפיילר.

הבעיה (?) היא ש-Visual Studio
הוא גם ה-Build System
גם ה-IDE
וגם (לא מדויק אבל ככה מרגיש) הקומפיילר.

ולכן אם נרצה להעביר את הקוד למערכת אחרת 
נהייה בבעיה כי הגדרות הפרוייקט 
הם מותאמות ספציפית ל-IDE של מיקרוסופט בלבד.
וכך נניח וכתבנו קוד 
(שלא משתמש ב-WinAPI כמובן) 
ב-Visual Studio,
למרות שאין שום סיבה בעולם שנהיה מחוייבים ל
-IDE
ו/או מערכת ההפעלה של מיקרוסופט, 
זה מאוד מורכב לבנות מחדש את כל הפרויקט. 
 
גם אם נעבוד קשה ונבצע את זה, 
לא נוכל לאפשר לעצמנו שבאותו הפרויקט 
מפתחת אחת תעבוד עם Visual Studio כ-IDE וגם כ-Build System על Windows עם הקומפיילר MSBuild,
ואחר יעבוד על VS Code על Linux עם הקומפיילר GCC.
לכאורה חייבים להחליט על משהו, וכולם יתיישרו לאותה הסביבה.

וזה רע. 
אין צורך להסביר למה חוסר יכולת לשנות IDE או מערכת הפעלה זה רוע צרוף.

### מה הפתרון? 
ראשית חשוב לדעת לכל מי שמתחיל לעבוד עם ++C 
שיש כלי Build System  נפלא של פרויקט GNU (כן האלה מ-Linux\GNU)
שנקרא [Make](https://www.gnu.org/software/make/) והקובץ הגדרות שלו נקרא `Makefile`.

הכלי הוא בקוד פתוח כמובן ודרכו אפשר להגדיר מה שרוצים לפרוייקט, 
ואפילו Visual Studio מגרסה 2017 [תומכים](https://docs.microsoft.com/en-us/cpp/build/reference/creating-a-makefile-project?view=vs-2019) בזה (!!!)
  
כך שראשית, 
גם אם משתמשים ב-Visual Studio כ-IDE
עדיין ממש לא חייבים להיתקע עם ה-Build System המובנה.

ועדיין, 
איך אפשר להגדיר פרויקט שלא יחייב אותנו להיצמד ל-Build System
ספציפי ויאפשר לשמור את הקוד במאגר קוד משותף 
וכל תכניתן יבחר לו מערכת הפעלה \ Build System \ IDE שבו הוא מעוניין לעבוד?


כאן מגיע הכלי המדהים שנקרא
[CMake](https://cmake.org/),
גם הוא פותח במסגרת פרוייקט הקוד הפתוח GNU,
דרכו מגדירים פעם אחת את הפרויקט, 
ובעזרתו ניתן ליצור מגוון קבצי Build system לפי הצורך,
CMake תומך ב-VS, CodeBlocks, Eclipse וכמובן גם ב-Make (ועוד ועוד).

וכך ניתן ע"י מאגר קוד אחד עם קובץ הגדרות אחד, 
לתת לכל משתמש את האופציה לבחור את ה-IDE וה-Build system
המועדף עליו, 
ואו אז הקוד הנכתב במסגרת הפרויקט המשותף הוא באמת חוצה-פלטפורמות. 

כמובן שעל הדרך גם מקבלים דרך נוחה יותר להגדיר את הפרוייקט 
בלי צורך להכיר איך משנים את זה בכלי הספציפי שעליו עובדים.
  
## חלק ב': מימוש התובנות

את הדוגמאות פה אני אתן במערכת ההפעלה Windows,
מאחר וב-Linux הכל יותר קל וזמין,
אם בכל אופן אראה שמשום מה יש ביקוש גם ל-Linux נוסיף גם את זה.

ראשית יש להוריד את Cmake עבור Windows [מכאן](https://cmake.org/download/)
נזכור לשנות באינסטולר מברירת-המחדל שלא מוסיף את נתיב ההתקנה ל-PATH
שיוסיף, אחרת נצטרך להוסיף ידנית.

אחרי ההתקנה נפתח חלון CMD 
ונפעיל את הפקודה `cmake --version`.

באם מופיעה שגיאה אפשר לנסות לבצע לוג-אין מחדש או להוסיף ידנית את הנתיב 
`C:\Program Files\CMake\bin` ל-PATH.

##### לא מכירים מה זה PATH? תתחילו [מפה](https://en.wikipedia.org/wiki/PATH_(variable)).

נבחר תיקיה בה נרצה ליצור את הפרויקט וניצור קובץ בשם
`CMakeLists.txt`

הקובץ הזה יכיל את קינפוג והגדרות הפרויקט עבור CMake.

לצד הקובץ ניצור את קובץ הקוד שלנו נקרא לו `hello_multi_platform.cpp`
ובתוכו נזין את הקוד התמים הבא:

```cpp
#include <iostream>
int main(int argc, const char *argv[])
{
   std::cout << "Hello Multi-Platform ++C Code!" << '\n';
   return 0;
}
```

אחרי ש"סיימנו" לכתוב את הקוד (אמור להיות ברור מאוד מה הוא עושה) 
נגדיר ל-Cmake
איך לבנות את ה-Build System.

ניגש לקובץ `CMakeLists.txt` שיצרנו קודם,
ראשית נגדיר גרסת CMake

```cmake
cmake_minimum_required(VERSION 3.0)
```

ניצור פרוייקט וניתן לו את שמו
```cmake
project(hello-mp-cpp)
```

נגדיר מהו קוד המקור בפרויקט
```cmake
set(SOURCE hello_multi_platform.cpp)
```

נגדיר את בניית קובץ הריצה שלנו כך שעבור הפרויקט 
`hello-mp-cpp` המקור יהיה מ-`hello_multi_platform.cpp`.
```cmake
add_executable(${PROJECT_NAME} ${SOURCE})
```

מומלץ לעיין עוד בדוקומנטציה [כאן](https://cmake.org/cmake/help/latest/guide/tutorial/index.html)

ובסופו של דבר תוכנו של הקובץ 
`CMakeLists.txt`
אמור עכשיו להראות כך

```cmake
cmake_minimum_required(VERSION 3.0)

# set the project name
project(hello-mp-cpp)

# define the source
set(SOURCE hello_multi_platform.cpp)

# add the executable for the current project with the defined source
add_executable(${PROJECT_NAME} ${SOURCE})
```

אחרי שסיימנו את ההגדרה ניצור תיקיה בשם 
`Build`.
ובתוכה נקרא ל-CMake ליצור עבורנו את ה-Build System המדובר.

##### בשלב זה אני מניח שיש לכם Visual Studio מותקן על המחשב, אם לא מותקן לא חובה להתקין כדי להבין את העיקרון

נפתח את חלון הפקודה בנתיב של Build (שם נרצה את כל ה"זבל" שיווצר).

ובתוכה נכתוב את הפקודה

```bash
cmake -G "Visual Studio 16 2019" -DCMAKE_BUILD_TYPE=Debug ..
```

שזה אומר: תיצור פרוייקט Visual Studio גרסה X,
את הפרויקט תבנה לסביבת דיבאג, 
ואת קובץ ההגדרות של CMake תמצא בנתיב העליון.

את גרסת ה-Visual Studio ניתן להחליף לגרסה הקיימת במחשב, 
לקבלת רשימת הגרסאות הנתמכות יש לכתוב את הפקודה
`cmake --help` 

ועכשיו ניתן לפתוח את הפרויקט 
ב-Visual Studio
להריץ לדבג ולעשות כל מה שרוצים, תנסו ותראו.

אבל זה ממש לא חכמה, 
אנחנו רוצים לכתוב קוד ב-IDE בקוד פתוח 
ועם Build System בקוד פתוח ולא להיתקע עם מיקרוסופט.

כמובן שגם זה אפשרי בקטע הבא:

### הגדרת Cmake + Make + VS Code

איך מגדירים עם אותו קוד, 
אותו קובץ `CMakeLists.txt`,
אבל עם הרצה בעזרת Make,
קימפול ע"י GCC,
ודיבאג ב-VS Code.

בא נתחיל…

#### התקנות
ראשית נתקין Make [מכאן](http://gnuwin32.sourceforge.net/packages/make.htm).

הפעם האינסטולר לא מוסיף אוטומטית ל-PATH
ולכן נצטרך להוסיף ידנית ל-PATH 
את נתיב ההתקנה בד"כ זה:
`C:\Program Files (x86)\GnuWin32\bin`.

נוודא שהכל בסדר ע"י הפקודה `make --version`.

נתקין את הקומפיילר
GCC אותו נוריד 
[מכאן](https://www.ics.uci.edu/~pattis/common/handouts/mingweclipse/mingw.html)

אחרי ההתקנה בחלון נסמן את אלו
<image-responsive class="center" imageURL="blog/mulit-platform-cpp/gcc-installer-prepare.png"  alt="gcc-installer-prepare"/>

נחיל את השינויים
<image-responsive class="center" imageURL="blog/mulit-platform-cpp/gcc-installer-apply-changes.png"  alt="gcc-installer-apply-changes"/>

אחרי כמה דקות העדכון אמור להסתיים, והאינסטולר אמור להראות כך
<image-responsive class="center" imageURL="blog/mulit-platform-cpp/gcc-installer-ready.png"  alt="gcc-installer-ready"/>

נוסיף את 
`C:\MinGW\bin`
ל-PATH
והפעם לראש הרשימה, 
כדי למנוע התנגשויות עם התקנות של Visual Studio.

נוודא שאכן הוגדר כהלכה ע"י הפקודה `g++ --version`.

עכשיו הגיע הזמן ליצור את קובץ ה-`makefile` של make,
ראשית ננקה את תיקיית ה-Build  מכל מה שיש שם עבור Visual Studio,

נייצר את ה-build system של make ע"י הפקודה

```bash
cmake -G "Unix Makefiles" -DCMAKE_BUILD_TYPE=Debug ..
```

אותו דבר כמו ב-Visual Studio רק מחולל Build System שונה.

ועכשיו אנחנו כבר יכולים לקמפל את הקוד ע"י הפקודה 
`make`.

ואם הכל עבר בסדר נוצר לנו קובץ הרצה שנקרא `hello-mp-cpp.exe` ואותו ניתן להריץ, מדהים!

### רגע, איך מדבגים?
נגדיר IDE לגיטימי שנקרא VS Code
(כמובן שאין חובה, ניתן להשתמש בכל IDE אחר, זה סה"כ IDE, לא יותר)

 נתקין VS Code (איך עדיין לא מותקן כבר?) [מכאן](https://code.visualstudio.com/download)

ונפתח אותו בנתיב של הקוד שכתבנו, 
בשביל נוחות שימוש נוסיף את התוספים
[++C/C](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools)
עבור כתיבת הקוד

ו [CMake](https://marketplace.visualstudio.com/items?itemName=twxs.cmake)
עבור קבצי CMakeLists

בכדי ליצור את ה-Tasks לבנייה אוטמטית של הפרויקט

נלחץ על `ctrl` + `shift` + `p` ובחלונית נזין `Task` ונבחר ב-`Task: Configure task`
ובתפריט לא משנה מה בוחרים העיקר שיווצר קובץ
`Tasks.json` בתיקייה `.vdcode`. 


את התוכן של הקובץ `tasks.json` נחליף ב 
```json
{
    // See https://go.microsoft.com/fwlink/?LinkId=733558
    // for the documentation about the tasks.json format
    "version": "2.0.0",
    "command": "",
    "options": {
        "cwd": "${workspaceRoot}/build"
    },
    "tasks": [
        {
            "label": "clean",
            "type": "shell",
            "options": {
                "cwd": "${workspaceRoot}"
            },
            "windows": {
                "command": "IF exist build ( rmdir /S /Q build && mkdir build ) ELSE ( mkdir build )"
            },
            "linux": {
                "command": "rm -r build && mkdir",
            }
        },
        {
            "label": "cmake",
            "type": "shell",
            "command": "cmake",
            "windows": {
                "command": "cmake"
            },
            "args": [
                "-G",
                "Unix Makefiles",
                "-DCMAKE_BUILD_TYPE=Debug",
                ".."
            ],
            "dependsOn" : "clean"
        },
        {
            "label": "make",
            "type": "shell",
            "command": "make",
            "windows": {
                "command": "make"
            },
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "dependsOn": "cmake"
        }
    ]
}
```

יצרנו את המשימה
`cmake`
שיוצרת את ה-build system בעזרת cmake.

את המשימה
`make`
שמקמפלת את הקוד בעזרת make.

והמשימה
`clean` 
לניקוי ה-Build.


ובכדי להריץ ולדבג את הקוד ב-Vs Code

עכשיו נוסיף את קובץ הגדרות ההפעלה

נלחץ על `F5`
או על האייקון של הדיבאג 
ובתפריט שנפתח נבחר 
`++C (GDB\LLDB)`  
ושוב לא משנה מה נבחר העיקר שיווצר קובץ 
`launch.json`.

את התוכן של הקובץ `launch.json` נחליף ב
```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "(gdb) Launch",
            "type": "cppdbg",
            "request": "launch",
            "args": [],
            "stopAtEntry": true,
            "cwd": "${workspaceFolder}",
            "environment": [],
            "externalConsole": true,
            "MIMode": "gdb",
            "miDebuggerPath": "gdb",
            "program": "${workspaceFolder}/build/hello-mp-cpp",
            "windows": {
                "miDebuggerPath": "gdb.exe",
                "program": "${workspaceFolder}/build/hello-mp-cpp.exe",
            },
            "linux": {
                "program": "${workspaceFolder}/build/hello-mp-cpp",
            },
            "setupCommands": [
                {
                    "description": "Enable pretty-printing for gdb",
                    "text": "-enable-pretty-printing",
                    "ignoreFailures": true
                }
            ],
            "preLaunchTask": "make"
        }
    ]
}
```

כך שיוגדר להפעיל את המשימה `make` לפני ההרצה,
להריץ את קובץ ההרצה שנוצר
ולהתחבר לדיבאגר של
GNU שנקרא gdb.

ועכשיו רק נשאר ללחוץ על `F5` ו… להתחיל לדבג. 

<image-responsive class="center" imageURL="blog/mulit-platform-cpp/debugging.png"  alt="gcc-installer-ready"/>

הקוד והסביבה במלואה ב-[GitHub](https://github.com/haimkastner/mulit-platfrom-cpp).

בהצלחה!

אגב, אם יש שגיאה של פקודה לא מוכרת וכדו' ב-VS Code כדאי לנסות לעשות לוג-אין מחדש.

---

Photo by <a href="https://burst.shopify.com/@matthew_henry?utm_campaign=photo_credit&amp;utm_content=Free+Old+Payphone+Keyboard+Photo+%E2%80%94+High+Res+Pictures&amp;utm_medium=referral&amp;utm_source=credit">Matthew Henry</a> from <a href="https://burst.shopify.com/contact-us?utm_campaign=photo_credit&amp;utm_content=Free+Old+Payphone+Keyboard+Photo+%E2%80%94+High+Res+Pictures&amp;utm_medium=referral&amp;utm_source=credit">Burst</a>
