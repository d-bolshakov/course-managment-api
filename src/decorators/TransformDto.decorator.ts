import {
  Transform,
  TransformOptions,
  plainToInstance,
} from "class-transformer";

export interface TransformDtoOptions extends TransformOptions {
  targetDtoGroups?: string[];
}

export const TransformDto = (
  dtoClass: any,
  options?: TransformDtoOptions
): PropertyDecorator =>
  Transform(
    ({ value }) =>
      plainToInstance(dtoClass, value, { groups: options?.targetDtoGroups }),
    options
  );
