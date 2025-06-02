const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

const app = express();

// In-memory database for demonstration purposes
let companies = [];

// Middleware to parse JSON bodies
app.use(express.json());

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// GET all companies
app.get("/companies", (req, res) => {
  res.json(companies);
});

// POST a new company
app.post("/companies", (req, res) => {
  const { name, industry } = req.body;
  if (!name || !industry) {
    return res.status(400).json({ message: "Name and industry are required." });
  }

  const newCompany = {
    id: companies.length ? companies[companies.length - 1].id + 1 : 1,
    name,
    industry,
  };
  companies.push(newCompany);
  res.status(201).json(newCompany);
});

// GET company by ID
app.get("/companies/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).send({ message: "Invalid company ID" });

  const company = companies.find((c) => c.id === id);
  if (!company) return res.status(404).send({ message: "Company not found" });

  res.json(company);
});

// PUT (update) company by ID
app.put("/companies/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, industry } = req.body;
  if (isNaN(id)) return res.status(400).send({ message: "Invalid company ID" });

  const company = companies.find((c) => c.id === id);
  if (!company) return res.status(404).send({ message: "Company not found" });

  if (!name || !industry) {
    return res.status(400).json({ message: "Name and industry are required." });
  }

  company.name = name;
  company.industry = industry;
  res.json(company);
});

// DELETE company by ID
app.delete("/companies/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).send({ message: "Invalid company ID" });

  const index = companies.findIndex((c) => c.id === id);
  if (index === -1)
    return res.status(404).send({ message: "Company not found" });

  const deleted = companies.splice(index, 1);
  res.json({ message: "Company deleted", company: deleted[0] });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
