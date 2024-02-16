import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { IFileService } from "../interfaces/services/file-service.interface";
import createError from "http-errors";

@injectable()
export class FileController {
  constructor(@inject("file-service") private fileService: IFileService) {}
  async getOne(
    { query, params: { fileId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const file = await this.fileService.getById(fileId);
      res.setHeader("content-type", file.mimetype);
      if (query.download) res.attachment(file.filename);
      file.stream.pipe(res);
    } catch (err) {
      console.error(err);
      if (err.code === "ENOENT")
        next(createError.NotFound(`File with id ${fileId} does not exist`));
      next(err);
    }
  }
}
