const knex = require('../database/connection');
const estrutura = require('./estrutura')
module.exports = class Produto{
    
async show( request, response){
    const id = request.params.id;

    const produto = await knex('table_prod').select('*');

   return response.json(produto);
}
async create(request,response){
        //console.log('[DEBUG] USER ROTA',request) 
         const {
            codigo,
            qtd,
            desc
        } = request.body;
          
     const produto ={
      codigo,
      qtd,
      desc
        
       }  
              //console.log('[DEBUG] USUARIO REQ:', usuario)      
      
        await knex('table_prod').insert(produto);
        await estrutura.criarTxt(codigo,qtd,desc);
        
         return response.json(produto)
     }

     async delete(request,response){
        // console.log('[DEBUG] USER ROTA',request)
        // console.log('[DEBUG] USER ROTA',request.params.id_user);
      const del =  await knex('table_prod').where('id',request.params.id).del()
         
       return response.json(del);


    }
    async atualizar(request,response){
      var {
         codigo,
        qtd,
        desc
          
      } = request.body;
      const s  = await knex('table_prod').select('qtd').where('id', request.params.id)
      const qtd1 = parseInt(s[0].qtd)
      const qtd2 = parseInt(qtd)
      const qtdAtual = qtd1 + qtd2
      //console.log(qtdAtual)
      qtd = qtdAtual 
   
   
   const atualizar ={
      codigo,
        qtd,
        desc     
     }  
    
      await knex('table_prod').where('id', request.params.id)
     .update(atualizar)
     await estrutura.criarTxt(codigo,qtd,desc);
     return response.json({msg: 'ok'});
  }
 
};



