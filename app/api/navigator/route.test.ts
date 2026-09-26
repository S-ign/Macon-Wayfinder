import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });

describe("Nexos API route: private-key configuration, strict shape, and safety", () => {
  it("rejects invalid, empty and oversized input without invoking Nexos", async () => {
    vi.stubEnv("NEXOS_API_KEY", "test-secret");
    const mockedFetch = vi.spyOn(globalThis, "fetch");
    const { POST } = await import("./route");
    for (const [body, status] of [["{",400],[JSON.stringify({text:"  "}),400],[JSON.stringify({text:"x".repeat(2001)}),400]] as const) {
      const request = new Request("http://localhost/api/navigator", {method:"POST",headers:{"Content-Type":"application/json"},body});
      expect((await POST(request as unknown as NextRequest)).status).toBe(status);
    }
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it("keeps Nexos unavailable until the local owner adds a private API key", async () => {
    vi.stubEnv("NEXOS_API_KEY", "");
    const mockedFetch = vi.spyOn(globalThis, "fetch");
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/navigator", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:"I need help with rent"})});
    expect((await POST(request as unknown as NextRequest)).status).toBe(503); expect(mockedFetch).not.toHaveBeenCalled();
  });

  it("rejects unexpected cross-origin submissions", async () => {
    vi.stubEnv("NEXOS_API_KEY", "test-secret");
    const mockedFetch = vi.spyOn(globalThis, "fetch");
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/navigator", {method:"POST",headers:{"Origin":"https://attacker.example","Content-Type":"application/json"},body:JSON.stringify({text:"I need help with rent"})});
    expect((await POST(request as unknown as NextRequest)).status).toBe(403); expect(mockedFetch).not.toHaveBeenCalled();
  });

  it.each(["I need somewhere safe to stay", "I have a power bill and need emergency help", "I need a free food pantry"]) ("refuses an out-of-scope request (%s) before it reaches Nexos", async (text) => {
    const mockedFetch=vi.spyOn(globalThis, "fetch");
    vi.stubEnv("NEXOS_API_KEY", "test-secret");
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/navigator", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text})});
    expect((await POST(request as unknown as NextRequest)).status).toBe(422); expect(mockedFetch).not.toHaveBeenCalled();
  });

  it("forwards only a consented request to the fixed Nexos API without storage", async () => {
    vi.stubEnv("NEXOS_API_KEY", "test-secret");
    const mock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({choices:[{message:{role:"assistant",content:JSON.stringify({categories:["rent"],guidance:"Call the local provider and ask about its current rental assistance."})}}]}),{status:200,headers:{"Content-Type":"application/json"}}));
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/navigator", {method:"POST",headers:{"Content-Type":"application/json", "Origin":"http://localhost"},body:JSON.stringify({text:"I need help with rent"})});
    const response=await POST(request as unknown as NextRequest); expect(response.status).toBe(200);
    const result=await response.json(); expect(result.guidance).toContain("local provider"); expect(JSON.stringify(result)).not.toContain("test-secret");
    const [url,init]=mock.mock.calls[0] as [string,RequestInit]; expect(url).toBe("https://api.nexos.ai/v1/chat/completions"); expect(init.method).toBe("POST");
    expect((init.headers as Record<string,string>).Authorization).toBe("Bearer test-secret"); const payload=JSON.parse(String(init.body)); expect(payload.store).toBe(false); expect(payload.model).toBe("GPT 5.6 Luna");
  });

  it.each(["not valid JSON", JSON.stringify({categories:["shelter"],guidance:"Unsupported"}), JSON.stringify({categories:["rent"],guidance:""}), JSON.stringify({categories:["rent"],guidance:"Too many words. ".repeat(100)})]) ("rejects malformed, unsupported or overlong model responses", async (content) => {
    vi.stubEnv("NEXOS_API_KEY", "test-secret");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({choices:[{message:{role:"assistant",content}}]}),{status:200}));
    const { POST }=await import("./route"); const request=new Request("http://localhost/api/navigator",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:"I need help with rent"})});
    expect((await POST(request as never)).status).toBe(502);
  });

  it("rejects upstream errors and never leaks credentials or raw provider error bodies", async () => {
    vi.stubEnv("NEXOS_API_KEY", "test-secret");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("test-secret denied",{status:401})); const { POST }=await import("./route"); const request=new Request("http://localhost/api/navigator",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:"I need help with rent"})}); const response=await POST(request as never); expect(response.status).toBe(502); expect(await response.text()).not.toContain("test-secret");
  });
});
