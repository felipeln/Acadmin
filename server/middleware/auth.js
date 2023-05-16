// autenticacaoMiddleware.js

// function autenticacaoMiddleware(req, res, next) {
//   if (!req.session.cargo) {
//     res.redirect('/login');
//   } else {
//     if (req.session.cargo === 'Admin') {
//       res.redirect('/dashboard');
//     } else if (req.session.cargo === 'funcionario') {
//       res.redirect('/acadmin');
//     } else if (req.session.cargo === 'Cliente') {
//       res.redirect('/portal');
//     } else {
//       res.redirect('/error');
//     }
//   }
// }



function autenticacaoMiddleware(req, res, next) {
  if (!req.session.cargo) {
    return res.redirect('/login');
  }

  if (req.session.cargo === 'Admin') {
    if (req.originalUrl.startsWith('/dashboard') || req.originalUrl === '/dashboard') {
      return next();
    } else {
      return res.redirect('/dashboard');
    }
  } else if (req.session.cargo === 'funcionario') {
    if (req.originalUrl.startsWith('/acadmin') || req.originalUrl === '/acadmin') {
      return next();
    } else {
      return res.redirect('/acadmin');
    }
  } else if (req.session.cargo === 'Cliente') {
    if (req.originalUrl.startsWith('/portal') || req.originalUrl === '/portal') {
      return next();
    } else {
      return res.redirect('/portal');
    }
  }

  next();
}



module.exports = autenticacaoMiddleware;
