
export default function handler(req, res) {
  res.status(200).json({ name: 'Generated Post', text: "A beautiful content" })
}