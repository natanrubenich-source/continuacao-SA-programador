import express from "express";
import { 
  listarVeiculos, 
  listarVeiculosDisponiveis, 
  obterVeiculo, 
  cadastrarVeiculo, 
  editarVeiculo, 
  removerVeiculo 
} from "../controllers/veiculoController.js";

const router = express.Router();

router.get("/", listarVeiculos);
router.get("/disponiveis", listarVeiculosDisponiveis);
router.get("/:id", obterVeiculo);
router.post("/", cadastrarVeiculo);
router.put("/:id", editarVeiculo);
router.delete("/:id", removerVeiculo);

export default router;
