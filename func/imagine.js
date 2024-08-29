export default function imagine(query) {
  const width = 720
  const height = 1280
  const seed = Math.floor(Math.random() * 100)
  const model = 'flux'

  const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(
    query
  )}?width=${width}&height=${height}&seed=${seed}&model=${model}`
  return imageUrl
}
