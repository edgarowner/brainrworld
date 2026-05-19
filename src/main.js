import Phaser from "phaser";
import "./styles.css";

const TILE = 16;
const SCALE = 3;
const WORLD_W = 60;
const WORLD_H = 38;
const VIEW_W = 960;
const VIEW_H = 540;
const TOWN_W = 1402;
const TOWN_H = 1122;
const BLOCKY_STRAWBERRY_AVATAR_KEY = "player-strawberry-elephant-blocky";
const BLOCKY_DRAGON_AVATAR_KEY = "dragon-cannelloni-blocky";
const DRAGON_FIRE_KEY = "dragon-cannelloni-fire";
const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const COLORS = {
  water: "#75cfe6",
  waterDark: "#3fa5cf",
  waterLight: "#d7fff4",
  grass: "#5fdb70",
  grassDark: "#32b95b",
  grassLight: "#a6ef7b",
  path: "#efd68b",
  pathDark: "#d1b76d",
  cliff: "#a86640",
  cliffDark: "#785037",
  cliffLight: "#ca8050",
  treeTop: "#4faf58",
  treeTopLight: "#86da65",
  treeShadow: "#2e7b52",
  roof: "#d75079",
  roofDark: "#97395f",
  wall: "#f8d695",
  wallShade: "#d88d5a",
  ink: "#22324a",
  cream: "#fff6d8",
  panel: "#f7f1de",
  panelShadow: "#56617c",
  panelInk: "#26324a",
  accent: "#e6575e",
  gold: "#f5c85b"
};

const terrain = Array.from({ length: WORLD_H }, () => Array(WORLD_W).fill("water"));
const blocked = Array.from({ length: WORLD_H }, () => Array(WORLD_W).fill(true));
const tallGrass = new Set();
const entities = [];

const BRAINROT_TIERS = {
  SIMPLE: { label: "Simple", order: 1, spawnWeight: 1000, minLevel: 3, maxLevel: 15 },
  SALVAJE: { label: "Salvaje", order: 2, spawnWeight: 600, minLevel: 16, maxLevel: 40 },
  ELITE: { label: "Élite", order: 3, spawnWeight: 300, minLevel: 41, maxLevel: 80 },
  RARO: { label: "Raro", order: 4, spawnWeight: 150, minLevel: 81, maxLevel: 130 },
  TITAN: { label: "Titan", order: 5, spawnWeight: 70, minLevel: 131, maxLevel: 180 },
  SPECIAL: { label: "SPECIAL", order: 6, spawnWeight: 35, minLevel: 100, maxLevel: 250 },
  GOAT: { label: "GOAT", order: 7, spawnWeight: 10, minLevel: 350, maxLevel: 520 },
  SUPREMO: { label: "Supremo", order: 8, spawnWeight: 3, minLevel: 700, maxLevel: 950 }
};

const brainrots = [
  {
    name: "Skibidi Sprout",
    tier: "SIMPLE",
    level: 5,
    maxHp: 27,
    color: "#6ee069",
    shade: "#2b9d65",
    moves: [
      { name: "Vine Meme", power: 8 },
      { name: "Brain Ping", power: 6 },
      { name: "Cringe Bark", power: 5 },
      { name: "Leaf Flex", power: 9 }
    ]
  },
  {
    name: "Skibidi Toilet",
    tier: "SUPREMO",
    level: 777,
    maxHp: 46,
    color: "#f4f4f4",
    shade: "#8b8b8b",
    frontTextureKey: "brainrot-skibidi-toilet-front",
    frontScale: 0.2,
    moves: [
      { name: "Flush Stare", power: 9 },
      { name: "Bowl Bash", power: 10 },
      { name: "Meme Grin", power: 8 },
      { name: "Porcelain Pop", power: 11 }
    ]
  },
  {
    name: "Rizz Lizard",
    tier: "SIMPLE",
    level: 6,
    maxHp: 31,
    color: "#f09558",
    shade: "#b84f3e",
    moves: [
      { name: "Charm Loop", power: 7 },
      { name: "Heat Take", power: 9 },
      { name: "Side Eye", power: 6 },
      { name: "Aura Pop", power: 8 }
    ]
  },
  {
    name: "Sigma Slime",
    tier: "SIMPLE",
    level: 4,
    maxHp: 24,
    color: "#7cc9ff",
    shade: "#4277d6",
    moves: [
      { name: "Solo Bounce", power: 7 },
      { name: "Drip Drop", power: 6 },
      { name: "Cold Stare", power: 5 },
      { name: "Mood Melt", power: 8 }
    ]
  },
  {
    name: "Strawberry Elephant",
    tier: "SUPREMO",
    level: 899,
    maxHp: 38,
    color: "#e64242",
    shade: "#a72735",
    frontTextureKey: "brainrot-strawberry-elephant-front",
    backTextureKey: "brainrot-strawberry-elephant-back",
    frontScale: 0.5,
    backScale: 0.22,
    moves: [
      { name: "Seed Static", power: 8 },
      { name: "Trunk Bonk", power: 10 },
      { name: "Berry Blast", power: 9 },
      { name: "Leaf Flex", power: 7 }
    ]
  },
  {
    name: "Dragon Cannelloni",
    tier: "GOAT",
    level: 380,
    maxHp: 64,
    color: "#e6b941",
    shade: "#8f5a25",
    frontTextureKey: "brainrot-dragon-canneloni-front",
    backTextureKey: "brainrot-dragon-canneloni-back",
    frontScale: 0.155,
    moves: [
      { name: "Pasta Flame", power: 13 },
      { name: "Crunch Roll", power: 11 },
      { name: "Golden Roar", power: 10 },
      { name: "Sauce Swipe", power: 12 }
    ]
  },
  {
    name: "Tralalero Tralala",
    tier: "SALVAJE",
    level: 180,
    maxHp: 52,
    color: "#1b93db",
    shade: "#0c4f9d",
    frontTextureKey: "brainrot-tralalero-tralala-front",
    frontScale: 0.165,
    moves: [
      { name: "Sneaker Splash", power: 10 },
      { name: "Shark Chomp", power: 12 },
      { name: "Aqua Dash", power: 11 },
      { name: "Tralala Roar", power: 9 }
    ]
  },
  {
    name: "Bombardiro Crocodilo",
    tier: "ELITE",
    level: 160,
    maxHp: 78,
    color: "#6a8f38",
    shade: "#59615e",
    frontTextureKey: "brainrot-bombardiro-crocodilo-front",
    frontScale: 0.39,
    moves: [
      { name: "Prop Chomp", power: 12 },
      { name: "Bomb Dive", power: 14 },
      { name: "Croc Barrage", power: 11 },
      { name: "Runway Bite", power: 10 }
    ]
  },
  {
    name: "Brr Brr Patapim",
    tier: "SALVAJE",
    level: 210,
    maxHp: 68,
    color: "#4b8b38",
    shade: "#8b5a2d",
    frontTextureKey: "brainrot-brr-brr-patapim-front",
    frontScale: 0.34,
    moves: [
      { name: "Root Stomp", power: 10 },
      { name: "Brr Brr Bash", power: 12 },
      { name: "Forest Flex", power: 9 },
      { name: "Hat Bonk", power: 11 }
    ]
  },
  {
    name: "Cappuccino Assassino",
    tier: "RARO",
    level: 150,
    maxHp: 58,
    color: "#c89b62",
    shade: "#3d281d",
    frontTextureKey: "brainrot-cappuccino-assassino-front",
    frontScale: 0.35,
    moves: [
      { name: "Espresso Cut", power: 13 },
      { name: "Foam Feint", power: 9 },
      { name: "Cup Combo", power: 11 },
      { name: "Latte Lunge", power: 12 }
    ]
  },
  {
    name: "Lirilì Larilà",
    tier: "ELITE",
    level: 190,
    maxHp: 72,
    color: "#6f9f38",
    shade: "#a8a078",
    frontTextureKey: "brainrot-lirili-larila-front",
    frontScale: 0.34,
    moves: [
      { name: "Cactus Charge", power: 11 },
      { name: "Trunk Prickle", power: 10 },
      { name: "Desert Slide", power: 9 },
      { name: "Flipper Flop", power: 12 }
    ]
  },
  {
    name: "Tung Tung Tung Sahur",
    tier: "SALVAJE",
    level: 28,
    maxHp: 46,
    color: "#9b5f36",
    shade: "#5a3424",
    accent: "#e7c173",
    spriteKind: "woodDrum",
    frontTextureKey: "brainrot-tung-tung-tung-sahur-front",
    frontScale: 0.17,
    moves: [
      { name: "Sahur Knock", power: 8 },
      { name: "Triple Bonk", power: 10 },
      { name: "Wood Echo", power: 7 },
      { name: "Midnight Tap", power: 9 }
    ]
  },
  {
    name: "Ballerina Cappuccina",
    tier: "ELITE",
    level: 62,
    maxHp: 54,
    color: "#f4c997",
    shade: "#7b4b35",
    accent: "#ff8fc2",
    spriteKind: "ballerinaCup",
    frontTextureKey: "brainrot-ballerina-cappuccina-front",
    frontScale: 0.18,
    moves: [
      { name: "Foam Pirouette", power: 10 },
      { name: "Cup Twirl", power: 9 },
      { name: "Sugar Step", power: 8 },
      { name: "Cappu Spin", power: 11 }
    ]
  },
  {
    name: "Chimpanzini Bananini",
    tier: "SALVAJE",
    level: 34,
    maxHp: 48,
    color: "#7a4e32",
    shade: "#3d281d",
    accent: "#ffd957",
    spriteKind: "monkeyBanana",
    frontTextureKey: "brainrot-chimpanzini-bananini-front",
    frontScale: 0.18,
    moves: [
      { name: "Banana Toss", power: 9 },
      { name: "Chimp Clap", power: 8 },
      { name: "Peel Slide", power: 7 },
      { name: "Jungle Bonk", power: 10 }
    ]
  },
  {
    name: "Bombombini Gusini",
    tier: "ELITE",
    level: 74,
    maxHp: 60,
    color: "#f3f0df",
    shade: "#5f6670",
    accent: "#2f4058",
    spriteKind: "gooseBomb",
    frontTextureKey: "brainrot-bombombini-gusini-front",
    frontScale: 0.17,
    moves: [
      { name: "Goose Raid", power: 10 },
      { name: "Bomb Honk", power: 12 },
      { name: "Wing Drop", power: 9 },
      { name: "Gusini Blast", power: 11 }
    ]
  },
  {
    name: "Espressona Signora",
    tier: "RARO",
    level: 108,
    maxHp: 66,
    color: "#3d281d",
    shade: "#1f1713",
    accent: "#d7a15a",
    spriteKind: "elegantCoffee",
    moves: [
      { name: "Signora Sip", power: 12 },
      { name: "Espresso Glare", power: 11 },
      { name: "Velvet Steam", power: 10 },
      { name: "Cup Crash", power: 13 }
    ]
  },
  {
    name: "Boneca Ambalabu",
    tier: "SALVAJE",
    level: 36,
    maxHp: 44,
    color: "#75c969",
    shade: "#3c7849",
    accent: "#f5b15d",
    spriteKind: "frogDoll",
    moves: [
      { name: "Doll Hop", power: 8 },
      { name: "Ambalabu Pop", power: 9 },
      { name: "Button Stare", power: 7 },
      { name: "Frog Flip", power: 10 }
    ]
  },
  {
    name: "Frigo Camelo",
    tier: "SIMPLE",
    level: 10,
    maxHp: 34,
    color: "#d6ecf2",
    shade: "#7b9ca7",
    accent: "#c99459",
    spriteKind: "fridgeCamel",
    moves: [
      { name: "Cold Hump", power: 6 },
      { name: "Fridge Slam", power: 8 },
      { name: "Ice Snort", power: 7 },
      { name: "Camel Kick", power: 8 }
    ]
  },
  {
    name: "Trippi Troppi",
    tier: "SIMPLE",
    level: 9,
    maxHp: 31,
    color: "#71cbd7",
    shade: "#326b8a",
    accent: "#f5974f",
    spriteKind: "trippiTroppi",
    moves: [
      { name: "Troppi Splash", power: 7 },
      { name: "Trippi Snap", power: 6 },
      { name: "Tiny Tumble", power: 6 },
      { name: "Bubble Nudge", power: 8 }
    ]
  },
  {
    name: "Ta Ta Ta Sahur",
    tier: "SIMPLE",
    level: 8,
    maxHp: 30,
    color: "#b97845",
    shade: "#68402a",
    accent: "#f0d28a",
    spriteKind: "sahurStick",
    moves: [
      { name: "Ta Ta Tap", power: 7 },
      { name: "Sleepy Knock", power: 6 },
      { name: "Street Echo", power: 6 },
      { name: "Stick Jab", power: 8 }
    ]
  },
  {
    name: "Blueberrinni Octopusini",
    tier: "RARO",
    level: 118,
    maxHp: 74,
    color: "#416dd8",
    shade: "#1c3477",
    accent: "#8ee3ff",
    spriteKind: "blueberryOctopus",
    moves: [
      { name: "Berry Ink", power: 11 },
      { name: "Octo Squeeze", power: 12 },
      { name: "Blue Pulse", power: 10 },
      { name: "Tentacle Pop", power: 13 }
    ]
  },
  {
    name: "Orangutini Ananasini",
    tier: "ELITE",
    level: 70,
    maxHp: 62,
    color: "#c56738",
    shade: "#6e3524",
    accent: "#f2d84b",
    spriteKind: "orangutanPineapple",
    moves: [
      { name: "Pineapple Punch", power: 11 },
      { name: "Ananas Roll", power: 9 },
      { name: "Orangutini Slam", power: 10 },
      { name: "Crown Bonk", power: 12 }
    ]
  },
  {
    name: "Gangster Footera",
    tier: "RARO",
    level: 116,
    maxHp: 70,
    color: "#d29b73",
    shade: "#50342b",
    accent: "#20283b",
    spriteKind: "gangsterFoot",
    moves: [
      { name: "Sneaker Snap", power: 12 },
      { name: "Footera Flex", power: 10 },
      { name: "Shade Kick", power: 11 },
      { name: "Street Step", power: 13 }
    ]
  },
  {
    name: "Pipi Kiwi",
    tier: "SIMPLE",
    level: 7,
    maxHp: 28,
    color: "#91b64f",
    shade: "#4e6d31",
    accent: "#f7d37d",
    spriteKind: "kiwiBird",
    moves: [
      { name: "Kiwi Peck", power: 6 },
      { name: "Pipi Dash", power: 7 },
      { name: "Fuzzy Roll", power: 6 },
      { name: "Seed Pop", power: 8 }
    ]
  },
  {
    name: "Burbaloni Luliloli",
    tier: "SIMPLE",
    level: 12,
    maxHp: 33,
    color: "#a97c54",
    shade: "#5d3f2e",
    accent: "#74d7e8",
    spriteKind: "burbaloni",
    moves: [
      { name: "Bubble Belly", power: 7 },
      { name: "Luliloli Hop", power: 6 },
      { name: "Soft Splash", power: 7 },
      { name: "Burb Burst", power: 8 }
    ]
  },
  {
    name: "La Vaca Saturno Saturnita",
    tier: "RARO",
    level: 124,
    maxHp: 82,
    color: "#f1eee2",
    shade: "#2c2f38",
    accent: "#d6b86b",
    spriteKind: "saturnCow",
    moves: [
      { name: "Saturn Ring", power: 12 },
      { name: "Cosmic Moo", power: 11 },
      { name: "Orbit Stomp", power: 13 },
      { name: "Milk Meteor", power: 10 }
    ]
  },
  {
    name: "Garama and Madundung",
    tier: "GOAT",
    level: 430,
    maxHp: 86,
    color: "#b06b3f",
    shade: "#3d2b22",
    accent: "#79c05b",
    spriteKind: "garamaMandundung",
    frontTextureKey: "brainrot-garama-and-madundung-front",
    frontScale: 0.16,
    backScale: 2.9,
    moves: [
      { name: "Dual Chant", power: 14 },
      { name: "Mandundung Mash", power: 13 },
      { name: "Garama Guard", power: 10, heal: 10 },
      { name: "GOAT Impact", power: 15 }
    ]
  }
];

const starter = {
  name: "Giga Bean",
  tier: "SIMPLE",
  level: 7,
  maxHp: 36,
  hp: 36,
  color: "#68dd96",
  shade: "#2f936d",
  backTextureKey: "starterBrainrot",
  moves: [
    { name: "Brain Beam", power: 9 },
    { name: "Fresh Take", power: 7 },
    { name: "Focus Tap", power: 6 },
    { name: "Vibe Guard", power: 0, heal: 8 }
  ]
};

const BRAINROT_VARIANTS = [
  { key: "NORMAL", label: "", weight: 58 },
  { key: "ORO", label: "ORO", weight: 12, color: "#ffcf3f" },
  { key: "ROJO", label: "ROJO FUEGO", weight: 12, color: "#ff3434" },
  { key: "AZUL_AQUA", label: "AZUL AQUA", weight: 12, color: "#24f2ff" },
  { key: "DARK", label: "DARK", weight: 10, color: "#33213f" },
  { key: "PRISMA", label: "PRISMA", weight: 8, color: "#ff4fc8", altColor: "#43e5ff" }
];

const NORMAL_VARIANT = BRAINROT_VARIANTS[0];

const BRAINROT_TRAITS = {
  TACO: {
    key: "TACO",
    label: "Taco",
    emoji: "🌮",
    baseChance: 0.1,
    maxChance: 0.22,
    levelMultiplier: 3
  },
  VVS: {
    key: "VVS",
    label: "VVS",
    emoji: "💎",
    baseChance: 0.08,
    maxChance: 0.18,
    levelMultiplier: 8
  }
};

const MAP_DOORS = [
  { key: "blueHome", label: "Casa azul", x: 245, y: 276, w: 40, h: 42, interior: "interiorBlueHome", returnX: 265, returnY: 338 },
  { key: "redHome", label: "Casa roja", x: 493, y: 276, w: 42, h: 48, interior: "interiorRedHome", returnX: 512, returnY: 340 },
  { key: "healCenter", label: "Centro de curacion", x: 858, y: 295, w: 40, h: 48, interior: "interiorHealCenter", returnX: 878, returnY: 358, heal: true },
  { key: "greenHome", label: "Casa verde", x: 697, y: 696, w: 44, h: 48, interior: "interiorGreenHome", returnX: 718, returnY: 770 },
  { key: "purpleShop", label: "Tienda morada", x: 1007, y: 570, w: 46, h: 50, interior: "interiorPurpleShop", returnX: 1030, returnY: 650 },
  { key: "yellowHome", label: "Casa amarilla", x: 220, y: 838, w: 46, h: 54, interior: "interiorYellowHome", returnX: 242, returnY: 920 },
  { key: "purpleHome", label: "Casa morada", x: 1334, y: 707, w: 54, h: 54, interior: "interiorPurpleHome", returnX: 1360, returnY: 775 },
  { key: "southVillageGate", label: "Camino sur", x: 462, y: 902, w: 94, h: 54, toMap: "southVillage", targetX: 706, targetY: 205, targetDirection: "down" }
];

const MAP_BLOCKERS = [
  [0, 0, 1402, 130],
  [0, 0, 92, 1122],
  [92, 64, 300, 88],
  [392, 68, 510, 84],
  [930, 72, 230, 74],
  [1296, 0, 106, 240],
  [1298, 850, 104, 272],
  [0, 1000, 475, 122],
  [1112, 1042, 290, 80],
  [164, 132, 194, 178],
  [423, 162, 183, 142],
  [803, 174, 164, 154],
  [613, 622, 224, 122],
  [928, 440, 292, 170],
  [144, 716, 222, 166],
  [1042, 154, 256, 136],
  [850, 870, 365, 110],
  [570, 432, 100, 104],
  [1290, 560, 112, 115],
  [1286, 760, 116, 70],
  [1286, 650, 42, 135],
  [1380, 650, 22, 135],
  [108, 315, 100, 42],
  [55, 432, 75, 18],
  [108, 492, 18, 128],
  [112, 610, 238, 18],
  [214, 408, 238, 18],
  [432, 422, 18, 184],
  [214, 408, 20, 84],
  [562, 575, 212, 22],
  [560, 580, 20, 132],
  [934, 714, 275, 20],
  [934, 835, 275, 20],
  [934, 714, 20, 141],
  [1194, 714, 20, 141],
  [1008, 328, 92, 20],
  [1333, 338, 66, 22],
  [382, 747, 78, 18],
  [104, 724, 22, 192],
  [422, 748, 40, 148],
  [142, 382, 62, 76],
  [543, 415, 62, 78],
  [704, 424, 55, 52],
  [1100, 770, 95, 78],
  [990, 80, 75, 80],
  [1218, 78, 70, 75],
  [1198, 802, 48, 70],
  [1248, 820, 50, 70],
  [820, 782, 48, 72],
  [448, 948, 105, 84],
  [1210, 965, 88, 84]
];

const MAP_TALL_GRASS_RECTS = [
  [585, 843, 260, 102],
  [235, 465, 180, 150],
  [940, 742, 260, 105]
];

const SOUTH_VILLAGE_BLOCKERS = [
  [0, 0, 1402, 70],
  [0, 0, 48, 1122],
  [1354, 0, 48, 1122],
  [182, 292, 206, 136],
  [474, 304, 184, 138],
  [822, 306, 158, 136],
  [976, 568, 206, 154],
  [174, 800, 206, 130],
  [588, 772, 194, 128],
  [1100, 306, 202, 162],
  [614, 528, 140, 128],
  [126, 520, 22, 162],
  [426, 520, 22, 162],
  [126, 512, 320, 20],
  [126, 674, 108, 20],
  [318, 674, 128, 20],
  [1264, 770, 48, 202],
  [88, 242, 70, 174],
  [418, 232, 38, 48],
  [1026, 222, 36, 50],
  [528, 854, 34, 46],
  [860, 862, 34, 46],
  [1250, 708, 36, 42]
];

const SOUTH_VILLAGE_SPAWN_RECTS = [
  [146, 526, 276, 142],
  [882, 744, 382, 248]
];

const SOUTH_VILLAGE_DOORS = [
  { key: "southBlueHome", label: "Casa azul sur", x: 246, y: 366, w: 48, h: 54, interior: "southInteriorBlueHome", returnMap: "southVillage", returnX: 270, returnY: 452 },
  { key: "southRedShop", label: "Tienda roja", x: 540, y: 364, w: 52, h: 56, interior: "southInteriorRedShop", returnMap: "southVillage", returnX: 566, returnY: 452 },
  { key: "southClinic", label: "Clinica sur", x: 862, y: 382, w: 48, h: 56, interior: "southInteriorClinic", returnMap: "southVillage", returnX: 886, returnY: 474, heal: true },
  { key: "southPurpleShop", label: "Tienda morada sur", x: 1030, y: 650, w: 50, h: 58, interior: "southInteriorPurpleShop", returnMap: "southVillage", returnX: 1054, returnY: 754 },
  { key: "southYellowHome", label: "Casa amarilla sur", x: 252, y: 870, w: 52, h: 58, interior: "southInteriorYellowHome", returnMap: "southVillage", returnX: 278, returnY: 972 },
  { key: "southGreenHome", label: "Casa verde sur", x: 678, y: 834, w: 52, h: 58, interior: "southInteriorGreenHome", returnMap: "southVillage", returnX: 704, returnY: 934 },
  { key: "southVillageReturn", label: "Volver al pueblo", x: 674, y: 116, w: 96, h: 58, toMap: "overworld", targetX: 512, targetY: 972, targetDirection: "up" }
];

const MAPTEST_BLOCKERS = [
  [0, 0, 1402, 86],
  [0, 0, 64, 1122],
  [1338, 0, 64, 1122],
  [0, 1040, 1402, 82],
  [94, 118, 308, 120],
  [998, 108, 298, 132],
  [214, 304, 210, 150],
  [598, 252, 218, 150],
  [930, 438, 250, 162],
  [190, 772, 242, 146],
  [602, 794, 236, 146],
  [1042, 754, 222, 142],
  [546, 532, 310, 176],
  [122, 512, 28, 240],
  [150, 512, 246, 20],
  [386, 512, 22, 240],
  [150, 732, 258, 20],
  [970, 262, 268, 18],
  [970, 392, 268, 18],
  [970, 262, 20, 148],
  [1218, 262, 20, 148],
  [90, 926, 250, 64],
  [938, 940, 250, 64],
  [1240, 520, 112, 210]
];

const MAPTEST_TALL_GRASS_RECTS = [
  [158, 548, 220, 166],
  [946, 286, 254, 92],
  [510, 884, 270, 94],
  [928, 650, 250, 76]
];

const MAPTEST_DOORS = [
  { key: "maptestBlueHome", label: "Casa de prueba azul", x: 270, y: 398, w: 54, h: 58, interior: "interiorBlueHome", returnMap: "maptest", returnX: 298, returnY: 502 },
  { key: "maptestRedHome", label: "Casa fresa", x: 668, y: 346, w: 58, h: 58, interior: "interiorRedHome", returnMap: "maptest", returnX: 696, returnY: 456 },
  { key: "maptestHealCenter", label: "Clinica de prueba", x: 1014, y: 540, w: 58, h: 58, interior: "interiorHealCenter", returnMap: "maptest", returnX: 1044, returnY: 650, heal: true },
  { key: "maptestSouthGate", label: "Volver al pueblo", x: 640, y: 1010, w: 126, h: 60, toMap: "overworld", targetX: 512, targetY: 972, targetDirection: "up" }
];

const NPC_SPAWN_ZONES = [
  [110, 326, 300, 58],
  [430, 330, 360, 70],
  [930, 330, 320, 70],
  [410, 370, 95, 300],
  [835, 390, 95, 330],
  [135, 650, 430, 72],
  [600, 760, 250, 70],
  [920, 625, 330, 78],
  [960, 975, 240, 66],
  [645, 356, 150, 110]
];

const SECONDARY_NPCS = [
  { key: "npcBlue", frame: 4, name: "Mujer", tipIndex: 0 },
  { key: "npcPink", frame: 4, name: "Fan", tipIndex: 3 },
  { key: "npcHiker", frame: 4, name: "Explorador", tipIndex: 5 },
  { key: "npcKid", frame: 4, name: "Nino", tipIndex: 1 }
];

const STRAWBERRY_NPC = {
  key: BLOCKY_STRAWBERRY_AVATAR_KEY,
  frame: 4,
  name: "Strawberry Elephant",
  x: 792,
  y: 742,
  mapKey: "overworld",
  battleEnemyName: "Strawberry Elephant",
  noRandomTrainer: true,
  hiddenUntilSpawn: true,
  noWander: true,
  scale: 1.35,
  standardDirections: true,
  wanderRadius: 96,
  wanderSpeed: 58,
  wanderTimerMs: 350
};

const DRAGON_NPC = {
  key: BLOCKY_DRAGON_AVATAR_KEY,
  frame: 4,
  name: "Dragon Cannelloni",
  x: 1118,
  y: 662,
  mapKey: "overworld",
  battleEnemyName: "Dragon Cannelloni",
  noRandomTrainer: true,
  hiddenUntilSpawn: true,
  noWander: true,
  scale: 0.94,
  fireScale: 1.05,
  standardDirections: true,
  wanderRadius: 110,
  wanderSpeed: 56,
  wanderTimerMs: 540,
  breathesFire: true
};

const SOUTH_VILLAGE_NPCS = [
  { key: "npcBlue", frame: 4, name: "Guia Sur", x: 748, y: 270, tipIndex: 0, mapKey: "southVillage" },
  { key: "npcPink", frame: 4, name: "Florista", x: 1134, y: 724, tipIndex: 2, mapKey: "southVillage" },
  { key: "npcKid", frame: 4, name: "Scout", x: 430, y: 720, tipIndex: 6, mapKey: "southVillage" },
  { key: "npcHiker", frame: 4, name: "Guardia", x: 512, y: 502, tipIndex: 5, mapKey: "southVillage" }
];

const NPC_TIPS = [
  "Los brainrots salvajes solo salen en la yerba alta.",
  "Mientras mas alto el nivel, mas EXP pide para subir.",
  "Si un brainrot cae, curalo en el centro azul.",
  "ORO, DARK y PRISMA cambian el color del brainrot.",
  "Usa 1, 2, 3, 4 para elegir ataques rapido.",
  "Parate frente a una puerta y presiona E para entrar.",
  "Si ganas, puedes guardar el brainrot derrotado.",
  "Los brainrots especiales suelen salir con nivel alto."
];

const ADMIN_EVENT_DURATION = 60_000;
const STRAWBERRY_SPAWN_DURATION = 180_000;
const DRAGON_SPAWN_DURATION = 180_000;
const MAX_TRAIT_LEVEL = 9999;
const PROFILE_STORAGE_KEY = "brainworldProfile";
const SESSION_STORAGE_KEY = "brainworldSession";
const DEFAULT_INVENTORY_LIMIT = 10;
const ADMIN_USERNAME = "edgar23";
const ADMIN_PASSWORD = "Berbys23@";

const INTERIOR_BLOCKERS = {
  blueHome: [
    [18, 20, 348, 88],
    [78, 142, 152, 92],
    [286, 122, 78, 140],
    [292, 34, 78, 66],
    [18, 290, 86, 74]
  ],
  redHome: [
    [18, 20, 344, 88],
    [96, 158, 132, 96],
    [292, 44, 74, 92],
    [295, 156, 72, 92],
    [24, 164, 50, 70],
    [300, 285, 52, 64]
  ],
  greenHome: [
    [18, 20, 314, 92],
    [24, 66, 72, 62],
    [142, 42, 90, 76],
    [268, 120, 68, 142],
    [116, 214, 92, 74],
    [18, 304, 74, 54]
  ],
  purpleShop: [
    [18, 30, 356, 92],
    [48, 118, 262, 88],
    [18, 178, 72, 112],
    [302, 44, 68, 92],
    [322, 278, 50, 58]
  ],
  yellowHome: [
    [18, 20, 366, 98],
    [108, 174, 158, 96],
    [298, 134, 78, 138],
    [26, 292, 64, 72],
    [308, 296, 56, 56]
  ],
  healCenter: [
    [76, 72, 226, 140],
    [326, 60, 56, 106],
    [310, 246, 80, 54],
    [30, 50, 56, 82],
    [245, 100, 42, 76]
  ],
  purpleHome: [
    [18, 20, 402, 104],
    [342, 132, 76, 142],
    [166, 184, 130, 84],
    [24, 286, 56, 80],
    [325, 288, 82, 62],
    [92, 62, 190, 58]
  ]
};

function expToNextLevel(level) {
  return Math.max(40, Math.floor(70 + level * level * 1.8));
}

function expRewardFor(defeatedBrainrot) {
  return Math.max(12, Math.floor(defeatedBrainrot.level * 5 + defeatedBrainrot.maxHp * 0.18));
}

function fillRect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function strokeRect(ctx, x, y, w, h, color, line = 1) {
  ctx.strokeStyle = color;
  ctx.lineWidth = line;
  ctx.strokeRect(x + line / 2, y + line / 2, w - line, h - line);
}

function drawPixelOval(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();
}

function getTile(x, y) {
  if (x < 0 || y < 0 || x >= WORLD_W || y >= WORLD_H) return "water";
  return terrain[y][x];
}

function setTile(x, y, type, isBlocked = false) {
  if (x < 0 || y < 0 || x >= WORLD_W || y >= WORLD_H) return;
  terrain[y][x] = type;
  blocked[y][x] = isBlocked;
}

function rectTiles(x, y, w, h, type, isBlocked = false) {
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      setTile(xx, yy, type, isBlocked);
    }
  }
}

function buildMapData() {
  rectTiles(0, 0, WORLD_W, WORLD_H, "grass");
  rectTiles(31, 0, 6, WORLD_H, "path");
  rectTiles(37, 0, 1, WORLD_H, "grass");

  [
    [19, 4], [20, 3], [21, 3], [22, 3], [23, 4],
    [18, 5], [19, 5], [20, 5], [21, 5], [22, 5], [23, 5],
    [19, 6], [20, 6], [21, 6], [22, 6],
    [16, 10], [17, 9], [18, 9], [19, 10],
    [16, 11], [17, 11], [18, 11], [19, 11],
    [17, 12], [18, 12]
  ].forEach(([x, y]) => setTile(x, y, "water", true));

  [
    [18, 16, 6, 3],
    [26, 17, 4, 3]
  ].forEach(([x, y, w, h]) => {
    rectTiles(x, y, w, h, "tallGrass");
    for (let yy = y; yy < y + h; yy += 1) {
      for (let xx = x; xx < x + w; xx += 1) tallGrass.add(`${xx},${yy}`);
    }
  });

  entities.push(
    { type: "fenceH", x: 20, y: 7, length: 11 },
    { type: "fenceH", x: 20, y: 15, length: 8 },
    { type: "fenceV", x: 20, y: 8, length: 7 },
    { type: "fenceV", x: 30, y: 1, length: 7 },
    { type: "fenceV", x: 30, y: 13, length: 5 },
    { type: "rock", x: 22, y: 18, size: "large" },
    { type: "rock", x: 18, y: 21, size: "small" },
    { type: "healMachine", x: 35, y: 18 },
    { type: "npc", x: 18, y: 11, mood: "kid" },
    { type: "npc", x: 22, y: 10, mood: "wanderer" },
    { type: "npc", x: 27, y: 3, mood: "fan" },
    { type: "npc", x: 32, y: 5, mood: "kid" },
    { type: "npc", x: 31, y: 9, mood: "hiker" }
  );

  entities.forEach((entity) => {
    if (entity.type === "fenceH") {
      for (let i = 0; i < entity.length; i += 1) blocked[entity.y][entity.x + i] = true;
    }
    if (entity.type === "fenceV") {
      for (let i = 0; i < entity.length; i += 1) blocked[entity.y + i][entity.x] = true;
    }
    if (entity.type === "rock" || entity.type === "healMachine") blocked[entity.y][entity.x] = true;
  });
}

buildMapData();

