import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import veiculoRoutes from "./routes/veiculoRoutes.js";
import viagemRoutes from "./routes/viagemRoutes.js";
import unidadeRoutes from "./routes/unidadeRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rotas da API
app.use("/api/users", userRoutes);
app.use("/api/veiculos", veiculoRoutes);
app.use("/api/viagens", viagemRoutes);
app.use("/api/unidades", unidadeRoutes);

app.get("/", (req, res) => {
  res.json({ 
    message: "API Sistema de Gestão de Frota SENAI-SC funcionando",
    endpoints: {
      usuarios: "/api/users",
      veiculos: "/api/veiculos", 
      viagens: "/api/viagens",
      unidades: "/api/unidades"
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Sistema de Gestão de Frota SENAI-SC`);
  console.log(`🏢 Banco de dados: ${process.env.DB_DATABASE}`);
  console.log(`👤 Usuário DB: ${process.env.DB_USER}`);
});
