import { Router } from "express";
import { fileService } from "../services/file.service";

export const TestRouter = Router();

TestRouter.post("/files/", async (req, res, next) => {
  try {
    const saved = await fileService.create(req.files!.attachment);
    res.status(200).send(saved);
  } catch (err) {
    console.log(err);
  }
});

TestRouter.get("/files/:id", async (req, res, next) => {
  try {
    const file = await fileService.getOne(req.params.id);
    res.setHeader("content-type", file.mimetype);
    if (req.query.download) res.attachment(file.filename);
    file.stream.pipe(res);
  } catch (err) {
    console.log(err);
  }
});
