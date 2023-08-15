const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Tesseract = require("tesseract.js");

require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(
  express.json({
    limit: "10mb",
  })
);

app.post("/", async (req, res) => {
  const base64Data = req.body.base64.replace(/^data:image\/png;base64,/, "");
  const url = `data:image/png;base64,${base64Data}`;

  try {
    Tesseract.recognize(url, "tur", {
      logger: (m) => console.log(m),
    }).then(({ data: { text } }) => {
      console.log(text);
      res.json(text);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OCR işlemi sırasında bir hata oluştu." });
  }
});

module.exports = app;