class BrainworldScene extends Phaser.Scene {
  constructor() {
    super("BrainworldScene");
    this.playerBrainrot = {
      ...starter,
      baseName: starter.name,
      baseMaxHp: starter.maxHp,
      maxHp: starter.maxHp + Math.floor(starter.level * 3),
      hp: starter.maxHp + Math.floor(starter.level * 3),
      brainExp: 0,
      brainExpToNext: expToNextLevel(starter.level),
      variant: NORMAL_VARIANT,
      moves: starter.moves.map((move) => ({ ...move }))
    };
    this.party = [this.playerBrainrot];
    this.inventory = [this.playerBrainrot];
    this.inventoryLimit = DEFAULT_INVENTORY_LIMIT;
    this.inBattle = false;
    this.battleMenuMode = "main";
    this.captureChoiceActive = false;
    this.adminKeepChoiceActive = false;
    this.pendingCapture = null;
    this.dialogueQueue = [];
    this.dialogueAdvanceAt = 0;
    this.lastStepTile = "";
    this.locationMode = "overworld";
    this.currentMapKey = "overworld";
    this.initialRouteMapKey = this.routeMapKey();
    this.currentInterior = null;
    this.moveTarget = null;
    this.mapWorldW = TOWN_W;
    this.mapWorldH = TOWN_H;
    this.interiorBlockers = [];
    this.adminEvent = null;
    this.adminEvents = [];
    this.spawnEconomy = {};
    this.adminSessionName = "Local Session";
    this.adminAuthed = false;
    this.adminSpawnMode = "spawn";
    this.npcBattle = null;
    this.userProfile = this.loadUserProfile();
    this.playerAvatarKey = this.userProfile?.avatarKey ?? "player";
    this.profileAvatarKey = this.playerAvatarKey;
	    this.awaitingStarterBrainrot = false;
	    this.starterEncounterActive = false;
	    this.pendingStarterBrainrot = null;
	    this.battleNoPlayerBrainrot = false;
	    this.homeStarted = false;
    this.adminSpawnFormVisible = false;
    this.inventorySelectedIndex = 0;
    this.inventoryDeleteConfirmIndex = null;
    this.inventoryPage = 0;
    this.adminSelectedIndex = 0;
    this.lastAdminPhaserClickAt = 0;
    this.lastInventoryPhaserClickAt = 0;
    this.battleInputBlockUntil = 0;
    this.lastBattleButtonPhaserClickAt = 0;
    this.escapeAttemptLocked = false;
    this.isMobilePhone = typeof navigator !== "undefined" && /Android|iPhone|iPod|Mobile/i.test(navigator.userAgent);
    this.joystickVector = { x: 0, y: 0 };
    this.joystickPointerId = null;
    this.joystickOrigin = { x: 112, y: 428 };
    this.joystickRadius = 54;
    this.tacoRainDrops = [];
    this.tacoRainActive = false;
    this.strawberrySpawnActive = false;
    this.strawberrySpawnDrops = [];
    this.dragonSpawnEndsAt = 0;
    this.vvsDiamonds = [];
    this.loadGameSession();
  }

  preload() {
    this.load.image("townMap", assetPath("assets/maps/town-map.png"));
    this.load.image("southVillageMap", assetPath("assets/maps/south-village-map.png"));
    this.load.image("interiorBlueHome", assetPath("assets/interiors/casa-azul-arriba-izquierda.png"));
    this.load.image("interiorRedHome", assetPath("assets/interiors/casa-roja-arriba-centro.png"));
    this.load.image("interiorGreenHome", assetPath("assets/interiors/casa-verde-centro.png"));
    this.load.image("interiorPurpleShop", assetPath("assets/interiors/tienda-morada-centro-derecha.png"));
    this.load.image("interiorYellowHome", assetPath("assets/interiors/casa-amarilla-abajo-izquierda.png"));
    this.load.image("interiorHealCenter", assetPath("assets/interiors/centro-curacion.png"));
    this.load.image("interiorPurpleHome", assetPath("assets/interiors/casa-morada-abajo-derecha.png"));
    this.load.image("southInteriorBlueHome", assetPath("assets/interiors/south-blue-home.png"));
    this.load.image("southInteriorRedShop", assetPath("assets/interiors/south-red-shop.png"));
    this.load.image("southInteriorClinic", assetPath("assets/interiors/south-clinic.png"));
    this.load.image("southInteriorPurpleShop", assetPath("assets/interiors/south-purple-shop.png"));
    this.load.image("southInteriorYellowHome", assetPath("assets/interiors/south-yellow-home.png"));
    this.load.image("southInteriorGreenHome", assetPath("assets/interiors/south-green-home.png"));
    this.load.image("na-floor", assetPath("assets/ninja/tilesets/TilesetFloor.png"));
    this.load.image("na-water", assetPath("assets/ninja/tilesets/TilesetWater.png"));
    this.load.image("na-nature", assetPath("assets/ninja/tilesets/TilesetNature.png"));
    this.load.image("na-element", assetPath("assets/ninja/tilesets/TilesetElement.png"));
    this.load.spritesheet("player", assetPath("assets/characters/brainworld/joven-gorra-azul.png"), { frameWidth: 64, frameHeight: 72 });
    this.load.spritesheet("npcPink", assetPath("assets/characters/brainworld/nina-lazo.png"), { frameWidth: 64, frameHeight: 72 });
    this.load.spritesheet("npcBlue", assetPath("assets/characters/brainworld/mujer-recogido.png"), { frameWidth: 64, frameHeight: 72 });
    this.load.spritesheet("npcKid", assetPath("assets/characters/brainworld/nino-gorra-verde.png"), { frameWidth: 64, frameHeight: 72 });
    this.load.spritesheet("npcHiker", assetPath("assets/characters/brainworld/explorador.png"), { frameWidth: 64, frameHeight: 72 });
    this.load.image("brainrot-strawberry-elephant-front", assetPath("assets/brainrots/strawberryelephant-front.webp"));
    this.load.image("brainrot-strawberry-elephant-back", assetPath("assets/brainrots/strawberryelephant-back.png"));
    this.load.image("brainrot-dragon-canneloni-front", assetPath("assets/brainrots/dragon-canneloni-front.png"));
    this.load.image("brainrot-dragon-canneloni-back", assetPath("assets/brainrots/dragon-canneloni-back.png"));
    this.load.image("brainrot-tralalero-tralala-front", assetPath("assets/brainrots/tralalero-tralala-front.png"));
    this.load.image("brainrot-bombardiro-crocodilo-front", assetPath("assets/brainrots/bombardiro-crocodilo-front.png"));
    this.load.image("brainrot-brr-brr-patapim-front", assetPath("assets/brainrots/brr-brr-patapim-front.png"));
    this.load.image("brainrot-cappuccino-assassino-front", assetPath("assets/brainrots/cappuccino-assassino-front.png"));
    this.load.image("brainrot-lirili-larila-front", assetPath("assets/brainrots/lirili-larila-front.png"));
    this.load.image("brainrot-skibidi-toilet-front", assetPath("assets/brainrots/skibidi-toilet-front.png"));
    this.load.image("brainrot-tung-tung-tung-sahur-front", assetPath("assets/brainrots/tung-tung-tung-sahur-front.png"));
    this.load.image("brainrot-ballerina-cappuccina-front", assetPath("assets/brainrots/ballerina-cappuccina-front.png"));
    this.load.image("brainrot-chimpanzini-bananini-front", assetPath("assets/brainrots/chimpanzini-bananini-front.png"));
    this.load.image("brainrot-bombombini-gusini-front", assetPath("assets/brainrots/bombombini-gusini-front.png"));
    this.load.image("brainrot-garama-and-madundung-front", assetPath("assets/brainrots/garama-and-madundung-front.png"));
  }

  create() {
    this.game.canvas.setAttribute("aria-label", "Brainworld top-down pixel RPG game");
    this.game.canvas.setAttribute("tabindex", "0");
    this.game.canvas.addEventListener("pointerdown", (event) => {
      this.game.canvas.focus();
      if (!this.homeStarted || this.profileOverlay?.visible) {
        this.handlePointerDown(this.pointerFromCanvasEvent(event));
      }
    });
    this.game.canvas.focus();
    window.addEventListener("brainworld:start-battle", () => {
      if (!this.inBattle) this.startBattle();
    });
    this.cameras.main.setBackgroundColor(COLORS.water);
    this.createTextures();
    this.createCharacterAnimations();
    this.createWorld();
    this.createCharacters();
    this.createHud();
    this.createBattleOverlay();
    this.createInput();
    this.createMobileControls();
    this.createTacoRain();
    this.createHomeScreen();
    if (this.initialRouteMapKey === "maptest") {
      this.setMapZone("maptest", { playerX: 706, playerY: 884, direction: "up" });
    }
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setBounds(0, 0, this.mapWorldW, this.mapWorldH);
    this.time.delayedCall(900, () => this.showToast("Brainworld Town", "Parate frente a una puerta y presiona E."));
    const demo = new URLSearchParams(window.location.search).get("demo");
    if (demo === "berryphant") {
      this.time.delayedCall(450, () => this.startBattle({
        enemyName: "Dragon Cannelloni",
        playerName: "Strawberry Elephant",
        introText: "Rival Dragon Cannelloni challenged you!"
      }));
    }
    if (demo === "tralalero") {
      this.time.delayedCall(450, () => this.startBattle({
        enemyName: "Tralalero Tralala",
        enemyVariant: "AZUL_AQUA",
        playerName: "Strawberry Elephant",
        introText: "AZUL AQUA Tralalero Tralala stepped in!"
      }));
    }
    const demoBrainrots = {
      bombardiro: "Bombardiro Crocodilo",
      patapim: "Brr Brr Patapim",
      cappuccino: "Cappuccino Assassino",
      lirili: "Lirilì Larilà",
      tung: "Tung Tung Tung Sahur",
      ballerina: "Ballerina Cappuccina",
      chimpanzini: "Chimpanzini Bananini",
      gusini: "Bombombini Gusini"
    };
    if (demoBrainrots[demo]) {
      this.time.delayedCall(450, () => this.startBattle({
        enemyName: demoBrainrots[demo],
        playerName: "Strawberry Elephant",
        introText: `${demoBrainrots[demo]} appeared!`
      }));
    }
  }

