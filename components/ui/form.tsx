"use client"

import * as React from "react"
import {
    Controller,
    FormProvider,
    useFormContext,
    useFormState,
    type ControllerProps,
    type FieldPath,
    type FieldValues,
} from "react-hook-form"
import { Pressable, Text, View } from "react-native"

import { cn } from "@/lib/utils"

const Form = FormProvider

/* -------------------------------------------------------------------------- */
/*                               Form Context                                 */
/* -------------------------------------------------------------------------- */

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
    name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

const FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
    props: ControllerProps<TFieldValues, TName>
) => {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    )
}

/* -------------------------------------------------------------------------- */
/*                               Form Item                                    */
/* -------------------------------------------------------------------------- */

type FormItemContextValue = {
    id: string
}

const FormItemContext = React.createContext<FormItemContextValue | null>(null)

function FormItem({
    className,
    ...props
}: React.ComponentProps<typeof View>) {
    const id = React.useId()

    return (
        <FormItemContext.Provider value={{ id }}>
            <View className={cn("gap-2", className)} {...props} />
        </FormItemContext.Provider>
    )
}

/* -------------------------------------------------------------------------- */
/*                               useFormField                                 */
/* -------------------------------------------------------------------------- */

function useFormField() {
    const fieldContext = React.useContext(FormFieldContext)
    const itemContext = React.useContext(FormItemContext)
    const { getFieldState } = useFormContext()

    if (!fieldContext || !itemContext) {
        throw new Error("useFormField must be used within <FormField> and <FormItem>")
    }

    const formState = useFormState({ name: fieldContext.name })
    const fieldState = getFieldState(fieldContext.name, formState)

    return {
        id: itemContext.id,
        name: fieldContext.name,
        error: fieldState.error,
    }
}

/* -------------------------------------------------------------------------- */
/*                               Form Label                                   */
/* -------------------------------------------------------------------------- */

function FormLabel({
    className,
    onPress,
    ...props
}: React.ComponentProps<typeof Text>) {
    const { error } = useFormField()

    return (
        <Pressable onPress={onPress}>
            <Text
                className={cn(
                    "text-sm font-semibold text-foreground",
                    error && "text-destructive",
                    className
                )}
                {...props}
            />
        </Pressable>
    )
}

/* -------------------------------------------------------------------------- */
/*                               Form Control                                 */
/* -------------------------------------------------------------------------- */

type FormControlProps = {
    children: React.ReactNode
}

function FormControl({ children }: FormControlProps) {
    const { error } = useFormField()

    return (
        <View
            className={cn(
                "rounded-md border border-border overflow-hidden",
                error && "border border-destructive"
            )}
        >
            {children}
        </View>
    )
}

/* -------------------------------------------------------------------------- */
/*                               Form Description                             */
/* -------------------------------------------------------------------------- */

function FormDescription({
    className,
    ...props
}: React.ComponentProps<typeof Text>) {
    return (
        <Text
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    )
}

/* -------------------------------------------------------------------------- */
/*                               Form Message                                 */
/* -------------------------------------------------------------------------- */

function FormMessage({
    className,
    ...props
}: React.ComponentProps<typeof Text>) {
    const { error } = useFormField()

    if (!error?.message) return null

    return (
        <Text
            className={cn("text-sm text-destructive", className)}
            {...props}
        >
            {String(error.message)}
        </Text>
    )
}

/* -------------------------------------------------------------------------- */

export {
    Form, FormControl,
    FormDescription, FormField, FormItem,
    FormLabel, FormMessage, useFormField
}

