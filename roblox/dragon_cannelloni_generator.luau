-- Paste this into Roblox Studio's Command Bar, or run it from a Script.
-- It builds a low-poly Dragon Cannelloni inspired by the reference image.

local Workspace = game:GetService("Workspace")

local MODEL_NAME = "Dragon Cannelloni"
local DRAGON_WIDTH_FACTOR = 1.55

local existing = Workspace:FindFirstChild(MODEL_NAME)
if existing then
	existing:Destroy()
end

local model = Instance.new("Model")
model.Name = MODEL_NAME
model.Parent = Workspace

local root = CFrame.new(0, 8, 0)

local colors = {
	pasta = Color3.fromRGB(238, 170, 45),
	pastaDark = Color3.fromRGB(186, 116, 30),
	belly = Color3.fromRGB(255, 212, 102),
	bellyShadow = Color3.fromRGB(241, 179, 63),
	brown = Color3.fromRGB(96, 55, 27),
	white = Color3.fromRGB(245, 244, 235),
	black = Color3.fromRGB(33, 26, 20),
	red = Color3.fromRGB(178, 29, 27),
	orange = Color3.fromRGB(236, 133, 35),
	blue = Color3.fromRGB(95, 196, 255),
}

local function part(className, name, size, cf, color, material)
	local p = Instance.new(className or "Part")
	p.Name = name
	p.Anchored = true
	p.CanCollide = true
	p.Size = size
	p.CFrame = root * cf
	p.Color = color
	p.Material = material or Enum.Material.SmoothPlastic
	p.TopSurface = Enum.SurfaceType.Smooth
	p.BottomSurface = Enum.SurfaceType.Smooth
	p.Parent = model
	return p
end

local function block(name, size, cf, color, material)
	return part("Part", name, size, cf, color, material)
end

local function wedge(name, size, cf, color, material)
	return part("WedgePart", name, size, cf, color, material)
end

local function ball(name, size, cf, color, material)
	local p = part("Part", name, size, cf, color, material)
	p.Shape = Enum.PartType.Ball
	return p
end

local function cylinder(name, size, cf, color, material)
	local p = part("Part", name, size, cf, color, material)
	p.Shape = Enum.PartType.Cylinder
	return p
end

local function tile(name, x, y, z, rx, ry, rz, sx, sy, sz)
	return block(
		name,
		Vector3.new(sx or 0.22, sy or 0.11, sz or 0.32),
		CFrame.new(x, y, z) * CFrame.Angles(math.rad(rx or 0), math.rad(ry or 0), math.rad(rz or 0)),
		colors.pastaDark,
		Enum.Material.Plastic
	)
end

-- Body and belly
block("Blocky golden torso", Vector3.new(3.2, 4.2, 2.0), CFrame.new(0, 0, 0) * CFrame.Angles(0, 0, math.rad(-8)), colors.pasta)
block("Soft cannelloni belly", Vector3.new(2.05, 4.0, 0.28), CFrame.new(-0.32, -0.15, -1.05) * CFrame.Angles(0, 0, math.rad(-8)), colors.belly)
block("Belly lower shadow", Vector3.new(1.2, 1.25, 0.32), CFrame.new(-0.5, -1.55, -1.12) * CFrame.Angles(0, 0, math.rad(-8)), colors.bellyShadow)

-- Neck and head
block("Tall neck", Vector3.new(1.25, 2.4, 1.25), CFrame.new(-0.2, 2.75, -0.05) * CFrame.Angles(0, 0, math.rad(-7)), colors.pasta)
block("Square dragon head", Vector3.new(2.55, 1.55, 1.75), CFrame.new(-0.55, 4.2, -0.12), colors.pasta)
block("Long snout", Vector3.new(2.55, 0.95, 1.35), CFrame.new(-1.95, 4.05, -0.12), colors.pasta)
block("Lower jaw", Vector3.new(2.25, 0.35, 1.18), CFrame.new(-2.02, 3.46, -0.12), colors.white)