  pointerFromCanvasEvent(event) {
    const rect = this.game.canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / Math.max(1, rect.width)) * VIEW_W;
    const y = ((event.clientY - rect.top) / Math.max(1, rect.height)) * VIEW_H;
    return {
      x,
      y,
      id: event.pointerId ?? -1,
      positionToCamera: (camera) => camera?.getWorldPoint?.(x, y) ?? { x, y }
    };
  }

  routeMapKey() {
    return window.location.pathname.replace(/\/+$/, "") === "/maptest" ? "maptest" : "overworld";
  }

  createTextures() {
    this.makeAssetTexture("water", "na-water", 32, 32, 16, 16);
    this.makeAssetTexture("grass", "na-floor", 48, 176, 16, 16);
    this.makeAssetTexture("path", "na-floor", 96, 128, 16, 16);
    this.makeAssetTexture("tallGrass", "na-nature", 32, 144, 16, 16);
    this.makeAssetTexture("tree", "na-nature", 0, 0, 32, 32);
    this.makeAssetTexture("rock", "na-nature", 256, 176, 48, 48);
    this.makeAssetTexture("pondSmall", "na-water", 0, 96, 64, 64);
    this.makeAssetTexture("fence", "na-nature", 160, 176, 16, 16);
    this.makeAssetTexture("fenceV", "na-nature", 176, 176, 16, 16);
    this.makeAssetTexture("flowerPink", "na-nature", 32, 160, 16, 16);
    this.makeAssetTexture("flowerGold", "na-nature", 0, 160, 16, 16);
    this.makeAssetTexture("flowerWhite", "na-nature", 64, 160, 16, 16);
    this.makeTile("cliff", (ctx) => {
      fillRect(ctx, 0, 0, 16, 16, COLORS.cliff);
      fillRect(ctx, 0, 0, 16, 4, COLORS.cliffLight);
      fillRect(ctx, 1, 11, 14, 4, COLORS.cliffDark);
      fillRect(ctx, 3, 4, 2, 6, "#89533a");
      fillRect(ctx, 10, 5, 2, 7, "#89533a");
    });
    this.makeHouseTexture();
    this.makeHealMachineTexture();
    this.makeTacoDropTexture();
    this.makeStrawberryDropTexture();
    this.makeDiamondDropTexture();
    this.makeMapTestTexture();
    this.makeBlockyStrawberryElephantTexture(BLOCKY_STRAWBERRY_AVATAR_KEY);
    this.makeBlockyDragonCannelloniTexture(BLOCKY_DRAGON_AVATAR_KEY);
    this.makeDragonFireTexture();
    this.makeBrainrotTexture("starterBrainrot", this.playerBrainrot.color, this.playerBrainrot.shade, "back");
    this.makeBerryphantBackTexture("brainrot-Berryphant-back");
    brainrots.forEach((brainrot) => {
      if (!brainrot.backTextureKey) {
        this.makeBrainrotTexture(`brainrot-${brainrot.name}-back`, brainrot.color, brainrot.shade, "back", brainrot);
      }
      if (!brainrot.frontTextureKey) {
        this.makeBrainrotTexture(`brainrot-${brainrot.name}-front`, brainrot.color, brainrot.shade, "front", brainrot);
      }
    });
  }

  createCharacterAnimations() {
    const characterKeys = ["player", "npcPink", "npcBlue", "npcKid", "npcHiker", BLOCKY_STRAWBERRY_AVATAR_KEY, BLOCKY_DRAGON_AVATAR_KEY];
    const directions = {
      up: [0, 1, 2],
      down: [3, 4, 5],
      left: [6, 7, 8],
      right: [9, 10, 11]
    };
    characterKeys.forEach((key) => {
      Object.entries(directions).forEach(([direction, frames]) => {
        const animKey = `${key}-${direction}`;
        if (this.anims.exists(animKey)) return;
        this.anims.create({
          key: animKey,
          frames: frames.map((frame) => ({ key, frame })),
          frameRate: 7,
          repeat: -1
        });
      });
    });
  }

  makeTile(key, draw) {
    const texture = this.textures.createCanvas(key, 16, 16);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;
    draw(ctx);
    texture.refresh();
  }

  makeAssetTexture(key, sourceKey, x, y, w, h) {
    const texture = this.textures.createCanvas(key, w, h);
    const ctx = texture.getContext();
    const source = this.textures.get(sourceKey).getSourceImage();
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(source, x, y, w, h, 0, 0, w, h);
    texture.refresh();
  }

  makeCharacterTexture(key, shirt, skin, hair) {
    const texture = this.textures.createCanvas(key, 16, 24);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 16, 24);
    fillRect(ctx, 5, 1, 7, 3, hair);
    fillRect(ctx, 4, 4, 9, 2, hair);
    fillRect(ctx, 5, 6, 7, 5, skin);
    fillRect(ctx, 4, 10, 9, 8, shirt);
    fillRect(ctx, 3, 12, 3, 4, shirt);
    fillRect(ctx, 11, 12, 3, 4, shirt);
    fillRect(ctx, 5, 18, 3, 5, "#25324a");
    fillRect(ctx, 10, 18, 3, 5, "#25324a");
    fillRect(ctx, 6, 8, 1, 1, "#24344b");
    fillRect(ctx, 10, 8, 1, 1, "#24344b");
    fillRect(ctx, 7, 11, 3, 1, "#9d533f");
    texture.refresh();
  }

  brainrotSpritePalette(name, fallback) {
    const template = brainrots.find((brainrot) => brainrot.name === name);
    return {
      ...fallback,
      main: template?.color ?? fallback.main,
      shade: template?.shade ?? fallback.shade
    };
  }

  makeBlockyStrawberryElephantTexture(key) {
    const frameW = 64;
    const frameH = 72;
    const canvas = document.createElement("canvas");
    canvas.width = frameW * 12;
    canvas.height = frameH;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const directions = ["up", "up", "up", "down", "down", "down", "left", "left", "left", "right", "right", "right"];
    const steps = [-1, 0, 1, -1, 0, 1, -1, 0, 1, -1, 0, 1];
    directions.forEach((direction, frame) => {
      this.drawBlockyStrawberryElephantFrame(ctx, frame * frameW, 0, direction, steps[frame]);
    });
    if (this.textures.exists(key)) this.textures.remove(key);
    this.textures.addSpriteSheet(key, canvas, { frameWidth: frameW, frameHeight: frameH });
  }

  drawBlockyStrawberryElephantFrame(ctx, ox, oy, direction, step) {
    const palette = this.brainrotSpritePalette("Strawberry Elephant", { main: "#e6494f", shade: "#a92f3d" });
    const red = palette.main;
    const redDark = palette.shade;
    const redShade = "#c83a42";
    const redLight = "#ff6b72";
    const earPink = "#ff8a91";
    const leaf = "#95be2e";
    const leafDark = "#6f951d";
    const seed = "#ffd8c4";
    const ink = "#13263a";
    const white = "#f8fbff";
    const walk = step === 0 ? 0 : step * 2;
    const trunkSwing = step * 2;

    const rect = (x, y, w, h, color) => fillRect(ctx, ox + x, oy + y, w, h, color);
    const seedDots = [
      [23, 23], [31, 24], [39, 23], [19, 31], [28, 33], [44, 33],
      [24, 42], [36, 43], [48, 43], [21, 52], [32, 54], [43, 53]
    ];

    rect(10, 60, 46, 8, "rgba(25, 35, 46, 0.18)");
    if (direction === "left" || direction === "right") {
      const flip = direction === "left" ? -1 : 1;
      const cx = direction === "left" ? 30 : 34;
	      rect(cx - 22, 25, 43, 30, redDark);
	      rect(cx - 19, 20, 45, 36, red);
	      rect(cx - 13, 17, 31, 12, redLight);
	      if (direction === "right") {
	        rect(cx - 27, 36, 10, 5, redDark);
	        rect(cx - 31, 38, 6, 4, redShade);
	      } else {
	        rect(cx + 18, 36, 10, 5, redDark);
	        rect(cx + 27, 38, 6, 4, redShade);
	      }
	      rect(cx + 17 * flip, 24, 13 * flip, 22, redShade);
	      rect(cx + 19 * flip, 27, 9 * flip, 17, earPink);
      rect(cx + 23 * flip, 30 + trunkSwing, 9 * flip, 25, red);
      rect(cx + 25 * flip, 51 + trunkSwing, 11 * flip, 8, redDark);
      rect(cx + 18 * flip, 39 + trunkSwing, 5 * flip, 12, white);
      rect(cx - 16, 47 + walk, 9, 17, redDark);
      rect(cx + 10, 47 - walk, 9, 17, redShade);
      rect(cx - 17, 62 + walk, 12, 5, red);
      rect(cx + 9, 62 - walk, 12, 5, red);
      rect(cx + 12 * flip, 29, 6 * flip, 6, ink);
      rect(cx + 14 * flip, 30, 2 * flip, 2, white);
      rect(cx - 22, 13, 42, 10, leaf);
      rect(cx - 16, 7, 11, 11, leaf);
      rect(cx + 5, 8, 11, 11, leaf);
      rect(cx - 3, 2, 10, 14, leafDark);
      seedDots.forEach(([x, y], index) => {
        const localX = cx + (x - 34) * (flip === 1 ? 1 : -1);
        if (index % 2 === 0 || y < 52) rect(localX, y, 2, 2, seed);
      });
      return;
    }

    const back = direction === "up";
    rect(15, 25, 34, 31, redDark);
    rect(14, 19, 36, 37, red);
    rect(7 - walk, 22, 17, 27, redShade);
    rect(41 + walk, 22, 17, 27, redShade);
    rect(10 - walk, 25, 13, 22, earPink);
    rect(42 + walk, 25, 13, 22, earPink);
    rect(18, 16, 28, 12, redLight);
    rect(13, 12, 38, 11, leaf);
    rect(17, 6, 11, 12, leaf);
    rect(36, 7, 11, 12, leaf);
    rect(27, 1, 10, 15, leafDark);
    rect(17, 47 + walk, 10, 17, redDark);
    rect(38, 47 - walk, 10, 17, redShade);
    rect(16, 62 + walk, 14, 5, red);
    rect(36, 62 - walk, 14, 5, red);
    if (!back) {
      rect(22, 30, 7, 7, ink);
      rect(24, 31, 2, 2, white);
      rect(36, 30, 7, 7, ink);
      rect(38, 31, 2, 2, white);
      rect(21, 47, 5, 13, white);
      rect(39, 47, 5, 13, white);
      rect(28 + trunkSwing, 37, 9, 22, redDark);
      rect(27 + trunkSwing, 55, 11, 8, red);
    } else {
      rect(20, 27, 25, 18, redShade);
      rect(28 - trunkSwing, 42, 9, 16, redDark);
    }
    seedDots.forEach(([x, y]) => rect(x, y, 2, 2, seed));
  }

  makeBlockyDragonCannelloniTexture(key) {
    const frameW = 112;
    const frameH = 96;
    const canvas = document.createElement("canvas");
    canvas.width = frameW * 12;
    canvas.height = frameH;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const directions = ["up", "up", "up", "down", "down", "down", "left", "left", "left", "right", "right", "right"];
    const steps = [-1, 0, 1, -1, 0, 1, -1, 0, 1, -1, 0, 1];
    directions.forEach((direction, frame) => {
      this.drawBlockyDragonCannelloniFrame(ctx, frame * frameW, 0, direction, steps[frame]);
    });
    if (this.textures.exists(key)) this.textures.remove(key);
    this.textures.addSpriteSheet(key, canvas, { frameWidth: frameW, frameHeight: frameH });
  }

  drawBlockyDragonCannelloniFrame(ctx, ox, oy, direction, step) {
    const palette = this.brainrotSpritePalette("Dragon Cannelloni", { main: "#e6b941", shade: "#8f5a25" });
    const dragon = palette.main;
    const dragonDark = palette.shade;
    const dragonLight = "#f7d977";
    const belly = "#f3c65d";
    const sauce = COLORS.accent;
    const sauceDark = "#aa3b34";
    const wing = "#d95b22";
    const wingShade = "#a83a20";
    const wingBone = "#ffd76c";
    const claw = "#3f2419";
    const cream = COLORS.cream;
    const ink = COLORS.ink;
    const walk = step === 0 ? 0 : step * 2;
    const flap = step === 0 ? 0 : step * 4;
    const jaw = step === 0 ? 0 : 1;
    const rect = (x, y, w, h, color) => fillRect(ctx, ox + x, oy + y, w, h, color);
    const sideRect = (x, y, w, h, color, flip) => {
      const px = flip === -1 ? 112 - x - w : x;
      rect(px, y, w, h, color);
    };
    const scaleLine = (x, y, count, flip = 1) => {
      for (let index = 0; index < count; index += 1) {
        sideRect(x + index * 6, y + (index % 2), 4, 3, dragonLight, flip);
      }
    };

    rect(16, 84, 82, 8, "rgba(28, 32, 40, 0.2)");

    if (direction === "left" || direction === "right") {
      const flip = direction === "left" ? -1 : 1;

      sideRect(5, 69 - walk, 46, 9, dragonDark, flip);
      sideRect(2, 72 - walk, 22, 7, dragon, flip);
      sideRect(0, 75 - walk, 9, 5, dragonLight, flip);

      sideRect(31, 24 + flap, 17, 7, wingBone, flip);
      sideRect(18, 34 + flap, 44, 10, wing, flip);
      sideRect(22, 45 + flap, 32, 10, wingShade, flip);
      sideRect(32, 34 + flap, 4, 32, wingBone, flip);
      sideRect(50, 29 + flap, 4, 26, wingBone, flip);
      sideRect(25, 62 + flap, 29, 3, wingBone, flip);

      sideRect(46, 37, 32, 34, dragonDark, flip);
      sideRect(49, 30, 28, 40, dragon, flip);
      sideRect(55, 28, 17, 8, dragonLight, flip);
      sideRect(55, 44, 13, 22, belly, flip);
      scaleLine(50, 39, 4, flip);
      scaleLine(51, 53, 3, flip);

      sideRect(50, 70 + walk, 12, 19, dragonDark, flip);
      sideRect(48, 86 + walk, 18, 6, dragon, flip);
      sideRect(53, 90 + walk, 5, 4, claw, flip);
      sideRect(68, 69 - walk, 12, 20, dragonDark, flip);
      sideRect(66, 86 - walk, 18, 6, dragon, flip);
      sideRect(76, 90 - walk, 5, 4, claw, flip);

      sideRect(68, 20, 13, 22, dragonDark, flip);
      sideRect(75, 10, 18, 22, dragon, flip);
      sideRect(88, 18, 20, 10, dragonDark, flip);
      sideRect(91, 20, 17, 7 + jaw, sauce, flip);
      sideRect(77, 4, 7, 13, dragonLight, flip);
      sideRect(93, 4, 7, 14, dragonLight, flip);
      sideRect(85, 0, 5, 12, dragonLight, flip);
      sideRect(78, 18, 5, 5, ink, flip);
      sideRect(80, 19, 2, 2, cream, flip);
      sideRect(96, 30, 5, 7, cream, flip);

      sideRect(75, 45 - walk, 10, 7, dragonDark, flip);
      sideRect(82, 50 - walk, 12, 5, dragon, flip);
      sideRect(91, 53 - walk, 4, 4, claw, flip);
      [33, 40, 47, 54, 61].forEach((y) => sideRect(43, y, 7, 5, sauceDark, flip));
      [58, 66, 74].forEach((x, index) => sideRect(x, 26 - index, 5, 5, dragonLight, flip));
      [18, 26, 34, 42].forEach((x, index) => sideRect(x, 66 - index, 5, 4, sauceDark, flip));
      sideRect(89, 16, 9, 3, dragonLight, flip);
      sideRect(92, 25, 8, 2, cream, flip);
      sideRect(82, 14, 3, 3, ink, flip);
      sideRect(60, 45, 5, 3, dragonLight, flip);
      sideRect(59, 53, 6, 3, dragonDark, flip);
      sideRect(59, 61, 5, 3, dragonLight, flip);
      sideRect(24, 40 + flap, 30, 2, "#ff8b38", flip);
      sideRect(25, 50 + flap, 24, 2, "#7f2c1f", flip);
      sideRect(34, 56 + flap, 4, 9, wingBone, flip);
      return;
    }

    const back = direction === "up";
    rect(16 - walk, 24 + flap, 24, 8, wingBone);
    rect(6 - walk, 36 + flap, 39, 11, wing);
    rect(11 - walk, 49 + flap, 30, 10, wingShade);
    rect(30 - walk, 34 + flap, 4, 34, wingBone);
    rect(72 + walk, 24 + flap, 24, 8, wingBone);
    rect(67 + walk, 36 + flap, 39, 11, wing);
    rect(71 + walk, 49 + flap, 30, 10, wingShade);
    rect(78 + walk, 34 + flap, 4, 34, wingBone);
    rect(42, 23, 31, 14, dragonDark);
    rect(36, 36, 41, 38, dragon);
    rect(42, 29, 29, 10, dragonLight);
    rect(45, 41, 24, 3, "rgba(255,255,255,0.28)");
    rect(45, 54, 25, 3, dragonDark);
    rect(48, 43, 17, 25, belly);
    rect(39, 73 + walk, 11, 18, dragonDark);
    rect(66, 73 - walk, 11, 18, dragonDark);
    rect(36, 88 + walk, 17, 6, dragon);
    rect(63, 88 - walk, 17, 6, dragon);
    rect(50, 9, 14, 18, dragon);
    rect(41, 13, 7, 13, dragonLight);
    rect(66, 13, 7, 13, dragonLight);
    rect(53, 2, 7, 14, dragonLight);
    rect(42, 39, 5, 29, sauce);
    rect(68, 39, 5, 29, sauceDark);
    if (back) {
      rect(49, 21, 17, 47, dragonDark);
      rect(53, 24, 10, 41, dragonLight);
      [30, 36, 42, 48, 54, 60].forEach((y, index) => rect(59 + (index % 2) * 3, y, 7, 6, sauceDark));
      rect(42 + walk, 67, 28, 9, dragonDark);
      rect(36 + walk, 74, 21, 8, dragon);
      rect(32 + walk, 77, 10, 5, dragonLight);
      return;
    }
    rect(43, 16, 28, 18, dragon);
    rect(39, 22, 36, 16, dragonDark);
    rect(41, 24, 32, 12, dragon);
    rect(45, 22, 6, 6, ink);
    rect(47, 23, 2, 2, cream);
    rect(64, 22, 6, 6, ink);
    rect(66, 23, 2, 2, cream);
    rect(44, 34, 26, 8 + jaw, sauce);
    rect(43, 41, 5, 8, cream);
    rect(66, 41, 5, 8, cream);
    rect(38, 5, 8, 15, dragonLight);
    rect(69, 5, 8, 15, dragonLight);
    rect(44, 47, 24, 19, belly);
    rect(48, 49, 16, 3, dragonLight);
    rect(48, 57, 16, 3, dragonDark);
    rect(42, 92 + walk, 5, 4, claw);
    rect(69, 92 - walk, 5, 4, claw);
  }

  makeDragonFireTexture() {
    const texture = this.textures.createCanvas(DRAGON_FIRE_KEY, 32, 22);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 32, 22);
    fillRect(ctx, 1, 8, 8, 7, "#ffef9a");
    fillRect(ctx, 6, 5, 13, 12, "#ffb33b");
    fillRect(ctx, 16, 3, 10, 16, "#ff6a2b");
    fillRect(ctx, 24, 7, 7, 8, "#e63b2e");
    fillRect(ctx, 10, 8, 12, 7, "#fff6d8");
    fillRect(ctx, 19, 9, 6, 5, "#ffd65d");
    texture.refresh();
  }

  makeTreeTexture() {
    const texture = this.textures.createCanvas("tree", 40, 56);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 40, 56);
    fillRect(ctx, 17, 35, 8, 18, "#9b613d");
    fillRect(ctx, 14, 46, 14, 7, "#75503d");
    drawPixelOval(ctx, 3, 12, 34, 30, COLORS.treeShadow);
    drawPixelOval(ctx, 5, 5, 30, 30, COLORS.treeTop);
    drawPixelOval(ctx, 14, 1, 20, 22, COLORS.treeTopLight);
    drawPixelOval(ctx, 6, 18, 24, 22, COLORS.treeTop);
    fillRect(ctx, 17, 5, 4, 3, "#b7ed80");
    fillRect(ctx, 26, 13, 3, 2, "#b7ed80");
    texture.refresh();
  }

  makeHouseTexture() {
    const texture = this.textures.createCanvas("house", 112, 96);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 112, 96);
    fillRect(ctx, 18, 38, 76, 48, COLORS.wall);
    fillRect(ctx, 74, 44, 24, 42, COLORS.wallShade);
    fillRect(ctx, 12, 32, 52, 10, COLORS.roofDark);
    for (let i = 0; i < 44; i += 4) {
      fillRect(ctx, 24 + i, 18 + Math.floor(i / 2), 24, 6, COLORS.roof);
    }
    fillRect(ctx, 54, 22, 45, 9, COLORS.roof);
    fillRect(ctx, 55, 31, 45, 7, COLORS.roofDark);
    fillRect(ctx, 24, 47, 14, 14, "#5da9bd");
    fillRect(ctx, 72, 47, 14, 14, "#5da9bd");
    strokeRect(ctx, 24, 47, 14, 14, COLORS.wallShade, 2);
    strokeRect(ctx, 72, 47, 14, 14, COLORS.wallShade, 2);
    fillRect(ctx, 47, 62, 18, 24, "#b56b43");
    fillRect(ctx, 51, 66, 10, 20, "#cf8252");
    fillRect(ctx, 61, 74, 2, 2, "#ffe08a");
    fillRect(ctx, 17, 84, 80, 5, "#9b613d");
    texture.refresh();
  }

  makeFenceTexture() {
    const texture = this.textures.createCanvas("fence", 16, 18);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 16, 18);
    fillRect(ctx, 0, 7, 16, 2, "#838a83");
    fillRect(ctx, 0, 11, 16, 2, "#687068");
    fillRect(ctx, 3, 4, 2, 11, "#d9decf");
    fillRect(ctx, 11, 4, 2, 11, "#d9decf");
    fillRect(ctx, 3, 3, 2, 2, "#f2f6e6");
    fillRect(ctx, 11, 3, 2, 2, "#f2f6e6");
    fillRect(ctx, 4, 14, 1, 1, "#575e57");
    fillRect(ctx, 12, 14, 1, 1, "#575e57");
    texture.refresh();
  }

  makeFenceVerticalTexture() {
    const texture = this.textures.createCanvas("fenceV", 16, 18);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 16, 18);
    fillRect(ctx, 7, 0, 2, 18, "#838a83");
    fillRect(ctx, 11, 0, 2, 18, "#687068");
    fillRect(ctx, 4, 3, 10, 2, "#d9decf");
    fillRect(ctx, 4, 11, 10, 2, "#d9decf");
    fillRect(ctx, 3, 3, 2, 2, "#f2f6e6");
    fillRect(ctx, 3, 11, 2, 2, "#f2f6e6");
    texture.refresh();
  }

  makeRockTexture() {
    const texture = this.textures.createCanvas("rock", 32, 26);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 32, 26);
    drawPixelOval(ctx, 3, 14, 25, 8, "rgba(30, 43, 59, 0.22)");
    fillRect(ctx, 8, 4, 15, 3, "#7b6d66");
    fillRect(ctx, 5, 7, 22, 7, "#6b5b57");
    fillRect(ctx, 3, 13, 25, 7, "#574945");
    fillRect(ctx, 8, 6, 6, 3, "#9b8e84");
    fillRect(ctx, 20, 10, 5, 3, "#453936");
    fillRect(ctx, 5, 18, 19, 3, "#3f3533");
    texture.refresh();
  }

  makeHealMachineTexture() {
    const texture = this.textures.createCanvas("healMachine", 28, 36);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 28, 36);
    fillRect(ctx, 5, 5, 18, 27, "#f7f1de");
    fillRect(ctx, 7, 7, 14, 8, "#74d8cf");
    fillRect(ctx, 6, 18, 16, 9, "#e6575e");
    fillRect(ctx, 12, 16, 4, 13, "#fff6d8");
    fillRect(ctx, 8, 20, 12, 4, "#fff6d8");
    fillRect(ctx, 3, 30, 22, 4, "#56617c");
    strokeRect(ctx, 5, 5, 18, 27, COLORS.panelInk, 2);
    texture.refresh();
  }

  makeTacoDropTexture() {
    const texture = this.textures.createCanvas("tacoDrop", 22, 18);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 22, 18);
    fillRect(ctx, 5, 11, 12, 3, "rgba(38, 38, 38, 0.22)");
    fillRect(ctx, 4, 6, 14, 8, "#f0b83f");
    fillRect(ctx, 5, 5, 12, 3, "#ffd96a");
    fillRect(ctx, 3, 8, 3, 5, "#d98f2d");
    fillRect(ctx, 16, 8, 3, 5, "#d98f2d");
    fillRect(ctx, 7, 7, 3, 2, "#55b85d");
    fillRect(ctx, 12, 7, 4, 2, "#55b85d");
    fillRect(ctx, 8, 10, 2, 2, "#d84a38");
    fillRect(ctx, 13, 10, 2, 2, "#8b4a2f");
    fillRect(ctx, 6, 13, 10, 2, "#c7782f");
    strokeRect(ctx, 4, 6, 14, 8, "#7b4a25", 1);
    texture.refresh();
  }

  makeStrawberryDropTexture() {
    const texture = this.textures.createCanvas("strawberryDrop", 22, 24);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 22, 24);
    fillRect(ctx, 8, 1, 6, 3, "#9acb32");
    fillRect(ctx, 5, 4, 12, 4, "#76a928");
    fillRect(ctx, 3, 8, 16, 10, "#f04b58");
    fillRect(ctx, 5, 18, 12, 4, "#cc3343");
    fillRect(ctx, 7, 22, 8, 2, "#9f2635");
    fillRect(ctx, 6, 10, 2, 2, "#ffe1b6");
    fillRect(ctx, 12, 11, 2, 2, "#ffe1b6");
    fillRect(ctx, 9, 15, 2, 2, "#ffd29a");
    fillRect(ctx, 15, 16, 2, 2, "#ffd29a");
    fillRect(ctx, 4, 14, 2, 2, "#ffd29a");
    strokeRect(ctx, 3, 8, 16, 14, "#8d2433", 1);
    texture.refresh();
  }

  makeDiamondDropTexture() {
    const texture = this.textures.createCanvas("diamondDrop", 24, 24);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 24, 24);
    fillRect(ctx, 10, 1, 4, 2, "#e9fbff");
    fillRect(ctx, 7, 3, 10, 3, "#8eeaff");
    fillRect(ctx, 4, 6, 16, 4, "#34c9f4");
    fillRect(ctx, 6, 10, 12, 4, "#1aa2dc");
    fillRect(ctx, 8, 14, 8, 4, "#1277b9");
    fillRect(ctx, 10, 18, 4, 3, "#0f5e9b");
    fillRect(ctx, 7, 6, 4, 9, "#d9fbff");
    fillRect(ctx, 13, 6, 4, 7, "#6ee4ff");
    strokeRect(ctx, 4, 6, 16, 4, "#095b8f", 1);
    fillRect(ctx, 11, 3, 2, 16, "#ffffff");
    fillRect(ctx, 8, 8, 8, 1, "#ffffff");
    texture.refresh();
  }

  makeMapTestTexture() {
    const texture = this.textures.createCanvas("maptestMap", TOWN_W, TOWN_H);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, TOWN_W, TOWN_H);
    const stamp = (key, x, y, scale = SCALE) => {
      const source = this.textures.get(key).getSourceImage();
      ctx.drawImage(source, x, y, source.width, source.height, x * scale, y * scale, source.width * scale, source.height * scale);
    };
    const tile = (key, x, y, scale = SCALE) => {
      const source = this.textures.get(key).getSourceImage();
      ctx.drawImage(source, x, y, source.width * scale, source.height * scale);
    };
    const fillTiles = (key, x, y, w, h, scale = SCALE) => {
      const source = this.textures.get(key).getSourceImage();
      const tw = source.width * scale;
      const th = source.height * scale;
      for (let yy = y; yy < y + h; yy += th) {
        for (let xx = x; xx < x + w; xx += tw) tile(key, xx, yy, scale);
      }
    };
    const rect = (x, y, w, h, color) => fillRect(ctx, x, y, w, h, color);

    fillTiles("grass", 0, 0, TOWN_W, TOWN_H);
    fillTiles("path", 646, 74, 96, 998);
    fillTiles("path", 112, 454, 1158, 112);
    fillTiles("path", 414, 244, 534, 88);
    fillTiles("path", 444, 728, 666, 92);
    fillTiles("path", 630, 1002, 154, 78);

    fillTiles("water", 548, 532, 306, 174);
    rect(548, 532, 306, 10, "#318dc0");
    rect(548, 696, 306, 10, "#318dc0");
    rect(548, 532, 10, 174, "#318dc0");
    rect(844, 532, 10, 174, "#318dc0");
    tile("pondSmall", 646, 570, 1.5);

    fillTiles("cliff", 0, 0, TOWN_W, 92);
    fillTiles("cliff", 0, 1036, TOWN_W, 86);
    fillTiles("cliff", 0, 0, 66, TOWN_H);
    fillTiles("cliff", 1336, 0, 66, TOWN_H);

    const house = (x, y, roof, wall, accent = "#64aac5") => {
      rect(x + 20, y + 46, 150, 88, wall);
      rect(x + 24, y + 52, 142, 10, "rgba(255,255,255,0.22)");
      rect(x + 46, y + 78, 30, 28, accent);
      rect(x + 116, y + 78, 30, 28, accent);
      strokeRect(ctx, x + 46, y + 78, 30, 28, "#596575", 3);
      strokeRect(ctx, x + 116, y + 78, 30, 28, "#596575", 3);
      rect(x + 82, y + 98, 30, 36, "#a26947");
      rect(x + 104, y + 114, 4, 4, "#ffe08a");
      rect(x + 8, y + 34, 174, 18, "#69405a");
      for (let i = 0; i < 7; i += 1) {
        rect(x + 22 + i * 20, y + 12 + (i % 2) * 3, 30, 25, roof);
        rect(x + 22 + i * 20, y + 34 + (i % 2) * 3, 30, 8, "#8b3c54");
      }
      rect(x + 16, y + 132, 160, 7, "#8b6a40");
    };
    house(206, 302, "#3f8bd5", "#f4d895");
    house(590, 250, "#df5968", "#f1d19b");
    house(930, 438, "#43a565", "#f6dca6");
    house(190, 772, "#dcbc45", "#f4d895");
    house(602, 794, "#7b58b6", "#f1d19b");
    house(1042, 754, "#3e8ccf", "#f5dfa5");

    const drawAssetLine = (key, x, y, count, vertical = false) => {
      const source = this.textures.get(key).getSourceImage();
      for (let i = 0; i < count; i += 1) tile(key, x + (vertical ? 0 : i * source.width * SCALE), y + (vertical ? i * source.height * SCALE : 0));
    };
    drawAssetLine("fence", 122, 512, 6);
    drawAssetLine("fence", 122, 728, 6);
    drawAssetLine("fenceV", 122, 512, 5, true);
    drawAssetLine("fenceV", 390, 512, 5, true);
    drawAssetLine("fence", 970, 262, 6);
    drawAssetLine("fence", 970, 390, 6);
    drawAssetLine("fenceV", 970, 262, 3, true);
    drawAssetLine("fenceV", 1220, 262, 3, true);

    MAPTEST_TALL_GRASS_RECTS.forEach(([gx, gy, gw, gh]) => fillTiles("tallGrass", gx, gy, gw, gh));
    [
      [108, 120], [168, 120], [228, 120], [288, 120], [348, 120],
      [1000, 116], [1060, 116], [1120, 116], [1180, 116], [1240, 116],
      [96, 920], [156, 920], [216, 920], [276, 920],
      [938, 936], [998, 936], [1058, 936], [1118, 936]
    ].forEach(([x, y], index) => {
      tile("tree", x, y, index > 4 && index < 10 ? 2.8 : 2.5);
    });
    [[470, 390], [515, 408], [880, 350], [902, 388], [480, 860], [895, 860], [1240, 508]].forEach(([x, y]) => tile("rock", x, y, 1.1));
    [[416, 382], [452, 382], [918, 628], [954, 628], [990, 628], [510, 718], [548, 718], [1110, 918]].forEach(([x, y], index) => {
      tile(index % 3 === 0 ? "flowerPink" : index % 3 === 1 ? "flowerGold" : "flowerWhite", x, y, 2.4);
    });
    for (let y = 1016; y <= 1064; y += 12) rect(612, y, 178, 5, "#b8b09b");
    texture.refresh();
  }


  makeFlowerTexture(key, color) {
    const texture = this.textures.createCanvas(key, 10, 10);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 10, 10);
    fillRect(ctx, 5, 4, 1, 5, "#3f9653");
    fillRect(ctx, 4, 6, 3, 1, "#3f9653");
    fillRect(ctx, 4, 1, 3, 3, color);
    fillRect(ctx, 5, 2, 1, 1, COLORS.cream);
    texture.refresh();
  }

  makeBrainrotTexture(key, main, shade, facing, meta = {}) {
    const texture = this.textures.createCanvas(key, 72, 72);
    const ctx = texture.getContext();
    const accent = meta.accent ?? COLORS.gold;
    const dark = meta.dark ?? COLORS.ink;
    const isFront = facing === "front";
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 72, 72);
    drawPixelOval(ctx, 8, 46, 54, 12, "rgba(30, 43, 59, 0.2)");
    drawPixelOval(ctx, 15, 16, 42, 40, main);
    fillRect(ctx, 21, 12, 11, 10, main);
    fillRect(ctx, 39, 13, 9, 9, main);
    fillRect(ctx, 17, 45, 11, 11, shade);
    fillRect(ctx, 45, 45, 11, 11, shade);
    fillRect(ctx, 16, 26, 8, 4, shade);
    fillRect(ctx, 49, 27, 8, 4, shade);
    if (isFront) {
      fillRect(ctx, 27, 31, 5, 5, COLORS.ink);
      fillRect(ctx, 43, 31, 5, 5, COLORS.ink);
      fillRect(ctx, 28, 32, 2, 2, COLORS.cream);
      fillRect(ctx, 44, 32, 2, 2, COLORS.cream);
      fillRect(ctx, 34, 43, 8, 3, shade);
      fillRect(ctx, 28, 20, 19, 4, "rgba(255,255,255,0.28)");
    } else {
      fillRect(ctx, 25, 20, 24, 6, "rgba(255,255,255,0.25)");
      fillRect(ctx, 31, 33, 14, 5, shade);
    }

    switch (meta.spriteKind) {
      case "woodDrum":
        fillRect(ctx, 20, 14, 32, 42, main);
        fillRect(ctx, 17, 16, 38, 8, accent);
        fillRect(ctx, 18, 48, 36, 8, accent);
        fillRect(ctx, 28, 7, 6, 18, shade);
        fillRect(ctx, 41, 7, 6, 18, shade);
        fillRect(ctx, 24, 26, 5, 18, shade);
        fillRect(ctx, 45, 26, 5, 18, shade);
        if (isFront) fillRect(ctx, 31, 32, 11, 5, COLORS.ink);
        break;
      case "ballerinaCup":
        fillRect(ctx, 23, 18, 28, 27, main);
        fillRect(ctx, 28, 12, 18, 8, "#fff8e7");
        fillRect(ctx, 19, 44, 36, 7, accent);
        fillRect(ctx, 27, 50, 6, 14, shade);
        fillRect(ctx, 41, 50, 6, 14, shade);
        fillRect(ctx, 18, 29, 7, 5, accent);
        fillRect(ctx, 50, 29, 7, 5, accent);
        break;
      case "monkeyBanana":
        drawPixelOval(ctx, 15, 18, 40, 34, main);
        fillRect(ctx, 9, 25, 11, 13, shade);
        fillRect(ctx, 52, 25, 11, 13, shade);
        fillRect(ctx, 21, 45, 8, 15, shade);
        fillRect(ctx, 44, 45, 8, 15, shade);
        fillRect(ctx, 42, 9, 17, 8, accent);
        fillRect(ctx, 52, 13, 9, 15, accent);
        break;
      case "gooseBomb":
        drawPixelOval(ctx, 12, 24, 42, 28, main);
        fillRect(ctx, 48, 20, 13, 9, accent);
        fillRect(ctx, 51, 27, 9, 6, "#de9145");
        fillRect(ctx, 20, 48, 6, 13, shade);
        fillRect(ctx, 39, 48, 6, 13, shade);
        fillRect(ctx, 8, 19, 13, 9, dark);
        fillRect(ctx, 8, 15, 5, 5, "#e6575e");
        break;
      case "elegantCoffee":
        fillRect(ctx, 22, 17, 29, 36, main);
        fillRect(ctx, 18, 20, 37, 8, accent);
        fillRect(ctx, 20, 52, 35, 5, accent);
        fillRect(ctx, 50, 27, 9, 14, shade);
        fillRect(ctx, 29, 7, 18, 9, "#fff8e7");
        fillRect(ctx, 25, 8, 25, 5, "rgba(255,255,255,0.35)");
        break;
      case "frogDoll":
        drawPixelOval(ctx, 15, 20, 42, 31, main);
        drawPixelOval(ctx, 16, 13, 13, 13, main);
        drawPixelOval(ctx, 43, 13, 13, 13, main);
        fillRect(ctx, 18, 49, 10, 11, shade);
        fillRect(ctx, 45, 49, 10, 11, shade);
        fillRect(ctx, 31, 40, 12, 4, accent);
        break;
      case "fridgeCamel":
        fillRect(ctx, 24, 13, 26, 42, main);
        fillRect(ctx, 27, 17, 20, 17, "#eef8fb");
        fillRect(ctx, 27, 37, 20, 13, "#c3dde6");
        fillRect(ctx, 18, 28, 10, 15, accent);
        fillRect(ctx, 46, 28, 12, 15, accent);
        fillRect(ctx, 16, 50, 9, 10, shade);
        fillRect(ctx, 49, 50, 9, 10, shade);
        break;
      case "trippiTroppi":
        drawPixelOval(ctx, 13, 24, 45, 25, main);
        fillRect(ctx, 51, 30, 11, 8, accent);
        fillRect(ctx, 12, 31, 10, 7, shade);
        fillRect(ctx, 29, 48, 5, 10, shade);
        fillRect(ctx, 40, 48, 5, 10, shade);
        fillRect(ctx, 23, 18, 18, 5, accent);
        break;
      case "sahurStick":
        fillRect(ctx, 29, 10, 14, 48, main);
        fillRect(ctx, 24, 13, 24, 8, accent);
        fillRect(ctx, 24, 47, 24, 8, accent);
        fillRect(ctx, 18, 27, 10, 5, shade);
        fillRect(ctx, 44, 27, 10, 5, shade);
        fillRect(ctx, 26, 57, 20, 5, dark);
        break;
      case "blueberryOctopus":
        drawPixelOval(ctx, 14, 15, 44, 36, main);
        [12, 21, 30, 39, 48].forEach((x, index) => {
          fillRect(ctx, x, 47 + (index % 2) * 3, 7, 13, shade);
          fillRect(ctx, x - 2, 57 + (index % 2) * 3, 10, 4, main);
        });
        fillRect(ctx, 23, 15, 7, 5, accent);
        fillRect(ctx, 42, 18, 7, 5, accent);
        break;
      case "orangutanPineapple":
        drawPixelOval(ctx, 15, 20, 42, 34, main);
        fillRect(ctx, 24, 8, 24, 7, accent);
        fillRect(ctx, 30, 3, 5, 12, "#69a84c");
        fillRect(ctx, 39, 3, 5, 12, "#69a84c");
        fillRect(ctx, 12, 34, 11, 18, shade);
        fillRect(ctx, 50, 34, 11, 18, shade);
        fillRect(ctx, 27, 42, 18, 5, accent);
        break;
      case "gangsterFoot":
        fillRect(ctx, 25, 10, 18, 42, main);
        fillRect(ctx, 20, 46, 34, 11, main);
        fillRect(ctx, 27, 20, 18, 5, dark);
        fillRect(ctx, 31, 26, 10, 3, accent);
        fillRect(ctx, 18, 53, 38, 6, dark);
        fillRect(ctx, 44, 12, 8, 8, shade);
        break;
      case "kiwiBird":
        drawPixelOval(ctx, 17, 18, 37, 38, main);
        fillRect(ctx, 49, 32, 13, 5, accent);
        fillRect(ctx, 22, 22, 18, 20, "#7b542f");
        fillRect(ctx, 25, 25, 12, 14, "#d8e68b");
        fillRect(ctx, 25, 52, 5, 9, shade);
        fillRect(ctx, 42, 52, 5, 9, shade);
        break;
      case "burbaloni":
        drawPixelOval(ctx, 12, 24, 46, 28, main);
        fillRect(ctx, 19, 18, 9, 10, shade);
        fillRect(ctx, 45, 18, 9, 10, shade);
        fillRect(ctx, 14, 50, 10, 9, shade);
        fillRect(ctx, 46, 50, 10, 9, shade);
        drawPixelOval(ctx, 49, 13, 11, 11, accent);
        drawPixelOval(ctx, 56, 7, 7, 7, accent);
        break;
      case "saturnCow":
        drawPixelOval(ctx, 14, 21, 44, 32, main);
        fillRect(ctx, 16, 17, 12, 10, shade);
        fillRect(ctx, 42, 34, 11, 9, shade);
        fillRect(ctx, 8, 34, 56, 5, accent);
        fillRect(ctx, 11, 31, 50, 3, "#f0d98a");
        fillRect(ctx, 20, 49, 7, 13, shade);
        fillRect(ctx, 45, 49, 7, 13, shade);
        break;
      case "garamaMandundung":
        drawPixelOval(ctx, 10, 24, 28, 29, main);
        drawPixelOval(ctx, 34, 20, 28, 33, shade);
        fillRect(ctx, 20, 12, 11, 12, accent);
        fillRect(ctx, 42, 8, 12, 14, accent);
        fillRect(ctx, 18, 49, 8, 12, dark);
        fillRect(ctx, 45, 49, 8, 12, dark);
        fillRect(ctx, 30, 39, 13, 5, "#f2d08a");
        break;
      default:
        break;
    }

    if (isFront && meta.spriteKind) {
      fillRect(ctx, 27, 31, 5, 5, COLORS.ink);
      fillRect(ctx, 43, 31, 5, 5, COLORS.ink);
      fillRect(ctx, 28, 32, 2, 2, COLORS.cream);
      fillRect(ctx, 44, 32, 2, 2, COLORS.cream);
    }
    texture.refresh();
  }

  makeBerryphantFrontTexture(key) {
    const texture = this.textures.createCanvas(key, 104, 104);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 104, 104);

    const red = "#c7333a";
    const redMid = "#df4244";
    const redLight = "#ef5b5b";
    const redDark = "#8f2430";
    const redDeep = "#6f1f2b";
    const pink = "#ff6d73";
    const pinkLight = "#ff8d8d";
    const leaf = "#a8bf3e";
    const leafLight = "#c5d65a";
    const leafDark = "#648b32";
    const seed = "#ffd88a";
    const seedDark = "#9f4a36";
    const white = "#fff9ef";
    const ink = "#111827";

    const seedAt = (x, y) => {
      fillRect(ctx, x, y, 2, 3, seed);
      fillRect(ctx, x + 1, y + 2, 1, 1, seedDark);
    };

    drawPixelOval(ctx, 14, 88, 76, 10, "rgba(22, 28, 36, 0.22)");

    fillRect(ctx, 30, 24, 38, 9, redDark);
    fillRect(ctx, 23, 30, 50, 12, red);
    fillRect(ctx, 22, 40, 53, 18, redMid);
    fillRect(ctx, 25, 58, 45, 17, red);
    fillRect(ctx, 31, 75, 31, 9, redDark);
    fillRect(ctx, 69, 39, 7, 28, redDark);
    fillRect(ctx, 26, 33, 9, 36, "#b52d36");
    fillRect(ctx, 56, 31, 14, 42, redLight);

    fillRect(ctx, 65, 32, 22, 8, pink);
    fillRect(ctx, 70, 39, 19, 12, pink);
    fillRect(ctx, 73, 51, 17, 14, pinkLight);
    fillRect(ctx, 71, 65, 13, 9, pink);
    fillRect(ctx, 86, 46, 6, 16, "#e45461");
    fillRect(ctx, 78, 35, 9, 4, "#ff9a98");

    fillRect(ctx, 20, 52, 13, 17, redDark);
    fillRect(ctx, 17, 65, 12, 17, red);
    fillRect(ctx, 15, 80, 11, 12, redDark);
    fillRect(ctx, 18, 92, 13, 5, redDeep);
    fillRect(ctx, 28, 69, 9, 19, "#b92e36");
    fillRect(ctx, 52, 66, 12, 21, redDark);
    fillRect(ctx, 63, 70, 9, 17, "#a92a34");
    fillRect(ctx, 52, 87, 20, 6, redDeep);
    fillRect(ctx, 74, 70, 8, 17, redDark);
    fillRect(ctx, 76, 86, 13, 5, redDeep);

    fillRect(ctx, 11, 54, 10, 28, white);
    fillRect(ctx, 8, 75, 10, 12, white);
    fillRect(ctx, 7, 86, 10, 6, "#f0e7dc");
    fillRect(ctx, 68, 61, 9, 25, white);
    fillRect(ctx, 74, 81, 11, 9, white);
    fillRect(ctx, 82, 87, 7, 5, "#f0e7dc");

    fillRect(ctx, 27, 38, 10, 11, ink);
    fillRect(ctx, 48, 38, 10, 11, ink);
    fillRect(ctx, 30, 40, 3, 3, white);
    fillRect(ctx, 52, 40, 3, 3, white);
    fillRect(ctx, 34, 54, 10, 4, redDeep);
    fillRect(ctx, 48, 56, 8, 4, redDeep);

    [
      [24, 34], [40, 32], [58, 35], [29, 45], [44, 45], [61, 47],
      [26, 57], [38, 60], [55, 59], [31, 70], [48, 71], [60, 76],
      [19, 58], [20, 71], [53, 83], [68, 74], [76, 77], [72, 43],
      [80, 51], [78, 62], [83, 58]
    ].forEach(([x, y]) => seedAt(x, y));

    fillRect(ctx, 37, 5, 15, 9, leafDark);
    fillRect(ctx, 39, 0, 11, 15, leaf);
    fillRect(ctx, 28, 13, 36, 8, leafLight);
    fillRect(ctx, 15, 17, 25, 8, leaf);
    fillRect(ctx, 7, 14, 16, 7, leafLight);
    fillRect(ctx, 0, 19, 15, 5, leaf);
    fillRect(ctx, 57, 14, 24, 8, leaf);
    fillRect(ctx, 78, 16, 13, 5, leafLight);
    fillRect(ctx, 86, 9, 8, 13, leaf);
    fillRect(ctx, 24, 22, 46, 9, leafDark);
    fillRect(ctx, 33, 19, 43, 9, leaf);
    fillRect(ctx, 60, 25, 19, 12, leafLight);
    fillRect(ctx, 66, 21, 29, 4, "#d63e67");
    fillRect(ctx, 86, 20, 9, 2, "#ff6d80");

    texture.refresh();
  }

  makeBerryphantBackTexture(key) {
    const texture = this.textures.createCanvas(key, 104, 104);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 104, 104);

    const red = "#c7333a";
    const redMid = "#df4244";
    const redLight = "#ef5b5b";
    const redDark = "#8f2430";
    const redDeep = "#6f1f2b";
    const pink = "#ff6d73";
    const pinkLight = "#ff8d8d";
    const leaf = "#a8bf3e";
    const leafLight = "#c5d65a";
    const leafDark = "#648b32";
    const seed = "#ffd88a";
    const seedDark = "#9f4a36";
    const white = "#fff9ef";

    const seedAt = (x, y) => {
      fillRect(ctx, x, y, 2, 3, seed);
      fillRect(ctx, x + 1, y + 2, 1, 1, seedDark);
    };

    drawPixelOval(ctx, 13, 88, 78, 10, "rgba(22, 28, 36, 0.22)");

    fillRect(ctx, 29, 24, 43, 9, redDark);
    fillRect(ctx, 23, 31, 54, 15, red);
    fillRect(ctx, 22, 45, 57, 22, redMid);
    fillRect(ctx, 27, 66, 47, 13, red);
    fillRect(ctx, 34, 78, 31, 8, redDark);
    fillRect(ctx, 25, 35, 10, 38, "#b52d36");
    fillRect(ctx, 61, 33, 16, 42, redLight);

    fillRect(ctx, 68, 35, 20, 9, pink);
    fillRect(ctx, 72, 44, 18, 16, pinkLight);
    fillRect(ctx, 70, 60, 14, 12, pink);
    fillRect(ctx, 85, 48, 6, 17, "#e45461");

    fillRect(ctx, 20, 65, 12, 23, redDark);
    fillRect(ctx, 18, 87, 17, 6, redDeep);
    fillRect(ctx, 52, 67, 14, 22, redDark);
    fillRect(ctx, 49, 89, 21, 6, redDeep);
    fillRect(ctx, 70, 70, 9, 18, redDark);
    fillRect(ctx, 74, 87, 14, 5, redDeep);

    fillRect(ctx, 12, 58, 10, 27, white);
    fillRect(ctx, 8, 79, 10, 11, white);
    fillRect(ctx, 68, 62, 9, 24, white);
    fillRect(ctx, 74, 82, 11, 9, white);

    fillRect(ctx, 45, 44, 11, 5, redDeep);
    fillRect(ctx, 51, 48, 5, 9, redDeep);
    fillRect(ctx, 29, 33, 4, 38, "rgba(255,255,255,0.12)");
    fillRect(ctx, 62, 35, 5, 35, "rgba(255,255,255,0.12)");

    [
      [28, 37], [43, 34], [61, 38], [31, 49], [48, 48], [65, 50],
      [25, 60], [40, 63], [58, 61], [34, 73], [50, 74], [64, 76],
      [22, 72], [55, 84], [72, 78], [79, 52], [78, 65]
    ].forEach(([x, y]) => seedAt(x, y));

    fillRect(ctx, 38, 5, 15, 9, leafDark);
    fillRect(ctx, 40, 0, 11, 15, leaf);
    fillRect(ctx, 29, 13, 36, 8, leafLight);
    fillRect(ctx, 15, 17, 25, 8, leaf);
    fillRect(ctx, 7, 14, 16, 7, leafLight);
    fillRect(ctx, 0, 19, 15, 5, leaf);
    fillRect(ctx, 58, 14, 24, 8, leaf);
    fillRect(ctx, 79, 16, 13, 5, leafLight);
    fillRect(ctx, 87, 9, 8, 13, leaf);
    fillRect(ctx, 25, 22, 47, 9, leafDark);
    fillRect(ctx, 34, 19, 43, 9, leaf);
    fillRect(ctx, 58, 25, 22, 12, leafLight);
    fillRect(ctx, 66, 21, 29, 4, "#d63e67");
    fillRect(ctx, 86, 20, 9, 2, "#ff6d80");

    texture.refresh();
  }

  createWorld() {
    this.worldLayer = this.add.container(0, 0);
    this.mapImage = this.add.image(0, 0, "townMap").setOrigin(0);
    this.worldLayer.add(this.mapImage);
    this.mapCollisionCanvas = document.createElement("canvas");
    this.mapCollisionCtx = this.mapCollisionCanvas.getContext("2d", { willReadFrequently: true });
    this.setMapZone("overworld");
    this.createMapNpcs();
    this.createInteriorLayer();
  }

  mapConfigFor(mapKey = this.currentMapKey) {
    if (mapKey === "maptest") {
      return {
        key: "maptest",
        texture: "maptestMap",
        blockers: MAPTEST_BLOCKERS,
        grass: MAPTEST_TALL_GRASS_RECTS,
        doors: MAPTEST_DOORS,
        title: "Map Test"
      };
    }
    if (mapKey === "southVillage") {
      return {
        key: "southVillage",
        texture: "southVillageMap",
        blockers: SOUTH_VILLAGE_BLOCKERS,
        grass: SOUTH_VILLAGE_SPAWN_RECTS,
        doors: SOUTH_VILLAGE_DOORS,
        title: "Zona Sur"
      };
    }
    return {
      key: "overworld",
      texture: "townMap",
      blockers: MAP_BLOCKERS,
      grass: MAP_TALL_GRASS_RECTS,
      doors: MAP_DOORS,
      title: "Brainworld Town"
    };
  }

  setMapZone(mapKey, options = {}) {
    const config = this.mapConfigFor(mapKey);
    const mapSource = this.textures.get(config.texture).getSourceImage();
    this.currentMapKey = config.key;
    this.locationMode = config.key;
    this.mapWorldW = mapSource.width;
    this.mapWorldH = mapSource.height;
    this.mapImage?.setTexture(config.texture);
    this.mapCollisionCanvas.width = this.mapWorldW;
    this.mapCollisionCanvas.height = this.mapWorldH;
    this.mapCollisionCtx = this.mapCollisionCanvas.getContext("2d", { willReadFrequently: true });
    this.mapCollisionCtx.drawImage(mapSource, 0, 0);
    this.blockedRects = config.blockers.map(([x, y, w, h]) => this.makeCollisionRect(x, y, w, h));
    this.wildGrassRects = config.grass.map(([x, y, w, h]) => new Phaser.Geom.Rectangle(x, y, w, h));
    this.doors = config.doors.map((door) => ({
      ...door,
      rect: new Phaser.Geom.Rectangle(door.x, door.y, door.w, door.h)
    }));
    this.mapNpcs?.forEach((npc) => {
	      const visible = npc.mapKey === config.key && !npc.hiddenUntilSpawn;
      npc.sprite?.setVisible(visible);
      if (!visible) npc.wanderTarget = null;
    });
    if (this.player && options.playerX !== undefined && options.playerY !== undefined) {
      this.player.setPosition(options.playerX, options.playerY);
      this.playerDirection = options.direction ?? this.playerDirection;
      this.player.setFrame(this.playerIdleFrames[this.playerDirection] ?? this.playerIdleFrames.down);
    }
    if (this.cameras?.main) {
      this.cameras.main.setBounds(0, 0, this.mapWorldW, this.mapWorldH);
      if (this.player) this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    }
    this.lastStepTile = "";
    this.updateDoorPrompt?.();
  }

  isMapMode() {
    return this.locationMode === "overworld" || this.locationMode === "southVillage" || this.locationMode === "maptest";
  }

  makeCollisionRect(x, y, w, h) {
    const insetX = w > 180 ? 28 : w > 90 ? 18 : 3;
    const insetY = h > 180 ? 28 : h > 90 ? 18 : 3;
    return new Phaser.Geom.Rectangle(x + insetX, y + insetY, Math.max(6, w - insetX * 2), Math.max(6, h - insetY * 2));
  }

  createMapNpcs() {
    this.mapNpcs = [
      { ...STRAWBERRY_NPC },
      { ...DRAGON_NPC },
      ...this.rollNpcSpawns(),
      ...SOUTH_VILLAGE_NPCS.map((npc) => ({ ...npc }))
    ];
    this.mapNpcs.forEach((npcData) => {
      npcData.trainer = !npcData.admin && !npcData.noRandomTrainer && Math.random() < 0.45;
      if (npcData.trainer) npcData.brainrots = this.makeNpcBrainrotTeam();
      const npc = this.add.sprite(npcData.x, npcData.y, npcData.key, npcData.frame).setScale(npcData.scale ?? 0.86);
      npc.setDepth(Math.floor(npcData.y));
      npc.setVisible(npcData.mapKey === this.currentMapKey && !npcData.hiddenUntilSpawn);
      npc.setInteractive({ useHandCursor: true });
	      npc.on("pointerdown", () => this.talkToNpc(npcData));
	      npcData.sprite = npc;
	      npcData.homeX = npcData.x;
	      npcData.homeY = npcData.y;
	      npcData.wanderTimer = (npcData.admin || npcData.noWander) ? Number.POSITIVE_INFINITY : (npcData.wanderTimerMs ?? Phaser.Math.Between(700, 2100));
	      npcData.wanderTarget = null;
	      npcData.direction = "down";
	      this.setNpcPosition(npcData, npcData.x, npcData.y);
	      if (npcData.breathesFire) this.ensureDragonFireSprite(npcData);
	      this.worldLayer.add(npc);
	    });
	  }

  makeNpcBrainrotTeam() {
    return Array.from({ length: 3 }, () => {
      const template = this.pickWeightedBrainrot(brainrots, Phaser.Math.Between(1, 4));
      const variant = Phaser.Utils.Array.GetRandom(BRAINROT_VARIANTS).key;
      const member = this.cloneBrainrot(template, variant);
      const randomTraits = this.rollNpcTraits();
      if (randomTraits.length) {
        member.traits = randomTraits;
        const baseLevel = member.rolledLevel ?? member.level;
        const traitLevel = Phaser.Math.Clamp(baseLevel * this.traitLevelMultiplier(member.traits), 1, MAX_TRAIT_LEVEL);
        member.level = traitLevel;
        member.maxHp = (member.baseMaxHp ?? template.maxHp) + Math.floor(traitLevel * 3);
        member.hp = member.maxHp;
        member.brainExp = 0;
        member.brainExpToNext = expToNextLevel(traitLevel);
      }
      return member;
    });
  }

  rollNpcTraits() {
    const traits = [];
    Object.values(BRAINROT_TRAITS).forEach((trait) => {
      if (Math.random() < 0.18) traits.push({ key: trait.key, label: trait.label, emoji: trait.emoji });
    });
    if (!traits.length && Math.random() < 0.24) {
      const trait = Phaser.Utils.Array.GetRandom(Object.values(BRAINROT_TRAITS));
      traits.push({ key: trait.key, label: trait.label, emoji: trait.emoji });
    }
    return traits;
  }

	  setNpcPosition(npcData, x, y) {
	    npcData.x = x;
	    npcData.y = y;
	    npcData.sprite?.setPosition(x, y);
	    npcData.sprite?.setDepth(Math.floor(y));
	    npcData.rect = new Phaser.Geom.Rectangle(x - 26, y - 40, 52, 76);
	    npcData.bodyRect = new Phaser.Geom.Rectangle(x - 16, y + 2, 32, 24);
	  }

	  updateNpcWander(deltaMs) {
	    if (!this.isMapMode() || !this.mapNpcs) return;
	    const dt = deltaMs / 1000;
	    this.mapNpcs.forEach((npc) => {
	      if (npc.admin || npc.noWander || !npc.sprite || npc.mapKey !== this.currentMapKey) return;
	      if (npc.wanderTarget) {
	        const dx = npc.wanderTarget.x - npc.x;
	        const dy = npc.wanderTarget.y - npc.y;
	        const distance = Math.hypot(dx, dy);
	        if (distance < 2) {
	          this.setNpcPosition(npc, npc.wanderTarget.x, npc.wanderTarget.y);
	          npc.wanderTarget = null;
	          npc.wanderTimer = Phaser.Math.Between(900, 2600);
	          npc.sprite.anims.stop();
		          npc.sprite.setFrame(this.playerIdleFrames[this.visualNpcDirection(npc.direction, npc)] ?? 4);
	          return;
	        }
		        const step = Math.min(distance, (npc.wanderSpeed ?? 42) * dt);
	        npc.direction = this.directionFromDelta(dx, dy, npc.direction);
	        const nextX = npc.x + (dx / distance) * step;
	        const nextY = npc.y + (dy / distance) * step;
	        if (!this.npcCanStand(npc, nextX, nextY)) {
	          npc.wanderTarget = null;
	          npc.wanderTimer = Phaser.Math.Between(900, 2200);
	          npc.sprite.anims.stop();
		          npc.sprite.setFrame(this.playerIdleFrames[this.visualNpcDirection(npc.direction, npc)] ?? 4);
	          return;
	        }
	        this.setNpcPosition(npc, nextX, nextY);
		        npc.sprite.anims.play(`${npc.key}-${this.visualNpcDirection(npc.direction, npc)}`, true);
	        return;
	      }
	      npc.wanderTimer -= deltaMs;
	      if (npc.wanderTimer <= 0) this.tryStartNpcWander(npc);
	    });
	  }

  ensureDragonFireSprite(npc) {
    if (npc.fireSprite) return npc.fireSprite;
    const fire = this.add.image(npc.x, npc.y, DRAGON_FIRE_KEY)
      .setOrigin(0.05, 0.5)
      .setScale(npc.fireScale ?? 1.45)
      .setVisible(false)
      .setDepth(Math.floor(npc.y) + 1);
    this.worldLayer.add(fire);
    npc.fireSprite = fire;
    npc.nextFireAt = this.time.now + Phaser.Math.Between(900, 2200);
    npc.fireUntil = 0;
    return fire;
  }

  dragonFireOffset(direction) {
    return {
      up: { x: 0, y: -32, angle: -90, alpha: 0.45 },
      down: { x: 0, y: -30, angle: 90, alpha: 1 },
      left: { x: -46, y: -28, angle: 180, alpha: 1 },
      right: { x: 46, y: -28, angle: 0, alpha: 1 }
    }[direction] ?? { x: 0, y: -30, angle: 90, alpha: 1 };
  }

  updateDragonFire() {
    if (!this.mapNpcs) return;
    const now = this.time.now;
    this.mapNpcs.forEach((npc) => {
      if (!npc.breathesFire) return;
      const fire = this.ensureDragonFireSprite(npc);
      const active = this.isMapMode()
        && !this.inBattle
        && npc.mapKey === this.currentMapKey
        && !npc.hiddenUntilSpawn
        && npc.sprite?.visible;
      if (!active) {
        fire.setVisible(false);
        return;
      }
      if (now >= (npc.nextFireAt ?? 0)) {
        npc.fireUntil = now + Phaser.Math.Between(360, 620);
        npc.nextFireAt = now + Phaser.Math.Between(1500, 3100);
      }
      if (now >= (npc.fireUntil ?? 0)) {
        fire.setVisible(false);
        return;
      }
      const direction = this.visualNpcDirection(npc.direction ?? "down", npc);
      const offset = this.dragonFireOffset(direction);
      const pulse = 1 + Math.sin(now / 70) * 0.12;
      fire
        .setVisible(true)
        .setPosition(npc.x + offset.x, npc.y + offset.y)
        .setAngle(offset.angle)
        .setAlpha(offset.alpha)
        .setScale((npc.fireScale ?? 1.45) * pulse)
        .setDepth(Math.floor(npc.y) + 2);
    });
  }

	  tryStartNpcWander(npc) {
	    const options = [
	      { direction: "up", x: 0, y: -36 },
	      { direction: "down", x: 0, y: 36 },
	      { direction: "left", x: -36, y: 0 },
	      { direction: "right", x: 36, y: 0 },
	      null
	    ];
	    for (let attempt = 0; attempt < 5; attempt += 1) {
	      const choice = Phaser.Utils.Array.GetRandom(options);
	      if (!choice) {
	        npc.wanderTimer = Phaser.Math.Between(700, 1800);
			        npc.sprite?.setFrame(this.playerIdleFrames[this.visualNpcDirection(npc.direction, npc)] ?? 4);
	        return;
	      }
	      const target = { x: npc.x + choice.x, y: npc.y + choice.y };
		      const radius = npc.wanderRadius ?? 78;
		      if (Math.abs(target.x - npc.homeX) > radius || Math.abs(target.y - npc.homeY) > radius) continue;
	      if (!this.npcCanStand(npc, target.x, target.y)) continue;
	      npc.direction = this.directionFromDelta(choice.x, choice.y, choice.direction);
	      npc.wanderTarget = target;
	      return;
	    }
	    npc.wanderTimer = Phaser.Math.Between(900, 2300);
	  }

	  directionFromDelta(dx, dy, fallback = "down") {
	    if (Math.abs(dx) > Math.abs(dy)) return dx < 0 ? "left" : "right";
	    if (Math.abs(dy) > 0.01) return dy < 0 ? "up" : "down";
	    return fallback;
	  }

  visualNpcDirection(direction) {
    return direction;
  }

	  npcCanStand(npc, x, y) {
	    if (!this.isMapMode()) return false;
	    if (this.npcTerrainBlockedAt(x, y)) return false;
	    if (this.npcBlockedAt(x, y + 16, npc)) return false;
	    if (Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y) < 42) return false;
	    return true;
	  }

  rollNpcSpawns() {
    const placed = [];
    SECONDARY_NPCS.forEach((npcData) => {
      let chosen = null;
      for (let attempt = 0; attempt < 160 && !chosen; attempt += 1) {
        const zone = Phaser.Utils.Array.GetRandom(NPC_SPAWN_ZONES);
        const x = Phaser.Math.Between(zone[0], zone[0] + zone[2]);
        const y = Phaser.Math.Between(zone[1], zone[1] + zone[3]);
        if (this.isNpcSpawnClear(x, y, placed)) chosen = { ...npcData, x, y, mapKey: "overworld" };
      }
      placed.push(chosen ?? { ...npcData, x: 700 + placed.length * 48, y: 800, mapKey: "overworld" });
    });
    return placed;
  }

  isNpcSpawnClear(x, y, placed) {
    if (this.collides(x, y)) return false;
    if (this.wildGrassRects?.some((rect) => Phaser.Geom.Rectangle.Contains(rect, x, y + 20))) return false;
    if (this.doors?.some((door) => Phaser.Geom.Rectangle.Contains(this.expandedRect(door.rect, 88), x, y + 20))) return false;
    if (Phaser.Math.Distance.Between(x, y, 717, 800) < 120) return false;
    return placed.every((npc) => Phaser.Math.Distance.Between(x, y, npc.x, npc.y) > 120);
  }

  createInteriorLayer() {
    this.interiorLayer = this.add.container(0, 0).setVisible(false);
    const backdrop = this.add.rectangle(0, 0, VIEW_W, VIEW_H, 0x050507, 1).setOrigin(0);
    this.interiorImage = this.add.image(VIEW_W / 2, VIEW_H / 2, "interiorBlueHome").setOrigin(0.5);
    this.interiorExitZone = new Phaser.Geom.Rectangle(VIEW_W / 2 - 66, VIEW_H - 76, 132, 64);
    this.interiorLayer.add([backdrop, this.interiorImage]);
  }

  drawCliffs() {
    for (let y = 0; y < WORLD_H; y += 1) {
      for (let x = 0; x < WORLD_W; x += 1) {
        const here = getTile(x, y);
        const below = getTile(x, y + 1);
        if (here !== "water" && below === "water") {
          this.worldLayer.add(
            this.add.image(x * TILE * SCALE, (y + 1) * TILE * SCALE - 7 * SCALE, "cliff").setOrigin(0).setScale(SCALE)
          );
        }
      }
    }
  }

  drawDecorations() {
    const flowers = [
      [3, 4, "flowerWhite"], [4, 5, "flowerWhite"], [5, 6, "flowerPink"],
      [11, 22, "flowerGold"], [13, 22, "flowerWhite"], [15, 22, "flowerWhite"],
      [12, 24, "flowerWhite"], [14, 25, "flowerGold"], [17, 26, "flowerWhite"],
      [24, 4, "flowerWhite"], [28, 5, "flowerGold"], [36, 13, "flowerPink"],
      [38, 16, "flowerWhite"], [34, 27, "flowerGold"], [7, 30, "flowerPink"]
    ];
    flowers.forEach(([x, y, key]) => {
      this.worldLayer.add(
        this.add.image((x * TILE + 4) * SCALE, (y * TILE + 5) * SCALE, key).setOrigin(0).setScale(SCALE)
      );
    });
  }

  drawEntities() {
    entities.forEach((entity) => {
      if (entity.type === "house") {
        this.worldLayer.add(this.add.image(entity.x * TILE * SCALE, entity.y * TILE * SCALE, "house").setOrigin(0).setScale(SCALE));
      }
      if (entity.type === "tree") {
        this.worldLayer.add(this.add.image((entity.x * TILE - 4) * SCALE, (entity.y * TILE - 18) * SCALE, "tree").setOrigin(0).setScale(SCALE));
      }
      if (entity.type === "fence") {
        for (let i = 0; i < entity.length; i += 1) {
          this.worldLayer.add(this.add.image((entity.x + i) * TILE * SCALE, (entity.y * TILE - 2) * SCALE, "fence").setOrigin(0).setScale(SCALE));
        }
      }
      if (entity.type === "fenceH") {
        for (let i = 0; i < entity.length; i += 1) {
          this.worldLayer.add(this.add.image((entity.x + i) * TILE * SCALE, (entity.y * TILE - 2) * SCALE, "fence").setOrigin(0).setScale(SCALE));
        }
      }
      if (entity.type === "fenceV") {
        for (let i = 0; i < entity.length; i += 1) {
          this.worldLayer.add(this.add.image((entity.x * TILE - 1) * SCALE, ((entity.y + i) * TILE - 2) * SCALE, "fenceV").setOrigin(0).setScale(SCALE));
        }
      }
      if (entity.type === "rock") {
        const scale = entity.size === "small" ? 0.55 : 0.95;
        const rock = this.add.image((entity.x * TILE + 8) * SCALE, (entity.y * TILE + 7) * SCALE, "rock").setScale(scale);
        rock.setDepth((entity.y + 1) * 10);
        this.worldLayer.add(rock);
      }
      if (entity.type === "healMachine") {
        this.worldLayer.add(
          this.add.image((entity.x * TILE + 2) * SCALE, (entity.y * TILE - 14) * SCALE, "healMachine").setOrigin(0).setScale(SCALE)
        );
      }
      if (entity.type === "npc") {
        const npcKeys = {
          fan: "npcPink",
          kid: "npcKid",
          hiker: "npcHiker",
          wanderer: "npcBlue"
        };
        const key = npcKeys[entity.mood] ?? "npcBlue";
        const npc = this.add.sprite((entity.x * TILE + 8) * SCALE, (entity.y * TILE + 6) * SCALE, key, 4).setScale(0.86);
        npc.setDepth((entity.y + 1) * 10);
        this.worldLayer.add(npc);
      }
    });
  }

  createCharacters() {
    this.playerDirection = "down";
    this.playerIdleFrames = { up: 1, down: 4, left: 7, right: 10 };
    const avatarScale = this.playerAvatarKey === BLOCKY_STRAWBERRY_AVATAR_KEY ? 1.64 : 0.86;
    this.player = this.add.sprite(717, 800, this.playerAvatarKey, this.playerIdleFrames.down).setScale(avatarScale);
    this.player.setDepth(1000);
    this.player.bodySize = { w: 10 * SCALE, h: 8 * SCALE };
    this.speed = 118;
  }

  createInput() {
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
      esc: Phaser.Input.Keyboard.KeyCodes.ESC,
      b: Phaser.Input.Keyboard.KeyCodes.B,
      e: Phaser.Input.Keyboard.KeyCodes.E,
      h: Phaser.Input.Keyboard.KeyCodes.H,
      i: Phaser.Input.Keyboard.KeyCodes.I,
      del: Phaser.Input.Keyboard.KeyCodes.DELETE,
      shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
      one: Phaser.Input.Keyboard.KeyCodes.ONE,
      two: Phaser.Input.Keyboard.KeyCodes.TWO,
      three: Phaser.Input.Keyboard.KeyCodes.THREE,
      four: Phaser.Input.Keyboard.KeyCodes.FOUR,
      backspace: Phaser.Input.Keyboard.KeyCodes.BACKSPACE
    });
    window.addEventListener("keydown", (event) => {
      if (!this.homeStarted && this.profileOverlay?.visible) {
        const key = event.key.toLowerCase();
        const typingName = event.target === this.profileNameInput;
        if (typingName) {
          if (key === "enter") {
            event.preventDefault();
            this.completeProfileSetup();
          }
          return;
        }
        if (!typingName && ["a", "w", "arrowleft", "arrowup"].includes(key)) {
          event.preventDefault();
          this.selectProfileAvatar("player");
          return;
        }
        if (!typingName && ["d", "s", "arrowright", "arrowdown"].includes(key)) {
          event.preventDefault();
          this.selectProfileAvatar("npcPink");
          return;
        }
        if (key === "enter" || (!typingName && key === " ")) {
          event.preventDefault();
          this.completeProfileSetup();
          return;
        }
        if (key === "escape" || key === "backspace") {
          event.preventDefault();
          if (this.input?.keyboard) this.input.keyboard.enabled = true;
          this.profileOverlay.setVisible(false);
          this.profileNameInput?.classList.remove("is-visible");
          this.homeOverlay?.setVisible(true);
          this.setProfileDomVisible(false);
          this.setHomeDomVisible(true);
          return;
        }
        return;
      }
      if (!this.homeStarted && [" ", "enter"].includes(event.key.toLowerCase())) {
        event.preventDefault();
        this.startHomeGame();
        return;
      }
      if (!this.homeStarted) return;
      if (!this.inBattle) {
        if (this.adminPanel?.visible) {
          event.preventDefault();
          this.handleAdminKey(event);
          return;
        }
        if (this.inventoryPanel?.visible) {
          event.preventDefault();
          this.handleInventoryKey(event);
          return;
        }
        if (event.key.toLowerCase() === "i") {
          event.preventDefault();
          this.toggleInventory();
        }
        if (event.key.toLowerCase() === "p") {
          event.preventDefault();
          this.toggleAdminPanel();
        }
        if (event.key.toLowerCase() === "b") {
          event.preventDefault();
          this.startWildBattle(true);
        }
        if (["e", " ", "enter"].includes(event.key.toLowerCase())) {
          event.preventDefault();
          this.tryInteract();
        }
        if (event.key.toLowerCase() === "h") {
          event.preventDefault();
          this.tryHealAtMachine();
        }
        return;
      }
      if (!this.inBattle) return;
      if (this.adminKeepChoiceActive) {
        if (event.key === "1") {
          event.preventDefault();
          this.handleAdminKeepChoice(true);
        }
        if (event.key === "2") {
          event.preventDefault();
          this.handleAdminKeepChoice(false);
        }
        return;
      }
      if (this.captureChoiceActive) {
        if (event.key === "1") {
          event.preventDefault();
          this.handleCaptureChoice(true);
        }
        if (event.key === "2") {
          event.preventDefault();
          this.handleCaptureChoice(false);
        }
        return;
      }
      if (event.key === "Escape" || event.key === "Backspace") {
        event.preventDefault();
        this.handleBattleBack();
        return;
      }
      if (this.battleMenuMode === "main") {
        if (event.key === "1") {
          event.preventDefault();
          this.showMoveMenu();
        }
        if (event.key === "2") {
          event.preventDefault();
          this.showSwitchMenu();
        }
        if (event.key === "3") {
          event.preventDefault();
          this.tryEscapeBattle();
        }
        return;
      }
      if (this.battleMenuMode === "switch") {
        const switchIndex = ["1", "2", "3", "4"].indexOf(event.key);
        if (switchIndex >= 0) {
          event.preventDefault();
          this.switchToInventoryBrainrot(switchIndex);
        }
        if (event.key.toLowerCase() === "b") {
          event.preventDefault();
          this.handleBattleBack();
        }
        return;
      }
      if (this.battleMenuMode !== "moves") return;
      if (this.time.now < this.battleInputBlockUntil) return;
      const moveIndex = ["1", "2", "3", "4"].indexOf(event.key);
      if (moveIndex >= 0) {
        event.preventDefault();
        this.useMove(moveIndex);
      }
      if (event.key.toLowerCase() === "b") {
        event.preventDefault();
        this.handleBattleBack();
      }
    });
    this.input.on("pointerdown", (pointer) => this.handlePointerDown(pointer));
    this.input.on("pointermove", (pointer) => {
      if (this.joystickPointerId === pointer.id) this.updateJoystick(pointer);
    });
    this.input.on("pointerup", (pointer) => {
      if (this.joystickPointerId === pointer.id) this.releaseJoystick();
    });
    this.input.on("pointerupoutside", (pointer) => {
      if (this.joystickPointerId === pointer.id) this.releaseJoystick();
    });
    this.input.on("wheel", (_pointer, _gameObjects, _deltaX, deltaY) => {
      if (!this.inventoryPanel?.visible) return;
      this.changeInventoryPage(deltaY > 0 ? 1 : -1);
    });
  }

  createMobileControls() {
    this.mobileControls = this.add.container(0, 0).setScrollFactor(0).setDepth(4300).setVisible(false);
    const base = this.add.circle(this.joystickOrigin.x, this.joystickOrigin.y, this.joystickRadius, 0x101322, 0.32);
    base.setStrokeStyle(4, 0xffffff, 0.62);
    this.joystickKnob = this.add.circle(this.joystickOrigin.x, this.joystickOrigin.y, 24, 0xffffff, 0.72);
    this.joystickKnob.setStrokeStyle(3, 0x30384f, 0.7);
    const action = this.add.circle(846, 424, 38, 0xfff3ba, 0.8);
    action.setStrokeStyle(4, 0x30384f, 0.85);
    action.setInteractive({ useHandCursor: true });
    action.on("pointerdown", () => this.tryInteract());
    const actionLabel = this.add.text(846, 424, "E", {
      fontFamily: "Courier New",
      fontSize: "22px",
      color: COLORS.panelInk,
      fontStyle: "bold"
    }).setOrigin(0.5);
    this.mobileControls.add([base, this.joystickKnob, action, actionLabel]);
  }

  updateMobileControls() {
    if (!this.mobileControls) return;
    const visible = this.isMobilePhone
      && this.homeStarted
      && !this.inBattle
      && !this.adminPanel?.visible
      && !this.inventoryPanel?.visible;
    this.mobileControls.setVisible(visible);
    if (!visible) this.releaseJoystick();
  }

  createTacoRain() {
    this.eventEffects = this.add.container(0, 0).setScrollFactor(0).setDepth(2850).setVisible(false);
    this.vvsMapTint = this.add.rectangle(0, 0, VIEW_W, VIEW_H, 0x49dbff, 0.18)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(2845)
      .setVisible(false);
    this.strawberrySpawnTint = this.add.rectangle(0, 0, VIEW_W, VIEW_H, 0xff6fa8, 0.22)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(2846)
      .setVisible(false);
    this.strawberrySpawnLayer = this.add.container(0, 0).setScrollFactor(0).setDepth(2865).setVisible(false);
    this.strawberrySpawnDrops = Array.from({ length: 82 }, () => {
      const sprite = this.add.image(0, 0, "strawberryDrop").setOrigin(0.5).setAlpha(0.94);
      const drop = { sprite, speed: 0, drift: 0, spin: 0 };
      this.resetStrawberryDrop(drop, false);
      this.strawberrySpawnLayer.add(sprite);
      return drop;
    });
    this.tacoRainDrops = Array.from({ length: 72 }, () => {
      const sprite = this.add.image(0, 0, "tacoDrop").setOrigin(0.5).setAlpha(0.92);
      const drop = { sprite, speed: 0, drift: 0, spin: 0 };
      this.resetTacoDrop(drop, false);
      this.eventEffects.add(sprite);
      return drop;
    });
    this.eventSparkles = Array.from({ length: 70 }, () => {
      const sprite = this.add.rectangle(0, 0, 8, 8, 0xf5c85b, 0.78).setOrigin(0.5);
      const sparkle = { sprite, speed: 0, drift: 0, pulse: Math.random() * Math.PI * 2 };
      this.resetEventSparkle(sparkle, false);
      this.eventEffects.add(sprite);
      return sparkle;
    });
    this.eventScreenEffects = this.add.container(0, 0).setScrollFactor(0).setDepth(2860).setVisible(false);
    this.vvsDiamonds = Array.from({ length: 56 }, () => {
      const sprite = this.add.image(0, 0, "diamondDrop").setOrigin(0.5).setAlpha(0);
      const diamond = { sprite, age: 0, life: 0, spin: 0 };
      this.resetVvsDiamond(diamond);
      this.eventScreenEffects.add(sprite);
      return diamond;
    });

    this.eventCountdown = this.add.container(18, 18).setScrollFactor(0).setDepth(3300).setVisible(false);
    this.eventCountdownBg = this.add.graphics();
    this.eventCountdownBg.fillStyle(0xf7f1de, 0.94).fillRoundedRect(0, 0, 128, 36, 5);
    this.eventCountdownBg.lineStyle(3, 0x30384f, 1).strokeRoundedRect(0, 0, 128, 36, 5);
    this.eventCountdownText = this.add.text(14, 8, "", {
      fontFamily: "Courier New",
      fontSize: "16px",
      color: COLORS.panelInk,
      fontStyle: "bold"
    });
    this.eventCountdown.add([this.eventCountdownBg, this.eventCountdownText]);

    this.strawberryEventTimer = this.add.container(18, 62).setScrollFactor(0).setDepth(3305).setVisible(false);
    this.strawberryEventTimerBg = this.add.graphics();
    this.strawberryEventTimerBg.fillStyle(0xffe0ec, 0.95).fillRoundedRect(0, 0, 178, 38, 5);
    this.strawberryEventTimerBg.lineStyle(3, 0xb73359, 1).strokeRoundedRect(0, 0, 178, 38, 5);
    this.strawberryEventTimerText = this.add.text(12, 8, "", {
      fontFamily: "Courier New",
      fontSize: "14px",
      color: "#7b1f3a",
      fontStyle: "bold"
    });
    this.strawberryEventTimer.add([this.strawberryEventTimerBg, this.strawberryEventTimerText]);

    this.eventBanner = this.add.container(VIEW_W / 2, 74).setScrollFactor(0).setDepth(8200).setVisible(false);
    this.eventBannerBg = this.add.graphics();
    this.eventBannerBg.fillStyle(0xfff3ba, 1).fillRoundedRect(-270, -36, 540, 72, 6);
    this.eventBannerBg.lineStyle(5, 0x30384f, 1).strokeRoundedRect(-270, -36, 540, 72, 6);
    this.eventBannerText = this.add.text(0, -3, "", {
      fontFamily: "Courier New",
      fontSize: "22px",
      color: COLORS.panelInk,
      fontStyle: "bold",
      align: "center",
      lineSpacing: 4
    }).setOrigin(0.5);
    this.eventBanner.add([this.eventBannerBg, this.eventBannerText]);
  }

  eventWorldBounds() {
    return {
      left: 0,
      right: VIEW_W,
      top: 0,
      bottom: VIEW_H
    };
  }

  resetTacoDrop(drop, startAbove = true) {
    const bounds = this.eventWorldBounds();
    drop.sprite.setPosition(
      Phaser.Math.Between(bounds.left - 90, bounds.right + 90),
      startAbove ? Phaser.Math.Between(bounds.top - 220, bounds.top - 20) : Phaser.Math.Between(bounds.top - 80, bounds.bottom + 20)
    );
    drop.sprite.setScale(Phaser.Math.FloatBetween(1.15, 1.9));
    drop.sprite.setRotation(Phaser.Math.FloatBetween(-0.5, 0.5));
    drop.speed = Phaser.Math.Between(95, 210);
    drop.drift = Phaser.Math.Between(-28, 28);
    drop.spin = Phaser.Math.FloatBetween(-1.7, 1.7);
  }

  resetStrawberryDrop(drop, startAbove = true) {
    const bounds = this.eventWorldBounds();
    drop.sprite.setPosition(
      Phaser.Math.Between(bounds.left - 110, bounds.right + 110),
      startAbove ? Phaser.Math.Between(bounds.top - 240, bounds.top - 24) : Phaser.Math.Between(bounds.top - 90, bounds.bottom + 30)
    );
    drop.sprite.setScale(Phaser.Math.FloatBetween(0.9, 1.65));
    drop.sprite.setRotation(Phaser.Math.FloatBetween(-0.45, 0.45));
    drop.speed = Phaser.Math.Between(135, 255);
    drop.drift = Phaser.Math.Between(-35, 35);
    drop.spin = Phaser.Math.FloatBetween(-2.2, 2.2);
  }

  resetEventSparkle(sparkle, startAbove = true) {
    const bounds = this.eventWorldBounds();
    sparkle.sprite.setPosition(
      Phaser.Math.Between(bounds.left - 70, bounds.right + 70),
      startAbove ? Phaser.Math.Between(bounds.top - 150, bounds.top - 8) : Phaser.Math.Between(bounds.top, bounds.bottom)
    );
    sparkle.sprite.setScale(Phaser.Math.FloatBetween(0.7, 1.55));
    sparkle.sprite.setRotation(Phaser.Math.FloatBetween(0, Math.PI));
    sparkle.speed = Phaser.Math.Between(35, 105);
    sparkle.drift = Phaser.Math.Between(-18, 18);
    sparkle.pulse = Math.random() * Math.PI * 2;
  }

  resetVvsDiamond(diamond) {
    const bounds = this.eventWorldBounds();
    diamond.sprite.setPosition(
      Phaser.Math.Between(bounds.left + 38, bounds.right - 38),
      Phaser.Math.Between(bounds.top + 66, bounds.bottom - 70)
    );
    diamond.sprite.setScale(Phaser.Math.FloatBetween(1.05, 2.1));
    diamond.sprite.setRotation(Phaser.Math.FloatBetween(-0.25, 0.25));
    diamond.sprite.setAlpha(0);
    diamond.age = Phaser.Math.FloatBetween(-0.6, 0);
    diamond.life = Phaser.Math.FloatBetween(1.45, 2.55);
    diamond.spin = Phaser.Math.FloatBetween(-1.1, 1.1);
  }

  updateEventEffects(deltaMs) {
    if (!this.eventEffects) return;
    this.updateStrawberrySpawnEffect(deltaMs);
    const activeEvents = this.activeAdminEvents();
    const visible = Boolean(
      activeEvents.length
      && this.homeStarted
      && !this.inBattle
      && !this.adminPanel?.visible
      && !this.inventoryPanel?.visible
    );
    this.eventEffects.setVisible(visible);
    this.eventScreenEffects?.setVisible(visible);
    this.vvsMapTint?.setVisible(false);
    if (!visible) {
      this.eventCountdown?.setVisible(false);
      return;
    }

    const dt = deltaMs / 1000;
    this.updateEventCountdown(activeEvents);
    const showTacos = activeEvents.some((event) => event.trait === "TACO");
    const showVvs = activeEvents.some((event) => event.trait === "VVS");
    const showSparkles = activeEvents.some((event) => event.variant || (event.luck ?? 1) > 1);
    const mutationSparkles = activeEvents.some((event) => event.variant);
    const bounds = this.eventWorldBounds();
    this.tacoRainDrops.forEach((drop) => {
      drop.sprite.setVisible(showTacos);
      if (!showTacos) return;
      drop.sprite.x += drop.drift * dt;
      drop.sprite.y += drop.speed * dt;
      drop.sprite.rotation += drop.spin * dt;
      if (
        drop.sprite.y > bounds.bottom + 90
        || drop.sprite.x < bounds.left - 170
        || drop.sprite.x > bounds.right + 170
      ) {
        this.resetTacoDrop(drop, true);
      }
    });

    this.eventSparkles.forEach((sparkle) => {
      sparkle.sprite.setVisible(showSparkles);
      if (!showSparkles) return;
      const color = mutationSparkles
        ? (Math.sin(this.time.now / 130 + sparkle.pulse) > 0 ? 0xff4fc8 : 0x43e5ff)
        : 0xf5c85b;
      sparkle.sprite.setFillStyle(color, mutationSparkles ? 0.62 : 0.72);
      sparkle.sprite.x += sparkle.drift * dt;
      sparkle.sprite.y += sparkle.speed * dt;
      sparkle.sprite.rotation += 1.5 * dt;
      sparkle.sprite.alpha = 0.45 + Math.sin(this.time.now / 180 + sparkle.pulse) * 0.22;
      if (
        sparkle.sprite.y > bounds.bottom + 70
        || sparkle.sprite.x < bounds.left - 130
        || sparkle.sprite.x > bounds.right + 130
      ) {
        this.resetEventSparkle(sparkle, true);
      }
    });
    this.updateVvsEffects(dt, showVvs);
  }

  updateStrawberrySpawnEffect(deltaMs) {
    if (this.dragonSpawnEndsAt && this.time.now >= this.dragonSpawnEndsAt) {
      this.despawnDragonMapEncounter(true);
    }
    if (this.strawberrySpawnActive && this.strawberrySpawnEndsAt && this.time.now >= this.strawberrySpawnEndsAt) {
      this.despawnStrawberryMapEncounter(true);
      return;
    }
    const visible = Boolean(this.strawberrySpawnActive && this.homeStarted && !this.inBattle);
    this.strawberrySpawnLayer?.setVisible(visible);
    this.strawberrySpawnTint?.setVisible(visible);
    this.strawberryEventTimer?.setVisible(visible);
    if (!visible) return;
    const dt = deltaMs / 1000;
    const elapsed = Math.max(0, this.time.now - (this.strawberrySpawnStartedAt ?? this.time.now));
    const remainingMs = Math.max(0, (this.strawberrySpawnEndsAt ?? this.time.now) - this.time.now);
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = String(remainingSeconds % 60).padStart(2, "0");
    this.strawberryEventTimerText?.setText(`STRAWBERRY ${minutes}:${seconds}`);
    const pulse = 0.2 + Math.sin(this.time.now / 85) * 0.06;
    this.strawberrySpawnTint?.setAlpha(pulse);
    const bounds = this.eventWorldBounds();
    this.strawberrySpawnDrops.forEach((drop) => {
      drop.sprite.x += drop.drift * dt;
      drop.sprite.y += drop.speed * dt;
      drop.sprite.rotation += drop.spin * dt;
      drop.sprite.alpha = Phaser.Math.Clamp(0.25 + elapsed / 260, 0.25, 0.95);
      if (
        drop.sprite.y > bounds.bottom + 95
        || drop.sprite.x < bounds.left - 180
        || drop.sprite.x > bounds.right + 180
      ) {
        this.resetStrawberryDrop(drop, true);
      }
    });
  }

  playStrawberrySpawnEffect(onComplete) {
    this.strawberrySpawnActive = true;
    this.strawberrySpawnStartedAt = this.time.now;
    this.strawberrySpawnLockUntil = this.time.now + 700;
    this.moveTarget = null;
    this.strawberrySpawnDrops?.forEach((drop) => this.resetStrawberryDrop(drop, false));
    this.strawberrySpawnLayer?.setVisible(true);
    this.strawberrySpawnTint?.setVisible(true);
    this.showToast("Strawberry Aura", "The map turns pink as strawberries fall.");
    this.time.delayedCall(900, () => {
      onComplete?.();
    });
  }

  stopStrawberrySpawnEffect() {
    this.strawberrySpawnActive = false;
    this.strawberrySpawnLockUntil = 0;
    this.strawberrySpawnEndsAt = 0;
    this.strawberrySpawnLayer?.setVisible(false);
    this.strawberrySpawnTint?.setVisible(false);
    this.strawberryEventTimer?.setVisible(false);
  }

  despawnStrawberryMapEncounter(showMessage = false) {
    const npc = this.findStrawberryNpc();
    if (npc) {
      npc.hiddenUntilSpawn = true;
      npc.noWander = true;
      npc.wanderTarget = null;
      npc.battleOptions = null;
      npc.sprite?.setVisible(false);
      npc.sprite?.setAlpha(1);
      npc.sprite?.setScale(npc.scale ?? 1.35);
    }
    this.stopStrawberrySpawnEffect();
    if (showMessage) this.showToast("Strawberry Aura", "Strawberry Elephant disappeared.");
  }

  startBattleAfterSpawnAtmosphere(template, options = {}) {
    if ((template?.name ?? options.enemyName) === "Strawberry Elephant") {
      this.spawnStrawberryMapEncounter(options);
      return;
    }
    if ((template?.name ?? options.enemyName) === "Dragon Cannelloni" && (options.adminSpawned || options.mapSpawnEvent)) {
      this.spawnDragonMapEncounter(options);
      return;
    }
    this.startBattle(options);
  }

  findStrawberryNpc() {
    return this.mapNpcs?.find((npc) => npc.battleEnemyName === "Strawberry Elephant") ?? null;
  }

  findDragonNpc() {
    return this.mapNpcs?.find((npc) => npc.battleEnemyName === "Dragon Cannelloni") ?? null;
  }

  prepareMapSpawnContext(eventName) {
    if (this.inBattle) return false;
    if (this.locationMode === "interior") this.leaveInterior();
    if (!this.isMapMode()) {
      this.setMapZone("overworld", { playerX: 717, playerY: 800, direction: "down" });
    }
    if (!this.isMapMode()) {
      this.showToast(eventName, "Go outside to spawn this brainrot.");
      return false;
    }
    return true;
  }

  findStrawberrySpawnPoint(npc) {
    const candidates = [
      { x: this.player.x + 84, y: this.player.y - 8 },
      { x: this.player.x - 84, y: this.player.y - 8 },
      { x: this.player.x, y: this.player.y + 84 },
      { x: this.player.x, y: this.player.y - 84 },
      { x: this.player.x + 58, y: this.player.y + 58 },
      { x: this.player.x - 58, y: this.player.y + 58 }
    ];
    return candidates.find((point) => this.npcCanStand(npc, point.x, point.y)) ?? {
      x: Phaser.Math.Clamp(this.player.x + 72, 40, this.mapWorldW - 40),
      y: Phaser.Math.Clamp(this.player.y, 70, this.mapWorldH - 70)
    };
  }

  spawnStrawberryMapEncounter(options = {}) {
    if (!this.prepareMapSpawnContext("Strawberry Aura")) return;
    const npc = this.findStrawberryNpc();
    if (!npc) {
      this.showToast("Strawberry Aura", "Strawberry NPC is not ready.");
      return;
    }
    const spawnPoint = this.findStrawberrySpawnPoint(npc);
    npc.hiddenUntilSpawn = false;
    npc.noWander = false;
    npc.mapKey = this.currentMapKey;
    npc.homeX = spawnPoint.x;
    npc.homeY = spawnPoint.y;
    npc.wanderTarget = null;
    npc.wanderTimer = npc.wanderTimerMs ?? 350;
    npc.direction = "down";
    npc.battleOptions = {
      ...options,
      enemyName: "Strawberry Elephant",
      introText: options.adminSpawned ? "ADMIN summoned Strawberry Elephant!" : "Strawberry Elephant appeared on the map!"
    };
    this.strawberrySpawnEndsAt = this.time.now + STRAWBERRY_SPAWN_DURATION;
    this.setNpcPosition(npc, spawnPoint.x, spawnPoint.y);
    npc.sprite?.setVisible(true);
    npc.sprite?.setAlpha(0);
    npc.sprite?.setScale((npc.scale ?? 1.35) * 0.4);
    npc.sprite?.setFrame(this.playerIdleFrames.down);
    this.playStrawberrySpawnEffect(() => {
      this.showToast("Strawberry Elephant", "It appeared nearby. Press E beside it to battle.");
    });
    this.tweens.add({
      targets: npc.sprite,
      alpha: 1,
      scale: npc.scale ?? 1.35,
      duration: 420,
      ease: "Back.easeOut"
    });
  }

  despawnDragonMapEncounter(showMessage = false) {
    const npc = this.findDragonNpc();
    if (npc) {
      npc.hiddenUntilSpawn = true;
      npc.noWander = true;
      npc.wanderTarget = null;
      npc.battleOptions = null;
      npc.fireSprite?.setVisible(false);
      npc.sprite?.anims?.stop();
      npc.sprite?.setVisible(false);
      npc.sprite?.setAlpha(1);
      npc.sprite?.setScale(npc.scale ?? 0.94);
    }
    this.dragonSpawnEndsAt = 0;
    if (showMessage) this.showToast("Dragon Spawn", "Dragon Cannelloni flew away.");
  }

  spawnDragonMapEncounter(options = {}) {
    if (!this.prepareMapSpawnContext("Dragon Spawn")) return;
    const npc = this.findDragonNpc();
    if (!npc) {
      this.showToast("Dragon Spawn", "Dragon NPC is not ready.");
      return;
    }
    const spawnPoint = this.findStrawberrySpawnPoint(npc);
    npc.hiddenUntilSpawn = false;
    npc.noWander = false;
    npc.mapKey = this.currentMapKey;
    npc.homeX = spawnPoint.x;
    npc.homeY = spawnPoint.y;
    npc.wanderTarget = null;
    npc.wanderTimer = npc.wanderTimerMs ?? 540;
    npc.direction = "down";
    npc.battleOptions = {
      ...options,
      enemyName: "Dragon Cannelloni",
      introText: options.adminSpawned ? "ADMIN summoned Dragon Cannelloni!" : "Dragon Cannelloni appeared on the map!"
    };
    this.dragonSpawnEndsAt = this.time.now + (options.durationMs ?? DRAGON_SPAWN_DURATION);
    this.setNpcPosition(npc, spawnPoint.x, spawnPoint.y);
    npc.sprite?.setVisible(true);
    npc.sprite?.setAlpha(0);
    npc.sprite?.setScale((npc.scale ?? 0.94) * 0.4);
    npc.sprite?.setFrame(this.playerIdleFrames.down);
    npc.fireSprite?.setVisible(false);
    this.playAdminEventAnimation("Dragon Spawn", { luck: 1 });
    this.showToast("Dragon Spawn", "Dragon Cannelloni landed nearby. Press E beside it to battle.");
    this.tweens.add({
      targets: npc.sprite,
      alpha: 1,
      scale: npc.scale ?? 0.94,
      duration: 420,
      ease: "Back.easeOut"
    });
  }

  updateVvsEffects(dt, showVvs) {
    this.vvsMapTint?.setVisible(showVvs);
    if (showVvs && this.vvsMapTint) {
      this.vvsMapTint.setAlpha(0.14 + Math.sin(this.time.now / 420) * 0.045);
    }
    this.vvsDiamonds?.forEach((diamond) => {
      diamond.sprite.setVisible(showVvs);
      if (!showVvs) return;
      diamond.age += dt;
      if (diamond.age >= diamond.life) {
        this.resetVvsDiamond(diamond);
        return;
      }
      const progress = Phaser.Math.Clamp(diamond.age / diamond.life, 0, 1);
      const fadeIn = Phaser.Math.Clamp(progress / 0.22, 0, 1);
      const fadeOut = Phaser.Math.Clamp((1 - progress) / 0.28, 0, 1);
      diamond.sprite.setAlpha(Math.min(fadeIn, fadeOut) * 0.92);
      diamond.sprite.rotation += diamond.spin * dt;
      diamond.sprite.y -= 10 * dt;
    });
  }

  eventIcon(event = this.adminEvent) {
    if (!event) return "";
    if (event.trait) return BRAINROT_TRAITS[event.trait]?.emoji ?? "★";
    if (event.variant) return "✦";
    return "★";
  }

  updateEventCountdown(activeEvents = this.activeAdminEvents()) {
    if (!this.eventCountdown || !activeEvents.length) return;
    const visible = this.homeStarted && !this.inBattle && !this.adminPanel?.visible && !this.inventoryPanel?.visible;
    this.eventCountdown.setVisible(visible);
    if (!visible) return;
    const chunks = activeEvents.map((event) => {
      const seconds = Math.max(0, Math.ceil((event.endsAt - this.time.now) / 1000));
      return `${this.eventIcon(event)} ${seconds}s`;
    });
    const lines = [];
    for (let index = 0; index < chunks.length; index += 2) {
      lines.push(chunks.slice(index, index + 2).join("  "));
    }
    const width = Math.max(128, Math.min(260, Math.max(...lines.map((line) => line.length)) * 11 + 28));
    const height = 18 + lines.length * 18;
    this.eventCountdownBg.clear();
    this.eventCountdownBg.fillStyle(0xf7f1de, 0.94).fillRoundedRect(0, 0, width, height, 5);
    this.eventCountdownBg.lineStyle(3, 0x30384f, 1).strokeRoundedRect(0, 0, width, height, 5);
    this.eventCountdownText.setText(lines.join("\n"));
  }

  playAdminEventAnimation(name, options = {}) {
    if (!this.eventBanner) return;
    const icon = options.trait ? `${BRAINROT_TRAITS[options.trait]?.emoji ?? "★"} ` : options.variant ? "✦ " : "★ ";
    const detail = options.trait === "TACO"
      ? "Taco trait multiplies levels x3"
      : options.trait === "VVS"
        ? "Diamond trait multiplies levels x8"
        : options.variant
          ? "Mutation colors are surging"
          : "Rare spawns boosted";
    this.eventBannerText.setText(`${icon}${name}\n${detail}`);
    this.eventBanner.setVisible(true).setAlpha(0).setScale(0.82).setY(56);
    this.tweens.killTweensOf(this.eventBanner);
    this.tweens.add({
      targets: this.eventBanner,
      alpha: 1,
      scale: 1,
      y: 82,
      duration: 260,
      ease: "Back.easeOut"
    });
    this.tweens.add({
      targets: this.eventBanner,
      scale: 1.035,
      yoyo: true,
      repeat: 2,
      delay: 290,
      duration: 120,
      ease: "Sine.easeInOut"
    });
    this.time.delayedCall(2100, () => {
      this.tweens.add({
        targets: this.eventBanner,
        alpha: 0,
        y: 54,
        duration: 240,
        ease: "Quad.easeIn",
        onComplete: () => this.eventBanner?.setVisible(false)
      });
    });
  }

  createHud() {
    this.toast = this.add.container(18, VIEW_H - 74).setScrollFactor(0).setDepth(3000).setAlpha(0);
    this.toastBg = this.add.graphics();
    this.toastBg.fillStyle(0xf8f1dc, 1).fillRoundedRect(0, 0, 360, 62, 4);
    this.toastBg.lineStyle(3, 0x30384f, 1).strokeRoundedRect(0, 0, 360, 62, 4);
    this.toastTitle = this.add.text(16, 9, "", { fontFamily: "Courier New", fontSize: "18px", color: COLORS.panelInk, fontStyle: "bold" });
    this.toastText = this.add.text(16, 31, "", { fontFamily: "Courier New", fontSize: "12px", color: "#526070", wordWrap: { width: 326 } });
    this.toast.add([this.toastBg, this.toastTitle, this.toastText]);
    this.createDoorPrompt();
    this.createInventoryPanel();
    this.createAdminPanel();
  }

  createHomeScreen() {
    this.homeOverlay = this.add.container(0, 0).setScrollFactor(0).setDepth(9000);
    const bg = this.add.rectangle(0, 0, VIEW_W, VIEW_H, 0xffffff, 1).setOrigin(0);
    const title = this.add.text(VIEW_W / 2, 154, "BERBYS", {
      fontFamily: "Courier New",
      fontSize: "78px",
      color: COLORS.panelInk,
      fontStyle: "bold"
    }).setOrigin(0.5);
    const subtitle = this.add.text(VIEW_W / 2, 246, "CATCH A BRAINROT", {
      fontFamily: "Courier New",
      fontSize: "22px",
      color: "#56617c",
      fontStyle: "bold"
    }).setOrigin(0.5);
    const buttonBg = this.add.graphics();
    this.homeStartRect = new Phaser.Geom.Rectangle(VIEW_W / 2 - 150, 328, 300, 54);
    buttonBg.fillStyle(0xf7f1de, 1).fillRoundedRect(VIEW_W / 2 - 150, 328, 300, 54, 6);
    buttonBg.lineStyle(4, 0x30384f, 1).strokeRoundedRect(VIEW_W / 2 - 150, 328, 300, 54, 6);
    const buttonText = this.add.text(VIEW_W / 2, 356, "CLICK TO START", {
      fontFamily: "Courier New",
      fontSize: "20px",
      color: COLORS.panelInk,
      fontStyle: "bold"
    }).setOrigin(0.5);
	    const hit = this.add.rectangle(VIEW_W / 2 - 150, 328, 300, 54, 0xffffff, 0.001).setOrigin(0);
	    hit.setInteractive({ useHandCursor: true });
	    hit.on("pointerdown", () => this.startHomeGame());
	    this.homeOverlay.add([bg, title, subtitle, buttonBg, buttonText, hit]);
	    this.createProfileScreen();
    this.createHomeDomControls();
	  }

	  startHomeGame() {
	    if (this.homeStarted) return;
    this.setHomeDomVisible(false);
	    if (!this.userProfile) {
	      this.showProfileSetup();
	      return;
	    }
	    this.finishHomeStart();
	  }

	  finishHomeStart() {
	    if (this.homeStarted) return;
	    this.homeStarted = true;
    if (this.input?.keyboard) this.input.keyboard.enabled = true;
	    this.homeOverlay?.setVisible(false);
	    this.profileOverlay?.setVisible(false);
	    this.profileNameInput?.classList.remove("is-visible");
    this.setHomeDomVisible(false);
    this.setProfileDomVisible(false);
	    this.applyUserProfile();
	    if (this.userProfile && !this.userProfile.hasFirstBrainrot) {
	      this.prepareStarterQuest();
	      return;
	    }
	    this.showToast("Brainworld Town", "Parate frente a una puerta y presiona E.");
	  }

  makeDomHitButton(className, rect, label, action) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = label;
    button.style.left = `${(rect.x / VIEW_W) * 100}%`;
    button.style.top = `${(rect.y / VIEW_H) * 100}%`;
    button.style.width = `${(rect.width / VIEW_W) * 100}%`;
    button.style.height = `${(rect.height / VIEW_H) * 100}%`;
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      action();
    });
    return button;
  }

  createHomeDomControls() {
    const host = document.getElementById("game");
    if (!host || this.homeDomButton) return;
    this.homeDomButton = this.makeDomHitButton(
      "home-hit-button is-visible",
      this.homeStartRect,
      "CLICK TO START",
      () => this.startHomeGame()
    );
    this.profileDomLayer = document.createElement("div");
    this.profileDomLayer.className = "profile-hit-layer";
    this.profileAvatarCards?.forEach((card) => {
      this.profileDomLayer.appendChild(this.makeDomHitButton(
        "profile-hit-button",
        card.rect,
        card.label?.text ?? card.key,
        () => this.selectProfileAvatar(card.key)
      ));
    });
    this.profileDomLayer.appendChild(this.makeDomHitButton(
      "profile-hit-button profile-start-hit",
      this.profileContinueRect,
      "START",
      () => this.completeProfileSetup()
    ));
    host.append(this.homeDomButton, this.profileDomLayer);
  }

  setHomeDomVisible(visible) {
    this.homeDomButton?.classList.toggle("is-visible", Boolean(visible));
  }

  setProfileDomVisible(visible) {
    this.profileDomLayer?.classList.toggle("is-visible", Boolean(visible));
  }

	  createProfileScreen() {
	    const host = document.getElementById("game");
	    this.profileOverlay = this.add.container(0, 0).setScrollFactor(0).setDepth(9100).setVisible(false);
	    const bg = this.add.rectangle(0, 0, VIEW_W, VIEW_H, 0xffffff, 1).setOrigin(0);
    const title = this.add.text(VIEW_W / 2, 72, "CREA TU PERFIL", {
	      fontFamily: "Courier New",
	      fontSize: "38px",
	      color: COLORS.panelInk,
	      fontStyle: "bold"
	    }).setOrigin(0.5);
    const hint = this.add.text(VIEW_W / 2, 116, "Escoge tu avatar. Despues busca tu primer brainrot en la hierba.", {
	      fontFamily: "Courier New",
	      fontSize: "15px",
	      color: "#56617c",
	      fontStyle: "bold",
	      align: "center",
	      wordWrap: { width: 720 }
	    }).setOrigin(0.5);
    this.profileAvatarCards = [
      this.makeProfileAvatarCard(340, 328, "player", "Joven gorra azul"),
      this.makeProfileAvatarCard(620, 328, "npcPink", "Nina con lazo")
    ];
    this.profileContinueRect = new Phaser.Geom.Rectangle(VIEW_W / 2 - 128, 466, 256, 46);
    this.profileContinueButton = this.add.container(this.profileContinueRect.x, this.profileContinueRect.y);
	    const continueBg = this.add.graphics();
	    continueBg.fillStyle(0xf7f1de, 1).fillRoundedRect(0, 0, 256, 46, 6);
	    continueBg.lineStyle(4, 0x30384f, 1).strokeRoundedRect(0, 0, 256, 46, 6);
	    const continueText = this.add.text(128, 24, "START", {
	      fontFamily: "Courier New",
	      fontSize: "20px",
	      color: COLORS.panelInk,
	      fontStyle: "bold"
	    }).setOrigin(0.5);
	    this.profileContinueButton.add([continueBg, continueText]);
	    this.profileContinueButton.setSize(256, 46);
	    this.profileContinueButton.setInteractive(new Phaser.Geom.Rectangle(0, 0, 256, 46), Phaser.Geom.Rectangle.Contains);
	    this.profileContinueButton.on("pointerdown", () => this.completeProfileSetup());
	    this.profileOverlay.add([
	      bg,
	      title,
	      hint,
	      ...this.profileAvatarCards.flatMap((card) => [card.bg, card.sprite, card.label, card.hit]),
	      this.profileContinueButton
	    ]);
	    if (host && !this.profileNameInput) {
	      this.profileNameInput = document.createElement("input");
	      this.profileNameInput.className = "profile-name-input";
	      this.profileNameInput.type = "text";
	      this.profileNameInput.placeholder = "Nombre de usuario";
	      this.profileNameInput.maxLength = 16;
	      this.profileNameInput.autocomplete = "off";
	      this.profileNameInput.addEventListener("pointerdown", (event) => event.stopPropagation());
      this.profileNameInput.addEventListener("keydown", (event) => {
        event.stopPropagation();
        if (event.key === "Enter") {
          event.preventDefault();
          this.completeProfileSetup();
        }
      });
	      host.appendChild(this.profileNameInput);
	    }
	    this.updateProfileAvatarCards();
	  }

	  makeProfileAvatarCard(x, y, key, labelText) {
    const rect = new Phaser.Geom.Rectangle(x - 96, y - 110, 192, 228);
	    const bg = this.add.graphics();
	    const spriteScale = key === BLOCKY_STRAWBERRY_AVATAR_KEY ? 1.6 : 1.42;
	    const sprite = this.add.sprite(x, y - 24, key, this.playerIdleFrames.down).setScale(spriteScale);
	    const label = this.add.text(x, y + 82, labelText, {
	      fontFamily: "Courier New",
	      fontSize: "15px",
	      color: COLORS.panelInk,
	      fontStyle: "bold",
	      align: "center"
	    }).setOrigin(0.5);
	    const hit = this.add.rectangle(rect.x, rect.y, rect.width, rect.height, 0xffffff, 0.001).setOrigin(0);
	    hit.setInteractive({ useHandCursor: true });
	    hit.on("pointerdown", () => this.selectProfileAvatar(key));
	    return { bg, sprite, label, hit, key, x, y, rect };
	  }

	  selectProfileAvatar(key) {
	    this.profileAvatarKey = key;
	    this.updateProfileAvatarCards();
	  }

	  updateProfileAvatarCards() {
	    this.profileAvatarCards?.forEach((card) => {
	      const selected = card.key === this.profileAvatarKey;
	      card.bg.clear();
	      card.bg.fillStyle(selected ? 0xd9ffe1 : 0xf7f1de, 1).fillRoundedRect(card.x - 96, card.y - 110, 192, 228, 8);
	      card.bg.lineStyle(selected ? 6 : 4, selected ? 0x2fbf5b : 0x30384f, 1).strokeRoundedRect(card.x - 96, card.y - 110, 192, 228, 8);
	    });
	  }

	  showProfileSetup() {
	    this.homeOverlay?.setVisible(false);
	    this.profileAvatarKey = "player";
	    this.profileOverlay?.setVisible(true);
	    this.profileNameInput?.classList.add("is-visible");
    this.setHomeDomVisible(false);
    this.setProfileDomVisible(true);
    if (this.input?.keyboard) this.input.keyboard.enabled = false;
    if (this.profileNameInput) {
      this.profileNameInput.value = "";
      this.profileNameInput.focus({ preventScroll: true });
    }
	    this.updateProfileAvatarCards();
	  }

	  completeProfileSetup() {
	    const cleanName = (this.profileNameInput?.value ?? "").trim().slice(0, 16) || "Player";
	    this.userProfile = {
	      name: cleanName,
	      avatarKey: this.profileAvatarKey,
	      hasFirstBrainrot: false
	    };
	    this.saveUserProfile();
	    this.finishHomeStart();
	  }

	  applyUserProfile() {
	    this.playerAvatarKey = this.userProfile?.avatarKey ?? "player";
	    this.player?.setTexture(this.playerAvatarKey, this.playerIdleFrames[this.playerDirection] ?? this.playerIdleFrames.down);
	    this.player?.setScale(this.playerAvatarKey === BLOCKY_STRAWBERRY_AVATAR_KEY ? 1.64 : 0.86);
	  }

  createDoorPrompt() {
    this.doorPrompt = this.add.container(VIEW_W / 2 - 74, VIEW_H - 118).setScrollFactor(0).setDepth(3200).setVisible(false);
    const bg = this.add.graphics();
    bg.fillStyle(0xf8f1dc, 1).fillRoundedRect(0, 0, 148, 34, 5);
    bg.lineStyle(3, 0x30384f, 1).strokeRoundedRect(0, 0, 148, 34, 5);
    const label = this.add.text(18, 8, "Entrar  [E]", {
      fontFamily: "Courier New",
      fontSize: "15px",
      color: COLORS.panelInk,
      fontStyle: "bold"
    });
    this.doorPrompt.add([bg, label]);
    this.doorPrompt.setSize(148, 34);
    this.doorPrompt.setInteractive(new Phaser.Geom.Rectangle(0, 0, 148, 34), Phaser.Geom.Rectangle.Contains);
    this.doorPrompt.on("pointerdown", () => this.tryInteract());
  }

  makeAdminButton(x, y, label, action) {
    const button = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.fillStyle(0xffffff, 1).fillRoundedRect(0, 0, 190, 34, 5);
    bg.lineStyle(3, 0x56617c, 1).strokeRoundedRect(0, 0, 190, 34, 5);
    const text = this.add.text(12, 9, label, {
      fontFamily: "Courier New",
      fontSize: "12px",
      color: COLORS.panelInk,
      fontStyle: "bold"
    });
    button.add([bg, text]);
    button.setSize(190, 34);
    button.setInteractive(new Phaser.Geom.Rectangle(0, 0, 190, 34), Phaser.Geom.Rectangle.Contains);
    button.on("pointerdown", action);
    this.adminButtonRegions?.push({
      rect: new Phaser.Geom.Rectangle(x, y, 190, 34),
      action
    });
    return button;
  }

  makeInventoryActionButton(x, y, w, label, action) {
    const button = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.fillStyle(0xffffff, 1).fillRoundedRect(0, 0, w, 30, 5);
    bg.lineStyle(3, 0x56617c, 1).strokeRoundedRect(0, 0, w, 30, 5);
    const text = this.add.text(10, 8, label, {
      fontFamily: "Courier New",
      fontSize: "11px",
      color: COLORS.panelInk,
      fontStyle: "bold"
    });
    button.add([bg, text]);
    button.setSize(w, 30);
    button.setInteractive(new Phaser.Geom.Rectangle(0, 0, w, 30), Phaser.Geom.Rectangle.Contains);
    button.on("pointerdown", () => {
      this.lastInventoryPhaserClickAt = this.time.now;
      action();
    });
    return { button, bg, text, rect: new Phaser.Geom.Rectangle(x, y, w, 30), action };
  }

  createAdminPanel() {
    this.adminPanel = this.add.container(0, 0).setScrollFactor(0).setDepth(4700).setVisible(false);
    this.adminButtonRegions = [];
    this.adminMenuActions = [
      ["Run Luck X", () => this.runAdminLuckEvent()],
      ["Events", () => this.openAdminEventsMenu()],
      ["Spawn Brainrot", () => this.openAdminSpawnForm("spawn")],
      ["Spawn Supremo", () => this.openAdminSpawnForm("supreme")],
      ["Add Owned", () => this.openAdminSpawnForm("owned")],
      ["Economy", () => this.openAdminEconomyPanel()],
      ["Add All Brainrots", () => this.adminAddAllBrainrots()],
      ["Level +X Active", () => this.adminLevelActive()],
      ["Heal All", () => this.tryHealAtMachine(true)],
      ["Delete Active", () => this.adminDeleteActive()],
      ["Clear Inventory", () => this.adminClearInventory()],
      ["Join User", () => this.adminJoinUser()],
      ["Join Random Session", () => this.adminJoinSession()],
      ["Close", () => this.toggleAdminPanel(false)]
    ];
    this.createAdminForm();
    this.createAdminLoginForm();
    this.updateAdminPanel();
  }

  createAdminForm() {
    const host = document.getElementById("game");
    if (!host || this.adminForm) return;
    this.adminForm = document.createElement("div");
    this.adminForm.className = "admin-panel-dom";

    const card = document.createElement("section");
    card.className = "admin-card";
    const header = document.createElement("div");
    header.className = "admin-card-header";
    const title = document.createElement("h2");
    title.textContent = "Admin Abuse Panel";
    this.adminStatusEl = document.createElement("p");
    this.adminStatusEl.className = "admin-status";
    header.append(title, this.adminStatusEl);

    this.adminMenuGrid = document.createElement("div");
    this.adminMenuGrid.className = "admin-menu-grid";
    this.adminMenuButtons = [];
    this.adminMenuActions.forEach(([label, action], index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "admin-menu-button";
      button.textContent = label;
      button.addEventListener("click", (event) => {
        event.preventDefault();
        this.setAdminSelectedIndex(index);
        action();
      });
      this.adminMenuGrid.appendChild(button);
      this.adminMenuButtons.push(button);
      this.adminButtonRegions.push({ action, button, index });
    });

    this.adminCombo = document.createElement("div");
    this.adminCombo.className = "admin-combo";
    this.adminSearchInput = document.createElement("input");
    this.adminSearchInput.type = "text";
    this.adminSearchInput.placeholder = "brainrot name...";
    this.adminSearchInput.autocomplete = "off";
    this.adminDropButton = document.createElement("button");
    this.adminDropButton.type = "button";
    this.adminDropButton.textContent = "V";
    this.adminDropButton.className = "admin-combo-toggle";
    this.adminSuggestionList = document.createElement("div");
    this.adminSuggestionList.className = "admin-combo-list";
    this.adminCombo.append(this.adminSearchInput, this.adminDropButton, this.adminSuggestionList);

    this.adminColorSelect = document.createElement("select");
    const randomColor = document.createElement("option");
    randomColor.value = "";
    randomColor.textContent = "color= RANDOM";
    this.adminColorSelect.appendChild(randomColor);
    BRAINROT_VARIANTS.forEach((variant) => {
      const option = document.createElement("option");
      option.value = variant.key;
      option.textContent = `color= ${variant.key === "NORMAL" ? "NORMAL" : variant.label || variant.key}`;
      this.adminColorSelect.appendChild(option);
    });

    this.adminLevelInput = document.createElement("input");
    this.adminLevelInput.placeholder = "lvl=";
    this.adminLevelInput.inputMode = "numeric";
    this.adminLevelInput.type = "text";

    this.adminTraitSelect = document.createElement("select");
    [
      ["", "traits= EVENT/RANDOM"],
      ["NONE", "traits= NONE"],
      ["TACO", "traits= 🌮 TACO"],
      ["VVS", "traits= 💎 VVS"],
      ["TACO,VVS", "traits= 🌮 + 💎"]
    ].forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      this.adminTraitSelect.appendChild(option);
    });

    const spawnButton = document.createElement("button");
    this.adminSpawnSubmitButton = spawnButton;
    spawnButton.type = "button";
    spawnButton.textContent = "SPAWN";
    spawnButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.adminSpawnFromForm();
    });

    this.adminSearchInput.addEventListener("input", () => {
      this.renderAdminBrainrotOptions(this.adminSearchInput.value);
      this.setAdminBrainrotDropdownVisible(true);
    });
    this.adminSearchInput.addEventListener("focus", () => {
      this.renderAdminBrainrotOptions(this.adminSearchInput.value);
      this.setAdminBrainrotDropdownVisible(true);
    });
    this.adminSearchInput.addEventListener("click", () => {
      this.renderAdminBrainrotOptions(this.adminSearchInput.value);
      this.setAdminBrainrotDropdownVisible(true);
    });
    this.adminDropButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.renderAdminBrainrotOptions(this.adminSearchInput.value);
      this.setAdminBrainrotDropdownVisible(!this.adminSuggestionList.classList.contains("is-visible"));
    });

    this.adminSpawnSection = document.createElement("div");
    this.adminSpawnSection.className = "admin-spawn-section";
    const spawnLabel = document.createElement("div");
    this.adminSpawnTitle = spawnLabel;
    spawnLabel.className = "admin-spawn-title";
    spawnLabel.textContent = "Spawn a Brainrot";
    this.adminSpawnSection.append(spawnLabel, this.adminCombo, this.adminColorSelect, this.adminTraitSelect, this.adminLevelInput, spawnButton);

    this.adminPrompt = document.createElement("div");
    this.adminPrompt.className = "admin-action-box";

    this.adminForm.addEventListener("keydown", (event) => {
      const inPanelControl = this.adminSpawnSection?.contains(event.target) || this.adminPrompt?.contains(event.target);
      if (inPanelControl) {
        if (event.key === "Escape") {
          event.preventDefault();
          if (this.adminPromptVisible) this.hideAdminPrompt();
          else this.toggleAdminSpawnForm(false);
        }
        event.stopPropagation();
        return;
      }
      this.handleAdminKey(event);
      event.stopPropagation();
    });

    [this.adminForm, this.adminSuggestionList].forEach((node) => {
      node.addEventListener("pointerdown", (event) => event.stopPropagation());
      node.addEventListener("wheel", (event) => event.stopPropagation());
    });
    this.renderAdminBrainrotOptions("");
    card.append(header, this.adminMenuGrid, this.adminSpawnSection, this.adminPrompt);
    this.adminForm.appendChild(card);
    host.appendChild(this.adminForm);
  }

  createAdminLoginForm() {
    const host = document.getElementById("game");
    if (!host || this.adminLoginForm) return;
    this.adminLoginForm = document.createElement("div");
    this.adminLoginForm.className = "admin-login-dom";
    const card = document.createElement("form");
    card.className = "admin-login-card";
    const title = document.createElement("h2");
    title.textContent = "Admin Login";
    this.adminLoginStatus = document.createElement("p");
    this.adminLoginStatus.textContent = "Authorized users only.";
    this.adminUsernameInput = document.createElement("input");
    this.adminUsernameInput.type = "text";
    this.adminUsernameInput.placeholder = "usuario";
    this.adminUsernameInput.autocomplete = "username";
    this.adminPasswordInput = document.createElement("input");
    this.adminPasswordInput.type = "password";
    this.adminPasswordInput.placeholder = "clave";
    this.adminPasswordInput.autocomplete = "current-password";
    const actions = document.createElement("div");
    actions.className = "admin-login-actions";
    const login = document.createElement("button");
    login.type = "submit";
    login.textContent = "LOGIN";
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.textContent = "BACK";
    cancel.addEventListener("click", (event) => {
      event.preventDefault();
      this.hideAdminLogin();
    });
    actions.append(login, cancel);
    card.append(title, this.adminLoginStatus, this.adminUsernameInput, this.adminPasswordInput, actions);
    card.addEventListener("submit", (event) => {
      event.preventDefault();
      this.handleAdminLogin();
    });
    this.adminLoginForm.addEventListener("pointerdown", (event) => event.stopPropagation());
    this.adminLoginForm.addEventListener("keydown", (event) => {
      const typingField = ["INPUT", "TEXTAREA", "SELECT"].includes(event.target?.tagName) || event.target?.isContentEditable;
      if (event.key === "Escape" || (event.key === "Backspace" && !typingField)) {
        event.preventDefault();
        this.hideAdminLogin();
      }
      event.stopPropagation();
    });
    this.adminLoginForm.appendChild(card);
    host.appendChild(this.adminLoginForm);
  }

  showAdminLogin() {
    this.inventoryPanel?.setVisible(false);
    this.adminLoginStatus.textContent = "Authorized users only.";
    this.adminLoginForm?.classList.add("is-visible");
    this.adminUsernameInput.value = "";
    this.adminPasswordInput.value = "";
    this.adminUsernameInput.focus({ preventScroll: true });
  }

  hideAdminLogin() {
    this.adminLoginForm?.classList.remove("is-visible");
  }

  handleAdminLogin() {
    const user = this.adminUsernameInput?.value.trim();
    const pass = this.adminPasswordInput?.value ?? "";
    if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
      this.adminAuthed = true;
      this.hideAdminLogin();
      this.toggleAdminPanel(true);
      return;
    }
    this.adminLoginStatus.textContent = "Usuario o clave incorrecta.";
    this.adminPasswordInput.value = "";
    this.adminPasswordInput.focus({ preventScroll: true });
  }

  renderAdminBrainrotOptions(filter = "") {
    if (!this.adminSuggestionList) return;
    const query = filter.trim().toLowerCase();
    const pool = this.adminSpawnMode === "supreme"
      ? brainrots.filter((brainrot) => this.normalizeTier(brainrot.tier) === "SUPREMO")
      : brainrots;
    const matches = pool
      .filter((brainrot) => brainrot.name.toLowerCase().includes(query))
      .sort((a, b) => a.name.localeCompare(b.name));
    this.adminSuggestionList.innerHTML = "";
    if (!matches.length) {
      const empty = document.createElement("div");
      empty.className = "admin-combo-empty";
      empty.textContent = "No matches";
      this.adminSuggestionList.appendChild(empty);
      return;
    }
    matches.forEach((brainrot) => {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "admin-combo-option";
      option.textContent = `${brainrot.name}  ${this.tierLabel(brainrot)}  Lv ${this.tierFor(brainrot).minLevel}-${this.tierFor(brainrot).maxLevel}`;
      option.addEventListener("click", (event) => {
        event.preventDefault();
        this.adminSearchInput.value = brainrot.name;
        this.setAdminBrainrotDropdownVisible(false);
      });
      this.adminSuggestionList.appendChild(option);
    });
  }

  setAdminBrainrotDropdownVisible(visible) {
    this.adminSuggestionList?.classList.toggle("is-visible", Boolean(visible));
  }

  createInventoryPanel() {
    this.inventoryPanel = this.add.container(0, 0).setScrollFactor(0).setDepth(4500).setVisible(false);
    const shade = this.add.rectangle(0, 0, VIEW_W, VIEW_H, 0x111827, 0.74).setOrigin(0);
    const bg = this.add.graphics();
    bg.fillStyle(0xf7f1de, 1).fillRoundedRect(24, 20, VIEW_W - 48, VIEW_H - 40, 8);
    bg.lineStyle(5, 0x30384f, 1).strokeRoundedRect(24, 20, VIEW_W - 48, VIEW_H - 40, 8);
    bg.fillStyle(0xfffbeb, 1).fillRoundedRect(42, 70, VIEW_W - 84, VIEW_H - 116, 6);
    bg.lineStyle(2, 0xd3c9aa, 1).strokeRoundedRect(42, 70, VIEW_W - 84, VIEW_H - 116, 6);
    const title = this.add.text(48, 34, "Brainrot Inventory", {
      fontFamily: "Courier New",
      fontSize: "26px",
      color: COLORS.panelInk,
      fontStyle: "bold"
    });
    const hint = this.add.text(VIEW_W - 326, 40, "I: toggle   ESC: close   E: heal", {
      fontFamily: "Courier New",
      fontSize: "13px",
      color: "#56617c",
      fontStyle: "bold"
    });
    const showcaseBg = this.add.graphics();
    showcaseBg.fillStyle(0xffffff, 0.82).fillRoundedRect(58, 88, 284, 376, 6);
    showcaseBg.lineStyle(2, 0xd3c9aa, 1).strokeRoundedRect(58, 88, 284, 376, 6);
    const showcaseTitle = this.add.text(78, 110, "Active Brainrot", {
      fontFamily: "Courier New",
      fontSize: "16px",
      color: COLORS.panelInk,
      fontStyle: "bold"
    });
    this.inventoryShowcaseIcon = this.add.image(200, 240, "starterBrainrot").setOrigin(0.5);
    this.inventoryShowcaseLabel = this.add.text(78, 356, "", {
      fontFamily: "Courier New",
      fontSize: "15px",
      color: COLORS.panelInk,
      fontStyle: "bold",
      lineSpacing: 4,
      wordWrap: { width: 240 }
    });
    this.inventoryRows = [];
    const rowParts = [];
    for (let i = 0; i < 8; i += 1) {
      const col = i % 4;
      const cardX = 364 + col * 136;
      const cardY = 88 + Math.floor(i / 4) * 202;
      const rowBg = this.add.graphics();
      rowBg.fillStyle(0xffffff, 0.72).fillRoundedRect(cardX, cardY, 122, 176, 6);
      rowBg.lineStyle(2, 0xd3c9aa, 1).strokeRoundedRect(cardX, cardY, 122, 176, 6);
      const icon = this.add.image(cardX + 61, cardY + 54, "starterBrainrot").setOrigin(0.5);
      const label = this.add.text(cardX + 10, cardY + 104, "", {
        fontFamily: "Courier New",
        fontSize: "10px",
        color: COLORS.panelInk,
        fontStyle: "bold",
        lineSpacing: 2,
        wordWrap: { width: 102 }
      });
      const expBack = this.add.graphics();
      const expBar = this.add.graphics();
      const hit = this.add.rectangle(cardX, cardY, 122, 176, 0xffffff, 0.001).setOrigin(0);
      hit.setInteractive({ useHandCursor: true });
      hit.on("pointerdown", () => {
        this.lastInventoryPhaserClickAt = this.time.now;
        this.selectInventoryBrainrot(this.inventoryPage * this.inventoryRows.length + i);
      });
      this.inventoryRows.push({ rowBg, icon, label, expBack, expBar, hit, cardX, cardY });
      rowParts.push(rowBg, icon, label, expBack, expBar, hit);
    }
    this.inventoryEmptyText = this.add.text(VIEW_W / 2, VIEW_H / 2, "No brainrots yet.", {
      fontFamily: "Courier New",
      fontSize: "22px",
      color: COLORS.panelInk,
      fontStyle: "bold"
    }).setOrigin(0.5);
    this.inventoryActionText = this.add.text(58, 474, "", {
      fontFamily: "Courier New",
      fontSize: "12px",
      color: COLORS.panelInk,
      fontStyle: "bold",
      wordWrap: { width: 284 }
    });
    this.inventoryActions = {
      active: this.makeInventoryActionButton(364, 470, 102, "ACTIVE", () => this.activateSelectedBrainrot()),
      left: this.makeInventoryActionButton(476, 470, 82, "< MOVE", () => this.moveInventorySelected(-1)),
      right: this.makeInventoryActionButton(568, 470, 82, "MOVE >", () => this.moveInventorySelected(1)),
      delete: this.makeInventoryActionButton(660, 470, 84, "DELETE", () => this.requestDeleteSelectedBrainrot()),
      pagePrev: this.makeInventoryActionButton(754, 470, 58, "PAGE<", () => this.changeInventoryPage(-1)),
      pageNext: this.makeInventoryActionButton(822, 470, 58, "PAGE>", () => this.changeInventoryPage(1)),
      yes: this.makeInventoryActionButton(754, 470, 58, "YES", () => this.confirmDeleteSelectedBrainrot(true)),
      no: this.makeInventoryActionButton(822, 470, 50, "NO", () => this.confirmDeleteSelectedBrainrot(false))
    };
    this.inventoryPanel.add([
      shade,
      bg,
      title,
      hint,
      showcaseBg,
      showcaseTitle,
      this.inventoryShowcaseIcon,
      this.inventoryShowcaseLabel,
      ...rowParts,
      this.inventoryEmptyText,
      this.inventoryActionText,
      ...Object.values(this.inventoryActions).map((action) => action.button)
    ]);
    this.updateInventoryPanel();
  }

  createBattleOverlay() {
    this.battle = this.add.container(0, 0).setScrollFactor(0).setDepth(5000).setVisible(false);
    const backdrop = this.add.graphics();
    backdrop.fillStyle(0x9bd67e, 1).fillRect(0, 0, VIEW_W, 278);
    backdrop.fillStyle(0x6fbd6d, 1).fillRect(0, 278, VIEW_W, 128);
    backdrop.fillStyle(0xc7dea0, 1).fillRect(0, 364, VIEW_W, 176);
    backdrop.lineStyle(2, 0x75b56c, 0.45);
    for (let y = 42; y < 376; y += 42) {
      backdrop.lineBetween(0, y, VIEW_W, y - 18);
    }
    const groundEnemy = this.add.ellipse(650, 178, 250, 58, 0xd7eab6, 1);
    const groundPlayer = this.add.ellipse(256, 342, 280, 66, 0xbfd8a0, 1);
    this.enemySprite = this.add.image(650, 128, "brainrot-Skibidi Sprout").setScale(3);
    this.playerSprite = this.add.image(250, 292, "starterBrainrot").setScale(3.1);
    this.enemyBox = this.makeStatusBox(72, 58, 314, 82);
    this.playerBox = this.makeStatusBox(572, 290, 314, 82);
    this.dialogueBox = this.add.graphics();
    this.dialogueBox.fillStyle(0xf7f1de, 1).fillRoundedRect(36, 388, 888, 132, 6);
    this.dialogueBox.lineStyle(4, 0x30384f, 1).strokeRoundedRect(36, 388, 888, 132, 6);
    this.dialogueText = this.add.text(60, 410, "", {
      fontFamily: "Courier New",
      fontSize: "24px",
      color: COLORS.panelInk,
      wordWrap: { width: 520 }
    });
    this.moveButtons = [];
    this.battleButtonRegions = [];
    for (let i = 0; i < 4; i += 1) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 590 + col * 156;
      const y = 408 + row * 38;
      const button = this.add.container(x, y);
      const bg = this.add.graphics();
      bg.fillStyle(0xffffff, 1).fillRoundedRect(0, 0, 138, 30, 4);
      bg.lineStyle(3, 0x56617c, 1).strokeRoundedRect(0, 0, 138, 30, 4);
      const label = this.add.text(12, 6, "", { fontFamily: "Courier New", fontSize: "13px", color: COLORS.panelInk, fontStyle: "bold" });
      button.add([bg, label]);
      button.setSize(138, 30);
      button.setInteractive(new Phaser.Geom.Rectangle(0, 0, 138, 30), Phaser.Geom.Rectangle.Contains);
      button.input.cursor = "pointer";
      button.on("pointerdown", () => {
        this.lastBattleButtonPhaserClickAt = this.time.now;
        this.handleBattleButton(i);
      });
      button.on("pointerover", () => {
        bg.clear();
        bg.fillStyle(0xfff3ba, 1).fillRoundedRect(0, 0, 138, 30, 4);
        bg.lineStyle(3, 0xe6575e, 1).strokeRoundedRect(0, 0, 138, 30, 4);
      });
      button.on("pointerout", () => {
        bg.clear();
        bg.fillStyle(0xffffff, 1).fillRoundedRect(0, 0, 138, 30, 4);
        bg.lineStyle(3, 0x56617c, 1).strokeRoundedRect(0, 0, 138, 30, 4);
      });
      this.moveButtons.push({ button, label });
      this.battleButtonRegions.push({
        rect: new Phaser.Geom.Rectangle(x, y, 138, 30),
        index: i
      });
    }
    this.backButton = this.makeBattleBackButton(92, 448);
    this.battle.add([
      backdrop,
      groundEnemy,
      groundPlayer,
      this.enemySprite,
      this.playerSprite,
      ...this.enemyBox.parts,
      ...this.playerBox.parts,
      this.dialogueBox,
      this.dialogueText,
      ...this.moveButtons.map((item) => item.button),
      this.backButton.button
    ]);
  }

  makeBattleBackButton(x, y) {
    const button = this.add.container(x, y).setVisible(false);
    const bg = this.add.graphics();
    bg.fillStyle(0xffffff, 1).fillRoundedRect(0, 0, 120, 30, 4);
    bg.lineStyle(3, 0x56617c, 1).strokeRoundedRect(0, 0, 120, 30, 4);
    const label = this.add.text(14, 6, "Back", {
      fontFamily: "Courier New",
      fontSize: "13px",
      color: COLORS.panelInk,
      fontStyle: "bold"
    });
    button.add([bg, label]);
    button.setSize(120, 30);
    button.setInteractive(new Phaser.Geom.Rectangle(0, 0, 120, 30), Phaser.Geom.Rectangle.Contains);
    button.on("pointerdown", () => {
      this.lastBattleButtonPhaserClickAt = this.time.now;
      this.handleBattleBack();
    });
    return { button, rect: new Phaser.Geom.Rectangle(x, y, 120, 30) };
  }

  makeStatusBox(x, y, w, h) {
    const bg = this.add.graphics();
    bg.fillStyle(0xf7f1de, 1).fillRoundedRect(x, y, w, h, 4);
    bg.lineStyle(3, 0x30384f, 1).strokeRoundedRect(x, y, w, h, 4);
    const name = this.add.text(x + 16, y + 8, "", { fontFamily: "Courier New", fontSize: "16px", color: COLORS.panelInk, fontStyle: "bold" });
    const mutation = this.add.text(x + 16, y + 29, "", { fontFamily: "Courier New", fontSize: "12px", color: "#e6575e", fontStyle: "bold" });
    const tier = this.add.text(x + w - 18, y + 31, "", { fontFamily: "Courier New", fontSize: "12px", color: "#56617c", fontStyle: "bold" }).setOrigin(1, 0);
    const level = this.add.text(x + w - 68, y + 14, "", { fontFamily: "Courier New", fontSize: "14px", color: COLORS.panelInk, fontStyle: "bold" });
    const hpLabel = this.add.text(x + 20, y + 55, "HP", { fontFamily: "Courier New", fontSize: "12px", color: "#e6575e", fontStyle: "bold" });
    const barBack = this.add.rectangle(x + 72, y + 63, 190, 10, 0x30384f).setOrigin(0, 0.5);
    const bar = this.add.rectangle(x + 74, y + 63, 186, 6, 0x4fc46b).setOrigin(0, 0.5);
    const expLabel = this.add.text(x + 20, y + 70, "EXP", { fontFamily: "Courier New", fontSize: "10px", color: "#56617c", fontStyle: "bold" });
    const expBarBack = this.add.rectangle(x + 72, y + 76, 190, 6, 0x56617c).setOrigin(0, 0.5);
    const expBar = this.add.rectangle(x + 74, y + 76, 186, 3, 0xf5c85b).setOrigin(0, 0.5);
    return { name, mutation, tier, level, bar, expLabel, expBarBack, expBar, parts: [bg, name, mutation, tier, level, hpLabel, barBack, bar, expLabel, expBarBack, expBar] };
  }

  update(_time, delta) {
    if (!this.homeStarted) {
      if (this.profileOverlay?.visible) return;
      if (
        Phaser.Input.Keyboard.JustDown(this.keys.enter)
        || Phaser.Input.Keyboard.JustDown(this.keys.space)
      ) {
        this.startHomeGame();
      }
      return;
    }
    this.clearExpiredAdminEvent();
    this.updateMobileControls();
    this.updateEventEffects(delta);
    if (this.strawberrySpawnLockUntil && this.time.now < this.strawberrySpawnLockUntil) {
      this.player.anims.stop();
      this.player.setFrame(this.playerIdleFrames[this.playerDirection] ?? this.playerIdleFrames.down);
      this.doorPrompt?.setVisible(false);
      return;
    }
    if (this.adminPanel?.visible) {
      this.updateAdminPanel();
      if (Phaser.Input.Keyboard.JustDown(this.keys.esc)) this.toggleAdminPanel(false);
      this.player.anims.stop();
      this.player.setFrame(this.playerIdleFrames[this.playerDirection] ?? this.playerIdleFrames.down);
      return;
    }
    if (this.inBattle) {
	      if (this.adminKeepChoiceActive) {
	        if (Phaser.Input.Keyboard.JustDown(this.keys.one)) this.handleAdminKeepChoice(true);
	        if (Phaser.Input.Keyboard.JustDown(this.keys.two)) this.handleAdminKeepChoice(false);
	        return;
	      }
	      if (this.starterEncounterActive) return;
	      if (this.captureChoiceActive) {
        if (Phaser.Input.Keyboard.JustDown(this.keys.one)) this.handleCaptureChoice(true);
        if (Phaser.Input.Keyboard.JustDown(this.keys.two)) this.handleCaptureChoice(false);
        return;
      }
      if (
        Phaser.Input.Keyboard.JustDown(this.keys.esc)
        || Phaser.Input.Keyboard.JustDown(this.keys.backspace)
      ) {
        this.handleBattleBack();
        return;
      }
      if (this.battleMenuMode === "main") {
        if (Phaser.Input.Keyboard.JustDown(this.keys.one)) this.showMoveMenu();
        if (Phaser.Input.Keyboard.JustDown(this.keys.two)) this.showSwitchMenu();
        if (Phaser.Input.Keyboard.JustDown(this.keys.three)) this.tryEscapeBattle();
        return;
      }
      if (this.battleMenuMode === "switch") {
        if (Phaser.Input.Keyboard.JustDown(this.keys.one)) this.switchToInventoryBrainrot(0);
        if (Phaser.Input.Keyboard.JustDown(this.keys.two)) this.switchToInventoryBrainrot(1);
        if (Phaser.Input.Keyboard.JustDown(this.keys.three)) this.switchToInventoryBrainrot(2);
        if (Phaser.Input.Keyboard.JustDown(this.keys.four)) this.switchToInventoryBrainrot(3);
        return;
      }
      if (this.battleMenuMode !== "moves") return;
      if (this.time.now < this.battleInputBlockUntil) return;
      if (Phaser.Input.Keyboard.JustDown(this.keys.one)) this.useMove(0);
      if (Phaser.Input.Keyboard.JustDown(this.keys.two)) this.useMove(1);
      if (Phaser.Input.Keyboard.JustDown(this.keys.three)) this.useMove(2);
      if (Phaser.Input.Keyboard.JustDown(this.keys.four)) this.useMove(3);
      return;
    }
    if (this.inventoryPanel?.visible) {
      if (Phaser.Input.Keyboard.JustDown(this.keys.esc)) {
        this.inventoryDeleteConfirmIndex = null;
        this.inventoryPanel.setVisible(false);
      }
      this.player.anims.stop();
      this.player.setFrame(this.playerIdleFrames[this.playerDirection] ?? this.playerIdleFrames.down);
      this.doorPrompt?.setVisible(false);
      return;
	    }
	    this.updateDoorPrompt();
	    this.updateNpcWander(delta);
	    this.updateDragonFire();
	    this.movePlayer(delta / 1000);
	  }

  handlePointerDown(pointer) {
    if (!this.homeStarted) {
      if (this.profileOverlay?.visible) {
        const pickedCard = this.profileAvatarCards?.find((card) => Phaser.Geom.Rectangle.Contains(card.rect, pointer.x, pointer.y));
        if (pickedCard) {
          this.selectProfileAvatar(pickedCard.key);
          return;
        }
        if (this.profileContinueRect && Phaser.Geom.Rectangle.Contains(this.profileContinueRect, pointer.x, pointer.y)) {
          this.completeProfileSetup();
          return;
        }
        return;
      }
      if (!this.homeStartRect || Phaser.Geom.Rectangle.Contains(this.homeStartRect, pointer.x, pointer.y)) {
        this.startHomeGame();
      }
      return;
    }
    if (this.isMobilePhone && this.isPointerOnJoystick(pointer) && !this.inBattle && !this.adminPanel?.visible && !this.inventoryPanel?.visible) {
      this.startJoystick(pointer);
      return;
    }
    if (this.adminPanel?.visible) {
      this.handleAdminPointer(pointer.x, pointer.y);
      return;
    }
    if (this.inBattle) {
      this.handleBattlePointer(pointer.x, pointer.y);
      return;
    }
    if (this.inventoryPanel?.visible) {
      this.handleInventoryPointer(pointer.x, pointer.y);
      return;
    }
    const worldPoint = pointer.positionToCamera(this.cameras.main);
    const x = worldPoint.x;
    const y = worldPoint.y;
    if (this.locationMode === "interior") {
      if (Phaser.Geom.Rectangle.Contains(this.interiorExitZone, x, y)) {
        this.leaveInterior();
        return;
      }
      this.moveTarget = { x, y };
      return;
    }
    const npc = this.findNpcAt(x, y, 26);
    if (npc) {
      this.talkToNpc(npc);
      return;
    }
    const door = this.findDoorAt(x, y, 76);
    if (door) {
      this.moveTarget = { x: door.rect.centerX, y: door.rect.bottom + 48 };
      this.showToast(door.label, "Parate frente a la puerta y presiona E.");
      return;
    }
    this.moveTarget = { x, y };
  }

  isPointerOnJoystick(pointer) {
    return Phaser.Math.Distance.Between(pointer.x, pointer.y, this.joystickOrigin.x, this.joystickOrigin.y) <= this.joystickRadius + 26;
  }

  startJoystick(pointer) {
    this.joystickPointerId = pointer.id;
    this.moveTarget = null;
    this.updateJoystick(pointer);
  }

  updateJoystick(pointer) {
    const dx = pointer.x - this.joystickOrigin.x;
    const dy = pointer.y - this.joystickOrigin.y;
    const distance = Math.hypot(dx, dy);
    const clamped = Math.min(distance, this.joystickRadius);
    const angle = Math.atan2(dy, dx);
    const knobX = this.joystickOrigin.x + Math.cos(angle) * clamped;
    const knobY = this.joystickOrigin.y + Math.sin(angle) * clamped;
    this.joystickKnob?.setPosition(knobX, knobY);
    if (distance < 8) {
      this.joystickVector = { x: 0, y: 0 };
      return;
    }
    this.joystickVector = {
      x: Math.cos(angle) * Math.min(1, distance / this.joystickRadius),
      y: Math.sin(angle) * Math.min(1, distance / this.joystickRadius)
    };
  }

  releaseJoystick() {
    this.joystickPointerId = null;
    this.joystickVector = { x: 0, y: 0 };
    this.joystickKnob?.setPosition(this.joystickOrigin.x, this.joystickOrigin.y);
  }

  setAdminSelectedIndex(index) {
    if (!this.adminMenuButtons?.length) return;
    this.adminSelectedIndex = Phaser.Math.Clamp(index, 0, this.adminMenuButtons.length - 1);
    this.updateAdminButtonSelection();
  }

  updateAdminButtonSelection() {
    this.adminMenuButtons?.forEach((button, index) => {
      button.classList.toggle("is-selected", index === this.adminSelectedIndex);
    });
  }

  moveAdminSelection(delta) {
    this.setAdminSelectedIndex((this.adminSelectedIndex ?? 0) + delta);
  }

  activateAdminSelection() {
    const entry = this.adminButtonRegions?.[this.adminSelectedIndex];
    if (!entry) return;
    entry.button?.focus({ preventScroll: true });
    entry.action();
  }

  handleAdminKey(event) {
    const key = event.key.toLowerCase();
    const handledKeys = ["escape", "backspace", "w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", "enter", " ", "e"];
    if (!handledKeys.includes(key)) return;
    event.preventDefault();
    if (key === "escape" || key === "backspace") {
      if (this.adminSpawnFormVisible) {
        this.toggleAdminSpawnForm(false);
      } else {
        this.toggleAdminPanel(false);
      }
      return;
    }
    if (key === "w" || key === "arrowup") this.moveAdminSelection(-3);
    if (key === "s" || key === "arrowdown") this.moveAdminSelection(3);
    if (key === "a" || key === "arrowleft") this.moveAdminSelection(-1);
    if (key === "d" || key === "arrowright") this.moveAdminSelection(1);
    if (key === "enter" || key === " " || key === "e") this.activateAdminSelection();
  }

  handleAdminPointer(x, y) {
    const hit = this.adminButtonRegions?.find((button) => (
      button.rect && Phaser.Geom.Rectangle.Contains(button.rect, x, y)
    ));
    if (hit) {
      this.setAdminSelectedIndex(hit.index ?? 0);
      hit.action();
    }
  }

  handleBattlePointer(x, y) {
    if (this.time.now - this.lastBattleButtonPhaserClickAt < 80) return;
    if (this.backButton?.button.visible && Phaser.Geom.Rectangle.Contains(this.backButton.rect, x, y)) {
      this.handleBattleBack();
      return;
    }
    const hit = this.battleButtonRegions?.find((button) => {
      const item = this.moveButtons[button.index];
      return item?.button.visible && Phaser.Geom.Rectangle.Contains(button.rect, x, y);
    });
    if (hit) this.handleBattleButton(hit.index);
  }

  handleInventoryPointer(x, y) {
    if (this.time.now - this.lastInventoryPhaserClickAt < 80) return;
    const rowHit = this.inventoryRows?.find((row) => (
      row.hit.visible && Phaser.Geom.Rectangle.Contains(new Phaser.Geom.Rectangle(row.cardX, row.cardY, 122, 176), x, y)
    ));
    if (rowHit) {
      const index = this.inventoryRows.indexOf(rowHit);
      this.selectInventoryBrainrot(this.inventoryPage * this.inventoryRows.length + index);
      return;
    }
    const action = Object.values(this.inventoryActions ?? {}).find((item) => (
      item.button.visible && Phaser.Geom.Rectangle.Contains(item.rect, x, y)
    ));
    if (action) action.action();
  }

  handleInventoryKey(event) {
    const key = event.key.toLowerCase();
    if (key === "escape" || key === "backspace" || key === "i") {
      this.inventoryDeleteConfirmIndex = null;
      this.inventoryPanel.setVisible(false);
      return;
    }
    if (this.inventoryDeleteConfirmIndex !== null) {
      if (key === "enter" || key === " " || key === "y" || key === "1") this.confirmDeleteSelectedBrainrot(true);
      if (key === "n" || key === "2") this.confirmDeleteSelectedBrainrot(false);
      return;
    }
    const columns = 4;
    if (key === "w" || key === "arrowup") {
      this.selectInventoryBrainrot(Math.max(0, this.inventorySelectedIndex - columns));
    }
    if (key === "s" || key === "arrowdown") {
      this.selectInventoryBrainrot(Math.min(this.inventory.length - 1, this.inventorySelectedIndex + columns));
    }
    if (key === "a" || key === "arrowleft") {
      if (event.shiftKey) this.moveInventorySelected(-1);
      else this.selectInventoryBrainrot(Math.max(0, this.inventorySelectedIndex - 1));
    }
    if (key === "d" || key === "arrowright") {
      if (event.shiftKey) this.moveInventorySelected(1);
      else this.selectInventoryBrainrot(Math.min(this.inventory.length - 1, this.inventorySelectedIndex + 1));
    }
    if (key === "enter" || key === " ") this.activateSelectedBrainrot();
    if (key === "delete") this.requestDeleteSelectedBrainrot();
    if (key === "pageup" || key === "q") this.changeInventoryPage(-1);
    if (key === "pagedown" || key === "e") this.changeInventoryPage(1);
  }

  movePlayer(dt) {
    const left = this.keys.left.isDown || this.keys.a.isDown;
    const right = this.keys.right.isDown || this.keys.d.isDown;
    const up = this.keys.up.isDown || this.keys.w.isDown;
    const down = this.keys.down.isDown || this.keys.s.isDown;
    const keyboardDx = Number(right) - Number(left);
    const keyboardDy = Number(down) - Number(up);
    const joystickDx = this.joystickVector?.x ?? 0;
    const joystickDy = this.joystickVector?.y ?? 0;
    if (keyboardDx !== 0 || keyboardDy !== 0 || Math.abs(joystickDx) > 0.05 || Math.abs(joystickDy) > 0.05) {
      this.moveTarget = null;
    }
    let dx = keyboardDx || joystickDx;
    let dy = keyboardDy || joystickDy;
    if (dx === 0 && dy === 0 && this.moveTarget) {
      const tx = this.moveTarget.x - this.player.x;
      const ty = this.moveTarget.y - this.player.y;
      const distance = Math.hypot(tx, ty);
      if (distance < 6) {
        this.moveTarget = null;
      } else {
        dx = tx / distance;
        dy = ty / distance;
      }
    }
    let direction = this.playerDirection;
    if (Math.abs(dx) > Math.abs(dy)) direction = dx < 0 ? "left" : "right";
    else if (dy !== 0) direction = dy < 0 ? "up" : "down";
    if ((keyboardDx !== 0 || keyboardDy !== 0) && dx !== 0 && dy !== 0) {
      dx *= 0.72;
      dy *= 0.72;
    }
    const nextX = this.player.x + dx * this.speed * dt;
    const nextY = this.player.y + dy * this.speed * dt;
    let moved = false;
    if (!this.collides(nextX, this.player.y)) {
      this.player.x = nextX;
      moved = moved || dx !== 0;
    } else if (this.moveTarget) {
      this.moveTarget = null;
    }
    if (!this.collides(this.player.x, nextY)) {
      this.player.y = nextY;
      moved = moved || dy !== 0;
    } else if (this.moveTarget) {
      this.moveTarget = null;
    }
    if (dx !== 0 || dy !== 0) {
      this.player.setDepth(Math.floor(this.player.y));
      this.playerDirection = direction;
      this.player.anims.play(`${this.playerAvatarKey}-${direction}`, true);
      if (moved) this.checkTallGrassStep();
      if (this.locationMode === "interior" && dy > 0 && Phaser.Geom.Rectangle.Contains(this.interiorExitZone, this.player.x, this.player.y + 20)) {
        this.leaveInterior();
      }
      return;
    }
    this.player.anims.stop();
    this.player.setFrame(this.playerIdleFrames[this.playerDirection] ?? this.playerIdleFrames.down);
  }

	  collides(px, py) {
	    if (this.locationMode === "interior") {
	      return (
        !Phaser.Geom.Rectangle.Contains(this.interiorWalkRect, px, py + 20)
        || !Phaser.Geom.Rectangle.Contains(this.interiorWalkRect, px - 10, py + 18)
        || !Phaser.Geom.Rectangle.Contains(this.interiorWalkRect, px + 10, py + 18)
        || this.interiorBlockedAt(px, py + 20)
        || this.interiorBlockedAt(px - 10, py + 18)
        || this.interiorBlockedAt(px + 10, py + 18)
      );
    }
    if (!this.isMapMode()) return true;
    if (px < 18 || py < 25 || px > this.mapWorldW - 18 || py > this.mapWorldH - 25) return true;
    if (this.isDoorWalkableAt(px, py + 20)) return false;
    if (this.isTransitionWalkableAt(px, py + 20)) return false;
    if (this.blockedRects?.some((rect) => Phaser.Geom.Rectangle.Contains(rect, px, py + 20))) return true;
    if (this.blockedRects?.some((rect) => Phaser.Geom.Rectangle.Contains(rect, px - 12, py + 18))) return true;
	    if (this.blockedRects?.some((rect) => Phaser.Geom.Rectangle.Contains(rect, px + 12, py + 18))) return true;
	    if (this.npcBlockedAt(px, py + 20)) return true;
	    if (this.npcBlockedAt(px - 10, py + 18)) return true;
	    if (this.npcBlockedAt(px + 10, py + 18)) return true;
	    if (this.mapPixelBlockedAt(px, py + 22)) return true;
	    if (this.mapPixelBlockedAt(px - 10, py + 20)) return true;
	    if (this.mapPixelBlockedAt(px + 10, py + 20)) return true;
	    return false;
	  }

	  npcBlockedAt(x, y, ignoreNpc = null) {
	    if (!this.isMapMode()) return false;
	    return this.mapNpcs?.some((npc) => (
	      npc !== ignoreNpc
	      && npc.mapKey === this.currentMapKey
	      && !npc.hiddenUntilSpawn
	      && npc.bodyRect
	      && Phaser.Geom.Rectangle.Contains(npc.bodyRect, x, y)
	    )) ?? false;
	  }

	  npcTerrainBlockedAt(x, y) {
	    if (x < 18 || y < 25 || x > this.mapWorldW - 18 || y > this.mapWorldH - 25) return true;
	    if (this.isDoorWalkableAt(x, y + 20)) return false;
	    if (this.isTransitionWalkableAt(x, y + 20)) return false;
	    if (this.blockedRects?.some((rect) => Phaser.Geom.Rectangle.Contains(rect, x, y + 20))) return true;
	    if (this.blockedRects?.some((rect) => Phaser.Geom.Rectangle.Contains(rect, x - 12, y + 18))) return true;
	    if (this.blockedRects?.some((rect) => Phaser.Geom.Rectangle.Contains(rect, x + 12, y + 18))) return true;
	    if (this.mapPixelBlockedAt(x, y + 22)) return true;
	    if (this.mapPixelBlockedAt(x - 10, y + 20)) return true;
	    if (this.mapPixelBlockedAt(x + 10, y + 20)) return true;
	    return false;
	  }

  interiorBlockedAt(x, y) {
    return this.interiorBlockers?.some((rect) => Phaser.Geom.Rectangle.Contains(rect, x, y)) ?? false;
  }

  mapPixelBlockedAt(x, y) {
    if (!this.mapCollisionCtx) return false;
    if (x < 0 || y < 0 || x >= this.mapWorldW || y >= this.mapWorldH) return true;
    const { data } = this.mapCollisionCtx.getImageData(Math.floor(x), Math.floor(y), 1, 1);
    return this.isBlockedMapColor(data[0], data[1], data[2], x, y);
  }

  isBlockedMapColor(r, g, b, x, y) {
    if (this.findDoorAt(x, y, 22)) return false;
    if (this.wildGrassRects?.some((rect) => Phaser.Geom.Rectangle.Contains(rect, x, y))) return false;
    if (this.isTransitionWalkableAt(x, y)) return false;
    const isWater = b > 105 && g > 70 && b > r * 1.25 && b >= g * 0.9;
    const isCave = r < 55 && g < 45 && b < 45;
    return isWater || isCave;
  }

  collidesTileMap(px, py) {
    const feet = this.worldToTile(px, py + 20 * SCALE);
    const leftFoot = this.worldToTile(px - 4 * SCALE, py + 18 * SCALE);
    const rightFoot = this.worldToTile(px + 4 * SCALE, py + 18 * SCALE);
    return [feet, leftFoot, rightFoot].some(({ x, y }) => {
      if (x < 0 || y < 0 || x >= WORLD_W || y >= WORLD_H) return true;
      return blocked[y][x];
    });
  }

  worldToTile(x, y) {
    return { x: Math.floor(x / (TILE * SCALE)), y: Math.floor(y / (TILE * SCALE)) };
  }

  checkTallGrassStep() {
    if (!this.isMapMode()) return;
	    if (this.isPlayerInWildGrass()) {
	      const key = `${Math.floor(this.player.x / 24)},${Math.floor(this.player.y / 24)}`;
	      if (key !== this.lastStepTile) {
	        this.lastStepTile = key;
	        if (this.awaitingStarterBrainrot) {
	          if (Math.random() < 0.35) this.startStarterEncounter();
	          return;
	        }
	        if (Math.random() < 0.1) this.startWildBattle();
      }
    }
  }

  prepareStarterQuest() {
    this.awaitingStarterBrainrot = true;
    this.inventory = [];
    this.party = [];
    this.updateInventoryPanel();
    this.showToast("Starter Brainrot", "Ve a la hierba. El primer brainrot que salga sera tuyo.");
  }

	  grantFirstBrainrot() {
	    if (!this.awaitingStarterBrainrot) return;
	    const firstBrainrot = this.pendingStarterBrainrot ?? this.cloneBrainrot(this.pickAdminSpawnTemplate(), this.activeAdminVariant());
	    firstBrainrot.hp = firstBrainrot.maxHp;
	    this.playerBrainrot = firstBrainrot;
	    this.party = [firstBrainrot];
	    this.inventory = [firstBrainrot];
	    this.awaitingStarterBrainrot = false;
	    this.pendingStarterBrainrot = null;
	    if (this.userProfile) {
	      this.userProfile.hasFirstBrainrot = true;
	      this.saveUserProfile();
	    }
	    this.updateInventoryPanel();
	    this.showToast("First Brainrot", `${this.brainrotLabel(firstBrainrot)} joined you. Now wild fights begin.`);
	  }

	  startStarterEncounter() {
	    if (!this.awaitingStarterBrainrot || this.inBattle || this.starterEncounterActive) return;
	    const template = this.pickAdminSpawnTemplate();
    this.recordSpawnEconomy(template.name);
	    const firstBrainrot = this.cloneBrainrot(template, this.activeAdminVariant());
	    firstBrainrot.hp = firstBrainrot.maxHp;
	    this.pendingStarterBrainrot = firstBrainrot;
	    this.startBattle({
	      enemyBrainrot: firstBrainrot,
	      noPlayerBrainrot: true,
	      starterEncounter: true,
	      introText: `${this.brainrotLabel(firstBrainrot)} appeared!\nThis will be your first brainrot.`
	    });
	  }

	  showStarterEncounterPrompt(introText) {
	    this.starterEncounterActive = true;
	    this.battleMenuMode = "starter";
	    this.turnLocked = true;
	    this.dialogueText.setText(introText);
	    this.moveButtons.forEach((item) => item.button.setVisible(false));
	    this.backButton?.button.setVisible(false);
	    this.time.delayedCall(1500, () => this.finishStarterEncounter());
	  }

	  finishStarterEncounter() {
	    if (!this.starterEncounterActive || !this.pendingStarterBrainrot) return;
	    const starterBrainrot = this.pendingStarterBrainrot;
	    this.grantFirstBrainrot();
	    this.starterEncounterActive = false;
	    this.battleNoPlayerBrainrot = false;
	    this.endBattle(
	      `${this.brainrotLabel(starterBrainrot)} joined you!`,
	      `${this.brainrotLabel(starterBrainrot)} is your first brainrot.`
	    );
	  }

  isPlayerInWildGrass() {
    return (
      this.isMapMode()
      && this.wildGrassRects?.some((rect) => Phaser.Geom.Rectangle.Contains(rect, this.player.x, this.player.y + 20))
    );
  }

  expandedRect(rect, padding) {
    return new Phaser.Geom.Rectangle(rect.x - padding, rect.y - padding, rect.width + padding * 2, rect.height + padding * 2);
  }

  isTransitionWalkableAt(x, y) {
    return this.doors?.some((door) => (
      door.toMap
      && Phaser.Geom.Rectangle.Contains(this.expandedRect(door.rect, 44), x, y)
    )) ?? false;
  }

  isDoorWalkableAt(x, y) {
    return this.doors?.some((door) => {
      const padding = door.toMap ? 44 : 34;
      return Phaser.Geom.Rectangle.Contains(this.expandedRect(door.rect, padding), x, y);
    }) ?? false;
  }

  findDoorAt(x, y, padding = 0) {
    return this.doors?.find((door) => Phaser.Geom.Rectangle.Contains(this.expandedRect(door.rect, padding), x, y));
  }

  findNearbyDoor() {
    if (!this.isMapMode()) return null;
    return this.findDoorInFront();
  }

  findDoorInFront() {
    if (!this.isMapMode()) return null;
    const feetY = this.player.y + 20;
    return this.doors?.find((door) => (
      Math.abs(this.player.x - door.rect.centerX) <= Math.max(30, door.rect.width * 0.65)
      && feetY >= door.rect.bottom + 10
      && feetY <= door.rect.bottom + 82
    ));
  }

  updateDoorPrompt() {
    if (!this.doorPrompt) return;
    this.doorPrompt.setVisible(Boolean(this.findDoorInFront()) && !this.inBattle && !this.inventoryPanel?.visible);
  }

  findNpcAt(x, y, padding = 0) {
    if (!this.isMapMode()) return null;
	    return this.mapNpcs?.find((npc) => (
	      npc.mapKey === this.currentMapKey
	      && !npc.hiddenUntilSpawn
	      && Phaser.Geom.Rectangle.Contains(this.expandedRect(npc.rect, padding), x, y)
	    ));
	  }

	  findNearbyNpc(options = {}) {
	    if (!this.isMapMode()) return null;
	    return this.mapNpcs?.find((npc) => (
	      npc.mapKey === this.currentMapKey
	      && !npc.hiddenUntilSpawn
	      && (!options.battleOnly || npc.battleEnemyName)
	      && Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y) < 76
	    ));
	  }

  talkToNpc(npc) {
    if (!npc || npc.mapKey !== this.currentMapKey) return;
    if (npc.admin) {
      this.toggleAdminPanel(true);
      return;
    }
    if (npc.battleEnemyName) {
      this.moveTarget = null;
      npc.sprite?.anims?.stop();
      npc.fireSprite?.setVisible(false);
      const battleOptions = npc.battleOptions
        ? { ...npc.battleOptions }
        : { enemyName: npc.battleEnemyName };
      battleOptions.introText = battleOptions.introText ?? `${npc.name} wants to battle!`;
      if (npc.key === BLOCKY_STRAWBERRY_AVATAR_KEY) this.despawnStrawberryMapEncounter(false);
      if (npc.key === BLOCKY_DRAGON_AVATAR_KEY) this.despawnDragonMapEncounter(false);
      this.startBattle(battleOptions);
      return;
    }
    const baseIndex = npc.tipIndex ?? Phaser.Math.Between(0, NPC_TIPS.length - 1);
    const roll = Math.random() < 0.55 ? baseIndex : Phaser.Math.Between(0, NPC_TIPS.length - 1);
    this.moveTarget = null;
    npc.sprite?.anims?.stop();
    this.showToast(npc.name ?? "Trainer", NPC_TIPS[roll]);
  }

  tryEnterDoorFromFront() {
    const door = this.findDoorInFront();
    if (!door) return false;
    if (door.toMap) this.enterMapTransition(door);
    else this.enterDoor(door);
    return true;
  }

  tryInteract() {
    if (this.inventoryPanel?.visible) {
      this.inventoryPanel.setVisible(false);
      return true;
    }
    if (this.locationMode === "interior") {
      if (this.currentInterior?.heal) {
        this.tryHealAtMachine();
        return true;
      }
      if (Phaser.Geom.Rectangle.Contains(this.interiorExitZone, this.player.x, this.player.y + 20)) {
        this.leaveInterior();
        return true;
      }
      this.showToast("Door", "Walk to the bottom exit.");
      return true;
    }
    const battleNpc = this.findNearbyNpc({ battleOnly: true });
    if (battleNpc) {
      this.talkToNpc(battleNpc);
      return true;
    }
    const door = this.findNearbyDoor();
    if (door) {
      if (door.toMap) this.enterMapTransition(door);
      else this.enterDoor(door);
      return true;
    }
    const npc = this.findNearbyNpc();
    if (npc) {
      this.talkToNpc(npc);
      return true;
    }
    return false;
  }

  enterDoor(door) {
    if (!door || !this.isMapMode() || door.toMap) return;
    this.moveTarget = null;
    this.locationMode = "interior";
    this.currentInterior = door;
    this.doorPrompt?.setVisible(false);
    this.worldLayer.setVisible(false);
    this.interiorLayer.setVisible(true);
    this.interiorImage.setTexture(door.interior);
    const source = this.textures.get(door.interior).getSourceImage();
    const scale = Math.min(1.36, (VIEW_H - 40) / source.height);
    this.interiorImage.setScale(scale);
    const displayW = source.width * scale;
    const displayH = source.height * scale;
    const imageLeft = (VIEW_W - displayW) / 2;
    const imageTop = (VIEW_H - displayH) / 2;
    const left = imageLeft + 34;
    const top = imageTop + 72;
    const right = imageLeft + displayW - 34;
    const bottom = imageTop + displayH - 28;
    this.interiorWalkRect = new Phaser.Geom.Rectangle(left, top, right - left, bottom - top);
    this.interiorBlockers = (INTERIOR_BLOCKERS[door.key] ?? []).map(([x, y, w, h]) => (
      new Phaser.Geom.Rectangle(imageLeft + x * scale, imageTop + y * scale, w * scale, h * scale)
    ));
    this.interiorExitZone.setPosition(VIEW_W / 2 - 66, bottom - 20);
    this.player.setPosition(VIEW_W / 2, bottom - 42);
    this.playerDirection = "up";
    this.player.setFrame(this.playerIdleFrames.up);
    this.player.setDepth(500);
    this.cameras.main.setBounds(0, 0, VIEW_W, VIEW_H);
    this.cameras.main.centerOn(VIEW_W / 2, VIEW_H / 2);
    this.showToast(door.label, door.heal ? "Press E to heal." : "Press S at the exit to leave.");
  }

  enterMapTransition(door) {
    if (!door?.toMap || !this.isMapMode()) return;
    this.moveTarget = null;
    this.doorPrompt?.setVisible(false);
    this.setMapZone(door.toMap, {
      playerX: door.targetX,
      playerY: door.targetY,
      direction: door.targetDirection ?? "up"
    });
    this.showToast(door.label, door.toMap === "southVillage" ? "Nueva zona conectada. Busca brainrots en la hierba." : "Volviste al pueblo.");
  }

  leaveInterior() {
    if (this.locationMode !== "interior" || !this.currentInterior) return;
    const door = this.currentInterior;
    this.moveTarget = null;
    this.currentInterior = null;
    this.interiorBlockers = [];
    this.interiorLayer.setVisible(false);
    this.worldLayer.setVisible(true);
    this.setMapZone(door.returnMap ?? "overworld");
    this.player.setPosition(door.returnX, door.returnY);
    this.playerDirection = "down";
    this.player.setFrame(this.playerIdleFrames.down);
    this.cameras.main.setBounds(0, 0, this.mapWorldW, this.mapWorldH);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
  }

  showToast(title, text) {
    this.toastTitle.setText(title);
    this.toastText.setText(text);
    this.tweens.killTweensOf(this.toast);
    this.toast.setAlpha(0).setY(VIEW_H - 68);
    this.tweens.add({ targets: this.toast, alpha: 1, y: VIEW_H - 74, duration: 180, ease: "Quad.easeOut" });
    this.time.delayedCall(2600, () => {
      this.tweens.add({ targets: this.toast, alpha: 0, y: VIEW_H - 62, duration: 220, ease: "Quad.easeIn" });
    });
  }

  loadUserProfile() {
    try {
      const raw = window.localStorage?.getItem(PROFILE_STORAGE_KEY);
      if (!raw) return null;
      const profile = JSON.parse(raw);
      if (!profile?.name || !["player", "npcPink", BLOCKY_STRAWBERRY_AVATAR_KEY].includes(profile.avatarKey)) return null;
      const avatarKey = profile.avatarKey === BLOCKY_STRAWBERRY_AVATAR_KEY ? "player" : profile.avatarKey;
      return {
        name: String(profile.name).slice(0, 16),
        avatarKey,
        hasFirstBrainrot: typeof profile.hasFirstBrainrot === "boolean" ? profile.hasFirstBrainrot : true
      };
    } catch (_error) {
      return null;
    }
  }

  saveUserProfile() {
    if (!this.userProfile) return;
    try {
      window.localStorage?.setItem(PROFILE_STORAGE_KEY, JSON.stringify(this.userProfile));
    } catch (_error) {
      // Local storage can be disabled in private browser modes.
    }
  }

  loadGameSession() {
    try {
      const raw = window.localStorage?.getItem(SESSION_STORAGE_KEY);
      if (!raw) return;
      const session = JSON.parse(raw);
      this.spawnEconomy = typeof session.spawnEconomy === "object" && session.spawnEconomy
        ? { ...session.spawnEconomy }
        : {};
      this.inventoryLimit = Phaser.Math.Clamp(
        Number.parseInt(session.inventoryLimit ?? DEFAULT_INVENTORY_LIMIT, 10) || DEFAULT_INVENTORY_LIMIT,
        1,
        99
      );
      const storedInventory = Array.isArray(session.inventory) ? session.inventory : [];
      const hydratedInventory = storedInventory
        .map((item) => this.hydrateBrainrot(item))
        .filter(Boolean)
        .slice(0, this.inventoryLimit);
      if (!hydratedInventory.length) return;
      this.inventory = hydratedInventory;
      const requestedActive = Phaser.Math.Clamp(Number.parseInt(session.activeIndex ?? 0, 10) || 0, 0, hydratedInventory.length - 1);
      this.playerBrainrot = hydratedInventory[requestedActive] ?? hydratedInventory[0];
      this.party = [this.playerBrainrot];
      this.inventorySelectedIndex = requestedActive;
    } catch (_error) {
      // Bad local data should never stop the game from booting.
    }
  }

  saveGameSession() {
    try {
      const activeIndex = Math.max(0, this.inventory.indexOf(this.playerBrainrot));
      window.localStorage?.setItem(SESSION_STORAGE_KEY, JSON.stringify({
        inventoryLimit: this.inventoryLimit ?? DEFAULT_INVENTORY_LIMIT,
        activeIndex,
        spawnEconomy: this.spawnEconomy ?? {},
        inventory: this.inventory.map((brainrot) => this.serializeBrainrot(brainrot))
      }));
    } catch (_error) {
      // Local storage can be unavailable in private windows.
    }
  }

  serializeBrainrot(brainrot) {
    return {
      baseName: brainrot.baseName ?? brainrot.name,
      name: brainrot.name,
      tier: this.normalizeTier(brainrot.tier),
      level: brainrot.level,
      rolledLevel: brainrot.rolledLevel ?? brainrot.level,
      baseMaxHp: brainrot.baseMaxHp ?? brainrot.maxHp,
      maxHp: brainrot.maxHp,
      hp: brainrot.hp,
      brainExp: brainrot.brainExp ?? 0,
      brainExpToNext: brainrot.brainExpToNext ?? expToNextLevel(brainrot.level),
      variantKey: brainrot.variant?.key ?? "NORMAL",
      traits: (brainrot.traits ?? []).map((trait) => trait.key)
    };
  }

  hydrateBrainrot(data) {
    if (!data?.baseName && !data?.name) return null;
    const template = this.findBrainrot(data.baseName ?? data.name) ?? (data.baseName === starter.name || data.name === starter.name ? starter : null);
    if (!template) return null;
    const level = Phaser.Math.Clamp(Number.parseInt(data.level ?? template.level, 10) || template.level, 1, MAX_TRAIT_LEVEL);
    const baseMaxHp = Number.parseInt(data.baseMaxHp ?? template.maxHp, 10) || template.maxHp;
    const maxHp = Number.parseInt(data.maxHp ?? (baseMaxHp + Math.floor(level * 3)), 10) || (baseMaxHp + Math.floor(level * 3));
    const variant = BRAINROT_VARIANTS.find((item) => item.key === (data.variantKey ?? "NORMAL")) ?? NORMAL_VARIANT;
    const traits = (Array.isArray(data.traits) ? data.traits : [])
      .map((key) => BRAINROT_TRAITS[key])
      .filter(Boolean)
      .map((trait) => ({ key: trait.key, label: trait.label, emoji: trait.emoji }));
    return {
      ...template,
      baseName: template.name,
      name: template.name,
      tier: this.normalizeTier(template.tier),
      level,
      rolledLevel: Number.parseInt(data.rolledLevel ?? level, 10) || level,
      baseMaxHp,
      maxHp,
      hp: Phaser.Math.Clamp(Number.parseInt(data.hp ?? maxHp, 10) || maxHp, 0, maxHp),
      brainExp: Math.max(0, Number.parseInt(data.brainExp ?? 0, 10) || 0),
      brainExpToNext: Math.max(1, Number.parseInt(data.brainExpToNext ?? expToNextLevel(level), 10) || expToNextLevel(level)),
      variant,
      traits,
      moves: template.moves.map((move) => ({ ...move }))
    };
  }

  brainrotLabel(brainrot) {
    const details = this.brainrotDetailLine(brainrot);
    return details ? `${brainrot.name} (${details})` : brainrot.name;
  }

  brainrotDetailLine(brainrot) {
    const mutation = brainrot.variant?.label;
    const traits = (brainrot.traits ?? []).map((trait) => `${trait.emoji ?? ""}${trait.label ? ` ${trait.label}` : ""}`.trim());
    return [mutation, ...traits].filter(Boolean).join("  ");
  }

  normalizeTier(tierKey) {
    return {
      COMMON: "SIMPLE",
      OP: "GOAT",
      SUPREME: "SUPREMO"
    }[tierKey] ?? tierKey ?? "SIMPLE";
  }

  tierLabel(brainrot) {
    return BRAINROT_TIERS[this.normalizeTier(brainrot.tier)]?.label ?? "Simple";
  }

  updateInventoryPanel() {
    if (!this.inventoryRows) return;
    if (this.inventorySelectedIndex >= this.inventory.length) this.inventorySelectedIndex = Math.max(0, this.inventory.length - 1);
    if (this.inventoryDeleteConfirmIndex !== null && this.inventoryDeleteConfirmIndex >= this.inventory.length) this.inventoryDeleteConfirmIndex = null;
    const pageSize = this.inventoryRows.length;
    const maxPage = Math.max(0, Math.ceil(this.inventory.length / pageSize) - 1);
    this.inventoryPage = Phaser.Math.Clamp(this.inventoryPage, 0, maxPage);
    if (this.inventorySelectedIndex < this.inventoryPage * pageSize || this.inventorySelectedIndex >= (this.inventoryPage + 1) * pageSize) {
      this.inventoryPage = Math.floor(this.inventorySelectedIndex / pageSize);
    }
    this.inventoryEmptyText.setVisible(this.inventory.length === 0);
    const featured = this.inventory.find((brainrot) => brainrot === this.playerBrainrot) ?? this.inventory[0];
    const hasFeatured = Boolean(featured);
    this.inventoryShowcaseIcon.setVisible(hasFeatured);
    this.inventoryShowcaseLabel.setVisible(hasFeatured);
    if (featured) {
      const details = this.brainrotDetailLine(featured) || "NORMAL";
      const exp = featured.brainExp ?? 0;
      const expNeed = featured.brainExpToNext ?? expToNextLevel(featured.level);
      this.inventoryShowcaseIcon.setTexture(this.displayTextureFor(featured, this.inventoryTextureFor(featured)));
      this.fitImageToBox(this.inventoryShowcaseIcon, 250, 200);
      this.applyVariantTint(this.inventoryShowcaseIcon, featured);
      this.inventoryShowcaseLabel.setText(`${featured.name}\n${this.tierLabel(featured)}  ${details}  Lv ${featured.level}\nHP ${featured.hp}/${featured.maxHp}\nEXP ${exp}/${expNeed}`);
    }
    this.inventoryRows.forEach((row, index) => {
      const inventoryIndex = this.inventoryPage * pageSize + index;
      const brainrot = this.inventory[inventoryIndex];
      const visible = Boolean(brainrot);
      const selected = inventoryIndex === this.inventorySelectedIndex;
      row.rowBg.setVisible(visible);
      row.icon.setVisible(visible);
      row.label.setVisible(visible);
      row.expBack.setVisible(visible);
      row.expBar.setVisible(visible);
      row.hit.setVisible(visible);
      row.expBack.clear();
      row.expBar.clear();
      row.rowBg.clear();
      if (!brainrot) return;
      row.rowBg.fillStyle(selected ? 0xfff3ba : 0xffffff, selected ? 0.94 : 0.72).fillRoundedRect(row.cardX, row.cardY, 122, 176, 6);
      row.rowBg.lineStyle(selected ? 4 : 2, selected ? 0xe6575e : 0xd3c9aa, 1).strokeRoundedRect(row.cardX, row.cardY, 122, 176, 6);
      const details = this.brainrotDetailLine(brainrot) || "NORMAL";
      const exp = brainrot.brainExp ?? 0;
      const expNeed = brainrot.brainExpToNext ?? expToNextLevel(brainrot.level);
      const expRatio = Phaser.Math.Clamp(exp / expNeed, 0, 1);
      row.icon.setTexture(this.displayTextureFor(brainrot, this.inventoryTextureFor(brainrot)));
      this.fitImageToBox(row.icon, 96, 74);
      this.applyVariantTint(row.icon, brainrot);
      row.expBack.fillStyle(0xd6ccb0, 1).fillRoundedRect(row.cardX + 10, row.cardY + 158, 102, 8, 3);
      row.expBar.fillStyle(0x5ba8ff, 1).fillRoundedRect(row.cardX + 10, row.cardY + 158, Math.max(2, 102 * expRatio), 8, 3);
      row.label.setText(`${inventoryIndex + 1}. ${brainrot.name}${brainrot === this.playerBrainrot ? "  ACTIVE" : ""}\n${this.tierLabel(brainrot)}  ${details}  Lv ${brainrot.level}\nHP ${brainrot.hp}/${brainrot.maxHp}  EXP ${exp}/${expNeed}`);
    });
    this.updateInventoryActions();
    this.saveGameSession();
  }

  updateInventoryActions() {
    if (!this.inventoryActions) return;
    const selected = this.inventory[this.inventorySelectedIndex];
    const confirming = this.inventoryDeleteConfirmIndex !== null;
    const setActionVisible = (key, visible) => this.inventoryActions[key].button.setVisible(Boolean(visible));
    setActionVisible("active", selected && !confirming);
    setActionVisible("left", selected && !confirming);
    setActionVisible("right", selected && !confirming);
    setActionVisible("delete", selected && !confirming);
    setActionVisible("pagePrev", !confirming && this.inventoryPage > 0);
    setActionVisible("pageNext", !confirming && this.inventoryPage < Math.max(0, Math.ceil(this.inventory.length / this.inventoryRows.length) - 1));
    setActionVisible("yes", confirming);
    setActionVisible("no", confirming);
    if (!selected) {
      this.inventoryActionText.setText("No brainrot selected.");
      return;
    }
    if (confirming) {
      this.inventoryActionText.setText(`Delete ${this.inventory[this.inventoryDeleteConfirmIndex]?.name ?? "this brainrot"}?\nAre you sure?`);
      return;
    }
    this.inventoryActionText.setText(`Selected: ${selected.name}\nPage ${this.inventoryPage + 1}/${Math.max(1, Math.ceil(this.inventory.length / this.inventoryRows.length))}. Click any card to inspect.`);
  }

  fitImageToBox(image, maxW, maxH) {
    const source = image.texture.getSourceImage();
    const sourceW = source?.width || image.width || maxW;
    const sourceH = source?.height || image.height || maxH;
    image.setScale(Math.min(maxW / sourceW, maxH / sourceH));
  }

  toggleInventory() {
    this.inventoryDeleteConfirmIndex = null;
    this.inventoryPage = Math.floor(this.inventorySelectedIndex / Math.max(1, this.inventoryRows?.length ?? 8));
    this.updateInventoryPanel();
    this.inventoryPanel.setVisible(!this.inventoryPanel.visible);
  }

  changeInventoryPage(direction) {
    const pageSize = this.inventoryRows.length;
    const maxPage = Math.max(0, Math.ceil(this.inventory.length / pageSize) - 1);
    this.inventoryPage = Phaser.Math.Clamp(this.inventoryPage + direction, 0, maxPage);
    const pageStart = this.inventoryPage * pageSize;
    if (this.inventorySelectedIndex < pageStart || this.inventorySelectedIndex >= pageStart + pageSize) {
      this.inventorySelectedIndex = Math.min(pageStart, this.inventory.length - 1);
    }
    this.inventoryDeleteConfirmIndex = null;
    this.updateInventoryPanel();
  }

  toggleAdminPanel(force = null) {
    const visible = this.homeStarted && (force ?? !this.adminPanel.visible);
    if (visible) {
      if (!this.adminAuthed) {
        this.showAdminLogin();
        return;
      }
      this.hideAdminLogin();
      this.inventoryPanel?.setVisible(false);
      this.updateAdminPanel();
      this.setAdminSelectedIndex(this.adminSelectedIndex ?? 0);
    } else {
      this.toggleAdminSpawnForm(false);
      this.hideAdminPrompt();
      this.hideAdminLogin();
    }
    this.adminPanel.setVisible(visible);
    this.adminForm?.classList.toggle("is-visible", visible);
    if (visible) {
      this.updateAdminButtonSelection();
      this.adminMenuButtons?.[this.adminSelectedIndex]?.focus({ preventScroll: true });
    }
  }

  openAdminSpawnForm(mode = "spawn") {
    this.adminSpawnMode = mode;
    if (this.adminSearchInput) this.adminSearchInput.value = "";
    this.toggleAdminSpawnForm(true);
  }

  toggleAdminSpawnForm(force = null) {
    if (!this.adminSpawnSection) return;
    const visible = force ?? !this.adminSpawnFormVisible;
    this.adminSpawnFormVisible = visible;
    this.adminSpawnSection.classList.toggle("is-visible", visible && this.adminPanel?.visible);
    if (visible && this.adminPanel?.visible) {
      this.hideAdminPrompt();
      const mode = this.adminSpawnMode ?? "spawn";
      const titleByMode = {
        spawn: "Spawn a Brainrot",
        supreme: "Spawn Supremo",
        owned: "Add Owned Brainrot"
      };
      if (this.adminSpawnTitle) this.adminSpawnTitle.textContent = titleByMode[mode] ?? titleByMode.spawn;
      if (this.adminSpawnSubmitButton) this.adminSpawnSubmitButton.textContent = mode === "owned" ? "ADD OWNED" : "SPAWN";
      if (this.adminSearchInput) {
        this.adminSearchInput.placeholder = mode === "supreme" ? "supreme name or blank=random" : "brainrot name...";
      }
      this.renderAdminBrainrotOptions(this.adminSearchInput?.value ?? "");
      this.setAdminBrainrotDropdownVisible(true);
      this.adminSearchInput?.focus();
      return;
    }
    this.setAdminBrainrotDropdownVisible(false);
  }

  updateAdminPanel() {
    if (!this.adminStatusText && !this.adminStatusEl) return;
    const activeEvents = this.activeAdminEvents();
    const spawnedTotal = Object.values(this.spawnEconomy ?? {}).reduce((sum, count) => sum + count, 0);
    const eventText = activeEvents.length
      ? activeEvents.map((event) => {
        const seconds = Math.max(0, Math.ceil((event.endsAt - this.time.now) / 1000));
        const luck = event.luck > 1 ? ` ${event.luck}x` : "";
        return `${this.eventIcon(event)} ${event.name}${luck} (${seconds}s)`;
      }).join(" + ")
      : "No active admin event";
    const status = `${this.adminSessionName} | ${eventText} | Economy: ${spawnedTotal} spawned | Inventory: ${this.inventory.length} | Active: ${this.playerBrainrot.name} Lv ${this.playerBrainrot.level}`;
    this.adminStatusText?.setText(status);
    if (this.adminStatusEl) this.adminStatusEl.textContent = status;
  }

  activeAdminEvents() {
    return (this.adminEvents ?? []).filter((event) => event && this.time.now < event.endsAt);
  }

  activeAdminTraits() {
    return this.activeAdminEvents().filter((event) => event.trait);
  }

  hasAdminTrait(traitKey) {
    return this.activeAdminEvents().some((event) => event.trait === traitKey);
  }

  adminLuckMultiplier() {
    return this.activeAdminEvents().reduce((luck, event) => Math.max(luck, event.luck ?? 1), 1);
  }

  activeAdminVariant() {
    const variantEvent = [...this.activeAdminEvents()].reverse().find((event) => event.variant);
    return variantEvent?.variant ?? null;
  }

  makeTraitList(keys = []) {
    return keys
      .map((key) => BRAINROT_TRAITS[key])
      .filter(Boolean)
      .map((trait) => ({ key: trait.key, label: trait.label, emoji: trait.emoji }));
  }

  selectedAdminTraits() {
    const value = this.adminTraitSelect?.value ?? "";
    if (value === "NONE") return [];
    if (!value) return null;
    return this.makeTraitList(value.split(","));
  }

  applyManualTraits(brainrot, traits = null) {
    if (!traits) return brainrot;
    const baseLevel = brainrot.rolledLevel ?? brainrot.level;
    brainrot.traits = traits.map((trait) => ({ ...trait }));
    this.setBrainrotLevel(brainrot, Phaser.Math.Clamp(baseLevel * this.traitLevelMultiplier(brainrot.traits), 1, MAX_TRAIT_LEVEL));
    brainrot.rolledLevel = baseLevel;
    return brainrot;
  }

  recordSpawnEconomy(brainrotOrName) {
    const name = typeof brainrotOrName === "string"
      ? brainrotOrName
      : brainrotOrName?.baseName ?? brainrotOrName?.name;
    if (!name) return;
    this.spawnEconomy[name] = (this.spawnEconomy[name] ?? 0) + 1;
    this.saveGameSession();
    this.updateAdminPanel();
  }

  hideAdminPrompt() {
    if (!this.adminPrompt) return;
    this.adminPromptVisible = false;
    this.adminPrompt.classList.remove("is-visible");
    this.adminPrompt.innerHTML = "";
  }

  showAdminPrompt({ title, fields, submitLabel = "RUN", onSubmit }) {
    if (!this.adminPrompt) return;
    this.toggleAdminSpawnForm(false);
    this.adminPromptVisible = true;
    this.adminPrompt.innerHTML = "";
    const form = document.createElement("form");
    form.className = "admin-action-form";
    const heading = document.createElement("h3");
    heading.textContent = title;
    heading.style.whiteSpace = "pre-wrap";
    const controls = {};
    fields.forEach((field) => {
      const label = document.createElement("label");
      label.className = "admin-action-field";
      const caption = document.createElement("span");
      caption.textContent = field.label;
      let input;
      if (field.type === "select") {
        input = document.createElement("select");
        field.options.forEach((optionData) => {
          const option = document.createElement("option");
          option.value = optionData.value;
          option.textContent = optionData.label;
          input.appendChild(option);
        });
      } else if (field.type === "text") {
        input = document.createElement("input");
        input.type = "text";
        input.maxLength = String(field.maxLength ?? 24);
      } else {
        input = document.createElement("input");
        input.type = "number";
        input.inputMode = "numeric";
        input.min = String(field.min ?? 1);
        input.max = String(field.max ?? 9999);
        input.step = "1";
      }
      input.value = String(field.value ?? "");
      controls[field.key] = input;
      label.append(caption, input);
      form.appendChild(label);
    });
    const actions = document.createElement("div");
    actions.className = "admin-action-buttons";
    const runButton = document.createElement("button");
    runButton.type = "submit";
    runButton.textContent = submitLabel;
    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.textContent = "BACK";
    cancelButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.hideAdminPrompt();
      this.adminMenuButtons?.[this.adminSelectedIndex]?.focus({ preventScroll: true });
    });
    actions.append(runButton, cancelButton);
    form.prepend(heading);
    form.appendChild(actions);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const values = {};
      Object.entries(controls).forEach(([key, input]) => {
        values[key] = input.value;
      });
      onSubmit(values);
    });
    this.adminPrompt.appendChild(form);
    this.adminPrompt.classList.add("is-visible");
    Object.values(controls)[0]?.focus();
  }

  parseAdminNumber(raw, min, max) {
    const value = Number.parseInt(String(raw ?? "").trim(), 10);
    if (!Number.isFinite(value) || value < min) return null;
    return Phaser.Math.Clamp(value, min, max);
  }

  parseAdminLuck() {
    const raw = window.prompt("Luck amount? Choose 1 to 10.", String(this.adminLuckMultiplier() > 1 ? this.adminLuckMultiplier() : 6));
    if (raw === null) return null;
    const luck = Number.parseInt(raw, 10);
    if (!Number.isFinite(luck)) return null;
    return Phaser.Math.Clamp(luck, 1, 10);
  }

  parseAdminLevelBoost() {
    const raw = window.prompt("How many levels should the active brainrot gain?", "50");
    if (raw === null) return null;
    const amount = Number.parseInt(raw, 10);
    if (!Number.isFinite(amount) || amount <= 0) return null;
    return Phaser.Math.Clamp(amount, 1, 9999);
  }

  parseAdminEventDuration(defaultSeconds = 60) {
    const raw = window.prompt("How long should this event run? Seconds:", String(defaultSeconds));
    if (raw === null) return null;
    const seconds = Number.parseInt(raw, 10);
    if (!Number.isFinite(seconds) || seconds <= 0) return null;
    return Phaser.Math.Clamp(seconds, 5, 3600) * 1000;
  }

  openAdminEventsMenu() {
    this.showAdminPrompt({
      title: "Run Event",
      submitLabel: "RUN EVENT",
      fields: [
        {
          key: "event",
          label: "event=",
          type: "select",
          value: "TACO",
          options: [
            { value: "ALL", label: "TODOS" },
            { value: "TACO", label: "🌮 Lluvia de Tacos" },
            { value: "VVS", label: "💎 VVS Event" },
            { value: "MUTATION", label: "✦ Mutation Storm" },
            { value: "DRAGON", label: "Dragon Spawn" }
          ]
        },
        { key: "seconds", label: "seconds=", type: "number", value: 60, min: 5, max: 3600 }
      ],
      onSubmit: ({ event, seconds }) => {
        const durationMs = this.parseAdminNumber(seconds, 5, 3600);
        if (!durationMs) {
          this.showToast("ADMIN EVENT", "Duration must be 5 to 3600 seconds.");
          return;
        }
        this.hideAdminPrompt();
        if (event === "ALL") {
          this.runAdminEvent("Lluvia de Tacos", { trait: "TACO", durationMs: durationMs * 1000 });
          this.runAdminEvent("VVS Event", { trait: "VVS", durationMs: durationMs * 1000 });
          this.runAdminEvent("Mutation Storm", { variant: "PRISMA", durationMs: durationMs * 1000 });
          return;
        }
        if (event === "TACO") this.runAdminEvent("Lluvia de Tacos", { trait: "TACO", durationMs: durationMs * 1000 });
        if (event === "VVS") this.runAdminEvent("VVS Event", { trait: "VVS", durationMs: durationMs * 1000 });
        if (event === "MUTATION") this.runAdminEvent("Mutation Storm", { variant: "PRISMA", durationMs: durationMs * 1000 });
        if (event === "DRAGON") {
          this.spawnDragonMapEncounter({
            enemyName: "Dragon Cannelloni",
            adminSpawned: true,
            durationMs: durationMs * 1000,
            introText: "ADMIN spawned Dragon Cannelloni!"
          });
          this.recordSpawnEconomy("Dragon Cannelloni");
        }
      }
    });
  }

  runAdminLuckEvent() {
    this.showAdminPrompt({
      title: "Run Luck",
      submitLabel: "RUN LUCK",
      fields: [
        { key: "luck", label: "luck x=", type: "number", value: this.adminLuckMultiplier() > 1 ? this.adminLuckMultiplier() : 6, min: 1, max: 10 },
        { key: "seconds", label: "seconds=", type: "number", value: 60, min: 5, max: 3600 }
      ],
      onSubmit: ({ luck: rawLuck, seconds }) => {
        const luck = this.parseAdminNumber(rawLuck, 1, 10);
        const duration = this.parseAdminNumber(seconds, 5, 3600);
        if (!luck) {
          this.showToast("ADMIN", "Luck must be 1 to 10.");
          return;
        }
        if (!duration) {
          this.showToast("ADMIN EVENT", "Duration must be 5 to 3600 seconds.");
          return;
        }
        this.hideAdminPrompt();
        this.runAdminEvent(`${luck}x Luck`, { luck, durationMs: duration * 1000 });
      }
    });
  }

  openAdminEconomyPanel() {
    const entries = Object.entries(this.spawnEconomy ?? {})
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    const topLines = entries.length
      ? entries.map(([name, count], index) => `${index + 1}. ${name}: ${count}`).join("\n")
      : "No brainrots spawned yet.";
    this.showAdminPrompt({
      title: `Economy - Spawned Brainrots\n${topLines}`,
      submitLabel: "RESET",
      fields: [],
      onSubmit: () => {
        this.spawnEconomy = {};
        this.saveGameSession();
        this.hideAdminPrompt();
        this.updateAdminPanel();
        this.showToast("ECONOMY", "Spawn counters reset.");
      }
    });
  }

  runAdminEvent(name, options = {}) {
    const durationMs = options.durationMs ?? ADMIN_EVENT_DURATION;
    const eventKey = options.trait ? `trait:${options.trait}` : options.variant ? `variant:${options.variant}` : "luck";
    const event = {
      key: eventKey,
      name,
      luck: Phaser.Math.Clamp(options.luck ?? 1, 1, 10),
      variant: options.variant ?? null,
      trait: options.trait ?? null,
      endsAt: this.time.now + durationMs
    };
    this.adminEvents = [
      ...this.activeAdminEvents().filter((activeEvent) => activeEvent.key !== eventKey),
      event
    ];
    this.adminEvent = event;
    this.updateAdminPanel();
    this.playAdminEventAnimation(name, options);
    this.showToast("ADMIN EVENT", `${name} started.`);
  }

  clearExpiredAdminEvent() {
    if (!this.adminEvents?.length) return;
    const active = [];
    this.adminEvents.forEach((event) => {
      if (this.time.now >= event.endsAt) {
        this.showToast("ADMIN EVENT", `${event.name} ended.`);
      } else {
        active.push(event);
      }
    });
    if (active.length === this.adminEvents.length) return;
    this.adminEvents = active;
    this.adminEvent = active.at(-1) ?? null;
    this.updateAdminPanel();
    if (!active.length) {
      this.eventEffects?.setVisible(false);
      this.eventScreenEffects?.setVisible(false);
      this.vvsMapTint?.setVisible(false);
      this.eventCountdown?.setVisible(false);
    }
  }

  adminSpawnFromForm() {
    const rawName = this.adminSearchInput?.value?.trim() ?? "";
    const mode = this.adminSpawnMode ?? "spawn";
    let template = this.findBrainrot(rawName);
    if (mode === "supreme" && template && this.normalizeTier(template.tier) !== "SUPREMO") template = null;
    if (mode === "supreme" && (!rawName || !template)) {
      const pool = brainrots.filter((brainrot) => this.normalizeTier(brainrot.tier) === "SUPREMO");
      template = Phaser.Utils.Array.GetRandom(pool);
    }
    if (!template) {
      this.showToast("ADMIN", "Choose a brainrot from the dropdown.");
      this.renderAdminBrainrotOptions(rawName);
      this.setAdminBrainrotDropdownVisible(true);
      return;
    }
    const level = this.parseAdminLevel();
    if (this.adminLevelInput?.value.trim() && !level) {
      this.showToast("ADMIN", "lvl must be a number above 0.");
      return;
    }
    const variantKey = this.adminColorSelect?.value || null;
    const traits = this.selectedAdminTraits();
    if (mode === "owned") {
      this.adminAddBrainrot(template.name, variantKey, level, traits);
      return;
    }
    this.adminSpawnBrainrot(template.name, variantKey, level, traits);
  }

  parseAdminLevel() {
    const raw = this.adminLevelInput?.value.trim();
    if (!raw) return null;
    const level = Number.parseInt(raw, 10);
    if (!Number.isFinite(level) || level <= 0) return null;
    return Phaser.Math.Clamp(level, 1, 9999);
  }

  adminSpawnBrainrot(name = null, variantKey = null, level = null, traits = null) {
    if (this.inBattle) return;
    const template = name ? this.findBrainrot(name) : this.pickAdminSpawnTemplate();
    const variant = variantKey ?? this.activeAdminVariant();
    if (!template) {
      this.showToast("ADMIN", "Brainrot not found.");
      return;
    }
    this.toggleAdminPanel(false);
    this.startBattleAfterSpawnAtmosphere(template, {
      enemyName: template.name,
      enemyVariant: variant,
      enemyLevel: level,
      enemyTraits: traits,
      adminSpawned: true,
      introText: `ADMIN spawned ${template.name}!`
    });
    this.recordSpawnEconomy(template.name);
  }

  adminSpawnByTier(tierKey) {
    if (this.inBattle) return;
    const targetTier = this.normalizeTier(tierKey);
    const pool = brainrots.filter((brainrot) => this.normalizeTier(brainrot.tier) === targetTier);
    if (!pool.length) {
      this.showToast("ADMIN", `No ${tierKey} brainrots found.`);
      return;
    }
    const template = Phaser.Utils.Array.GetRandom(pool);
    this.adminSpawnBrainrot(template.name, this.activeAdminVariant(), null, this.selectedAdminTraits());
  }

  pickAdminSpawnTemplate() {
    return this.pickWeightedBrainrot(brainrots, this.adminLuckMultiplier());
  }

  raritySpawnWeight(template, luck = 1) {
    const tier = this.tierFor(template);
    const cleanLuck = Phaser.Math.Clamp(luck, 1, 10);
    const rarityPower = Math.max(0, tier.order - 1) / 2.2;
    const boost = Math.pow(cleanLuck, rarityPower);
    return Math.max(1, Math.round(tier.spawnWeight * boost));
  }

  pickWeightedBrainrot(pool = brainrots, luck = 1) {
    const options = pool.length ? pool : brainrots;
    const totalWeight = options.reduce((sum, template) => sum + this.raritySpawnWeight(template, luck), 0);
    let roll = Phaser.Math.Between(1, totalWeight);
    for (const template of options) {
      roll -= this.raritySpawnWeight(template, luck);
      if (roll <= 0) return template;
    }
    return options[0];
  }

  adminAddBrainrot(name = null, variantKey = null, level = null, traits = null) {
    const template = name ? this.findBrainrot(name) : this.pickAdminSpawnTemplate();
    const brainrot = this.cloneBrainrot(template, variantKey ?? this.activeAdminVariant());
    this.applyManualTraits(brainrot, traits);
    if (level) this.setBrainrotLevel(brainrot, Phaser.Math.Clamp(level * this.traitLevelMultiplier(brainrot.traits), 1, MAX_TRAIT_LEVEL));
    brainrot.hp = brainrot.maxHp;
    this.ensureInventoryHas(brainrot);
    this.recordSpawnEconomy(brainrot);
    this.updateAdminPanel();
    this.showToast("ADMIN", `${this.brainrotLabel(brainrot)} added.`);
  }

  adminAddAllBrainrots() {
    brainrots.forEach((template) => this.adminAddBrainrot(template.name));
    this.updateAdminPanel();
    this.showToast("ADMIN", "All brainrots added.");
  }

  adminLevelActive(amount = null) {
    if (amount === null) {
      this.showAdminPrompt({
        title: "Level Active Brainrot",
        submitLabel: "ADD LEVELS",
        fields: [
          { key: "levels", label: "levels +=", type: "number", value: 50, min: 1, max: 9999 }
        ],
        onSubmit: ({ levels }) => {
          const boost = this.parseAdminNumber(levels, 1, 9999);
          if (!boost) {
            this.showToast("ADMIN", "Level amount must be above 0.");
            return;
          }
          this.hideAdminPrompt();
          this.adminLevelActive(boost);
        }
      });
      return;
    }
    const boost = amount;
    if (!boost) {
      this.showToast("ADMIN", "Level amount must be above 0.");
      return;
    }
    this.setBrainrotLevel(this.playerBrainrot, this.playerBrainrot.level + boost);
    this.playerBrainrot.brainExp = 0;
    this.updateInventoryPanel();
    this.updateAdminPanel();
    this.showToast("ADMIN", `${this.playerBrainrot.name} +${boost} levels.`);
  }

  adminDeleteActive() {
    if (this.inventory.length <= 1) {
      this.showToast("ADMIN", "Cannot delete your last brainrot.");
      return;
    }
    const deleted = this.playerBrainrot;
    this.inventory = this.inventory.filter((brainrot) => brainrot !== deleted);
    this.playerBrainrot = this.inventory[0];
    this.party[0] = this.playerBrainrot;
    this.updateInventoryPanel();
    this.updateAdminPanel();
    this.showToast("ADMIN", `${deleted.name} deleted.`);
  }

  adminClearInventory() {
    this.inventory = [this.playerBrainrot];
    this.party = [this.playerBrainrot];
    this.updateInventoryPanel();
    this.updateAdminPanel();
    this.showToast("ADMIN", "Inventory cleared except active.");
  }

  adminJoinSession() {
    const session = Phaser.Math.Between(1000, 9999);
    this.adminSessionName = `Joined Session #${session}`;
    const x = Phaser.Math.Between(620, 780);
    const y = Phaser.Math.Between(760, 820);
    this.leaveInterior();
    this.player.setPosition(x, y);
    this.updateAdminPanel();
    this.showToast("ADMIN JOIN", this.adminSessionName);
  }

  adminJoinUser() {
    this.showAdminPrompt({
      title: "Join User Session",
      submitLabel: "JOIN",
      fields: [
        { key: "username", label: "username=", type: "text", value: this.userProfile?.name ?? "" }
      ],
      onSubmit: ({ username }) => {
        const cleanName = String(username ?? "").trim().slice(0, 24);
        if (!cleanName) {
          this.showToast("ADMIN JOIN", "Write a username.");
          return;
        }
        this.hideAdminPrompt();
        this.adminSessionName = `Joined ${cleanName}`;
        this.leaveInterior();
        this.player.setPosition(706, 800);
        this.updateAdminPanel();
        this.showToast("ADMIN JOIN", `Joined ${cleanName}'s session.`);
      }
    });
  }

  selectInventoryBrainrot(index) {
    const brainrot = this.inventory[index];
    if (!brainrot) return;
    this.inventorySelectedIndex = index;
    this.inventoryDeleteConfirmIndex = null;
    this.updateInventoryPanel();
  }

  activateSelectedBrainrot() {
    const brainrot = this.inventory[this.inventorySelectedIndex];
    if (!brainrot) return;
    if (brainrot.hp <= 0) {
      this.showToast("Inventory", "Heal this brainrot first.");
      return;
    }
    this.playerBrainrot = brainrot;
    this.party[0] = brainrot;
    this.updateInventoryPanel();
    this.showToast("Active Brainrot", brainrot.name);
  }

  moveInventorySelected(direction) {
    const from = this.inventorySelectedIndex;
    const to = from + direction;
    if (from < 0 || to < 0 || from >= this.inventory.length || to >= this.inventory.length) return;
    [this.inventory[from], this.inventory[to]] = [this.inventory[to], this.inventory[from]];
    this.inventorySelectedIndex = to;
    this.inventoryDeleteConfirmIndex = null;
    this.updateInventoryPanel();
  }

  requestDeleteSelectedBrainrot() {
    const brainrot = this.inventory[this.inventorySelectedIndex];
    if (!brainrot) return;
    if (this.inventory.length <= 1) {
      this.showToast("Inventory", "You need at least one brainrot.");
      return;
    }
    this.inventoryDeleteConfirmIndex = this.inventorySelectedIndex;
    this.updateInventoryPanel();
  }

  confirmDeleteSelectedBrainrot(confirmed) {
    if (!confirmed) {
      this.inventoryDeleteConfirmIndex = null;
      this.updateInventoryPanel();
      return;
    }
    const index = this.inventoryDeleteConfirmIndex;
    const deleted = this.inventory[index];
    if (!deleted || this.inventory.length <= 1) return;
    this.inventory.splice(index, 1);
    this.party = this.party.filter((brainrot) => brainrot !== deleted);
    if (this.playerBrainrot === deleted) {
      this.playerBrainrot = this.inventory[Math.min(index, this.inventory.length - 1)];
      this.party[0] = this.playerBrainrot;
    }
    if (!this.party.includes(this.playerBrainrot)) this.party.unshift(this.playerBrainrot);
    this.inventorySelectedIndex = Math.min(index, this.inventory.length - 1);
    this.inventoryDeleteConfirmIndex = null;
    this.updateInventoryPanel();
    this.showToast("Inventory", `${deleted.name} deleted.`);
  }

  showMainBattleMenu(message = "What will you do?") {
    this.battleMenuMode = "main";
    this.turnLocked = false;
    this.dialogueText.setText(message);
    this.backButton?.button.setVisible(false);
    this.moveButtons.forEach((item, index) => {
      item.button.setVisible(index < 3);
      if (index === 0) item.label.setText("1 Fight");
      if (index === 1) item.label.setText("2 Switch");
      if (index === 2) item.label.setText("3 Escape");
      if (index > 2) item.label.setText("");
    });
  }

  showMoveMenu(message = "Choose a move.") {
    this.battleMenuMode = "moves";
    this.turnLocked = false;
    this.battleInputBlockUntil = this.time.now + 180;
    this.dialogueText.setText(message);
    this.backButton?.button.setVisible(true);
    this.moveButtons.forEach((item, i) => {
      item.label.setText(this.playerBrainrot.moves[i] ? `${i + 1} ${this.playerBrainrot.moves[i].name}` : "");
      item.button.setVisible(Boolean(this.playerBrainrot.moves[i]));
    });
  }

  handleBattleButton(index) {
    if (this.adminKeepChoiceActive) {
      if (index === 0) this.handleAdminKeepChoice(true);
      if (index === 1) this.handleAdminKeepChoice(false);
      return;
    }
    if (this.captureChoiceActive) {
      if (index === 0) this.handleCaptureChoice(true);
      if (index === 1) this.handleCaptureChoice(false);
      return;
    }
    if (this.battleMenuMode === "main") {
      if (index === 0) this.showMoveMenu();
      if (index === 1) this.showSwitchMenu();
      if (index === 2) this.tryEscapeBattle();
      return;
    }
    if (this.battleMenuMode === "switch") {
      this.switchToInventoryBrainrot(index);
      return;
    }
    if (this.battleMenuMode === "moves") this.useMove(index);
  }

  handleBattleBack() {
    if (this.adminKeepChoiceActive) {
      this.handleAdminKeepChoice(false);
      return;
    }
    if (this.captureChoiceActive) return;
    if (this.battleMenuMode === "moves" || this.battleMenuMode === "switch") {
      this.showMainBattleMenu("What will you do?");
    }
  }

  tryEscapeBattle() {
    if (this.turnLocked || this.escapeAttemptLocked) return;
    this.escapeAttemptLocked = true;
    const tierOrder = this.tierFor(this.enemy).order ?? 1;
    const levelGap = Math.max(-200, Math.min(200, this.enemy.level - this.playerBrainrot.level));
    const chance = Phaser.Math.Clamp(0.82 - tierOrder * 0.055 - levelGap * 0.0015, 0.18, 0.9);
    if (Math.random() < chance) {
      this.endBattle("You escaped safely.", "Escaped safely.");
      return;
    }
    this.dialogueText.setText(`${this.enemy.name} blocked your escape!`);
    this.moveButtons.forEach((item) => item.button.setVisible(false));
    this.backButton?.button.setVisible(false);
    this.time.delayedCall(650, () => {
      this.escapeAttemptLocked = false;
      this.enemyTurn();
    });
  }

  showAdminKeepPrompt(introText = null) {
    if (!this.inBattle || !this.enemy) return;
    this.adminKeepChoiceActive = true;
    this.battleMenuMode = "adminKeep";
    this.turnLocked = true;
    this.pendingCapture = {
      ...this.enemy,
      hp: this.enemy.maxHp,
      brainExp: 0,
      brainExpToNext: expToNextLevel(this.enemy.level),
      traits: (this.enemy.traits ?? []).map((trait) => ({ ...trait })),
      moves: this.enemy.moves.map((move) => ({ ...move }))
    };
    this.dialogueText.setText(`${introText ?? `ADMIN spawned ${this.brainrotLabel(this.enemy)}!`}\nDo you want to keep it without fighting?`);
    this.moveButtons.forEach((item, index) => {
      item.button.setVisible(index < 2);
      item.label.setText(index === 0 ? "1 Yes" : "2 No");
    });
    this.backButton?.button.setVisible(false);
  }

  handleAdminKeepChoice(keep) {
    if (!this.adminKeepChoiceActive || !this.pendingCapture) return;
    const captured = this.pendingCapture;
    this.adminKeepChoiceActive = false;
    this.pendingCapture = null;
    this.turnLocked = false;
    if (keep) {
      captured.hp = captured.maxHp;
      this.inventory.push(captured);
      if (this.party.length < 3) this.party.push(captured);
      this.updateInventoryPanel();
      this.endBattle(
        `${this.brainrotLabel(captured)} joined your inventory.`,
        `Stored ${this.brainrotLabel(captured)}. Press I.`
      );
      return;
    }
    this.showMainBattleMenu("Fight mode resumed.");
  }

  chooseVariant(key) {
    const normalizedKey = key === "PRIMA" ? "PRISMA" : key;
    if (normalizedKey) return BRAINROT_VARIANTS.find((variant) => variant.key === normalizedKey) ?? NORMAL_VARIANT;
    const luck = this.adminLuckMultiplier();
    const totalWeight = BRAINROT_VARIANTS.reduce((sum, variant) => (
      sum + (variant.key === "NORMAL" ? variant.weight : variant.weight * luck)
    ), 0);
    let roll = Phaser.Math.Between(1, totalWeight);
    for (const variant of BRAINROT_VARIANTS) {
      roll -= variant.key === "NORMAL" ? variant.weight : variant.weight * luck;
      if (roll <= 0) return variant;
    }
    return NORMAL_VARIANT;
  }

  rollEventTraits(template) {
    const traitEvents = this.activeAdminTraits();
    if (!traitEvents.length) return [];
    const tierOrder = this.tierFor(template).order ?? 1;
    const luckBoost = Math.max(0, this.adminLuckMultiplier() - 1) * 0.012;
    const tierBoost = Math.max(0, tierOrder - 1) * 0.006;
    return traitEvents.reduce((traits, event) => {
      const eventTrait = BRAINROT_TRAITS[event.trait];
      if (!eventTrait || traits.some((trait) => trait.key === eventTrait.key)) return traits;
      const chance = Phaser.Math.Clamp(eventTrait.baseChance + tierBoost + luckBoost, eventTrait.baseChance, eventTrait.maxChance);
      if (Math.random() <= chance) traits.push({ key: eventTrait.key, label: eventTrait.label, emoji: eventTrait.emoji });
      return traits;
    }, []);
  }

  traitLevelMultiplier(traits = []) {
    return traits.reduce((multiplier, trait) => {
      const traitConfig = BRAINROT_TRAITS[trait.key];
      return multiplier * (traitConfig?.levelMultiplier ?? 1);
    }, 1);
  }

  tierFor(template) {
    return BRAINROT_TIERS[this.normalizeTier(template.tier)] ?? BRAINROT_TIERS.SIMPLE;
  }

  rollBrainrotLevel(template) {
    const tier = this.tierFor(template);
    return Phaser.Math.Between(tier.minLevel, tier.maxLevel);
  }

  cloneBrainrot(template, variantKey = "NORMAL") {
    const variant = this.chooseVariant(variantKey);
    const baseLevel = template.lockLevel ? template.level : this.rollBrainrotLevel(template);
    const traits = [
      ...(template.traits ?? []).map((trait) => ({ ...trait })),
      ...this.rollEventTraits(template)
    ];
    const level = Phaser.Math.Clamp(baseLevel * this.traitLevelMultiplier(traits), 1, MAX_TRAIT_LEVEL);
    const scaledMaxHp = template.maxHp + Math.floor(level * 3);
    const hp = template.hp ?? scaledMaxHp;
    return {
      ...template,
      baseName: template.name,
      name: template.name,
      level,
      rolledLevel: baseLevel,
      tier: this.normalizeTier(template.tier),
      baseMaxHp: template.maxHp,
      maxHp: scaledMaxHp,
      hp: Math.min(hp, scaledMaxHp),
      brainExp: template.brainExp ?? 0,
      brainExpToNext: template.brainExpToNext ?? expToNextLevel(level),
      variant,
      traits,
      moves: template.moves.map((move) => ({ ...move }))
    };
  }

  setBrainrotLevel(brainrot, level) {
    const cleanLevel = Phaser.Math.Clamp(Math.floor(level), 1, 9999);
    brainrot.level = cleanLevel;
    brainrot.baseMaxHp = brainrot.baseMaxHp ?? brainrot.maxHp;
    brainrot.maxHp = brainrot.baseMaxHp + Math.floor(cleanLevel * 3);
    brainrot.hp = brainrot.maxHp;
    brainrot.brainExp = 0;
    brainrot.brainExpToNext = expToNextLevel(cleanLevel);
  }

  findBrainrot(name) {
    const query = String(name ?? "").trim().toLowerCase();
    return brainrots.find((brainrot) => brainrot.name.toLowerCase() === query);
  }

  frontTextureFor(brainrot) {
    return brainrot.frontTextureKey ?? `brainrot-${brainrot.baseName ?? brainrot.name}-front`;
  }

  backTextureFor(brainrot) {
    if (brainrot.backTextureKey) return brainrot.backTextureKey;
    const generatedBackKey = `brainrot-${brainrot.baseName ?? brainrot.name}-back`;
    if (this.textures.exists(generatedBackKey)) return generatedBackKey;
    return this.frontTextureFor(brainrot);
  }

  backScaleFor(brainrot) {
    return brainrot.backScale ?? brainrot.frontScale ?? 3.1;
  }

  battleScaleFor(brainrot, facing = "front") {
    const textureKey = facing === "back" ? this.backTextureFor(brainrot) : this.frontTextureFor(brainrot);
    const source = this.textures.get(textureKey)?.getSourceImage();
    const sourceW = source?.width || 96;
    const sourceH = source?.height || 96;
    const maxW = facing === "back" ? 300 : 280;
    const maxH = facing === "back" ? 240 : 220;
    return Math.min(maxW / sourceW, maxH / sourceH);
  }

  inventoryTextureFor(brainrot) {
    return brainrot.frontTextureKey ? this.frontTextureFor(brainrot) : this.backTextureFor(brainrot);
  }

  displayTextureFor(brainrot, baseKey) {
    if (!brainrot?.variant || brainrot.variant.key === "NORMAL") return baseKey;
    return this.variantTextureFor(brainrot, baseKey);
  }

  variantTextureFor(brainrot, baseKey) {
    const variant = brainrot.variant;
    const variantKey = `${baseKey}-${variant.key}-solid`;
    if (this.textures.exists(variantKey)) return variantKey;
    const sourceTexture = this.textures.get(baseKey);
    if (!sourceTexture) return baseKey;
    const source = sourceTexture.getSourceImage();
    const width = source?.width || 72;
    const height = source?.height || 72;
    const texture = this.textures.createCanvas(variantKey, width, height);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(source, 0, 0, width, height);
    const image = ctx.getImageData(0, 0, width, height);
    const target = this.hexToRgb(variant.color ?? "#ffffff");
    const alt = this.hexToRgb(variant.altColor ?? variant.color ?? "#ffffff");
    for (let i = 0; i < image.data.length; i += 4) {
      const r = image.data[i];
      const g = image.data[i + 1];
      const b = image.data[i + 2];
      const alpha = image.data[i + 3];
      if (alpha < 18) continue;
      const nearBlack = r < 22 && g < 22 && b < 22;
      const nearWhite = r > 232 && g > 232 && b > 232;
      if (nearBlack || nearWhite) continue;
      const pixelIndex = i / 4;
      const x = pixelIndex % width;
      const y = Math.floor(pixelIndex / width);
      const color = variant.key === "PRISMA" && (x + y) % 18 > 8 ? alt : target;
      const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
      const shade = 0.45 + lum * 0.75;
      image.data[i] = Math.min(255, Math.round(color.r * shade));
      image.data[i + 1] = Math.min(255, Math.round(color.g * shade));
      image.data[i + 2] = Math.min(255, Math.round(color.b * shade));
    }
    ctx.putImageData(image, 0, 0);
    texture.refresh();
    return variantKey;
  }

  hexToRgb(hex) {
    const normalized = hex.replace("#", "");
    const value = Number.parseInt(normalized.length === 3
      ? normalized.split("").map((char) => char + char).join("")
      : normalized, 16);
    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255
    };
  }

  ensureInventoryHas(brainrot) {
    const exists = this.inventory.some((owned) => (
      owned === brainrot
      || (
        owned.baseName === brainrot.baseName
        && owned.variant?.key === brainrot.variant?.key
      )
    ));
    if (!exists) this.inventory.unshift(brainrot);
    if (!this.party.includes(brainrot)) this.party[0] = brainrot;
    this.updateInventoryPanel();
  }

  findOwnedBrainrot(name, variantKey = "NORMAL") {
    return this.inventory.find((owned) => (
      (owned.baseName === name || owned.name === name)
      && (owned.variant?.key ?? "NORMAL") === variantKey
    ));
  }

  getSwitchCandidates() {
    return this.inventory
      .filter((brainrot) => brainrot !== this.playerBrainrot && brainrot.hp > 0)
      .slice(0, 4);
  }

  showSwitchMenu() {
    const candidates = this.getSwitchCandidates();
    if (!candidates.length) {
      this.dialogueText.setText("No healthy brainrots to switch.");
      this.time.delayedCall(650, () => {
        if (this.inBattle && this.battleMenuMode === "main") this.showMainBattleMenu("What will you do?");
      });
      return;
    }
    this.battleMenuMode = "switch";
    this.turnLocked = false;
    this.dialogueText.setText("Switch to which brainrot?");
    this.backButton?.button.setVisible(true);
    this.moveButtons.forEach((item, index) => {
      const brainrot = candidates[index];
      item.button.setVisible(Boolean(brainrot));
      item.label.setText(brainrot ? `${index + 1} ${brainrot.name}` : "");
    });
  }

  switchToInventoryBrainrot(index) {
    if (this.turnLocked) return;
    const candidate = this.getSwitchCandidates()[index];
    if (!candidate) return;
    this.playerBrainrot = candidate;
    this.party[0] = candidate;
    this.playerSprite.setTexture(this.displayTextureFor(this.playerBrainrot, this.backTextureFor(this.playerBrainrot)));
    this.applyVariantTint(this.playerSprite, this.playerBrainrot);
    this.playerSprite.setPosition(250, 292).setScale(0.1).setAlpha(1);
    this.tweens.add({ targets: this.playerSprite, scale: this.battleScaleFor(this.playerBrainrot, "back"), duration: 260, ease: "Back.easeOut" });
    this.updateBattleStats();
    this.dialogueText.setText(`Go, ${this.brainrotLabel(this.playerBrainrot)}!`);
    this.turnLocked = true;
    this.time.delayedCall(650, () => this.enemyTurn());
  }

  startWildBattle(manual = false) {
    if (!this.isPlayerInWildGrass()) {
      if (manual) this.showToast("Wild Brainrots", "They only spawn in tall grass.");
      return;
	    }
	    if (this.awaitingStarterBrainrot) {
	      this.startStarterEncounter();
	      return;
	    }
    const template = this.pickAdminSpawnTemplate();
    this.recordSpawnEconomy(template.name);
    this.startBattleAfterSpawnAtmosphere(template, {
      enemyName: template.name,
      enemyVariant: this.activeAdminVariant(),
      introText: `A wild ${template.name} appeared!`
    });
  }

  isNearHealMachine() {
    if (this.locationMode === "interior") return Boolean(this.currentInterior?.heal);
    const playerTile = this.worldToTile(this.player.x, this.player.y + 18 * SCALE);
    if (this.locationMode === "overworld") {
      const healDoor = this.doors?.find((door) => door.heal);
      if (healDoor && Phaser.Geom.Rectangle.Contains(this.expandedRect(healDoor.rect, 58), this.player.x, this.player.y + 20)) return true;
    }
    return entities.some((entity) => (
      entity.type === "healMachine"
      && Math.abs(playerTile.x - entity.x) <= 6
      && Math.abs(playerTile.y - entity.y) <= 5
    ));
  }

  tryHealAtMachine(force = false) {
    if (!force && !this.isNearHealMachine()) {
      this.showToast("Heal Machine", "Move closer and press E.");
      return;
    }
    this.inventory.forEach((brainrot) => {
      brainrot.hp = brainrot.maxHp;
    });
    this.party.forEach((brainrot) => {
      brainrot.hp = brainrot.maxHp;
    });
    this.playerBrainrot.hp = this.playerBrainrot.maxHp;
    this.updateInventoryPanel();
    this.showToast("Heal Machine", "All stored brainrots healed.");
  }


  applyVariantTint(sprite, brainrot) {
    sprite.clearTint();
  }

	  startBattle(options = {}) {
	    this.inBattle = true;
	    this.turnLocked = false;
	    this.escapeAttemptLocked = false;
	    this.battleMenuMode = "main";
	    this.captureChoiceActive = false;
	    this.adminKeepChoiceActive = false;
	    this.starterEncounterActive = false;
	    this.battleNoPlayerBrainrot = Boolean(options.noPlayerBrainrot);
	    this.pendingCapture = null;
	    this.inventoryPanel?.setVisible(false);
    if (options.playerName) {
      const playerTemplate = this.findBrainrot(options.playerName);
      if (playerTemplate) {
        const playerVariant = options.playerVariant ?? "NORMAL";
        this.playerBrainrot = this.findOwnedBrainrot(playerTemplate.name, playerVariant) ?? this.cloneBrainrot(playerTemplate, playerVariant);
        this.party[0] = this.playerBrainrot;
        this.ensureInventoryHas(this.playerBrainrot);
      }
    }
	    const template = options.enemyName ? this.findBrainrot(options.enemyName) : Phaser.Utils.Array.GetRandom(brainrots);
	    this.enemy = options.enemyBrainrot
	      ? {
	        ...options.enemyBrainrot,
	        traits: (options.enemyBrainrot.traits ?? []).map((trait) => ({ ...trait })),
	        moves: options.enemyBrainrot.moves.map((move) => ({ ...move }))
	      }
	      : this.cloneBrainrot(template ?? Phaser.Utils.Array.GetRandom(brainrots), options.enemyVariant ?? null);
	    if (Array.isArray(options.enemyTraits)) {
	      this.enemy.traits = options.enemyTraits.map((trait) => ({ ...trait }));
	    }
	    if (options.enemyLevel || Array.isArray(options.enemyTraits)) {
	      const baseLevel = options.enemyLevel ?? this.enemy.rolledLevel ?? this.enemy.level;
	      const traitMultiplier = this.traitLevelMultiplier(this.enemy.traits);
	      this.setBrainrotLevel(this.enemy, Phaser.Math.Clamp(baseLevel * traitMultiplier, 1, MAX_TRAIT_LEVEL));
	      this.enemy.rolledLevel = baseLevel;
	    }
	    this.enemy.hp = this.enemy.maxHp;
	    if (!this.battleNoPlayerBrainrot) this.playerBrainrot.hp = Math.max(1, this.playerBrainrot.hp ?? this.playerBrainrot.maxHp);
	    this.enemySprite.setPosition(650, 128).setAlpha(1);
	    this.playerSprite.setPosition(250, 292).setAlpha(this.battleNoPlayerBrainrot ? 0 : 1);
	    this.enemySprite.setTexture(this.displayTextureFor(this.enemy, this.frontTextureFor(this.enemy)));
	    if (!this.battleNoPlayerBrainrot) this.playerSprite.setTexture(this.displayTextureFor(this.playerBrainrot, this.backTextureFor(this.playerBrainrot)));
	    this.applyVariantTint(this.enemySprite, this.enemy);
	    if (!this.battleNoPlayerBrainrot) this.applyVariantTint(this.playerSprite, this.playerBrainrot);
	    this.enemySprite.setScale(0.1);
	    this.playerSprite.setScale(0.1);
	    this.updateBattleStats();
	    const introText = options.introText ?? `A wild ${this.enemy.name} appeared!`;
	    if (options.starterEncounter) {
	      this.showStarterEncounterPrompt(introText);
	    } else if (options.adminSpawned) {
	      this.showAdminKeepPrompt(introText);
	    } else {
	      this.showMainBattleMenu(introText);
	    }
	    this.battle.setVisible(true).setAlpha(0);
	    this.tweens.add({ targets: this.battle, alpha: 1, duration: 220 });
	    this.tweens.add({ targets: this.enemySprite, scale: this.battleScaleFor(this.enemy, "front"), duration: 340, ease: "Back.easeOut" });
	    if (!this.battleNoPlayerBrainrot) this.tweens.add({ targets: this.playerSprite, scale: this.battleScaleFor(this.playerBrainrot, "back"), duration: 340, ease: "Back.easeOut" });
	  }

	  updateBattleStats() {
	    this.enemyBox.name.setText(this.enemy.name);
    this.enemyBox.mutation.setText(this.brainrotDetailLine(this.enemy));
    this.enemyBox.tier.setText(this.tierLabel(this.enemy));
    this.enemyBox.level.setText(`Lv ${this.enemy.level}`);
	    const hasPlayerBrainrot = !this.battleNoPlayerBrainrot && Boolean(this.playerBrainrot);
	    this.playerBox.parts.forEach((part) => part.setVisible(hasPlayerBrainrot));
	    if (hasPlayerBrainrot) {
	      this.playerBox.name.setText(this.playerBrainrot.name);
	      this.playerBox.mutation.setText(this.brainrotDetailLine(this.playerBrainrot));
	      this.playerBox.tier.setText(this.tierLabel(this.playerBrainrot));
	      this.playerBox.level.setText(`Lv ${this.playerBrainrot.level}`);
	    }
	    const enemyHpRatio = Phaser.Math.Clamp(this.enemy.hp / this.enemy.maxHp, 0, 1);
	    const playerHpRatio = hasPlayerBrainrot ? Phaser.Math.Clamp(this.playerBrainrot.hp / this.playerBrainrot.maxHp, 0, 1) : 0;
	    this.enemyBox.bar.setSize(Math.max(1, 186 * enemyHpRatio), 6).setVisible(enemyHpRatio > 0);
	    this.playerBox.bar.setSize(Math.max(1, 186 * playerHpRatio), 6).setVisible(hasPlayerBrainrot && playerHpRatio > 0);
	    this.enemyBox.bar.fillColor = this.enemy.hp / this.enemy.maxHp < 0.35 ? 0xe6575e : 0x4fc46b;
	    if (hasPlayerBrainrot) this.playerBox.bar.fillColor = this.playerBrainrot.hp / this.playerBrainrot.maxHp < 0.35 ? 0xe6575e : 0x4fc46b;
	    const exp = hasPlayerBrainrot ? this.playerBrainrot.brainExp ?? 0 : 0;
	    const expNeed = hasPlayerBrainrot ? this.playerBrainrot.brainExpToNext ?? expToNextLevel(this.playerBrainrot.level) : 1;
	    const expRatio = Phaser.Math.Clamp(exp / expNeed, 0, 1);
	    this.enemyBox.expLabel.setVisible(false);
	    this.enemyBox.expBarBack.setVisible(false);
	    this.enemyBox.expBar.setVisible(false);
	    this.playerBox.expLabel.setVisible(hasPlayerBrainrot);
	    this.playerBox.expBarBack.setVisible(hasPlayerBrainrot);
	    this.playerBox.expBar.setSize(Math.max(1, 186 * expRatio), 3).setVisible(hasPlayerBrainrot && expRatio > 0);
	  }

  wait(ms) {
    return new Promise((resolve) => this.time.delayedCall(ms, resolve));
  }

  tweenTo(config) {
    return new Promise((resolve) => {
      this.tweens.add({
        ...config,
        onComplete: (...args) => {
          config.onComplete?.(...args);
          resolve();
        }
      });
    });
  }

  showDamagePop(x, y, text, color = "#e6575e") {
    const pop = this.add.text(x, y, text, {
      fontFamily: "Courier New",
      fontSize: "18px",
      color,
      fontStyle: "bold",
      stroke: "#fff6d8",
      strokeThickness: 4
    }).setOrigin(0.5).setScrollFactor(0).setDepth(6200);
    this.tweens.add({
      targets: pop,
      y: y - 34,
      alpha: 0,
      duration: 620,
      ease: "Quad.easeOut",
      onComplete: () => pop.destroy()
    });
  }

  async animateStrike(attacker, target, home, lunge, onImpact) {
    this.tweens.killTweensOf([attacker, target]);
    await this.tweenTo({ targets: attacker, x: lunge.x, y: lunge.y, duration: 150, ease: "Quad.easeOut" });
    onImpact();
    this.tweens.add({ targets: target, x: target.x + (target.x > attacker.x ? 18 : -18), alpha: 0.55, yoyo: true, repeat: 2, duration: 58 });
    await this.wait(210);
    await this.tweenTo({ targets: attacker, x: home.x, y: home.y, duration: 180, ease: "Back.easeOut" });
  }

  async useMove(index) {
    if (!this.inBattle || this.turnLocked) return;
    const move = this.playerBrainrot.moves[index];
    if (!move) return;
    this.turnLocked = true;
    if (move.heal) {
      this.playerBrainrot.hp = Math.min(this.playerBrainrot.maxHp, this.playerBrainrot.hp + move.heal);
      this.dialogueText.setText(`${this.playerBrainrot.name} used ${move.name}.\nIt got its focus back.`);
      this.updateBattleStats();
      this.tweens.add({ targets: this.playerSprite, scale: this.battleScaleFor(this.playerBrainrot, "back") * 1.08, yoyo: true, repeat: 1, duration: 120 });
    } else {
      const damage = this.rollDamage(move.power, this.playerBrainrot.level, this.enemy.level);
      this.dialogueText.setText(`${this.playerBrainrot.name} used ${move.name}!`);
      await this.animateStrike(
        this.playerSprite,
        this.enemySprite,
        { x: 250, y: 292 },
        { x: 335, y: 248 },
        () => {
          this.enemy.hp = Math.max(0, this.enemy.hp - damage);
          this.dialogueText.setText(`${this.playerBrainrot.name} used ${move.name}.\n${damage} damage!`);
          this.updateBattleStats();
          this.showDamagePop(650, 116, `-${damage}`);
        }
      );
    }
    if (this.enemy.hp <= 0) {
      this.time.delayedCall(900, () => this.winBattle());
      return;
    }
    this.time.delayedCall(550, () => this.enemyTurn());
  }

  async enemyTurn() {
    const move = Phaser.Utils.Array.GetRandom(this.enemy.moves);
    const damage = this.rollDamage(move.power, this.enemy.level, this.playerBrainrot.level);
    this.dialogueText.setText(`${this.enemy.name} used ${move.name}!`);
    await this.animateStrike(
      this.enemySprite,
      this.playerSprite,
      { x: 650, y: 128 },
      { x: 585, y: 176 },
      () => {
        this.playerBrainrot.hp = Math.max(0, this.playerBrainrot.hp - damage);
        this.dialogueText.setText(`${this.enemy.name} used ${move.name}.\n${damage} damage!`);
        this.updateBattleStats();
        this.showDamagePop(250, 270, `-${damage}`);
      }
    );
    if (this.playerBrainrot.hp <= 0) {
      this.time.delayedCall(900, () => {
        this.playerBrainrot.hp = Math.ceil(this.playerBrainrot.maxHp * 0.55);
        this.endBattle(`${this.playerBrainrot.name} needs snacks.\nYou wake up near the coast.`);
      });
      return;
    }
    this.time.delayedCall(420, () => {
      this.showMainBattleMenu("What will you do?");
    });
  }

  grantBattleExperience(defeatedBrainrot) {
    const gained = expRewardFor(defeatedBrainrot);
    const active = this.playerBrainrot;
    active.brainExp = (active.brainExp ?? 0) + gained;
    active.brainExpToNext = active.brainExpToNext ?? expToNextLevel(active.level);
    let leveled = 0;
    while (active.brainExp >= active.brainExpToNext) {
      active.brainExp -= active.brainExpToNext;
      active.level += 1;
      leveled += 1;
      active.maxHp += 3;
      active.hp = Math.min(active.maxHp, active.hp + 3);
      active.brainExpToNext = expToNextLevel(active.level);
    }
    this.updateBattleStats();
    this.updateInventoryPanel();
    return { gained, leveled };
  }

  winBattle() {
    const reward = this.grantBattleExperience(this.enemy);
    const captured = {
      ...this.enemy,
      hp: 1,
      brainExp: 0,
      brainExpToNext: expToNextLevel(this.enemy.level),
      traits: (this.enemy.traits ?? []).map((trait) => ({ ...trait })),
      moves: this.enemy.moves.map((move) => ({ ...move }))
    };
    this.pendingCapture = captured;
    this.captureChoiceActive = true;
    this.battleMenuMode = "capture";
    this.turnLocked = true;
    const levelText = reward.leveled ? `\n${this.playerBrainrot.name} grew ${reward.leveled} level${reward.leveled === 1 ? "" : "s"}!` : "";
    this.dialogueText.setText(`${this.brainrotLabel(captured)} was defeated.\n+${reward.gained} Brain EXP.${levelText}\nKeep this brainrot?`);
    this.moveButtons.forEach((item, index) => {
      item.button.setVisible(index < 2);
      item.label.setText(index === 0 ? "1 Keep" : "2 Let Go");
    });
  }

  handleCaptureChoice(keep) {
    if (!this.captureChoiceActive || !this.pendingCapture) return;
    const captured = this.pendingCapture;
    const inventoryCountBeforeChoice = this.inventory.length;
    this.captureChoiceActive = false;
    this.pendingCapture = null;
    this.turnLocked = false;
    if (keep) {
      this.inventory.push(captured);
      if (this.party.length < 3) this.party.push(captured);
      this.updateInventoryPanel();
      this.endBattle(
        `${this.brainrotLabel(captured)} joined your inventory.\nUse the heal machine to recover it.`,
        `Stored ${this.brainrotLabel(captured)}. Press I.`
      );
      return;
    }
    this.inventory.length = inventoryCountBeforeChoice;
    this.updateInventoryPanel();
    this.endBattle(`${this.brainrotLabel(captured)} was let go.`, "Let go. Inventory unchanged.");
  }

  endBattle(message, toastMessage = null) {
    this.dialogueText.setText(message);
    this.time.delayedCall(900, () => {
      this.tweens.add({
        targets: this.battle,
        alpha: 0,
        duration: 220,
        onComplete: () => {
          this.battle.setVisible(false);
          this.inBattle = false;
          this.turnLocked = false;
          this.enemySprite.x = 650;
          this.playerSprite.x = 250;
          this.showToast(toastMessage ? "Inventory" : "Battle", toastMessage ?? "Battle ended.");
        }
      });
    });
  }

  rollDamage(power, attackLevel, defendLevel) {
    const levelPressure = attackLevel * 0.12 - defendLevel * 0.06;
    const movePressure = power * 4;
    const variance = Phaser.Math.FloatBetween(0.9, 1.12);
    return Math.max(4, Math.round((movePressure + levelPressure) * variance));
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "game",
  width: VIEW_W,
  height: VIEW_H,
  pixelArt: true,
  roundPixels: true,
  backgroundColor: COLORS.water,
  scene: BrainworldScene,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  render: {
    antialias: false,
    pixelArt: true
  }
};

const game = new Phaser.Game(config);
globalThis.brainworldGame = game;
