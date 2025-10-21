"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchSchema, type SearchFormValues } from "@/schemas/searchSchema";

interface Props {
  onSubmit: (values: SearchFormValues) => Promise<void> | void;
  defaultQuery?: string;
  pending?: boolean;
}

export default function SearchForm({
  onSubmit,
  defaultQuery = "",
  pending = false,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { q: defaultQuery },
    mode: "onTouched",
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
        reset({ q: "" });
      })}
      className="flex gap-2"
    >
      <input
        {...register("q")}
        placeholder="Busque por título (ex: Inception)"
        className="w-full rounded-xl border px-4 py-3 outline-none focus:ring"
      />
      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="rounded-xl bg-black px-5 py-3 text-white disabled:opacity-50"
      >
        {isSubmitting || pending ? "Buscando..." : "Buscar"}
      </button>
      {errors.q && <p className="text-sm text-red-600">{errors.q.message}</p>}
    </form>
  );
}