-- Mouth, teeth, eyes
block("Dark mouth gap", Vector3.new(2.1, 0.17, 1.22), CFrame.new(-2.03, 3.7, -0.12), colors.black)
for i = 1, 6 do
	local x = -2.9 + i * 0.31
	wedge("Upper tooth " .. i, Vector3.new(0.22, 0.45, 0.22), CFrame.new(x, 3.64, -0.55) * CFrame.Angles(0, 0, math.rad(180)), colors.white)
	wedge("Lower tooth " .. i, Vector3.new(0.22, 0.38, 0.22), CFrame.new(x, 3.62, 0.28), colors.white)
end
block("Left eye white", Vector3.new(0.36, 0.55, 0.08), CFrame.new(-1.08, 4.43, -1.03), colors.white)
block("Left eye blue", Vector3.new(0.18, 0.32, 0.09), CFrame.new(-1.08, 4.43, -1.085), colors.blue)
block("Left pupil", Vector3.new(0.07, 0.16, 0.1), CFrame.new(-1.08, 4.43, -1.14), colors.black)
block("Right eye white", Vector3.new(0.36, 0.55, 0.08), CFrame.new(-1.08, 4.43, 0.79), colors.white)
block("Right eye blue", Vector3.new(0.18, 0.32, 0.09), CFrame.new(-1.08, 4.43, 0.845), colors.blue)
block("Right pupil", Vector3.new(0.07, 0.16, 0.1), CFrame.new(-1.08, 4.43, 0.9), colors.black)

-- Horns, ears/spikes
wedge("Back left horn", Vector3.new(0.75, 1.25, 0.75), CFrame.new(0.22, 5.05, -0.62) * CFrame.Angles(math.rad(-25), 0, math.rad(-15)), colors.brown)
wedge("Back right horn", Vector3.new(0.75, 1.25, 0.75), CFrame.new(0.22, 5.05, 0.62) * CFrame.Angles(math.rad(-25), 0, math.rad(-15)), colors.brown)
wedge("Cheek spike left", Vector3.new(0.6, 0.8, 0.5), CFrame.new(-0.02, 3.9, -1.02) * CFrame.Angles(0, math.rad(90), 0), colors.brown)
wedge("Cheek spike right", Vector3.new(0.6, 0.8, 0.5), CFrame.new(-0.02, 3.9, 1.02) * CFrame.Angles(0, math.rad(-90), 0), colors.brown)

-- Arms
block("Raised left upper arm", Vector3.new(2.55, 0.72, 0.8), CFrame.new(-2.35, 1.1, -0.85) * CFrame.Angles(0, math.rad(8), math.rad(24)), colors.pasta)
block("Raised left forearm", Vector3.new(2.25, 0.62, 0.72), CFrame.new(-4.35, 1.8, -0.98) * CFrame.Angles(0, math.rad(10), math.rad(18)), colors.pasta)
block("Left hand", Vector3.new(0.8, 0.52, 0.85), CFrame.new(-5.52, 2.1, -1.05), colors.pasta)
block("Right upper arm", Vector3.new(1.85, 0.68, 0.8), CFrame.new(1.7, -0.45, -0.82) * CFrame.Angles(0, math.rad(-12), math.rad(-28)), colors.pasta)
block("Right forearm", Vector3.new(1.6, 0.58, 0.72), CFrame.new(2.73, -1.22, -0.94) * CFrame.Angles(0, math.rad(-10), math.rad(-8)), colors.pasta)
block("Right hand", Vector3.new(0.78, 0.5, 0.82), CFrame.new(3.5, -1.35, -0.98), colors.pasta)

for _, claw in ipairs({
	{"Left claw 1", -5.9, 2.12, -1.42, 0},
	{"Left claw 2", -5.96, 2.08, -1.05, 0},
	{"Left claw 3", -5.9, 2.12, -0.68, 0},
	{"Right claw 1", 3.86, -1.32, -1.34, 0},
	{"Right claw 2", 3.92, -1.34, -0.98, 0},
	{"Right claw 3", 3.86, -1.32, -0.62, 0},
}) do
	wedge(claw[1], Vector3.new(0.22, 0.38, 0.22), CFrame.new(claw[2], claw[3], claw[4]) * CFrame.Angles(0, 0, math.rad(-90)), colors.brown)
end

