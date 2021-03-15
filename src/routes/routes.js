const { Router } = require('express');
const routes = Router();
const Produto = require("../controllers/produto");
const validate = require('../controllers/estrutura')
const produto = new Produto();
routes.get('/valida',async (req,res)=>{
   
    try {
        await validate.validateApis();
       // console.log("fim")
        return res.status(201).json({ msg: "sucesso" });
    } catch (e) {
        console.log("ERRO")
        return res.status(400).json({ msg: "erro" });
    }
});
routes.get("/produto",produto.show);
routes.post("/produto",produto.create);
routes.put("/produto/:id",produto.atualizar)
module.exports = routes;