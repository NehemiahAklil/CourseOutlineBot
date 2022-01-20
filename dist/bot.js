import express from 'express';
import { main } from './menu';
import { Bot, session, webhookCallback } from 'grammy';
import { coursesInfo } from './course_map';
//Config dotenv to map .env files and environmental variables
import dotenv from 'dotenv';
dotenv.config();
import { DepartmentType, SchoolType, YearType, SemesterType, } from './types';
if (process.env.BOT_TOKEN == null)
    throw Error('BOT_TOKEN is missing.');
export const bot = new Bot(process.env.BOT_TOKEN);
// Install session middleware, and define the initial session value.
function initial() {
    return {
        school_type: SchoolType.SoANS,
        department_type: DepartmentType.AB,
        year_type: YearType.First,
        semester_type: SemesterType.sem1,
    };
}
bot.use(session({ initial }));
// bot.on('callback_query:data', async (ctx, next) => {
//   console.log(
//     'another callbackQuery happened',
//     ctx.callbackQuery.data.length,
//     ctx.callbackQuery.data
//   );
//   return next();
// });
//Catch any Errors while handling Updates
bot.catch((error) => {
    console.log(new Date(), 'Bot Error : ', error);
});
// Use Menu Menu to Make it interactive.
bot.use(main);
bot.command('start', async (ctx) => {
    //Send menu
    await ctx.reply('Welcome ASTU Course Outline Bot. Pick a School to view its departments course outline.', { reply_markup: main });
});
function checkWord(word) {
    let courseInfo = new Set();
    coursesInfo.forEach((course) => {
        course.course.forEach((c) => {
            if (course.course.length < 3) {
                return;
            }
            c = c.toLowerCase();
            word = word.toLowerCase();
            if (c.includes(word)) {
                courseInfo.add(course.course);
            }
        });
    });
    return courseInfo;
}
// Inline Query
bot.on('inline_query', async (ctx) => {
    const answer = [];
    const res = checkWord(ctx.inlineQuery.query);
    if (!res.size) {
        return;
    }
    console.log(res);
    let idx = 0;
    res.forEach((query) => {
        answer.push({
            type: 'document',
            id: `course-${idx}`,
            title: `${query[0]}`,
            caption: `${query[0]} Course Outline`,
            document_file_id: query[2],
            description: `${query[0]}'s Outline`,
        });
        idx++;
    });
    await ctx.answerInlineQuery(answer);
});
// bot.start({
//   onStart: (botInfo) => {
//     console.log(new Date(), 'Bot starts as', botInfo.username);
//   },
// });
const app = express(); // or whatever you're using
app.use(express.json()); // parse the JSON request body
// 'express' is also used as default if no argument is given.
app.use(webhookCallback(bot, 'express'));