-- Legs and feet
block("Left thigh", Vector3.new(0.9, 1.75, 0.95), CFrame.new(-0.9, -2.65, -0.55) * CFrame.Angles(0, 0, math.rad(12)), colors.pasta)
block("Left shin", Vector3.new(0.75, 1.55, 0.85), CFrame.new(-1.35, -3.95, -0.65) * CFrame.Angles(0, 0, math.rad(-4)), colors.pasta)
block("Left foot", Vector3.new(1.25, 0.48, 1.15), CFrame.new(-1.62, -4.78, -0.75), colors.pasta)
block("Right thigh", Vector3.new(0.9, 1.75, 0.95), CFrame.new(1.0, -2.55, 0.55) * CFrame.Angles(0, 0, math.rad(-14)), colors.pasta)
block("Right shin", Vector3.new(0.75, 1.5, 0.85), CFrame.new(1.42, -3.85, 0.64) * CFrame.Angles(0, 0, math.rad(4)), colors.pasta)
block("Right foot", Vector3.new(1.25, 0.48, 1.15), CFrame.new(1.68, -4.7, 0.75), colors.pasta)

for _, claw in ipairs({
	{"Left toe 1", -2.1, -4.86, -1.26},
	{"Left toe 2", -1.62, -4.9, -1.3},
	{"Left toe 3", -1.13, -4.86, -1.26},
	{"Right toe 1", 1.19, -4.78, 1.27},
	{"Right toe 2", 1.68, -4.83, 1.32},
	{"Right toe 3", 2.15, -4.78, 1.27},
}) do
	wedge(claw[1], Vector3.new(0.26, 0.4, 0.28), CFrame.new(claw[2], claw[3], claw[4]) * CFrame.Angles(math.rad(90), 0, 0), colors.brown)
end

-- Tail with orange stripe and dark tip
local tailPoints = {
	{1.55, -0.5, 0.15, 1.35, 0.78, 0.78, 20},
	{2.75, 0.12, 0.2, 1.45, 0.68, 0.68, 27},
	{3.92, 0.92, 0.18, 1.4, 0.58, 0.58, 34},
	{5.0, 1.62, 0.12, 1.25, 0.48, 0.48, 29},
	{6.02, 2.15, 0.08, 1.0, 0.4, 0.4, 24},
}
for i, t in ipairs(tailPoints) do
	block("Tail segment " .. i, Vector3.new(t[4], t[5], t[6]), CFrame.new(t[1], t[2], t[3]) * CFrame.Angles(0, 0, math.rad(t[7])), colors.pasta)
	block("Tail orange stripe " .. i, Vector3.new(t[4] * 0.82, 0.12, 0.08), CFrame.new(t[1], t[2] + 0.04, t[3] - 0.32) * CFrame.Angles(0, 0, math.rad(t[7])), colors.orange)
end
wedge("Tail dark tip", Vector3.new(0.7, 0.7, 0.7), CFrame.new(6.65, 2.46, 0.06) * CFrame.Angles(0, 0, math.rad(-66)), colors.brown)

-- Wings, blocky and raised behind the body
block("Left wing arm", Vector3.new(3.1, 0.38, 0.45), CFrame.new(1.55, 1.5, 1.1) * CFrame.Angles(math.rad(8), math.rad(22), math.rad(35)), colors.pastaDark)
wedge("Left wing membrane", Vector3.new(2.55, 1.25, 0.28), CFrame.new(2.28, 1.08, 1.58) * CFrame.Angles(math.rad(-8), math.rad(20), math.rad(20)), colors.pasta)
block("Right wing arm", Vector3.new(3.1, 0.38, 0.45), CFrame.new(1.55, 1.5, -1.1) * CFrame.Angles(math.rad(-8), math.rad(-22), math.rad(35)), colors.pastaDark)
wedge("Right wing membrane", Vector3.new(2.55, 1.25, 0.28), CFrame.new(2.28, 1.08, -1.58) * CFrame.Angles(math.rad(8), math.rad(-20), math.rad(20)), colors.pasta)

-- Red sauce-like accents from the reference
block("Left knee red patch", Vector3.new(0.42, 0.58, 0.08), CFrame.new(-1.58, -3.7, -1.09), colors.red)
block("Right knee red patch", Vector3.new(0.42, 0.58, 0.08), CFrame.new(1.55, -3.58, 1.08), colors.red)
block("Body side red patch", Vector3.new(0.08, 0.7, 0.46), CFrame.new(1.72, -0.75, 0.98) * CFrame.Angles(0, math.rad(90), 0), colors.red)
block("Left arm orange patch", Vector3.new(0.62, 0.1, 0.42), CFrame.new(-3.05, 1.42, -1.42) * CFrame.Angles(0, 0, math.rad(22)), colors.orange)

