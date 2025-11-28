import express from "express";
import { 
  listarViagens, 
  obterViagem, 
  agendarViagem, 
  editarViagem, 
  cancelarViagem, 
  participarViagem, 
  sairViagem 
} from "../controllers/viagemController.js";

const router = express.Router();

router.get("/", listarViagens);
router.get("/:id", obterViagem);
router.post("/", agendarViagem);
router.put("/:id", editarViagem);
router.delete("/:id", cancelarViagem);
router.post("/participar", participarViagem);
router.delete("/sair", sairViagem);

export default router;
