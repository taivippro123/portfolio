export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://outspoken-katrice-unamplifiable.ngrok-free.dev"

// Intercept global fetch to bypass ngrok browser warning page which causes CORS errors
if (typeof globalThis !== "undefined" && typeof globalThis.fetch === "function") {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    let urlString = "";
    if (typeof input === "string") {
      urlString = input;
    } else if (input instanceof URL) {
      urlString = input.toString();
    } else if (input && typeof input === "object" && "url" in input) {
      urlString = (input as Request).url;
    }

    if (urlString && (urlString.includes("ngrok-free.dev") || urlString.includes("ngrok-free.app"))) {
      // If it's a Request object, try to set the header directly on it as well
      if (input && typeof input === "object" && !((input as any) instanceof URL)) {
        try {
          const req = input as Request;
          if (req.headers && typeof req.headers.set === "function") {
            req.headers.set("ngrok-skip-browser-warning", "true");
          }
        } catch (e) {
          // Ignore failures to write to request headers directly
        }
      }

      init = init || {};
      if (!init.headers) {
        init.headers = {};
      }
      if (init.headers instanceof Headers) {
        init.headers.set("ngrok-skip-browser-warning", "true");
      } else if (Array.isArray(init.headers)) {
        init.headers.push(["ngrok-skip-browser-warning", "true"]);
      } else {
        (init.headers as Record<string, string>)["ngrok-skip-browser-warning"] = "true";
      }
    }
    return originalFetch.call(this, input, init);
  };
}
