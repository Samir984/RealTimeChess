

export async function GET(
  request: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  console.log(userId);
  const url = `${process.env.NEXT_PUBLIC_MANAGER_URL}api/profiles/${userId}`;
  console.log("Fetching from:", url);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.MANAGER_AUTH_TOKEN}`,
    },
  });

  console.log("Response status:", response.status);
  if (!response.ok) {
    const errorText = await response.text();
    console.log("Error response:", errorText);
    return Response.json(
      {
        error: "Failed to fetch profile",
        status: response.status,
        details: errorText,
      },
      { status: 400 }
    );
  }

  const data = await response.json();
  console.log("API Data:", data);
  return Response.json({ status: "success", data }, { status: 200 });
}
