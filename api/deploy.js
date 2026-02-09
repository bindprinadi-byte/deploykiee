export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { name, html } = req.body;

  if (!name || !html) {
    return res.status(400).json({ error: "Missing name or html" });
  }

  try {
    const response = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        target: "production",
        files: [
          {
            file: "index.html",
            data: html,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!data.url) {
      return res.status(500).json(data);
    }

    res.status(200).json({
      url: "https://" + data.url,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
