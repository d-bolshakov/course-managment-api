import {
  ValidateBy,
  ValidationOptions,
  buildMessage,
  ValidationArguments,
} from "class-validator";

export const IsAfter = (
  property?: string,
  options?: ValidationOptions
): PropertyDecorator =>
  ValidateBy(
    {
      name: "IsAfter",
      constraints: [property],
      validator: {
        validate: (value: Date, args: ValidationArguments): boolean => {
          if (!property) return value.toISOString() > new Date().toISOString();
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as Record<string, unknown>)[
            relatedPropertyName
          ] as Date;
          if (!relatedValue) return true;
          return value.toISOString() > relatedValue.toISOString();
        },
        defaultMessage: buildMessage(
          (each: string): string =>
            each + "$property must be after $constraint1",
          options
        ),
      },
    },
    options
  );

export const IsAfterNow = (options?: ValidationOptions): PropertyDecorator => {
  return IsAfter(undefined, options);
};
