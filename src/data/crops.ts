export interface Crop {
  id: string
  name: string
  emoji: string
  category: "grains" | "vegetables" | "fruits" | "legumes" | "cash-crops" | "herbs"
  altNames?: string[]
  custom?: boolean
}

export const CROP_CATEGORIES = [
  { id: "all", label: "All", color: "#6B7280", bg: "#F3F4F6" },
  { id: "grains", label: "Grains", color: "#B45309", bg: "#FEF3C7" },
  { id: "vegetables", label: "Vegetables", color: "#15803D", bg: "#DCFCE7" },
  { id: "fruits", label: "Fruits", color: "#DC2626", bg: "#FEE2E2" },
  { id: "legumes", label: "Legumes", color: "#7C3AED", bg: "#EDE9FE" },
  { id: "cash-crops", label: "Cash Crops", color: "#0369A1", bg: "#E0F2FE" },
  { id: "herbs", label: "Herbs", color: "#0F766E", bg: "#CCFBF1" },
] as const

export type CategoryId = typeof CROP_CATEGORIES[number]["id"]

export const CATEGORY_EMOJI_BG: Record<string, string> = {
  grains: "#FEF3C7",
  vegetables: "#DCFCE7",
  fruits: "#FEE2E2",
  legumes: "#EDE9FE",
  "cash-crops": "#E0F2FE",
  herbs: "#CCFBF1",
}

