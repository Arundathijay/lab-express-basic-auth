const routeGuard = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    next(new Error('User is not authenticated.'));
    // Alternatively, you can redirect the visitor to the login page
    // res.redirect('/login');
  }
};

module.exports = routeGuard;
