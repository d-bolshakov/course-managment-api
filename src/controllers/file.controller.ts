import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { IFileService } from "../interfaces/services/file-service.interface";

@injectable()
export class FileController {
  constructor(@inject("file-service") private fileService: IFileService) {}
  async getOne(
    { query, params: { fileId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    const file = await this.fileService.getById(fileId);
    res.setHeader("content-type", file.mimetype);
    if (query.download) res.attachment(file.filename);
    file.stream.pipe(res);
  }
}
