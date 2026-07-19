import { toast } from "sonner";

/**
 * Consistent toast helpers. Use these instead of calling `toast(...)` directly
 * so every module speaks with the same voice.
 */
export const feedback = {
  success(title: string, description?: string) {
    return toast.success(title, description ? { description } : undefined);
  },
  info(title: string, description?: string) {
    return toast(title, description ? { description } : undefined);
  },
  error(title: string, description?: string, action?: { label: string; onClick: () => void }) {
    return toast.error(title, {
      description,
      action,
    });
  },
  loading(title: string, description?: string) {
    return toast.loading(title, description ? { description } : undefined);
  },
  promise<T>(
    promise: Promise<T>,
    messages: { loading: string; success: string | ((data: T) => string); error: string | ((err: unknown) => string) },
  ) {
    return toast.promise(promise, messages);
  },
  dismiss(id?: string | number) {
    toast.dismiss(id);
  },
};

export { toast };
