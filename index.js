import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filepath = path.join(__dirname, "data.json");
const data = JSON.parse(fs.readFileSync(filepath, "utf-8"));

const app = express();
const PORT = process.env.PORT || 3000;



// LEVEL 1 (Basic CRUD Operations)
// Students API
app.get('/api/students', (req, res) => {
    res.json({
        students: data.students
    });
});
app.get('/api/students/:id', (req, res) => {
    const paramObject = req.params;
    const student = data.students.find(stu => stu.id === paramObject.id * 1);
    res.json({
        student: student
    });
});

// Instructors API
app.get('/api/instructors', (req, res) => {
    res.json({
        instructors: data.instructors
    });
});
app.get('/api/instructors/:id', (req, res) => {
    const paramObject = req.params;
    const instructor = data.instructors.find(ins => ins.id === paramObject.id * 1);
    res.json({
        instructor: instructor
    });
});

// Courses API
app.get('/api/courses', (req, res) => {
    res.json({
        courses: data.courses
    });
});
app.get('/api/courses/:id', (req, res) => {
    const paramObject = req.params;
    const course = data.courses.find(cou => cou.id === paramObject.id * 1);
    res.json({
        course: course
    });
});

// enrollments API
app.get('/api/enrollments', (req, res) => {
    res.json({
        enrollments: data.enrollments
    });
});
app.get('/api/enrollments/:id', (req, res) => {
    const paramObject = req.params;
    const enrollment = data.enrollments.find(enr => enr.id === paramObject.id * 1);
    res.json({
        enrollment: enrollment
    });
});

// Assignments API
app.get('/api/assignments', (req, res) => {
    res.json({
        assignments: data.assignments
    });
});
app.get('/api/assignments/:id', (req, res) => {
    const paramObject = req.params;
    const assignment = data.assignments.find(ass => ass.id === paramObject.id * 1);
    res.json({
        assignment: assignment
    });
});

// Grades
app.get('/api/grades', (req, res) => {
    res.json({
        grades: data.grades
    });
});
app.get('/api/grades/:id', (req, res) => {
    const paramObject = req.params;
    const grade = data.grades.find(gra => gra.id === paramObject.id * 1);
    res.json({
        grade: grade
    });



    // LEVEL 2 (Nested Resources & Relationships)
    // Student's enrollments
    app.get('/api/students/:id/enrollments', (req, res) => {
        const paramObject = req.params;
        const studentEnrollments = data.enrollments.filter(enr => enr.student_id === paramObject.id * 1);
        res.json({
            enrollments: studentEnrollments
        });
    });

    // Student's courses
    app.get('/api/students/:id/courses', (req, res) => {
        const paramObject = req.params;
        const studentEnrollments = data.enrollments.filter(enr => enr.student_id === paramObject.id * 1);
        const studentCourses = studentEnrollments.map(enr => data.courses.find(cou => cou.id === enr.course_id));
        res.json({
            courses: studentCourses
        });
    });

    // Course's students
    app.get('/api/courses/:id/students', (req, res) => {
        const paramObject = req.params;
        const courseEnrollments = data.enrollments.filter(enr => enr.course_id === paramObject.id * 1);
        const courseStudents = courseEnrollments.map(enr => data.students.find(stu => stu.id === enr.student_id));
        res.json({
            students: courseStudents
        });
    });

    // Instructor's courses
    app.get('/api/instructors/:id/courses', (req, res) => {
        const paramObject = req.params;
        const instructorCourses = data.courses.filter(cou => cou.instructor_id === paramObject.id * 1);
        res.json({
            courses: instructorCourses
        });
    });

    // Course's assignments
    app.get('/api/courses/:id/assignments', (req, res) => {
        const paramObject = req.params;
        const courseAssignments = data.assignments.filter(ass => ass.course_id === paramObject.id * 1);
        res.json({
            assignments: courseAssignments
        });
    });

    // Enrollment's grades
    app.get('/api/enrollments/:id/grades', (req, res) => {
        const paramObject = req.params;
        const enrollmentGrades = data.grades.filter(gra => gra.enrollment_id === paramObject.id * 1);
        res.json({
            grades: enrollmentGrades
        });
    });

    

    // LEVEL 3 (Advanced Queries)
    // Student's GPA
    app.get('/api/students/:id/gpa', (req, res) => {
        const paramObject = req.params;
        const studentGrades = data.grades.filter(gra => gra.student_id === paramObject.id * 1);
        const totalPoints = studentGrades.reduce((sum, grade) => sum + grade.points, 0);
        const totalAssignments = studentGrades.length;
        const gpa = totalAssignments > 0 ? totalPoints / totalAssignments : 0;
        res.json({
            gpa: gpa
        });
    });

    // Course average grade
    app.get('/api/courses/:id/average-grade', (req, res) => {
        const paramObject = req.params;
        const courseAssignments = data.assignments.filter(ass => ass.course_id === paramObject.id * 1);
        const courseGrades = data.grades.filter(gra => courseAssignments.some(ass => ass.id === gra.assignment_id));
        const totalPoints = courseGrades.reduce((sum, grade) => sum + grade.points, 0);
        const totalAssignments = courseGrades.length;
        const averageGrade = totalAssignments > 0 ? totalPoints / totalAssignments : 0;
        res.json({
            averageGrade: averageGrade
        });
    });

    // Students taught by instructors
    app.get('/api/instructors/:id/students', (req, res) => {
        const paramObject = req.params;
        const instructorCourses = data.courses.filter(cou => cou.instructor_id === paramObject.id * 1);
        const instructorEnrollments = data.enrollments.filter(enr => instructorCourses.some(cou => cou.id === enr.course_id));
        const instructorStudents = instructorEnrollments.map(enr => data.students.find(stu => stu.id === enr.student_id));
        res.json({
            students: instructorStudents
        });
    });

    // Student's Schedule
    app.get('/api/students/:id/schedule', (req, res) => {
        const paramObject = req.params;
        const studentEnrollments = data.enrollments.filter(enr => enr.student_id === paramObject.id * 1);
        const studentCourses = studentEnrollments.map(enr => data.courses.find(cou => cou.id === enr.course_id));
        res.json({
            schedule: studentCourses
        });
    });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

});
