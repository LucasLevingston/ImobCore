import { NextResponse } from 'next/server'

// Único endpoint público do app — usado pelo HEALTHCHECK do Docker. Todo o
// resto do app exige sessão (middleware.ts), então não dá pra reaproveitar
// nenhuma página existente pro healthcheck.
export function GET() {
  return NextResponse.json({ status: 'ok' })
}
