import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/pubmed")({
  beforeLoad: () => {
    throw redirect({ to: "/app/sources" });
  },
});
