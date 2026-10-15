import { useEffect } from "react";

const DEFAULT_TITLE = "Pulso Concept | Studio Premium de Treinamento";

/** Per-page tab title; restores the default on leave. */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title]);
}