export const DEFAULT_CROPS: Crop[] = [
  // Grains
  { id: "wheat", name: "Wheat", emoji: "🌾", category: "grains" },
  {
    id: "rice",
    name: "Rice",
    emoji: "🌾",
    category: "grains",
    altNames: ["paddy"],
  },
  {
    id: "corn",
    name: "Corn / Maize",
    emoji: "🌽",
    category: "grains",
    altNames: ["maize"],
  },
  { id: "barley", name: "Barley", emoji: "🌾", category: "grains" },
  {
    id: "sorghum",
    name: "Sorghum",
    emoji: "🌾",
    category: "grains",
    altNames: ["jowar"],
  },
  {
    id: "millet",
    name: "Millet",
    emoji: "🌾",
    category: "grains",
    altNames: ["bajra"],
  },
  { id: "oats", name: "Oats", emoji: "🌾", category: "grains" },
  // Vegetables
  { id: "tomato", name: "Tomato", emoji: "🍅", category: "vegetables" },
  {
    id: "potato",
    name: "Potato",
    emoji: "🥔",
    category: "vegetables",
    altNames: ["aloo"],
  },
  {
    id: "onion",
    name: "Onion",
    emoji: "🧅",
    category: "vegetables",
    altNames: ["pyaz"],
  },
  { id: "garlic", name: "Garlic", emoji: "🧄", category: "vegetables" },
  { id: "carrot", name: "Carrot", emoji: "🥕", category: "vegetables" },
  { id: "cabbage", name: "Cabbage", emoji: "🥬", category: "vegetables" },
  {
    id: "spinach",
    name: "Spinach",
    emoji: "🥬",
    category: "vegetables",
    altNames: ["palak"],
  },
  {
    id: "eggplant",
    name: "Eggplant",
    emoji: "🍆",
    category: "vegetables",
    altNames: ["brinjal", "baingan", "aubergine"],
  },
  {
    id: "pepper",
    name: "Bell Pepper",
    emoji: "🫑",
    category: "vegetables",
    altNames: ["capsicum"],
  },
  {
    id: "chilli",
    name: "Chilli",
    emoji: "🌶️",
    category: "vegetables",
    altNames: ["chili", "mirchi"],
  },
  {
    id: "cucumber",
    name: "Cucumber",
    emoji: "🥒",
    category: "vegetables",
    altNames: ["kakdi"],
  },
  {
    id: "pumpkin",
    name: "Pumpkin",
    emoji: "🎃",
    category: "vegetables",
    altNames: ["kaddu"],
  },
  {
    id: "okra",
    name: "Okra",
    emoji: "🌿",
    category: "vegetables",
    altNames: ["ladyfinger", "bhindi"],
  },
  { id: "broccoli", name: "Broccoli", emoji: "🥦", category: "vegetables" },
  {
    id: "cauliflower",
    name: "Cauliflower",
    emoji: "🥦",
    category: "vegetables",
    altNames: ["gobi"],
  },
  { id: "lettuce", name: "Lettuce", emoji: "🥬", category: "vegetables" },
  {
    id: "radish",
    name: "Radish",
    emoji: "🌱",
    category: "vegetables",
    altNames: ["mooli"],
  },
  {
    id: "beetroot",
    name: "Beetroot",
    emoji: "🌱",
    category: "vegetables",
    altNames: ["beet", "chukandar"],
  },
  // Fruits
  {
    id: "mango",
    name: "Mango",
    emoji: "🥭",
    category: "fruits",
    altNames: ["aam"],
  },
  {
    id: "banana",
    name: "Banana",
    emoji: "🍌",
    category: "fruits",
    altNames: ["kela"],
  },
  {
    id: "apple",
    name: "Apple",
    emoji: "🍎",
    category: "fruits",
    altNames: ["seb"],
  },
  {
    id: "grapes",
    name: "Grapes",
    emoji: "🍇",
    category: "fruits",
    altNames: ["angur"],
  },
  {
    id: "watermelon",
    name: "Watermelon",
    emoji: "🍉",
    category: "fruits",
    altNames: ["tarbooz"],
  },
  {
    id: "papaya",
    name: "Papaya",
    emoji: "🍈",
    category: "fruits",
    altNames: ["papita"],
  },
  {
    id: "guava",
    name: "Guava",
    emoji: "🍏",
    category: "fruits",
    altNames: ["amrood"],
  },
  {
    id: "orange",
    name: "Orange",
    emoji: "🍊",
    category: "fruits",
    altNames: ["santra"],
  },
  {
    id: "lemon",
    name: "Lemon",
    emoji: "🍋",
    category: "fruits",
    altNames: ["nimbu"],
  },
  { id: "strawberry", name: "Strawberry", emoji: "🍓", category: "fruits" },
  {
    id: "pomegranate",
    name: "Pomegranate",
    emoji: "🍎",
    category: "fruits",
    altNames: ["anar"],
  },
  // Legumes
  {
    id: "soybean",
    name: "Soybean",
    emoji: "🫘",
    category: "legumes",
    altNames: ["soya"],
  },
  {
    id: "chickpea",
    name: "Chickpea",
    emoji: "🫘",
    category: "legumes",
    altNames: ["chana", "gram"],
  },
  {
    id: "lentil",
    name: "Lentil",
    emoji: "🫘",
    category: "legumes",
    altNames: ["dal", "masoor"],
  },
  {
    id: "peanut",
    name: "Peanut",
    emoji: "🥜",
    category: "legumes",
    altNames: ["groundnut", "moongphali"],
  },
  {
    id: "beans",
    name: "Beans",
    emoji: "🫘",
    category: "legumes",
    altNames: ["kidney beans", "rajma"],
  },
  {
    id: "peas",
    name: "Peas",
    emoji: "🫛",
    category: "legumes",
    altNames: ["matar"],
  },
  {
    id: "moong",
    name: "Moong Dal",
    emoji: "🫘",
    category: "legumes",
    altNames: ["mung bean", "green gram"],
  },
  {
    id: "urad",
    name: "Urad Dal",
    emoji: "🫘",
    category: "legumes",
    altNames: ["black gram"],
  },
  // Cash Crops
  {
    id: "cotton",
    name: "Cotton",
    emoji: "🌸",
    category: "cash-crops",
    altNames: ["kapas"],
  },
  {
    id: "sugarcane",
    name: "Sugarcane",
    emoji: "🌿",
    category: "cash-crops",
    altNames: ["ganna"],
  },
  { id: "jute", name: "Jute", emoji: "🌿", category: "cash-crops" },
  { id: "coffee", name: "Coffee", emoji: "☕", category: "cash-crops" },
  { id: "tea", name: "Tea", emoji: "🍵", category: "cash-crops" },
  {
    id: "sunflower",
    name: "Sunflower",
    emoji: "🌻",
    category: "cash-crops",
    altNames: ["surajmukhi"],
  },
  {
    id: "mustard",
    name: "Mustard",
    emoji: "🌼",
    category: "cash-crops",
    altNames: ["sarson", "rape seed"],
  },
  { id: "tobacco", name: "Tobacco", emoji: "🌿", category: "cash-crops" },
  // Herbs
  {
    id: "turmeric",
    name: "Turmeric",
    emoji: "🟡",
    category: "herbs",
    altNames: ["haldi"],
  },
  {
    id: "ginger",
    name: "Ginger",
    emoji: "🫚",
    category: "herbs",
    altNames: ["adrak"],
  },
  {
    id: "coriander",
    name: "Coriander",
    emoji: "🌿",
    category: "herbs",
    altNames: ["cilantro", "dhania"],
  },
  {
    id: "mint",
    name: "Mint",
    emoji: "🌿",
    category: "herbs",
    altNames: ["pudina"],
  },
  {
    id: "basil",
    name: "Basil",
    emoji: "🌿",
    category: "herbs",
    altNames: ["tulsi"],
  },
  {
    id: "fenugreek",
    name: "Fenugreek",
    emoji: "🌿",
    category: "herbs",
    altNames: ["methi"],
  },
]

export function searchCrops(crops: Crop[], query: string): Crop[] {
  const q = query.toLowerCase().trim()
  if (!q) return crops
  return crops.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.altNames?.some((a) => a.toLowerCase().includes(q)),
  )
}
