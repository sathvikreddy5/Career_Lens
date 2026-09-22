export const practiceResources = {
  javascript: {
    practice: [
      {
        id: "js-sum-two-numbers",
        title: "Sum Two Numbers",
        type: "coding",
        difficulty: "Beginner",
        description:
          "Write a function that takes two numbers and returns their sum.",

        instructions: [
          "Create a function named sum.",
          "The function should accept two numbers: a and b.",
          "Return the sum of a and b.",
        ],

        language: "javascript",

        starterCode: `function sum(a, b) {
  // Write your solution here
}`,

        testCases: [
          {
            input: [2, 3],
            expected: 5,
          },
          {
            input: [10, 20],
            expected: 30,
          },
          {
            input: [-5, 5],
            expected: 0,
          },
        ],

        hint: "Use the + operator to combine the two numbers.",
      },

      {
        id: "js-find-maximum",
        title: "Find the Maximum Number",
        type: "coding",
        difficulty: "Beginner",
        description: "Write a function that returns the larger of two numbers.",

        instructions: [
          "Create a function named findMax.",
          "The function should accept two numbers.",
          "Return whichever number is larger.",
        ],

        language: "javascript",

        starterCode: `function findMax(a, b) {
  // Write your solution here
}`,

        testCases: [
          {
            input: [10, 20],
            expected: 20,
          },
          {
            input: [50, 30],
            expected: 50,
          },
          {
            input: [-5, -2],
            expected: -2,
          },
        ],

        hint: "Compare the two numbers and return the larger one.",
      },

      {
        id: "js-count-vowels",
        title: "Count Vowels",
        type: "coding",
        difficulty: "Intermediate",
        description:
          "Write a function that counts the number of vowels in a string.",

        instructions: [
          "Create a function named countVowels.",
          "Accept a string as input.",
          "Count a, e, i, o, and u.",
          "Return the total number of vowels.",
        ],

        language: "javascript",

        starterCode: `function countVowels(str) {
  // Write your solution here
}`,

        testCases: [
          {
            input: ["hello"],
            expected: 2,
          },
          {
            input: ["javascript"],
            expected: 3,
          },
          {
            input: ["AEIOU"],
            expected: 5,
          },
        ],

        hint: "Convert the string to lowercase and check each character against the vowels.",
      },
    ],

    project: {
      title: "Build a JavaScript Expense Tracker",
      difficulty: "Intermediate",
      description:
        "Build a small expense tracker using JavaScript with add, delete, filter, and total-expense functionality.",
      skills: ["JavaScript", "Arrays", "Objects", "DOM Manipulation"],
    },
  },

  react: {
    practice: [
      {
        title: "Build Reusable React Components",
        type: "practice",
        difficulty: "Beginner",
        description:
          "Create reusable components using props, state, and event handling.",
      },
      {
        title: "React API Dashboard",
        type: "practice",
        difficulty: "Intermediate",
        description:
          "Create a dashboard that fetches data from an API and handles loading and error states.",
      },
    ],
    project: {
      title: "React Career Dashboard",
      difficulty: "Intermediate",
      description:
        "Build a responsive dashboard with reusable components, API integration, forms, and navigation.",
      skills: ["React", "JavaScript", "REST APIs", "Git"],
    },
  },

  "node-js": {
    practice: [
      {
        title: "Build a REST API",
        type: "practice",
        difficulty: "Beginner",
        description: "Create CRUD endpoints using Node.js and Express.",
      },
      {
        title: "Authentication API",
        type: "practice",
        difficulty: "Intermediate",
        description:
          "Implement registration, login, password hashing, and JWT authentication.",
      },
      {
        title: "API Error Handling",
        type: "practice",
        difficulty: "Intermediate",
        description:
          "Build centralized error handling and validation for an Express application.",
      },
    ],
    project: {
      title: "Student Management API",
      difficulty: "Intermediate",
      description:
        "Build a backend API for managing students, authentication, CRUD operations, and protected routes.",
      skills: ["Node.js", "Express.js", "REST APIs", "Authentication", "SQL"],
    },
  },

  "express-js": {
    practice: [
      {
        title: "Create a Basic Express Server",
        type: "practice",
        difficulty: "Beginner",
        description:
          "Create an Express server with a health-check endpoint and return a JSON response.",
      },
      {
        title: "Build REST API Routes",
        type: "practice",
        difficulty: "Intermediate",
        description:
          "Create GET, POST, PUT, and DELETE routes for a simple resource.",
      },
      {
        title: "Add Middleware",
        type: "practice",
        difficulty: "Intermediate",
        description:
          "Create custom middleware that logs incoming requests and handles invalid requests.",
      },
      {
        title: "Build an Authenticated API",
        type: "practice",
        difficulty: "Advanced",
        description:
          "Create an Express API with JWT authentication and protected routes.",
      },
    ],

    project: {
      title: "Build a REST API with Express.js",
      difficulty: "Intermediate",
      description:
        "Build a complete REST API with Express.js, authentication, validation, error handling, and database integration.",
      skills: ["Express.js", "REST API", "Middleware", "Authentication"],
    },
  },

  java: {
    practice: [
      {
        id: "java-sum-two-numbers",
        title: "Sum Two Numbers",
        type: "coding",
        difficulty: "Beginner",
        description:
          "Write a Java method that takes two integers and returns their sum.",

        instructions: [
          "Create a method named sum.",
          "The method should accept two integers: a and b.",
          "Return the sum of a and b.",
        ],

        language: "java",

        starterCode: `class Solution {
    public static int sum(int a, int b) {
        // Write your solution here
        return 0;
    }
}`,

        testCases: [
          {
            input: [2, 3],
            expected: 5,
          },
          {
            input: [10, 20],
            expected: 30,
          },
          {
            input: [-5, 5],
            expected: 0,
          },
        ],

        hint: "Use the + operator to add the two integers.",
      },

      {
        id: "java-find-maximum",
        title: "Find the Maximum",
        type: "coding",
        difficulty: "Beginner",
        description:
          "Write a Java method that returns the larger of two integers.",

        instructions: [
          "Create a method named findMax.",
          "The method should accept two integers.",
          "Return the larger value.",
        ],

        language: "java",

        starterCode: `class Solution {
    public static int findMax(int a, int b) {
        // Write your solution here
        return 0;
    }
}`,

        testCases: [
          {
            input: [10, 20],
            expected: 20,
          },
          {
            input: [50, 30],
            expected: 50,
          },
          {
            input: [-5, -2],
            expected: -2,
          },
        ],

        hint: "Compare the two numbers using if/else or Math.max().",
      },

      {
        id: "java-count-vowels",
        title: "Count Vowels",
        type: "coding",
        difficulty: "Intermediate",
        description:
          "Write a Java method that counts the number of vowels in a string.",

        instructions: [
          "Create a method named countVowels.",
          "Accept a String as input.",
          "Count a, e, i, o, and u.",
          "The method should handle uppercase letters.",
          "Return the total number of vowels.",
        ],

        language: "java",

        starterCode: `class Solution {
    public static int countVowels(String str) {
        // Write your solution here
        return 0;
    }
}`,

        testCases: [
          {
            input: ["hello"],
            expected: 2,
          },
          {
            input: ["javascript"],
            expected: 3,
          },
          {
            input: ["AEIOU"],
            expected: 5,
          },
        ],

        hint: "Convert the string to lowercase and check each character against a, e, i, o, and u.",
      },
    ],

    project: {
      title: "Build a Java Student Management System",
      difficulty: "Intermediate",
      description:
        "Build a Java application for managing students using classes, collections, validation, and basic CRUD operations.",
      skills: ["Java", "OOP", "Collections", "Exception Handling"],
    },
  },

  dsa: {
    practice: [
      {
        title: "Array Problems",
        type: "practice",
        difficulty: "Beginner",
        description:
          "Solve common array problems involving traversal, hashing, prefix sums, and two pointers.",
      },
      {
        title: "Sliding Window Problems",
        type: "practice",
        difficulty: "Intermediate",
        description:
          "Practice fixed and variable-size sliding window patterns.",
      },
      {
        title: "Binary Search Problems",
        type: "practice",
        difficulty: "Intermediate",
        description:
          "Practice binary search on arrays and answer-space problems.",
      },
    ],
    project: {
      title: "DSA Problem Solving Portfolio",
      difficulty: "Intermediate",
      description:
        "Build a structured collection of solved DSA problems with explanations, approaches, and complexity analysis.",
      skills: ["DSA", "Problem Solving", "Java", "Git"],
    },
  },

  sql: {
    practice: [
      {
        id: "sql-select-students",
        title: "Select All Students",
        type: "sql",
        difficulty: "Beginner",

        description:
          "Write a SQL query to retrieve all students from the students table.",

        instructions: [
          "Use the students table.",
          "Return all columns.",
          "Use a SELECT query.",
        ],

        language: "sql",

        starterCode: `SELECT
    -- Write your query here
`,

        setupSql: `
        CREATE TEMP TABLE students (
          id INTEGER,
          name TEXT,
          age INTEGER,
          branch TEXT
        );

        INSERT INTO students (id, name, age, branch)
        VALUES
          (1, 'Rahul', 21, 'CSE'),
          (2, 'Priya', 20, 'ECE'),
          (3, 'Arjun', 22, 'CSE'),
          (4, 'Sneha', 21, 'IT');
      `,

        testCases: [
          {
            expectedRows: [
              {
                id: "1",
                name: "Rahul",
                age: "21",
                branch: "CSE",
              },
              {
                id: "2",
                name: "Priya",
                age: "20",
                branch: "ECE",
              },
              {
                id: "3",
                name: "Arjun",
                age: "22",
                branch: "CSE",
              },
              {
                id: "4",
                name: "Sneha",
                age: "21",
                branch: "IT",
              },
            ],
          },
        ],

        hint: "Use SELECT * FROM students;",
      },

      {
        id: "sql-filter-cse",
        title: "Find CSE Students",
        type: "sql",
        difficulty: "Beginner",

        description: "Find all students who belong to the CSE branch.",

        instructions: [
          "Use the students table.",
          "Return the name and branch.",
          "Only return students whose branch is CSE.",
        ],

        language: "sql",

        starterCode: `SELECT
    -- Select name and branch
FROM students
-- Add your condition
`,

        setupSql: `
        CREATE TEMP TABLE students (
          id INTEGER,
          name TEXT,
          age INTEGER,
          branch TEXT
        );

        INSERT INTO students (id, name, age, branch)
        VALUES
          (1, 'Rahul', 21, 'CSE'),
          (2, 'Priya', 20, 'ECE'),
          (3, 'Arjun', 22, 'CSE'),
          (4, 'Sneha', 21, 'IT');
      `,

        testCases: [
          {
            expectedRows: [
              {
                name: "Rahul",
                branch: "CSE",
              },
              {
                name: "Arjun",
                branch: "CSE",
              },
            ],
          },
        ],

        hint: "Use WHERE branch = 'CSE'.",
      },

      {
        id: "sql-order-students",
        title: "Sort Students by Age",
        type: "sql",
        difficulty: "Beginner",

        description: "Return all students sorted from youngest to oldest.",

        instructions: [
          "Use the students table.",
          "Return name and age.",
          "Sort the result by age in ascending order.",
        ],

        language: "sql",

        starterCode: `SELECT
    name,
    age
FROM students
-- Sort by age
`,

        setupSql: `
        CREATE TEMP TABLE students (
          id INTEGER,
          name TEXT,
          age INTEGER,
          branch TEXT
        );

        INSERT INTO students (id, name, age, branch)
        VALUES
          (1, 'Rahul', 21, 'CSE'),
          (2, 'Priya', 20, 'ECE'),
          (3, 'Arjun', 22, 'CSE'),
          (4, 'Sneha', 21, 'IT');
      `,

        testCases: [
          {
            expectedRows: [
              {
                name: "Priya",
                age: "20",
              },
              {
                name: "Rahul",
                age: "21",
              },
              {
                name: "Sneha",
                age: "21",
              },
              {
                name: "Arjun",
                age: "22",
              },
            ],
          },
        ],

        hint: "Use ORDER BY age ASC.",
      },

      {
        id: "sql-count-students",
        title: "Count Students",
        type: "sql",
        difficulty: "Intermediate",

        description: "Find the total number of students in the table.",

        instructions: [
          "Use the students table.",
          "Count all students.",
          "Return the count using an alias named total_students.",
        ],

        language: "sql",

        starterCode: `SELECT
    -- Count the students
FROM students;
`,

        setupSql: `
        CREATE TEMP TABLE students (
          id INTEGER,
          name TEXT,
          age INTEGER,
          branch TEXT
        );

        INSERT INTO students (id, name, age, branch)
        VALUES
          (1, 'Rahul', 21, 'CSE'),
          (2, 'Priya', 20, 'ECE'),
          (3, 'Arjun', 22, 'CSE'),
          (4, 'Sneha', 21, 'IT');
      `,

        testCases: [
          {
            expectedRows: [
              {
                total_students: "4",
              },
            ],
          },
        ],

        hint: "Use COUNT(*) and give the result the alias total_students.",
      },

      {
        id: "sql-group-branch",
        title: "Count Students by Branch",
        type: "sql",
        difficulty: "Intermediate",

        description: "Find how many students belong to each branch.",

        instructions: [
          "Group students by branch.",
          "Count the students in each branch.",
          "Return branch and student_count.",
          "Sort the result by branch.",
        ],

        language: "sql",

        starterCode: `SELECT
    -- Select branch
    -- Count students
FROM students
-- Group by branch
-- Sort by branch
`,

        setupSql: `
        CREATE TEMP TABLE students (
          id INTEGER,
          name TEXT,
          age INTEGER,
          branch TEXT
        );

        INSERT INTO students (id, name, age, branch)
        VALUES
          (1, 'Rahul', 21, 'CSE'),
          (2, 'Priya', 20, 'ECE'),
          (3, 'Arjun', 22, 'CSE'),
          (4, 'Sneha', 21, 'IT');
      `,

        testCases: [
          {
            expectedRows: [
              {
                branch: "CSE",
                student_count: "2",
              },
              {
                branch: "ECE",
                student_count: "1",
              },
              {
                branch: "IT",
                student_count: "1",
              },
            ],
          },
        ],

        hint: "Use GROUP BY branch with COUNT(*).",
      },

      {
        id: "sql-student-course-join",
        title: "Join Students and Courses",
        type: "sql",
        difficulty: "Intermediate",

        description: "Join students with their enrolled courses.",

        instructions: [
          "Join the students and courses tables.",
          "Match students using student_id.",
          "Return the student name and course name.",
          "Sort by student name.",
        ],

        language: "sql",

        starterCode: `SELECT
    -- Select student name and course name
FROM students
JOIN courses
    -- Add the join condition
-- Sort by student name
`,

        setupSql: `
        CREATE TEMP TABLE students (
          id INTEGER,
          name TEXT
        );

        CREATE TEMP TABLE courses (
          id INTEGER,
          student_id INTEGER,
          course_name TEXT
        );

        INSERT INTO students (id, name)
        VALUES
          (1, 'Rahul'),
          (2, 'Priya'),
          (3, 'Arjun');

        INSERT INTO courses (id, student_id, course_name)
        VALUES
          (1, 1, 'Database Systems'),
          (2, 1, 'Operating Systems'),
          (3, 2, 'Data Structures'),
          (4, 3, 'Computer Networks');
      `,

        testCases: [
          {
            expectedRows: [
              {
                name: "Arjun",
                course_name: "Computer Networks",
              },
              {
                name: "Priya",
                course_name: "Data Structures",
              },
              {
                name: "Rahul",
                course_name: "Database Systems",
              },
              {
                name: "Rahul",
                course_name: "Operating Systems",
              },
            ],
          },
        ],

        hint: "Join students.id with courses.student_id and use ORDER BY name.",
      },
    ],

    project: {
      title: "Build a Student Analytics Database",
      difficulty: "Intermediate",

      description:
        "Design and query a small student database using tables, joins, filtering, aggregation, grouping, and sorting.",

      skills: [
        "SQL",
        "SELECT",
        "WHERE",
        "ORDER BY",
        "GROUP BY",
        "COUNT",
        "JOIN",
      ],
    },
  },

  python: {
    practice: [
      {
        id: "python-sum-two-numbers",
        title: "Sum Two Numbers",
        type: "coding",
        difficulty: "Beginner",
        description:
          "Write a Python function that takes two numbers and returns their sum.",
        instructions: [
          "Create a function named sum_numbers.",
          "Accept two numbers as parameters.",
          "Return their sum.",
        ],
        language: "python",
        starterCode: `def sum_numbers(a, b):
    # Write your solution here
    return 0`,
        testCases: [
          { input: [2, 3], expected: 5 },
          { input: [10, 20], expected: 30 },
          { input: [-5, 5], expected: 0 },
        ],
        hint: "Use the + operator.",
      },
      {
        id: "python-find-maximum",
        title: "Find the Maximum",
        type: "coding",
        difficulty: "Beginner",
        description: "Return the larger of two numbers.",
        instructions: [
          "Create a function named find_max.",
          "Accept two numbers.",
          "Return the larger number.",
        ],
        language: "python",
        starterCode: `def find_max(a, b):
    # Write your solution here
    return 0`,
        testCases: [
          { input: [10, 20], expected: 20 },
          { input: [50, 30], expected: 50 },
          { input: [-5, -2], expected: -2 },
        ],
        hint: "Use max(a, b) or an if/else condition.",
      },
      {
        id: "python-count-vowels",
        title: "Count Vowels",
        type: "coding",
        difficulty: "Intermediate",
        description: "Count the number of vowels in a string.",
        instructions: [
          "Create a function named count_vowels.",
          "Accept a string.",
          "Count a, e, i, o, and u.",
          "Handle uppercase letters.",
          "Return the vowel count.",
        ],
        language: "python",
        starterCode: `def count_vowels(text):
    # Write your solution here
    return 0`,
        testCases: [
          { input: ["hello"], expected: 2 },
          { input: ["javascript"], expected: 3 },
          { input: ["AEIOU"], expected: 5 },
        ],
        hint: "Convert the string to lowercase and check whether each character is a vowel.",
      },
    ],

    project: {
      title: "Build a Python Expense Tracker",
      difficulty: "Intermediate",
      description:
        "Build a command-line expense tracker using functions, lists, dictionaries, file handling, and validation.",
      skills: [
        "Python",
        "Functions",
        "Collections",
        "File Handling",
        "Exception Handling",
      ],
    },
  },
  mongodb: {
    practice: [
      {
        id: "mongo-find-all-students",
        title: "Find All Students",
        type: "mongodb",
        difficulty: "Beginner",

        description: "Write a MongoDB query to retrieve all students.",

        instructions: ["Use the students collection.", "Return all students."],

        language: "mongodb",

        starterCode: `db.students.find({})`,

        dataset: {
          students: [
            {
              _id: 1,
              name: "Rahul",
              age: 21,
              branch: "CSE",
            },
            {
              _id: 2,
              name: "Priya",
              age: 20,
              branch: "ECE",
            },
            {
              _id: 3,
              name: "Arjun",
              age: 22,
              branch: "CSE",
            },
            {
              _id: 4,
              name: "Sneha",
              age: 21,
              branch: "IT",
            },
          ],
        },

        testCases: [
          {
            expectedRows: [
              {
                _id: 1,
                name: "Rahul",
                age: 21,
                branch: "CSE",
              },
              {
                _id: 2,
                name: "Priya",
                age: 20,
                branch: "ECE",
              },
              {
                _id: 3,
                name: "Arjun",
                age: 22,
                branch: "CSE",
              },
              {
                _id: 4,
                name: "Sneha",
                age: 21,
                branch: "IT",
              },
            ],
          },
        ],

        hint: "Use db.students.find({}).",
      },

      {
        id: "mongo-find-cse",
        title: "Find CSE Students",
        type: "mongodb",
        difficulty: "Beginner",

        description: "Find all students belonging to the CSE branch.",

        instructions: [
          "Use the students collection.",
          "Filter using branch.",
          "Return only CSE students.",
        ],

        language: "mongodb",

        starterCode: `db.students.find({
  // Add your filter
})`,

        dataset: {
          students: [
            {
              _id: 1,
              name: "Rahul",
              age: 21,
              branch: "CSE",
            },
            {
              _id: 2,
              name: "Priya",
              age: 20,
              branch: "ECE",
            },
            {
              _id: 3,
              name: "Arjun",
              age: 22,
              branch: "CSE",
            },
            {
              _id: 4,
              name: "Sneha",
              age: 21,
              branch: "IT",
            },
          ],
        },

        testCases: [
          {
            expectedRows: [
              {
                _id: 1,
                name: "Rahul",
                age: 21,
                branch: "CSE",
              },
              {
                _id: 3,
                name: "Arjun",
                age: 22,
                branch: "CSE",
              },
            ],
          },
        ],

        hint: 'Use { branch: "CSE" } as the filter.',
      },

      {
        id: "mongo-age-greater",
        title: "Find Students Older Than 20",
        type: "mongodb",
        difficulty: "Intermediate",

        description: "Find students whose age is greater than 20.",

        instructions: [
          "Use the students collection.",
          "Use the $gt operator.",
          "Return students whose age is greater than 20.",
        ],

        language: "mongodb",

        starterCode: `db.students.find({
  age: {
    // Use $gt
  }
})`,

        dataset: {
          students: [
            {
              _id: 1,
              name: "Rahul",
              age: 21,
              branch: "CSE",
            },
            {
              _id: 2,
              name: "Priya",
              age: 20,
              branch: "ECE",
            },
            {
              _id: 3,
              name: "Arjun",
              age: 22,
              branch: "CSE",
            },
            {
              _id: 4,
              name: "Sneha",
              age: 21,
              branch: "IT",
            },
          ],
        },

        testCases: [
          {
            expectedRows: [
              {
                _id: 1,
                name: "Rahul",
                age: 21,
                branch: "CSE",
              },
              {
                _id: 3,
                name: "Arjun",
                age: 22,
                branch: "CSE",
              },
              {
                _id: 4,
                name: "Sneha",
                age: 21,
                branch: "IT",
              },
            ],
          },
        ],

        hint: "Use age: { $gt: 20 }.",
      },

      {
        id: "mongo-sort-age",
        title: "Sort Students by Age",
        type: "mongodb",
        difficulty: "Intermediate",

        description: "Sort students from youngest to oldest.",

        instructions: [
          "Use the students collection.",
          "Sort using the age field.",
          "Use ascending order.",
        ],

        language: "mongodb",

        starterCode: `db.students
  .find({})
  .sort({
    // Sort by age
  })`,

        dataset: {
          students: [
            {
              _id: 1,
              name: "Rahul",
              age: 21,
              branch: "CSE",
            },
            {
              _id: 2,
              name: "Priya",
              age: 20,
              branch: "ECE",
            },
            {
              _id: 3,
              name: "Arjun",
              age: 22,
              branch: "CSE",
            },
            {
              _id: 4,
              name: "Sneha",
              age: 21,
              branch: "IT",
            },
          ],
        },

        testCases: [
          {
            expectedRows: [
              {
                _id: 2,
                name: "Priya",
                age: 20,
                branch: "ECE",
              },
              {
                _id: 1,
                name: "Rahul",
                age: 21,
                branch: "CSE",
              },
              {
                _id: 4,
                name: "Sneha",
                age: 21,
                branch: "IT",
              },
              {
                _id: 3,
                name: "Arjun",
                age: 22,
                branch: "CSE",
              },
            ],
          },
        ],

        hint: "Use .sort({ age: 1 }).",
      },
    ],

    project: {
      title: "Build a MongoDB Student Database",
      difficulty: "Intermediate",

      description:
        "Design a student database and practice document queries, filtering, comparison operators, sorting, and projections.",

      skills: [
        "MongoDB",
        "Documents",
        "find()",
        "Filtering",
        "Comparison Operators",
        "Sorting",
        "Projection",
      ],
    },
  },

  git: {
    practice: [
      {
        id: "git-check-status",
        title: "Check Git Status",
        type: "git",
        difficulty: "Beginner",

        description:
          "You modified some files in your project and want to see which files are changed, staged, or untracked.",

        instructions: [
          "Enter the Git command that shows the current working tree status.",
        ],

        language: "git",

        starterCode: "",

        expectedCommand: "git status",

        acceptedCommands: ["git status", "git status --short"],

        hint: "Use the Git command that displays modified, staged, and untracked files.",
      },

      {
        id: "git-stage-files",
        title: "Stage Your Changes",
        type: "git",
        difficulty: "Beginner",

        description:
          "You have modified multiple files and want to stage all of them before committing.",

        instructions: [
          "Stage all modified and untracked files.",
          "Use a single Git command.",
        ],

        language: "git",

        starterCode: "",

        expectedCommand: "git add .",

        acceptedCommands: ["git add .", "git add --all", "git add -A"],

        hint: "Use git add followed by a symbol that means all files.",
      },

      {
        id: "git-commit",
        title: "Create a Commit",
        type: "git",
        difficulty: "Beginner",

        description:
          "Your changes are staged. Create a Git commit with the message 'Add login page'.",

        instructions: ["Create a commit.", "Use the message: Add login page."],

        language: "git",

        starterCode: "",

        expectedCommand: 'git commit -m "Add login page"',

        acceptedCommands: [
          'git commit -m "Add login page"',
          "git commit -m 'Add login page'",
        ],

        hint: "Use git commit -m followed by your commit message.",
      },

      {
        id: "git-view-history",
        title: "View Commit History",
        type: "git",
        difficulty: "Beginner",

        description:
          "You want to see the previous commits made in the repository.",

        instructions: ["Enter the Git command used to view commit history."],

        language: "git",

        starterCode: "",

        expectedCommand: "git log",

        acceptedCommands: ["git log", "git log --oneline"],

        hint: "Use the Git command that displays previous commits.",
      },

      {
        id: "git-create-branch",
        title: "Create a Feature Branch",
        type: "git",
        difficulty: "Intermediate",

        description:
          "You are starting work on a new dashboard feature. Create a branch named feature/dashboard.",

        instructions: [
          "Create a new branch.",
          "The branch name must be feature/dashboard.",
        ],

        language: "git",

        starterCode: "",

        expectedCommand: "git branch feature/dashboard",

        acceptedCommands: [
          "git branch feature/dashboard",
          "git switch -c feature/dashboard",
          "git checkout -b feature/dashboard",
        ],

        hint: "You can create a branch with git branch, or create and switch to one using git switch -c.",
      },

      {
        id: "git-pull",
        title: "Get Latest Remote Changes",
        type: "git",
        difficulty: "Intermediate",

        description:
          "Your teammate pushed new changes to the remote repository. Get those changes into your local branch.",

        instructions: [
          "Use the Git command that downloads and integrates remote changes.",
        ],

        language: "git",

        starterCode: "",

        expectedCommand: "git pull",

        acceptedCommands: ["git pull"],

        hint: "Think about the command that retrieves and integrates changes from the remote repository.",
      },

      {
        id: "git-push",
        title: "Push Your Changes",
        type: "git",
        difficulty: "Intermediate",

        description:
          "Your local commit is ready and you want to send it to the remote repository.",

        instructions: ["Push your local commits to the remote repository."],

        language: "git",

        starterCode: "",

        expectedCommand: "git push",

        acceptedCommands: ["git push"],

        hint: "Use the Git command that sends local commits to the remote repository.",
      },

      {
        id: "git-see-changes",
        title: "See Unstaged Changes",
        type: "git",
        difficulty: "Intermediate",

        description:
          "You changed some code but have not staged it yet. You want to inspect the exact changes.",

        instructions: [
          "Use the Git command that displays unstaged differences.",
        ],

        language: "git",

        starterCode: "",

        expectedCommand: "git diff",

        acceptedCommands: ["git diff"],

        hint: "Use the command that compares your working tree with the staged version.",
      },
    ],

    project: {
      title: "Git Collaboration Workflow",
      difficulty: "Intermediate",

      description:
        "Practice a realistic Git workflow involving branches, commits, status checks, pulling changes, and pushing work to a remote repository.",

      skills: [
        "Git",
        "GitHub",
        "Branches",
        "Commits",
        "Remote Repositories",
        "Collaboration",
      ],
    },
  },
  docker: {
    practice: [
      {
        title: "Containerize a Node Application",
        type: "practice",
        difficulty: "Intermediate",
        description:
          "Create a Dockerfile and run a Node.js application inside a container.",
      },
      {
        title: "Docker Compose Practice",
        type: "practice",
        difficulty: "Intermediate",
        description:
          "Run an application and database together using Docker Compose.",
      },
    ],
    project: {
      title: "Containerized Full Stack Application",
      difficulty: "Advanced",
      description:
        "Containerize a full-stack application and its database using Docker and Docker Compose.",
      skills: ["Docker", "Node.js", "React", "Database"],
    },
  },

  aws: {
    practice: [
      {
        title: "Deploy a Web Application",
        type: "practice",
        difficulty: "Intermediate",
        description:
          "Deploy a basic web application on AWS and configure the required resources.",
      },
      {
        title: "AWS Storage Practice",
        type: "practice",
        difficulty: "Intermediate",
        description:
          "Practice storing and retrieving application files using Amazon S3.",
      },
    ],
    project: {
      title: "Cloud Hosted Application",
      difficulty: "Advanced",
      description:
        "Deploy a full-stack application on AWS with storage, networking, and application hosting.",
      skills: ["AWS", "Cloud", "Linux", "Git"],
    },
  },

  networking: {
    practice: [
      {
        title: "TCP/IP Fundamentals",
        type: "practice",
        difficulty: "Beginner",
        description:
          "Practice identifying common protocols, ports, IP addresses, and network layers.",
      },
      {
        title: "Network Troubleshooting",
        type: "practice",
        difficulty: "Intermediate",
        description:
          "Use common networking commands to diagnose connectivity problems.",
      },
    ],
    project: {
      title: "Network Monitoring Setup",
      difficulty: "Advanced",
      description:
        "Design a basic monitoring setup that tracks network connectivity and identifies failures.",
      skills: ["Networking", "Linux", "Monitoring"],
    },
  },

  security: {
    practice: [
      {
        title: "Authentication Security Review",
        type: "practice",
        difficulty: "Intermediate",
        description:
          "Identify common authentication weaknesses and understand how secure authentication should work.",
      },
      {
        title: "Security Risk Analysis",
        type: "practice",
        difficulty: "Intermediate",
        description:
          "Analyze an application for common security risks and document mitigation steps.",
      },
    ],
    project: {
      title: "Application Security Audit",
      difficulty: "Advanced",
      description:
        "Perform a structured security review of a small application and document risks and mitigations.",
      skills: ["Security", "Authentication", "Networking", "Git"],
    },
  },

  "machine-learning": {
    practice: [
      {
        title: "Build a Classification Model",
        type: "practice",
        difficulty: "Intermediate",
        description:
          "Train and evaluate a basic classification model using a structured dataset.",
      },
      {
        title: "Feature Engineering Practice",
        type: "practice",
        difficulty: "Intermediate",
        description:
          "Clean data, create useful features, and compare model performance.",
      },
    ],
    project: {
      title: "End-to-End ML Prediction System",
      difficulty: "Advanced",
      description:
        "Build a machine learning project from data preparation through model evaluation and prediction.",
      skills: ["Python", "Pandas", "NumPy", "Machine Learning"],
    },
  },
};
