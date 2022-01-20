import { Menu, MenuRange } from '@grammyjs/menu';
import { course } from './course_map';

import {
  DepartmentType,
  SchoolType,
  YearType,
  SemesterType,
  School,
  Year,
  Semester,
  MyContext,
} from './types';

// Main Menu to Pick School
export const main = new Menu<MyContext>('menu-menu')
  .submenu(
    SchoolType.SoANS,
    'school',
    (ctx) => (ctx.session.school_type = SchoolType.SoANS)
  )
  .row()
  .submenu(
    SchoolType.SoCEA,
    'school',
    (ctx) => (ctx.session.school_type = SchoolType.SoCEA)
  )
  .row()
  .submenu(
    SchoolType.SoEEC,
    'school',
    (ctx) => (ctx.session.school_type = SchoolType.SoEEC)
  )
  .row()
  .submenu(
    SchoolType.SoMCME,
    'school',
    (ctx) => (ctx.session.school_type = SchoolType.SoMCME)
  )
  .row();
// First SubMenu to Pick A School's Department
const school = new Menu<MyContext>('school');

function sendDepartmentBySchoolType(
  range: MenuRange<MyContext>,
  start: number,
  end?: number
) {
  Object.values(DepartmentType)
    .slice(start, end)
    .forEach((key) => {
      range
        .submenu(key, 'department', (ctx) => {
          ctx.session.department_type = key;
          ctx.editMessageText(
            `Please pick the Academic year for ${ctx.session.department_type} Department`
          );
        })
        .row();
    });
}

school.dynamic((ctx) => {
  const range = new MenuRange<MyContext>();
  //Check from Session which School was picked and Prompt to pick its departments
  switch (ctx.session.school_type) {
    case SchoolType.SoANS:
      sendDepartmentBySchoolType(range, 0, 7);
      break;
    case SchoolType.SoCEA:
      sendDepartmentBySchoolType(range, 7, 11);
      break;
    case SchoolType.SoEEC:
      sendDepartmentBySchoolType(range, 11, 15);
      break;
    case SchoolType.SoMCME:
      sendDepartmentBySchoolType(range, 15);
      break;
    default:
      for (let key in DepartmentType) {
        range.text(key).row();
      }
  }
  return range;
});

// Back button to return to main menu
school.back('🔝main menu');

//Submenu of School Submenu to pick a Departments Year
const department = new Menu<MyContext>('department');

function sendYearBySchoolType(
  range: MenuRange<MyContext>,
  start: number,
  end?: number
) {
  Object.values(YearType)
    .slice(start, end)
    .forEach((value) => {
      range
        .submenu(value, 'year', (ctx) => {
          ctx.session.year_type = value;
        })
        .row();
    });
}

department.dynamic((ctx) => {
  const range = new MenuRange<MyContext>();
  //Check from Session which School was picked and Prompt to pick year
  if (ctx.session.school_type == SchoolType.SoANS) {
    sendYearBySchoolType(range, 0, -1);
  } else {
    sendYearBySchoolType(range, 0);
  }
  // ctx.editMessageText(
  //   `Please Pick the Academic Semester for ${ctx.session.year_type} of ${ctx.session.department_type} Department`
  // );
  return range;
});
// Back button to return to main menu
department.back('🔝main menu');
// Back button to return to School Submenu
department.text('🔙back', (ctx) => ctx.menu.nav('school'));

// Year Submenu to pick which Semester Result user wants to view
const year = new Menu<MyContext>('year');
year
  .submenu('First Semester', 'semester', (ctx) => {
    ctx.session.semester_type = SemesterType.sem1;
  })
  .row();
year
  .submenu(
    'Second Semester',
    'semester',
    (ctx) => (ctx.session.semester_type = SemesterType.sem2)
  )
  .row();
// Back button to return to main menu
year.back('🔝main menu');
// Back button to return to Department Submenu
year.text('🔙back', (ctx) => ctx.menu.nav('department'));

const semester = new Menu<MyContext>('semester');

function makeCourseButtons(courses: string[][], range: MenuRange<MyContext>) {
  courses.forEach((course) => {
    range
      .text(course[0], (ctx) => {
        if (course.length < 3) {
          ctx.reply(
            `Sorry, But I don't have ${course[0]}'s Course Outline yet`
          );
        } else {
          ctx.replyWithDocument(course[2], {
            caption: `${course[0]} Course Outline`,
          });
          ctx.deleteMessage();
        }
      })
      .row();
  });
}

semester.dynamic((ctx) => {
  const range = new MenuRange<MyContext>();
  const sem: Semester = ctx.session.semester_type;
  const school = Object.keys(SchoolType)[
    Object.values(SchoolType).indexOf(ctx.session.school_type)
  ] as School;
  const year = Object.keys(YearType)[
    Object.values(YearType).indexOf(ctx.session.year_type)
  ] as Year;
  const department =
    Object.keys(DepartmentType)[
      Object.values(DepartmentType).indexOf(ctx.session.department_type)
    ];

  if (ctx.session.year_type == YearType.First) {
    if (ctx.session.school_type == SchoolType.SoANS) {
      makeCourseButtons(course.SoANS.First[sem], range);
    } else {
      makeCourseButtons(course.SoEEC.First[sem], range);
    }
  } else {
    makeCourseButtons((<any>course[school])[department][year][sem], range);
  }
  return range;
});

// function find_str(array: string[][], str: string) {
//   for (let i = 0; i < array.length; i++) {
//     for (let j = 0; j < array[i].length; j++) {
//       if (array[i][j] == str) {
//         return i;
//       }
//     }
//   }
// }

// semester.dynamic((ctx) => {
//   const range = new MenuRange<MyContext>();
//   const sem: Semester = ctx.session.semester_type;
//   const school = Object.keys(SchoolType)[
//     Object.values(SchoolType).indexOf(ctx.session.school_type)
//   ] as School;
//   const year = Object.keys(YearType)[
//     Object.values(YearType).indexOf(ctx.session.year_type)
//   ] as Year;
//   const department = Object.keys(DepartmentType)[
//     Object.values(DepartmentType).indexOf(ctx.session.department_type)
//   ] as Department;

//   courses.forEach((course) => {
//     const idxSchool = find_str(course.school, school);
//     const idxDepartment = find_str(course.department, department);
//     if (idxDepartment == idxSchool && idxDepartment) {
//       if (
//         year == course.year[idxDepartment] &&
//         sem == course.semester[idxDepartment]
//       ) {
//         // let course = course.course;
//         range
//           .text(course.course[0], (ctx) => {
//             if (course.course.length < 3) {
//               ctx.reply(
//                 `Sorry, But I don't have ${course.course[0]}'s Course Outline yet`
//               );
//             } else {
//               ctx.replyWithDocument(course.course[2], {
//                 caption: `${course.course[0]} Course Outline`,
//               });
//               ctx.deleteMessage();
//             }
//           })
//           .row();
//       }
//     }
//   });

//   return range;
// });

// Back button to return to main menu
semester.back('🔝main menu');
// Back button to return to School Submenu
semester.text('🔙back', (ctx) => ctx.menu.nav('year'));
// Close and Remove Menu
semester.text('⛔️ Close Menu', (ctx) => ctx.deleteMessage());
// Register Submenus under Main Menu
main.register(school);
main.register(department);
main.register(year);
main.register(semester);
