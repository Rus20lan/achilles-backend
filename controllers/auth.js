import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      const passResult = bcrypt.compareSync(password, candidate.password);
      if (passResult) {
        const token = jwt.sign(
          { email, userID: candidate.userID },
          process.env.JWT_SECRET,
          { expiresIn: 60 * 60 }
        );
        res.status(201).json({
          token: `Bearer ${token}`,
          user: { email, userID: candidate.userID },
        });
      } else {
        console.log('Пароль не верный, попробуйте ещё раз');
        res
          .status(401)
          .json({ message: 'Пароль не верный, попробуйте ещё раз' });
      }
    } else {
      res.status(404).json({ message: 'Неправильный логин или пароль' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function register(req, res) {
  const { email, password } = req.body;
  const result = await User.findOne({ where: { email } });
  console.log(result);
  if (result) {
    res
      .status(403)
      .json({ message: 'Такой email уже занят. Попробуйте другой' });
  } else {
    // Хеширует пароль нового пользователя с помощью bcrypt
    const salt = bcrypt.genSaltSync(10);
    // Создаем пользователя
    const user = {
      email,
      password: bcrypt.hashSync(password, salt),
    };
    const result = await User.create(user);
    res.status(201).json(result);
  }
}
