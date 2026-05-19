# Brainrot Art Prompt Guide

Use this guide whenever creating new Brainworld brainrot sprites. The goal is to keep every creature in the same visual family: clean meme-creature designs, voxel-inspired forms, readable battle silhouettes, and consistent RPG presentation.

## Core Style

```text
Create a clean game sprite for Brainworld, a 2D monster-collecting RPG.

Subject: [BRAINROT NAME], based on the known Italian brainrot meme design: [SHORT DESCRIPTION OF THE CHARACTER].

Style: polished voxel-inspired pixel game sprite, crisp blocky silhouette, clean simplified surfaces, readable from a small battle-screen size. Keep the meme design recognizable, but remove noisy Minecraft-like block texture. Use broad color areas, controlled highlights, and clear shape language.

Composition: full-body front/three-quarter enemy battle sprite, centered with generous padding, facing slightly left. The creature should feel like a collectible RPG monster, not a realistic render.

Background: perfectly flat solid #00ff00 chroma-key background for removal. No shadows, no floor, no gradients, no text, no watermark, no UI. Do not use #00ff00 anywhere in the creature.

Output: one single creature only.
```

## Back Sprite Prompt

```text
Create a rear/back-facing battle sprite of the same Brainworld creature.

Use the front sprite as the exact character reference. Preserve the same body shape, colors, accessories, proportions, and meme identity, but show it from behind and slightly above, like a classic RPG player-side battle sprite.

Style: polished voxel-inspired pixel game sprite, clean simplified surfaces, crisp silhouette, no noisy block texture.

Composition: full-body back/three-quarter view, centered with generous padding. No ground shadow.

Background: perfectly flat solid #00ff00 chroma-key background for removal. No text, no watermark, no UI. Do not use #00ff00 anywhere in the creature.
```

## Mutation Rules

Mutations should tint or recolor the sprite while preserving the original design. Show mutation text as a separate UI line under the brainrot name.

Current mutation labels:

- `ORO`
- `ROJO FUEGO`
- `AZUL AQUA`
- `DARK`
- `PRIMA`

Prompt add-on for a fixed mutation:

```text
Mutation: [MUTATION LABEL].
Apply the mutation as a clean palette shift while keeping the creature recognizable. Do not change the silhouette or accessories.
```

## Character Examples

### Tralalero Tralala

```text
Subject: Tralalero Tralala, an Italian brainrot meme creature: a blue shark standing on fin-like legs, wearing bright blue sneakers, with a toothy shark grin and absurd athletic energy.
```

### Bombardiro Crocodilo

```text
Subject: Bombardiro Crocodilo, an Italian brainrot meme creature: a crocodile-headed bomber-plane hybrid, absurd and cartoonish. Avoid real-world military symbols or insignia.
```

### Brr Brr Patapim

```text
Subject: Brr Brr Patapim, an Italian brainrot meme creature: a forest/tree monkey hybrid with oversized feet, leafy/wooden body details, and a small golden hat.
```

### Cappuccino Assassino

```text
Subject: Cappuccino Assassino, an Italian brainrot meme creature: a cappuccino coffee cup assassin with tiny limbs, a dramatic stealth pose, and espresso/foam details. No gore.
```

### Lirili Larila

```text
Subject: Lirili Larila, an Italian brainrot meme creature: a cactus-bodied elephant-like creature with desert-surreal energy, long nose/trunk shape, and flippers or slippers.
```

## Integration Checklist

1. Generate the sprite on flat `#00ff00`.
2. Save the generated source in `public/assets/brainrots/[name]-front-source.png`.
3. Remove chroma key into `public/assets/brainrots/[name]-front.png`.
4. Add `this.load.image(...)` in `preload()`.
5. Add a brainrot object to `brainrots` with `frontTextureKey`, `frontScale`, `level`, `maxHp`, and four moves.
6. If making it playable, generate and load a back sprite too.
7. Test in the browser with a `?demo=[name]` route.
