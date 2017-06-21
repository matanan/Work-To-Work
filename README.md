# Work-To-Work - Final Project

This project is a software project that deals with Web Applications. 
It is intended for **professionals**  – the system’s users.

The app is a kind of social network for professionals in various fields, who can perform a “job exchange” \ “match”, which means, one works for the other.

In addition, users will be able to recommend each other, send messages, add pictures to their profiles and more…

As I said, this Web App is intended for professionals and professionals only and creates kind of clique whose common denominator is professionals.
Each user will have a profile page where they can rank each other works and projects, give a positive \ negative feedback, and in that way to help others to decide who to choose.

The main tools that I have used to develop this Web App are:

  •	Database – MongoDB
  
  •	Server side – ExpressJS + NodeJS
  
  •	Client side – AngularJS + Bootstrap

All these tools together (except the Bootstrap) make up the software bundle – MEAN STACK.
This bundle is a free and open-source JaveScript software stack for building dynamic web sites and web applications.
All these components together make the perfect package for building projects like mine.


# Diary:

**יום חמישי 3.11.16:**
* בחרית מנחה
* כתיבת ההצעה

**יום ריבעי 23.11.16:**
* פגישה עם המנחה - יעל נצר

**יום חמישי 24.11.16:**
* יצירת תרשימי Use-Casee ו- Deployment Diagram
* סיום טופס ההתנעה והגשתו


**יום ראשון 27.11.16:**
* תחילת עבודה על הפרויקט המעשי - הקוד

**יום ראשון 11.12.16:**
* יצירת דפי האפליקציה - 
  * Registration.ejs
  * Profile.ejs
 * מימוש פונקציונליות - מעבר בין הדפים

**יום שבת 24.12.16:**
* החברות למסד הנתונים - MongoDB
* יצירת סכמות ואובייקטים עבור משתמש חדש ועבור משתמש רשום


**יום שלישי 3.1.17:**
* יצירת תרשים מחלקות (UML) 
* יצירת State Chart Diagram

**יום חמישי 5.1.17:**

* תחילת העבודה על סרטון האב טיפוס
* תחילת עבודה על מסמך האב טיפוס

**יום רביעי 18.1.17:**

* המשך עבודה על סרטון האב טיפוס
* שליחת טופס האב טיפוס לבדיקה ראשונית אצל המנחה

**יום שלישי 31.1.17:**

* המשך עבודה על סרטון האב טיפוס
* המשך עבודה על טופס האב טיפוס לאחר קבלת הערות מהמנחה

**יום שישי 10.2.17:**

* סיום הכנת סרטון האב טיפוס וקבלת אישור מהמנחה
* סיום הכנת טופס האב טיפוס וקבלת אישור מהמנחה

**יום חמישי 23.2.17:**

* הוספת תיעוד לקוד.
* הוספת הפיצ'ר להכנסת המלצה עבור משתמש, כולל הוספת סכמה ואובייקט עבור המלצה.
* שמירת ההמלצה במסד הנתונים.

**יום שלישי 7.3.17:**

* הוספת בדיקות יחידה לפונקצית הוספת המלצה למסד הנתונים.
* בעזרת פונקצית הבדיקה - מציאת באג - הוספת ההמלצה מתאפשרת ללא ולידציה של של המייל.
* תיקון הבאג באמצעות הוספת פונקציה הבודקת את נכונות המייל.

**יום שני 13.3.17:**

* הוספת כפתור חזרה לתחילת העמוד בעת גלילת העכבר (פונקצית - topFunction).

**יום רביעי 22.3.17:**

* על מנת לבצע "שאיבת" המלצות מבסיס הנתונים עבור משתמש מסוים והצגתן במעוד הפרופיל שלו - הוספתי שדה לאובייקט ההמלצה - owner - זהו שדה אשר מזהה את בעל ההמלצה וכך אוכל להציג את ההמלצות בעמודים המתאימים.
* סיום עבודה על פונקצית הכנסת המלצה - משתמש יכול להכניס המלצה עבור משתמש אחר וההמלצה תוצג אצל שעליו נכתבה ההמלצה וכמובן שגם הדירוג יופיע.

**יום חמישי 30.3.17:**

* ביצוע בדיקת אינטגרציה לעמוד הכניסה\הרשמה (registration).
* תיקון באגים בעמוד הכניסה - 
  * בעת הרשמת משתמש חדש תתבצע בדיקה בבסיס הנתונים האם קיים משתמש עם אותה כתובת מייל והוצאת הודעת שגיאה בהתאם.
  * הוספת שדה לרישום משתמש חדש - "שם העסק".
  * הוספת שם העסק לעמוד הפרופיל של המשתמש.
  * רישום משתמש יסתיים רק כאשר כל השדות בעמוד ההרשמה מלאים.
  
**יום רביעי 12.4.17:**

* הוספת פונקציית חיפוש בעמוד הפרופיל - משתמש יכול לחפש משתמשים אחרים הרשומים לאפליקציה לפי: מיקום, מייל, מקצוע או שם משתמש. התוצאות מוצגות בטבלה.

