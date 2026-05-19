local player = {
	x = 420,
	y = 300,
	speed = 185,
	scale = 3.2,
	facing = "down",
	walkTime = 0,
	moving = false,
}

local world = {
	w = 1200,
	h = 820,
}

local colors = {
	bg = { 0.39, 0.78, 0.55 },
	path = { 0.89, 0.78, 0.48 },
	grassDark = { 0.20, 0.58, 0.30 },
	shadow = { 0.05, 0.06, 0.08, 0.24 },
	berry = { 0.88, 0.20, 0.21 },
	berryLight = { 1.0, 0.38, 0.36 },
	berryDark = { 0.62, 0.12, 0.16 },
	innerEar = { 1.0, 0.52, 0.54 },
	seed = { 1.0, 0.88, 0.60 },
	leaf = { 0.54, 0.72, 0.16 },
	leafLight = { 0.72, 0.86, 0.25 },
	leafDark = { 0.28, 0.48, 0.12 },
	white = { 0.98, 0.96, 0.88 },
	black = { 0.04, 0.05, 0.07 },
	eyeShine = { 0.77, 0.94, 1.0 },
}

local seedPattern = {}
for i = 1, 90 do
	seedPattern[i] = {
		x = love.math.random(-26, 30),
		y = love.math.random(-37, 26),
		size = love.math.random(1, 2),
	}
end

local grassBlades = {}
for i = 1, 180 do
	grassBlades[i] = {
		x = love.math.random(20, world.w - 20),
		y = love.math.random(20, world.h - 20),
		h = love.math.random(5, 13),
	}
end

local function setColor(color)
	love.graphics.setColor(color)
end

local function rect(x, y, w, h, color)
	setColor(color)
	love.graphics.rectangle("fill", x, y, w, h)
end

local function outlineRect(x, y, w, h, fill, stroke)
	rect(x, y, w, h, fill)
	setColor(stroke or colors.berryDark)
	love.graphics.setLineWidth(2)
	love.graphics.rectangle("line", x, y, w, h)
end

local function drawShadow(cx, cy, scale)
	setColor(colors.shadow)
	love.graphics.ellipse("fill", cx, cy + 28 * scale, 28 * scale, 9 * scale)
end

local function drawSeeds(cx, cy, scale)
	for _, seed in ipairs(seedPattern) do
		local x = cx + seed.x * scale
		local y = cy + seed.y * scale
		rect(x, y, seed.size * scale, seed.size * scale, colors.seed)
	end
end

local function drawLeafCrown(cx, cy, scale, sway)
	local s = scale
	rect(cx - 22 * s, cy - 55 * s, 44 * s, 7 * s, colors.leaf)
	rect(cx - 4 * s, cy - 71 * s, 8 * s, 17 * s, colors.leafDark)
	rect(cx - 34 * s, cy - 60 * s + sway * s, 24 * s, 8 * s, colors.leafLight)
	rect(cx + 10 * s, cy - 60 * s - sway * s, 28 * s, 8 * s, colors.leafLight)
	rect(cx - 12 * s, cy - 64 * s, 24 * s, 9 * s, colors.leafLight)
	rect(cx - 28 * s, cy - 50 * s, 18 * s, 7 * s, colors.leaf)
	rect(cx + 12 * s, cy - 50 * s, 18 * s, 7 * s, colors.leaf)
end

local function drawEye(cx, cy, scale)
	local s = scale
	outlineRect(cx - 4 * s, cy - 4 * s, 8 * s, 8 * s, colors.black, colors.black)
	rect(cx - 2 * s, cy - 2 * s, 2 * s, 2 * s, colors.eyeShine)
	rect(cx + 2 * s, cy + 2 * s, 2 * s, 2 * s, colors.white)
end