-- Cannelloni/waffle raised tiles
for row = 1, 5 do
	for col = 1, 3 do
		tile("Torso tile " .. row .. "-" .. col, -0.95 + col * 0.58, 1.9 - row * 0.62, -1.15, 0, 0, -8)
	end
end

for i = 1, 5 do
	tile("Neck tile " .. i, -0.18, 3.55 - i * 0.32, -0.72, 0, 0, -7, 0.18, 0.09, 0.24)
	tile("Snout tile " .. i, -2.9 + i * 0.38, 4.6, -0.8, 0, 0, 0, 0.2, 0.1, 0.25)
end

for i = 1, 11 do
	local x = 1.0 + i * 0.47
	local y = -0.2 + i * 0.24
	tile("Tail tile left " .. i, x, y, -0.2, 0, 0, 28, 0.18, 0.08, 0.24)
	tile("Tail tile right " .. i, x, y, 0.42, 0, 0, 28, 0.18, 0.08, 0.24)
end

for i = 1, 6 do
	tile("Left arm tile " .. i, -4.9 + i * 0.48, 1.7 + i * 0.06, -1.42, 0, 0, 19, 0.18, 0.08, 0.22)
	tile("Right arm tile " .. i, 1.25 + i * 0.35, -0.65 - i * 0.13, -1.34, 0, 0, -20, 0.18, 0.08, 0.22)
end

for i = 1, 4 do
	tile("Left leg tile " .. i, -1.45, -2.4 - i * 0.5, -1.07, 0, 0, 4, 0.18, 0.08, 0.22)
	tile("Right leg tile " .. i, 1.45, -2.3 - i * 0.5, 1.05, 0, 0, -4, 0.18, 0.08, 0.22)
end

-- Back spikes
for i = 1, 5 do
	wedge(
		"Back spike " .. i,
		Vector3.new(0.55, 0.7, 0.45),
		CFrame.new(0.1 + i * 0.38, 2.35 - i * 0.58, 1.08) * CFrame.Angles(math.rad(20), 0, math.rad(180)),
		colors.brown
	)
end

-- Simple platform and lighting helpers
block("Display base", Vector3.new(11, 0.25, 7), CFrame.new(0.4, -5.45, 0), Color3.fromRGB(48, 42, 35), Enum.Material.WoodPlanks)

local light = Instance.new("PointLight")
light.Name = "Warm display light"
light.Color = Color3.fromRGB(255, 211, 145)
light.Brightness = 3
light.Range = 18
light.Parent = model:FindFirstChild("Square dragon head")

local highlight = Instance.new("Highlight")
highlight.Name = "Golden outline"
highlight.FillTransparency = 1
highlight.OutlineTransparency = 0.45
highlight.OutlineColor = Color3.fromRGB(255, 226, 112)
highlight.Parent = model

model.PrimaryPart = model:FindFirstChild("Blocky golden torso")
model:PivotTo(CFrame.new(0, 8, 0) * CFrame.Angles(0, math.rad(-22), 0))

local function widenDragon(targetModel, widthFactor)
	local pivot = targetModel:GetPivot()

	for _, item in ipairs(targetModel:GetDescendants()) do
		if item:IsA("BasePart") and item.Name ~= "Display base" then
			local relative = pivot:ToObjectSpace(item.CFrame)
			local x, y, z, r00, r01, r02, r10, r11, r12, r20, r21, r22 = relative:GetComponents()
			item.Size = Vector3.new(item.Size.X, item.Size.Y, item.Size.Z * widthFactor)
			item.CFrame = pivot * CFrame.new(x, y, z * widthFactor, r00, r01, r02, r10, r11, r12, r20, r21, r22)
		end
	end
end

widenDragon(model, DRAGON_WIDTH_FACTOR)

print("Created " .. MODEL_NAME .. " with " .. #model:GetDescendants() .. " instances.")
