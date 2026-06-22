// ── List of queries that are obviously not company names ─────────
const JUNK_WORDS = new Set([
  'hi','hello','hey','yo','sup','test','testing','asdf','qwerty',
  'foo','bar','baz','lol','lmao','wtf','idk','ok','okay','yes','no',
  'me','you','we','they','it','this','that','what','who','why','how',
  'a','the','is','are','was','were','be','been','my','your','our',
  'stuff','thing','things','something','anything','nothing','random',
  'company','name','search','find','google','bing','help','info',
  'money','cash','token','tokens','api','ai','llm','gpt','claude',
  'please','thanks','thank','sorry','wow','oh','ah','uh','um',
  'one','two','three','four','five','six','seven','eight','nine','ten',
  'good','bad','best','worst','big','small','new','old',
])

const FUNNY_MESSAGES = [
  {
    title: "bruh.",
    body: "That's not a company, that's just a vibe.",
    sub: "i ain't burning tokens for that 💸",
  },
  {
    title: "c'mon now.",
    body: "I need a real company name — not your stream of consciousness.",
    sub: "tokens don't grow on trees 🌳",
  },
  {
    title: "nice try though.",
    body: "The API doesn't know what to do with that either.",
    sub: "try \"Apple\", \"Stripe\", \"That sketchy startup\" — anything, really.",
  },
  {
    title: "my wallet hurts.",
    body: "Every search costs real money and that... is not a company.",
    sub: "be kind to the tokens 🥺",
  },
  {
    title: "sir, this is a Wendy's.",
    body: "I only investigate companies. Not vibes. Not ideas. Companies.",
    sub: "type a company name and we're back in business.",
  },
]

export interface ValidationResult {
  valid: boolean
  message?: typeof FUNNY_MESSAGES[0]
}

export function validateCompanyQuery(query: string): ValidationResult {
  const trimmed = query.trim()

  // Too short
  if (trimmed.length < 2) {
    return { valid: false, message: FUNNY_MESSAGES[0] }
  }

  // All digits
  if (/^\d+$/.test(trimmed)) {
    return { valid: false, message: FUNNY_MESSAGES[1] }
  }

  // All same character / keyboard smash
  if (/^(.)\1{2,}$/.test(trimmed) || /^[asdfghjklqwertyuiopzxcvbnm]{1,4}$/i.test(trimmed)) {
    return { valid: false, message: FUNNY_MESSAGES[2] }
  }

  // Single junk word
  const lower = trimmed.toLowerCase()
  if (JUNK_WORDS.has(lower)) {
    return {
      valid: false,
      message: FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)],
    }
  }

  return { valid: true }
}
