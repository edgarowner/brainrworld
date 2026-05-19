-- Paste this into Roblox Studio's Command Bar, or run it from a Script.
-- It builds a blocky Strawberry Elephant inspired by the reference image.

local Workspace = game:GetService("Workspace")

local MODEL_NAME = "Strawberry Elephant"
local CHARACTER_SCALE = 1.45

local existing = Workspace:FindFirstChild(MODEL_NAME)
if existing then
	existing:Destroy()
end

local model = Instance.new("Model")
model.Name = MODEL_NAME
model.Parent = Workspace

local root = CFrame.new(-11, 6.4, 0) * CFrame.Angles(0, math.rad(18), 0)

local colors = {
	strawberry = Color3.fromRGB(216, 57, 57),
	strawberryDark = Color3.fromRGB(162, 38, 43),
	strawberryLight = Color3.fromRGB(242, 91, 91),
	innerEar = Color3.fromRGB(255, 132, 136),
	seed = Color3.fromRGB(255, 225, 166),
	seedShadow = Color3.fromRGB(170, 46, 43),
	leaf = Color3.fromRGB(139, 184, 42),
	leafLight = Color3.fromRGB(180, 210, 64),
	leafDark = Color3.fromRGB(83, 130, 37),
	white = Color3.fromRGB(248, 245, 230),
	black = Color3.fromRGB(20, 24, 28),
	eyeBlue = Color3.fromRGB(185, 240, 255),
	base = Color3.fromRGB(44, 39, 34),
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

local function seed(name, x, y, z, rx, ry, rz, sx, sy, sz, color)
	return block(
		name,
		Vector3.new(sx or 0.08, sy or 0.08, sz or 0.035),
		CFrame.new(x, y, z) * CFrame.Angles(math.rad(rx or 0), math.rad(ry or 0), math.rad(rz or 0)),
		color or colors.seed,
		Enum.Material.SmoothPlastic
	)
end

-- Chunky strawberry elephant body
block("Berry body", Vector3.new(3.5, 3.1, 2.6), CFrame.new(0.75, 0.25, 0), colors.strawberry)
block("Berry back haunch", Vector3.new(2.35, 2.7, 2.45), CFrame.new(2.45, -0.15, 0), colors.strawberryLight)
block("Berry belly shadow", Vector3.new(2.15, 1.15, 2.5), CFrame.new(0.95, -1.25, 0), colors.strawberryDark)
block("Chest block", Vector3.new(2.35, 2.35, 2.25), CFrame.new(-1.15, 0.35, 0), colors.strawberry)

-- Head, face and trunk
block("Square strawberry head", Vector3.new(2.55, 2.2, 2.2), CFrame.new(-2.25, 1.75, 0), colors.strawberry)
block("Forehead berry cap", Vector3.new(2.25, 0.7, 2.0), CFrame.new(-2.2, 3.15, 0), colors.strawberryLight)
block("Long trunk upper", Vector3.new(0.88, 1.8, 0.82), CFrame.new(-2.65, 0.3, 0), colors.strawberry)
block("Long trunk middle", Vector3.new(0.78, 1.7, 0.74), CFrame.new(-2.75, -1.15, 0), colors.strawberry)
block("Trunk foot curl", Vector3.new(1.0, 0.55, 0.9), CFrame.new(-2.45, -2.2, 0), colors.strawberryLight)
block("Trunk front shadow", Vector3.new(0.1, 2.5, 0.55), CFrame.new(-3.22, -0.65, -0.42), colors.strawberryDark)

-- Ears, large and round-ish through blocky layers
block("Left outer ear", Vector3.new(0.65, 2.45, 2.25), CFrame.new(-1.15, 1.75, -1.55), colors.strawberry)
block("Left inner ear", Vector3.new(0.72, 1.85, 1.68), CFrame.new(-1.22, 1.72, -1.66), colors.innerEar)
block("Left ear top pixel", Vector3.new(0.7, 0.45, 1.3), CFrame.new(-1.18, 2.92, -1.58), colors.strawberryLight)
block("Left ear lower pixel", Vector3.new(0.7, 0.42, 1.1), CFrame.new(-1.2, 0.62, -1.55), colors.strawberryDark)
block("Right outer ear", Vector3.new(0.65, 2.35, 2.0), CFrame.new(-1.2, 1.72, 1.45), colors.strawberry)
block("Right inner ear", Vector3.new(0.72, 1.65, 1.45), CFrame.new(-1.27, 1.7, 1.53), colors.innerEar)

-- Eyes and tusks
block("Left pixel eye", Vector3.new(0.09, 0.42, 0.48), CFrame.new(-3.58, 2.04, -0.63), colors.black)
block("Left eye sparkle 1", Vector3.new(0.1, 0.1, 0.11), CFrame.new(-3.64, 2.12, -0.78), colors.eyeBlue)
block("Left eye sparkle 2", Vector3.new(0.1, 0.1, 0.11), CFrame.new(-3.64, 1.95, -0.53), colors.white)
block("Right pixel eye", Vector3.new(0.09, 0.42, 0.48), CFrame.new(-3.58, 2.04, 0.63), colors.black)
block("Right eye sparkle 1", Vector3.new(0.1, 0.1, 0.11), CFrame.new(-3.64, 2.12, 0.48), colors.eyeBlue)
block("Right eye sparkle 2", Vector3.new(0.1, 0.1, 0.11), CFrame.new(-3.64, 1.95, 0.72), colors.white)
wedge("Left tusk", Vector3.new(0.42, 1.35, 0.42), CFrame.new(-3.15, -0.05, -0.82) * CFrame.Angles(math.rad(15), 0, math.rad(180)), colors.white)
wedge("Right tusk", Vector3.new(0.42, 1.35, 0.42), CFrame.new(-3.15, -0.05, 0.82) * CFrame.Angles(math.rad(15), 0, math.rad(180)), colors.white)

-- Legs and square feet
local legs = {
	{"Front left", -0.85, -1.9, -0.75},
	{"Front right", -0.85, -1.9, 0.75},
	{"Back left", 2.25, -1.85, -0.72},
	{"Back right", 2.25, -1.85, 0.72},
}
for _, leg in ipairs(legs) do
	block(leg[1] .. " leg", Vector3.new(0.82, 2.05, 0.78), CFrame.new(leg[2], leg[3], leg[4]), colors.strawberry)
	block(leg[1] .. " ankle", Vector3.new(0.88, 0.42, 0.84), CFrame.new(leg[2], leg[3] - 1.1, leg[4]), colors.strawberryDark)
	block(leg[1] .. " foot", Vector3.new(1.05, 0.42, 1.0), CFrame.new(leg[2] - 0.08, leg[3] - 1.38, leg[4]), colors.strawberryLight)
	for toe = 1, 3 do
		local zOffset = (toe - 2) * 0.26
		block(leg[1] .. " toe " .. toe, Vector3.new(0.22, 0.18, 0.18), CFrame.new(leg[2] - 0.55, leg[3] - 1.62, leg[4] + zOffset), colors.white)
	end
end

-- Tail
block("Tiny berry tail", Vector3.new(0.75, 0.32, 0.3), CFrame.new(3.85, 0.55, 0.12) * CFrame.Angles(0, 0, math.rad(18)), colors.strawberryDark)
ball("Tail berry tip", Vector3.new(0.42, 0.42, 0.42), CFrame.new(4.28, 0.65, 0.16), colors.strawberryLight)

-- Leafy crown on top
block("Leaf crown center", Vector3.new(2.8, 0.34, 2.4), CFrame.new(-0.9, 3.68, 0), colors.leaf)
block("Leaf crown stem", Vector3.new(0.48, 1.0, 0.48), CFrame.new(-0.9, 4.28, 0), colors.leafDark)
local leaves = {
	{"Front leaf", -2.0, 3.78, 0, 0, 0, -8, 1.65, 0.3, 0.62},
	{"Back leaf", 0.35, 3.72, 0, 0, 0, 10, 1.7, 0.3, 0.62},
	{"Left leaf", -0.85, 3.75, -1.35, 0, 24, 0, 1.55, 0.3, 0.58},
	{"Right leaf", -0.85, 3.75, 1.35, 0, -24, 0, 1.55, 0.3, 0.58},
	{"Diagonal left leaf", -1.7, 3.84, -0.9, 0, 35, -18, 1.25, 0.28, 0.52},
	{"Diagonal right leaf", -1.7, 3.84, 0.9, 0, -35, -18, 1.25, 0.28, 0.52},
}
for _, leaf in ipairs(leaves) do
	block(leaf[1], Vector3.new(leaf[8], leaf[9], leaf[10]), CFrame.new(leaf[2], leaf[3], leaf[4]) * CFrame.Angles(math.rad(leaf[5]), math.rad(leaf[6]), math.rad(leaf[7])), colors.leafLight)
	wedge(leaf[1] .. " tip", Vector3.new(0.5, 0.32, 0.5), CFrame.new(leaf[2] - 0.72, leaf[3] + 0.02, leaf[4]) * CFrame.Angles(0, math.rad(leaf[6]), math.rad(-90)), colors.leaf)
end

-- Strawberry seeds on visible surfaces
local index = 0
local function nextSeedName(prefix)
	index += 1
	return prefix .. " seed " .. index
end

for row = 1, 8 do
	for col = 1, 6 do
		local y = 3.05 - row * 0.47
		local z = -1.18 + col * 0.38 + ((row % 2) * 0.15)
		seed(nextSeedName("Face"), -3.59, y, z, 0, 90, 0)
	end
end

for row = 1, 6 do
	for col = 1, 7 do
		local x = -0.95 + col * 0.52 + ((row % 2) * 0.18)
		local y = 1.75 - row * 0.45
		seed(nextSeedName("Body left"), x, y, -1.34, 0, 0, 0)
		seed(nextSeedName("Body right"), x, y, 1.34, 0, 180, 0)
	end
end

for row = 1, 5 do
	for col = 1, 4 do
		local y = -0.15 - row * 0.38
		local z = -0.45 + col * 0.3
		seed(nextSeedName("Trunk"), -3.23, y, z, 0, 90, 0, 0.07, 0.07, 0.032)
	end
end

for _, leg in ipairs(legs) do
	for row = 1, 4 do
		for col = 1, 2 do
			seed(nextSeedName(leg[1]), leg[2] - 0.43, leg[3] + 0.75 - row * 0.35, leg[4] - 0.16 + col * 0.3, 0, 90, 0, 0.065, 0.065, 0.03)
		end
	end
end

-- Some darker seed dimples for depth
for row = 1, 5 do
	for col = 1, 5 do
		local x = 0.1 + col * 0.6
		local y = 1.45 - row * 0.5
		seed(nextSeedName("Dimple"), x, y, -1.38, 0, 0, 0, 0.1, 0.1, 0.025, colors.seedShadow)
	end
end

-- Display base and lighting
block("Display base", Vector3.new(8.5, 0.25, 6.5), CFrame.new(0.25, -3.78, 0), colors.base, Enum.Material.WoodPlanks)

local lightHolder = model:FindFirstChild("Square strawberry head")
if lightHolder then
	local light = Instance.new("PointLight")
	light.Name = "Berry display light"
	light.Color = Color3.fromRGB(255, 170, 145)
	light.Brightness = 2.6
	light.Range = 16
	light.Parent = lightHolder
end

local highlight = Instance.new("Highlight")
highlight.Name = "Berry outline"
highlight.FillTransparency = 1
highlight.OutlineTransparency = 0.5
highlight.OutlineColor = Color3.fromRGB(255, 150, 130)
highlight.Parent = model

model.PrimaryPart = model:FindFirstChild("Berry body")
model:PivotTo(root)

local function scaleCharacter(targetModel, scale)
	local base = targetModel:FindFirstChild("Display base")
	local scaleOrigin = targetModel:GetPivot()
	if base and base:IsA("BasePart") then
		base.Size = Vector3.new(base.Size.X * 1.28, base.Size.Y, base.Size.Z * 1.28)
		scaleOrigin = base.CFrame * CFrame.new(0, base.Size.Y / 2, 0)
	end

	for _, item in ipairs(targetModel:GetDescendants()) do
		if item:IsA("BasePart") and item.Name ~= "Display base" then
			local relative = scaleOrigin:ToObjectSpace(item.CFrame)
			local x, y, z, r00, r01, r02, r10, r11, r12, r20, r21, r22 = relative:GetComponents()
			item.Size *= scale
			item.CFrame = scaleOrigin * CFrame.new(x * scale, y * scale, z * scale, r00, r01, r02, r10, r11, r12, r20, r21, r22)
		end
	end
end

scaleCharacter(model, CHARACTER_SCALE)

local animationScript = Instance.new("Script")
animationScript.Name = "ElephantIdleAnimation"
animationScript.Source = [=[
local RunService = game:GetService("RunService")

local model = script.Parent
local homePivot = model:GetPivot()
local baseCFrames = {}
local groupParts = {}

for _, item in ipairs(model:GetDescendants()) do
	if item:IsA("BasePart") and item.Name ~= "Display base" then
		baseCFrames[item] = item.CFrame
	end
end

local function getParts(names)
	local parts = {}
	for _, name in ipairs(names) do
		local part = model:FindFirstChild(name)
		if part and part:IsA("BasePart") then
			parts[#parts + 1] = part
		end
	end
	return parts
end

local function seedRange(prefix, firstIndex, lastIndex)
	local names = {}
	for index = firstIndex, lastIndex do
		names[#names + 1] = prefix .. " seed " .. index
	end
	return names
end

local function combine(...)
	local names = {}
	for _, source in ipairs({ ... }) do
		for _, name in ipairs(source) do
			names[#names + 1] = name
		end
	end
	return names
end

local function makeGroup(names, pivotPartName, localPivotOffset)
	local pivotPart = model:FindFirstChild(pivotPartName or names[1])
	if not (pivotPart and pivotPart:IsA("BasePart")) then
		return nil
	end

	local pivot = baseCFrames[pivotPart] * CFrame.new(localPivotOffset or Vector3.zero)
	local group = {
		pivot = pivot,
		items = {},
	}

	for _, part in ipairs(getParts(names)) do
		groupParts[part] = true
		group.items[#group.items + 1] = {
			part = part,
			relative = group.pivot:ToObjectSpace(baseCFrames[part] or part.CFrame),
		}
	end

	return group
end

local leftEar = makeGroup({
	"Left outer ear",
	"Left inner ear",
	"Left ear top pixel",
	"Left ear lower pixel",
}, "Left outer ear", Vector3.new(0, 0, 1.02))

local rightEar = makeGroup({
	"Right outer ear",
	"Right inner ear",
}, "Right outer ear", Vector3.new(0, 0, -0.9))

local trunk = makeGroup({
	"Long trunk upper",
	"Long trunk middle",
	"Trunk foot curl",
	"Trunk front shadow",
	"Trunk seed 133",
	"Trunk seed 134",
	"Trunk seed 135",
	"Trunk seed 136",
	"Trunk seed 137",
	"Trunk seed 138",
	"Trunk seed 139",
	"Trunk seed 140",
	"Trunk seed 141",
	"Trunk seed 142",
	"Trunk seed 143",
	"Trunk seed 144",
	"Trunk seed 145",
	"Trunk seed 146",
	"Trunk seed 147",
	"Trunk seed 148",
	"Trunk seed 149",
	"Trunk seed 150",
	"Trunk seed 151",
	"Trunk seed 152",
}, "Long trunk upper", Vector3.new(0, 0.82, 0))

local frontLeftLeg = makeGroup(combine({
	"Front left leg",
	"Front left ankle",
	"Front left foot",
	"Front left toe 1",
	"Front left toe 2",
	"Front left toe 3",
}, seedRange("Front left", 153, 160)), "Front left leg", Vector3.new(0, 0.95, 0))

local frontRightLeg = makeGroup(combine({
	"Front right leg",
	"Front right ankle",
	"Front right foot",
	"Front right toe 1",
	"Front right toe 2",
	"Front right toe 3",
}, seedRange("Front right", 161, 168)), "Front right leg", Vector3.new(0, 0.95, 0))

local backLeftLeg = makeGroup(combine({
	"Back left leg",
	"Back left ankle",
	"Back left foot",
	"Back left toe 1",
	"Back left toe 2",
	"Back left toe 3",
}, seedRange("Back left", 169, 176)), "Back left leg", Vector3.new(0, 0.95, 0))

local backRightLeg = makeGroup(combine({
	"Back right leg",
	"Back right ankle",
	"Back right foot",
	"Back right toe 1",
	"Back right toe 2",
	"Back right toe 3",
}, seedRange("Back right", 177, 184)), "Back right leg", Vector3.new(0, 0.95, 0))

local function setBasePose(walkRoot)
	for part, cframe in pairs(baseCFrames) do
		if not groupParts[part] then
			part.CFrame = walkRoot * cframe
		end
	end
end

local function animateGroup(walkRoot, group, offset)
	if not group then
		return
	end

	for _, item in ipairs(group.items) do
		item.part.CFrame = walkRoot * group.pivot * offset * item.relative
	end
end

RunService.Heartbeat:Connect(function()
	local t = os.clock()
	local stride = t * 3.4
	local step = math.sin(stride)
	local counterStep = math.sin(stride + math.pi)
	local bob = math.abs(math.sin(stride)) * 0.08
	local travel = math.sin(t * 0.55) * 0.25
	local sway = math.sin(stride) * 0.035
	local yaw = math.rad(math.sin(t * 0.55) * 1.5)
	local walkRoot = homePivot * CFrame.new(travel, bob, sway) * CFrame.Angles(0, yaw, 0) * homePivot:Inverse()

	setBasePose(walkRoot)

	local earWave = math.sin(t * 4.0)
	local trunkSwing = math.sin(stride + 0.65)
	local trunkCurl = math.sin(t * 3.0 + 0.7)
	local legAngle = 8

	animateGroup(walkRoot, leftEar, CFrame.Angles(0, math.rad(-6 * earWave), math.rad(1.5 * earWave)))
	animateGroup(walkRoot, rightEar, CFrame.Angles(0, math.rad(6 * earWave), math.rad(-1.5 * earWave)))
	animateGroup(
		walkRoot,
		trunk,
		CFrame.Angles(math.rad(2.5 * trunkCurl), math.rad(7 * trunkSwing), math.rad(2 * math.sin(t * 2.2)))
	)
	animateGroup(walkRoot, frontLeftLeg, CFrame.Angles(0, 0, math.rad(legAngle * step)))
	animateGroup(walkRoot, backRightLeg, CFrame.Angles(0, 0, math.rad(legAngle * step)))
	animateGroup(walkRoot, frontRightLeg, CFrame.Angles(0, 0, math.rad(legAngle * counterStep)))
	animateGroup(walkRoot, backLeftLeg, CFrame.Angles(0, 0, math.rad(legAngle * counterStep)))
end)
]=]
animationScript.Parent = model

print("Created " .. MODEL_NAME .. " with " .. #model:GetDescendants() .. " instances.")
