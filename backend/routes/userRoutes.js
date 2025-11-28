import express from "express";
import { registrarUsuario, loginUsuario, listarUsuarios, obterUsuario } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registrarUsuario);
router.post("/login", loginUsuario);
router.get("/", listarUsuarios);
router.get("/:id", obterUsuario);

export default router;
