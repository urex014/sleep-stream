export async function GET() {
  try {
    const res = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD",
      { cache: "no-store" } // always fresh data
    )

    const data = await res.json()

    return Response.json(data)

  } catch (error) {
    console.error(error)
    return Response.json(
      { message: "Failed to fetch rates" },
      { status: 500 }
    )
  }
}