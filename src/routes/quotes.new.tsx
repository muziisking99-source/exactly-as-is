import { createFileRoute } from "@tanstack/react-router";
import { QuoteForm } from "@/components/QuoteForm";
export const Route = createFileRoute("/quotes/new")({ component: QuoteForm });
