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
            // Wait for the new SW to actually take control before reloading.
            // Using controllerchange avoids a double-reload race where
            // updateServiceWorker(true)'s internal reload and a manual
            // reload fire concurrently, aborting in-flight asset fetches.
            if ("serviceWorker" in navigator) {
              navigator.serviceWorker.addEventListener(
                "controllerchange",
                () => window.location.reload(),
                { once: true },
              );
            }
            updateServiceWorker(false);
          }}
        >
          UPDATE
        </button>
      </div>
    </div>
  );
}
