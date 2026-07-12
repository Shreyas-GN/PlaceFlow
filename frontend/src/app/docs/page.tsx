"use client";

import { useEffect, useRef } from "react";
import "swagger-ui-dist/swagger-ui.css";

export default function DocsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadSwagger = async () => {
      // Dynamically import swagger-ui-dist to bypass Turbopack's ESM issues
      // with swagger-ui-react dependencies
      // @ts-ignore
      const mod = await import("swagger-ui-dist/swagger-ui-bundle");
      const SwaggerUIBundle = mod.default || mod.SwaggerUIBundle || mod;

      // @ts-ignore
      const presetMod = await import("swagger-ui-dist/swagger-ui-standalone-preset");
      const SwaggerUIStandalonePreset = presetMod.default || presetMod.SwaggerUIStandalonePreset || presetMod;

      if (containerRef.current) {
        SwaggerUIBundle({
          url: "http://localhost:8000/openapi.json",
          domNode: containerRef.current,
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
          ],
          layout: "StandaloneLayout",
        });
      }
    };

    loadSwagger();
  }, []);

  return (
    <div className="bg-white text-black min-h-screen w-full">
      <div className="py-8" ref={containerRef} />
    </div>
  );
}