local function drawStrawberryElephant(x, y, scale, time, moving, facing)
	local s = scale
	local step = moving and math.sin(time * 10) or 0
	local bob = moving and math.abs(math.sin(time * 10)) * 1.6 or math.sin(time * 2.4) * 0.5
	local earWave = math.sin(time * 5.5) * (moving and 2.2 or 1.0)
	local trunkWave = math.sin(time * 4.2) * (moving and 2.5 or 1.4)
	local leafSway = math.sin(time * 3.5) * 1.2

	local flip = facing == "left" and -1 or 1
	if facing == "up" then
		flip = -1
	end

	love.graphics.push()
	love.graphics.translate(x, y + bob * s)

	drawShadow(0, 18 * s, s)

	-- Back legs
	rect(-23 * s, 13 * s + step * s, 11 * s, 27 * s, colors.berryDark)
	rect(13 * s, 13 * s - step * s, 11 * s, 27 * s, colors.berryDark)
	rect(-25 * s, 37 * s + step * s, 15 * s, 7 * s, colors.berryLight)
	rect(11 * s, 37 * s - step * s, 15 * s, 7 * s, colors.berryLight)

	-- Ears behind head
	outlineRect(-43 * s, -31 * s + earWave * s, 21 * s, 39 * s, colors.berry, colors.berryDark)
	rect(-38 * s, -24 * s + earWave * s, 13 * s, 27 * s, colors.innerEar)
	outlineRect(22 * s, -31 * s - earWave * s, 21 * s, 39 * s, colors.berry, colors.berryDark)
	rect(25 * s, -24 * s - earWave * s, 13 * s, 27 * s, colors.innerEar)

	-- Body and head
	outlineRect(-31 * s, -42 * s, 62 * s, 58 * s, colors.berry, colors.berryDark)
	rect(-27 * s, -39 * s, 54 * s, 10 * s, colors.berryLight)
	rect(-28 * s, 10 * s, 56 * s, 9 * s, colors.berryDark)

	drawSeeds(0, -9 * s, s)

	-- Trunk, front legs and tusks
	rect(-10 * s + trunkWave * s * 0.4, 4 * s, 20 * s, 40 * s, colors.berry)
	rect(-7 * s + trunkWave * s, 38 * s, 18 * s, 9 * s, colors.berryLight)
	rect(-21 * s, 12 * s - step * s, 10 * s, 33 * s, colors.berry)
	rect(12 * s, 12 * s + step * s, 10 * s, 33 * s, colors.berry)
	rect(-24 * s, 42 * s - step * s, 15 * s, 7 * s, colors.berryLight)
	rect(10 * s, 42 * s + step * s, 15 * s, 7 * s, colors.berryLight)
	rect(-22 * s, 5 * s, 8 * s, 27 * s, colors.white)
	rect(14 * s, 5 * s, 8 * s, 27 * s, colors.white)

	-- Eyes
	drawEye(-15 * s, -16 * s, s)
	drawEye(15 * s, -16 * s, s)

	-- Little side pixel nose/tail cue when moving horizontally
	if facing == "left" or facing == "right" then
		rect(31 * s * flip, -2 * s, 8 * s * flip, 5 * s, colors.berryDark)
	end

	drawLeafCrown(0, 0, s, leafSway)

	love.graphics.pop()
end

local function drawWorld(cameraX, cameraY)
	setColor(colors.bg)
	love.graphics.rectangle("fill", 0, 0, world.w, world.h)

	rect(0, 310, world.w, 92, colors.path)
	rect(520, 0, 92, world.h, colors.path)

	for _, blade in ipairs(grassBlades) do
		rect(blade.x, blade.y, 2, blade.h, colors.grassDark)
	end

	for i = 1, 6 do
		local houseX = 120 + i * 150
		local houseY = 120 + (i % 2) * 430
		rect(houseX, houseY, 86, 52, { 0.77, 0.60, 0.40 })
		rect(houseX - 8, houseY - 18, 102, 24, i % 2 == 0 and { 0.25, 0.53, 0.95 } or { 0.93, 0.28, 0.45 })
		rect(houseX + 34, houseY + 22, 18, 30, { 0.36, 0.22, 0.14 })
	end
end

function love.load()
	love.window.setTitle("Blocky Strawberry Elephant WASD")
	love.window.setMode(960, 540, { resizable = true, minwidth = 640, minheight = 360 })
	love.graphics.setDefaultFilter("nearest", "nearest")
end

function love.update(dt)
	local dx, dy = 0, 0

	if love.keyboard.isDown("a") or love.keyboard.isDown("left") then
		dx = dx - 1
	end
	if love.keyboard.isDown("d") or love.keyboard.isDown("right") then
		dx = dx + 1
	end
	if love.keyboard.isDown("w") or love.keyboard.isDown("up") then
		dy = dy - 1
	end
	if love.keyboard.isDown("s") or love.keyboard.isDown("down") then
		dy = dy + 1
	end

	player.moving = dx ~= 0 or dy ~= 0
	if player.moving then
		local length = math.sqrt(dx * dx + dy * dy)
		dx, dy = dx / length, dy / length
		player.x = math.max(55, math.min(world.w - 55, player.x + dx * player.speed * dt))
		player.y = math.max(75, math.min(world.h - 75, player.y + dy * player.speed * dt))
		player.walkTime = player.walkTime + dt

		if math.abs(dx) > math.abs(dy) then
			player.facing = dx < 0 and "left" or "right"
		else
			player.facing = dy < 0 and "up" or "down"
		end
	end
end

function love.draw()
	local sw, sh = love.graphics.getDimensions()
	local cameraX = math.max(0, math.min(world.w - sw, player.x - sw / 2))
	local cameraY = math.max(0, math.min(world.h - sh, player.y - sh / 2))

	love.graphics.push()
	love.graphics.translate(-math.floor(cameraX), -math.floor(cameraY))
	drawWorld(cameraX, cameraY)
	drawStrawberryElephant(player.x, player.y, player.scale, love.timer.getTime(), player.moving, player.facing)
	love.graphics.pop()

	rect(14, 14, 330, 54, { 0.97, 0.94, 0.84, 0.92 })
	setColor({ 0.12, 0.16, 0.25 })
	love.graphics.setFont(love.graphics.newFont(14))
	love.graphics.print("WASD / arrows: move blocky Strawberry Elephant", 26, 28)
	love.graphics.print("No sprites needed - drawn completely with Lua.", 26, 48)
end
