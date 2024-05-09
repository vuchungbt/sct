const db = require('../../../models');

exports.generateSKU = async function(techpack){
 let sku = techpack.category.code+'-' ;
 techpack.sub_category.code !=null? sku+= techpack.category.code+'-' :''; 
 sku+= techpack.xMay.id+'-';
 sku+= techpack.xIn.id+'-';
 sku+= techpack.xTheu.id+'-';
 sku+= techpack.xTheu.id+'-';
 sku+= techpack.xTheu.id+'-';
 return {
        SKU : sku
      }
}
