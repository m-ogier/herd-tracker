import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  try {
    const data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const props = {
      Name: { title: [{ type: "text", text: { content: data.name || "Unnamed horse" } }] },
      "Horse Link": data.url ? { url: data.url } : { url: null },
      Pregnancy: typeof data.pregnant === "boolean" ? { checkbox: data.pregnant } : undefined,
      "Due date": data.dueDate ? { date: { start: data.dueDate } } : undefined,
      Stud: data.stud ? { rich_text: [{ type: "text", text: { content: data.stud } }] } : undefined,
      Conformation: data.conformation ? { rich_text: [{ type: "text", text: { content: data.conformation } }] } : undefined,
      GP: typeof data.gp === "number" ? { number: data.gp } : undefined,
      "Tagline best": typeof data.taglineBest === "number" ? { number: data.taglineBest } : undefined,
      Genetics: data.genetics ? { rich_text: [{ type: "text", text: { content: data.genetics } }] } : undefined,
      Sire: data.sire ? { rich_text: [{ type: "text", text: { content: data.sire } }] } : undefined,
      Dam: data.dam ? { rich_text: [{ type: "text", text: { content: data.dam } }] } : undefined,
      "For sale": typeof data.forSale === "boolean" ? { checkbox: data.forSale } : undefined
    };
    Object.keys(props).forEach(k => props[k] === undefined && delete props[k]);

    const children = [];
    if (data.url && data.name) {
      children.push({
        object: "block",
        type: "paragraph",
        paragraph: { rich_text: [{ type: "text", text: { content: data.name, link: { url: data.url } } }] }
      });
    }
    if (data.image) {
      children.push({
        object: "block",
        type: "image",
        image: { type: "external", external: { url: data.image } }
      });
    }

    const page = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: props,
      children
    });

    res.status(200).json({ ok: true, pageId: page.id });
  } catch (e) {
    res.status(500).json({ error: e.message || String(e) });
  }
}