**יום שני 24.4.17:**

* הוספת עמוד "צפייה בפרופיל" אשר ישמש לצפייה בפרופילים של משתמשים אחרים ללא אפשרות עריכה - כאשר משתמש מחפש משתמשים אחרים הוא יוכל להקליק על שמות המשתמשים בטבלת התוצאות וכך להגיע לעמוד הפרופיל שלהם כצופה.
* הוספת אובייקט נוסף - "יצירת קשר" אשר ישמש ליצירת קשר בין משתמשים
* יצירת קשר בין משתמשים תתבצע באמצעות שליחת מייל מרובריקת "יצירת קשר" ישירות מהאפליקציה (אוסיף זאת בעתיד) במקום שליחת הודעות פנימית של האפליקציה - מצאתי כי שימוש שכזה הוא נכון יותר, נח יותר ויעיל יותר.
עמוד הפרופיל של המשתמשים ישמש כעמוד פרטי - עמוד בו ניתן לערוך את הפרטיים האישיים.

**יום שני 1.5.17:*

* הוספת פונקציית שליחת מייל ישירות מעמוד הצפייה בפרופיל ע"י שימוש ב-API
של "EmailJS"
המאפשר שליחת טפסים באמצעות דואר אלקטרוני.

**יום שני 8.5.17:**

* הוספת הפונקציה - updateContact
אשר מעדכנת רשומה בבסיס הנתונים - כאשר משתמש מכניס נתונים על עצמו ברובריקת "יצירת קשר" האובייקט של יצירת הקשר מתווסף לבסיס התונים לאוסף המתאים.
כעת, ניתן לבצע עריכה לשדה זה ע"י הפונקציה החדשה והשדה הרלוונטי בלבד מתעדכן. 
* הוספת הפונקציה addContact
אשר יודעת לזהות אם צריך לעדכן את השדה או להוסיף אובייקט חדש ע"פ בדיקה וזיהוי כתובת המייל של המשתמש.
* הוספת תיבת טקסט פונקציונלית ברובריקת "צור קשר" ע"י שימוש ב-
CK-EDITOR API

**יום רביעי 10.5.17:**

* פגישה עם המנחה - יעל.
* אישור הגשת דו"ח הבנייה ע"י יעל, והגשתו.

**יום שבת 13.5.17:**

* שיפור פונקציית שליחת המיילים - אין יותר צורך בהכנסת כתובות המייל של המוען והנמען ע"י המשתמש, הכתובות נקלחות ישירות מבסיס הנתונים.

**יום שני 15.5.17:**

* הוספת פנוקציית חיפוש גם לעמוד visitProfile.
* הוספת בדיקת קלט ורשימת ערים מובנית בעמוד ההרשמה ופוקנציות החיפוש.
* הוספת אייקון לכרטיסיה בדפדפן ע"י שימוש ב-Favicon.
* החלפת ה-pop-ups המקוריים ב-Sweet-Alerts פונקציונליים.

**יום ראשון 21.5.17:**

* פגישה עם יעל המנחה.
* הוספת עמוד עריכת פרופיל ועריכת תמונות - "editProfile" - העמוד מכיל עריכת פרטי משתמש ועריכת תמונות.

**יום שני 22.5.17:**

* מימוש הפונקציה לעריכת פרטי המשתמש "editProp" בעמוד עריכת הפרופיל.
* הוספת שימוש ב- Google AutoComplete Places API בעת הוספת מיקום - עמודים: registration, profile, visitProfile.
* שינוי בפונקציות ההמלצות - כעת במקום כתובת המייל מופיע שם המשתמש בתור לינק לעמוד הבית של אותו משתמש.

**יום ראשון 28.5.17:**

* הוספת פונקציה "שכחת סיסמא" בעמוד ההרשמה הכוללת:
         1. יצירת סיסמא רנדומלית בת 5 תווים ע"י הפונקציה makeRandomPass.
         2. בדיקה שהמשתמש אכן קיים בבסיס הנתונים.
         3. שליחת מייל למשתמש הרלוונטי ע"י שימוש  ב-API של "EmailJS".

**יום ראשון 4.6.17:**

* הוספת פונקצית העלאת תמונות לבסיס הנתונים מעמוד editProfile.
* ההעלאה מתבצעת על קובץ bitmap שהומר לקובץ base64.
* עבור כל תמונה סכמה עם השדות: כותרת, בעלים והתמונה עצמה.
* השדה owner הוא בעצם המפתח של ה-collection ובאמצעותו אוכל להציג את התמונה בעמוד המתאים.

**יום שישי 9.6.17:** 

* הוספת אפשרות להמלצה אנונימית ע"י סימון "וי" בתיבה המתאימה.
* תיקון באגים - עמוד visitProfile.

**יום שישי 16.6.17 - יום שני 19.6.17:**

* הכנת דו"ח סיום.
* הכנסת הסרטון.

**יום ראשון 18.6.17:**

* הוספת מיון התוצאות בטבלת החיפוש ע"פ מיקום.


