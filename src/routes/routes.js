const { Router } = require('express');
const routes = Router();
const Produto = require("../controllers/produto");
const produto = new Produto();

routes.get("/produto",produto.show);
routes.post("/produto",produto.create);
routes.put("/produto/:id",produto.atualizar)
module.exports = routes;