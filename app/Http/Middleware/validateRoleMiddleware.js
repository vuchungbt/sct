class ValidateRoleMiddleware{
  static validateRole(role) {

    return async (req, res, next) => {
      //try {
       // console.log("rolesss::",role,req.session.roles,req.session.roles.includes(role));

        if(role.includes(req.session.roles)){
          console.log("rolss",role);
          return next();
        }
        else {
          return res.status(401).render('errors/401',{
            errorMessage: "401 Unauthorized Access!!"
          });
        }         
    }
  }
}
module.exports = ValidateRoleMiddleware;