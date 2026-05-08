import { useRegisterSW } from "virtual:pwa-register/react";

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="update-prompt" role="alert" aria-live="polite">
      <span>New version available!</span>
      <div className="update-prompt-actions">
        <button
          id="update-reload-btn"
          onClick={() => {
            updateServiceWorker(true).finally(() => {
              window.location.reload();
            });
          }}
        >
          UPDATE
        </button>
      </div>
    </div>
  );
}
