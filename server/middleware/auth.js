const jwt = require('jsonwebtoken');

// ! Verifica se o usuário está autenticado
const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, 'suaChaveSecreta'); // Substitua 'suaChaveSecreta' pela sua chave secreta real

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token de autenticação inválido.' });
  }
};

// ! Verifica se o usuário tem permissão de administrador
const isAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para acessar esta rota.' });
  }
};

// ! Verifica se o usuário tem permissão de atendente
const isAtendente = (req, res, next) => {
  if (req.user.role === 'atendente') {
    next();
  } else {
    return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para acessar esta rota.' });
  }
};

// ! Verifica se o usuário tem permissão de cliente
const isCliente = (req, res, next) => {
  if (req.user.role === 'cliente') {
    next();
  } else {
    return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para acessar esta rota.' });
  }
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isAtendente,
  isCliente,
};
