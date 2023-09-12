const sqlite3 = require('sqlite3').verbose();

// Cria uma conexão com o banco de dados SQLite
const db = new sqlite3.Database('db/database.db');

// Cria a tabela "users"
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    type_plan TEXT NOT NULL
  )
`);

// Cria a tabela "exercises"
db.run(`
  CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY,
    description TEXT NOT NULL
  )
`);

// Cria a tabela "students"
db.run(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    contact TEXT NOT NULL,
    date_birth TEXT NOT NULL,
    cep TEXT NOT NULL,
    number TEXT,
    street TEXT NOT NULL,
    province TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    city TEXT NOT NULL,
    complement TEXT
  )
`);

// Cria a tabela "workouts"
db.run(`
  CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    repetitions INTEGER NOT NULL,
    weight REAL NOT NULL,
    break_time TEXT NOT NULL,
    day TEXT NOT NULL,
    observations TEXT,
    FOREIGN KEY (student_id) REFERENCES students (id),
    FOREIGN KEY (exercise_id) REFERENCES exercises (id)
  )

 

`);

// Cria a tabela "workouts_students"
db.run(`
  CREATE TABLE IF NOT EXISTS workouts_students (
    id INTEGER PRIMARY KEY,
    workout_id INTEGER NOT NULL,
    day_of_week TEXT NOT NULL,
    student_id INTEGER NOT NULL,
    FOREIGN KEY (workout_id) REFERENCES workouts (id),
    FOREIGN KEY (student_id) REFERENCES students (id)
  )
`);

module.exports = db;