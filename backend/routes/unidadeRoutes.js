import express from "express";
import { 
  listarUnidades, 
  obterUnidade, 
  cadastrarUnidade, 
  editarUnidade, 
  removerUnidade 
} from "../controllers/unidadeController.js";

const router = express.Router();

router.get("/", listarUnidades);
router.get("/:id", obterUnidade);
router.post("/", cadastrarUnidade);
router.put("/:id", editarUnidade);
router.delete("/:id", removerUnidade);

export default router;
