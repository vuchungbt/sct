const db = require('../../../models');

exports.usersByRoles = async function(id){
  return await db.User.findAll({
    include: {
      model: db.Role,
      as :'role'
    }
  })
  .then(result => {
    return result.map((user) => { 
      return {
        id:user.id, 
        name: user.name, 
        email: user.email,
        status: user.status, 
        tel: user.tel,
        roles: user.role.name
      }
    });    
  }); 
}


