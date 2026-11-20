import { type Env, handleStart } from "./start.ts"

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (new URL(request.url).pathname === "/api/start") {
      return handleStart(request, env)
    }
    return env.ASSETS.fetch(request)
  },
}

export default worker
