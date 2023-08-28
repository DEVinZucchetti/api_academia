// app.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/database');

const app = express();
app.use(bodyParser.json());

app.post('/users', (req, res) => {
  const { name, email, password, type_plan } = req.body;
  const query = `
    INSERT INTO users (name, email, password, type_plan)
    VALUES (?, ?, ?, ?)
  `;
  db.run(query, [name, email, password, type_plan], function (err) {
    if (err) {
      console.error('Erro ao inserir usuário:', err.message);
      return res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
    console.log('Usuário cadastrado com ID:', this.lastID);
    res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
  });
});

app.post('/sessions', (req, res) => {
  const { email, password } = req.body;

  const query = `
      SELECT * FROM users WHERE email = ? AND password = ?
    `;
  db.get(query, [email, password], (err, user) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err.message);
      return res.status(500).json({ error: 'Erro ao fazer login' });
    }

    if (user) {

      res.json({ name: user.name, type_plan: user.type_plan, token: 'token_jwt' });
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  });
});

app.post('/exercises', (req, res) => {
  const { description } = req.body;
  const query = `
      INSERT INTO exercises (description)
      VALUES (?)
    `;
  db.run(query, [description], function (err) {
    if (err) {
      console.error('Erro ao inserir exercício:', err.message);
      return res.status(500).json({ error: 'Erro ao cadastrar exercício' });
    }
    console.log('Exercício cadastrado com ID:', this.lastID);
    res.status(201).json({ message: 'Exercício cadastrado com sucesso' });
  });
});

app.get('/exercises', (req, res) => {
  const query = `
      SELECT * FROM exercises
    `;
  db.all(query, [], (err, exercises) => {
    if (err) {
      console.error('Erro ao buscar exercícios:', err.message);
      return res.status(500).json({ error: 'Erro ao buscar exercícios' });
    }
    res.json(exercises);
  });
});

app.post('/students', (req, res) => {
  const {
    name,
    email,
    contact,
    date_birth,
    cep,
    street,
    province,
    neighborhood,
    city,
    complement
  } = req.body;
  const query = `
    INSERT INTO students (name, email, contact, date_birth, cep, street, province, neighborhood, city, complement)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(
    query,
    [
      name,
      email,
      contact,
      date_birth,
      cep,
      street,
      province,
      neighborhood,
      city,
      complement
    ],
    function (err) {
      if (err) {
        console.error('Erro ao inserir aluno:', err.message);
        return res.status(500).json({ error: 'Erro ao cadastrar aluno' });
      }
      console.log('Aluno cadastrado com ID:', this.lastID);
      res.status(201).json({ message: 'Aluno cadastrado com sucesso' });
    }
  );
});

app.get('/students', (req, res) => {
  const query = `
    SELECT * FROM students
  `;
  db.all(query, [], (err, students) => {
    if (err) {
      console.error('Erro ao buscar alunos:', err.message);
      return res.status(500).json({ error: 'Erro ao buscar alunos' });
    }
    res.json({ students });
  });
});


app.get('/dashboard', (req, res) => {
  const countAlunosQuery = `
    SELECT COUNT(*) as count FROM students
  `;
  const countExerciciosQuery = `
    SELECT COUNT(*) as count FROM exercises
  `;

  db.get(countAlunosQuery, [], (errAlunos, resultAlunos) => {
    if (errAlunos) {
      console.error('Erro ao buscar contagem de alunos:', errAlunos.message);
      return res.status(500).json({ error: 'Erro ao buscar informações do dashboard' });
    }

    db.get(countExerciciosQuery, [], (errExercicios, resultExercicios) => {
      if (errExercicios) {
        console.error('Erro ao buscar contagem de exercícios:', errExercicios.message);
        return res.status(500).json({ error: 'Erro ao buscar informações do dashboard' });
      }

      const dashboardData = {
        amount_students: resultAlunos.count,
        amount_exercises: resultExercicios.count
      };

      res.json(dashboardData);
    });
  });
});


app.post('/workouts', (req, res) => {
  const {
    student_id,
    exercise_id,
    repetitions,
    weight,
    break_time,
    day,
    observations
  } = req.body;
  const query = `
    INSERT INTO workouts (student_id, exercise_id, repetitions, weight, break_time, day, observations)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(
    query,
    [
      student_id,
      exercise_id,
      repetitions,
      weight,
      break_time,
      day,
      observations
    ],
    function (err) {
      if (err) {
        console.error('Erro ao inserir treino:', err.message);
        return res.status(500).json({ error: 'Erro ao cadastrar treino' });
      }
      console.log('Treino cadastrado com ID:', this.lastID);
      res.status(201).json({ message: 'Treino cadastrado com sucesso' });
    }
  );
});

app.get('/workouts', (req, res) => {
  const { student_id } = req.query;
  const query = `
    SELECT 
      workouts.id,
      students.name AS student_name,
      exercises.description AS exercise_description,
      workouts.repetitions,
      workouts.weight,
      workouts.break_time,
      workouts.day,
      workouts.observations
    
    FROM workouts 
    INNER JOIN students ON workouts.student_id = students.id
    INNER JOIN exercises ON workouts.exercise_id = exercises.id
    WHERE student_id = ?
  `;
  db.all(query, [student_id], (err, workouts) => {
    if (err) {
      console.error('Erro ao buscar treinos:', err.message);
      return res.status(500).json({ error: 'Erro ao buscar treinos' });
    }
    res.json({ workouts });
  });
});


app.post('workouts/check', (req, res) => {
  const { student_id, workout_id, day_of_week } = req.body;
  const query = `
    INSERT INTO workouts_students (student_id, workout_id, day_of_week)
    VALUES (?, ?, ?)
  `;
  db.run(
    query,
    [student_id, workout_id, day_of_week],
    function (err) {
      if (err) {
        console.error('Erro ao associar treino ao estudante:', err.message);
        return res.status(500).json({ error: 'Erro ao associar treino ao estudante' });
      }
      console.log('Associação de treino e estudante cadastrada com ID:', this.lastID);
      res.status(201).json({ message: 'Associação de treino e estudante cadastrada com sucesso' });
    }
  );
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});