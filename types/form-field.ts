import { Control, FieldValues, Path } from "react-hook-form";

export type TFormField<
    TFieldValue extends FieldValues,
    TFieldName extends Path<FieldValues>
> = {
    control: Control<TFieldValue>,
    name: TFieldName
}