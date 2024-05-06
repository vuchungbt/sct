const db = require('../../../models');

exports.historyLogged = async function(name,action,content,item){
  if(item ) {
    content+= '{' + item + '}';
  }
  return await db.SystemHistory.create({
    content: action + ':' +content  + '-' + name,
    createdAt: new Date(),
    updatedAt: new Date()
  } ); 
}


