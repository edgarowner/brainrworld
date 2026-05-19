-- Run in Roblox Studio with StudioMCP/Command Bar.
-- Creates a first playable Brainworld Roblox prototype using logic ported from the Phaser game.

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerScriptService = game:GetService("ServerScriptService")
local StarterPlayer = game:GetService("StarterPlayer")
local Workspace = game:GetService("Workspace")

local function putScript(parent, className, name, source)
	local existing = parent:FindFirstChild(name)
	if existing then
		existing:Destroy()
	end

	local scriptObject = Instance.new(className)
	scriptObject.Name = name
	scriptObject.Source = source
	scriptObject.Parent = parent
	return scriptObject
end

local assetFolder = ReplicatedStorage:FindFirstChild("BrainworldAssets")
if not assetFolder then
	assetFolder = Instance.new("Folder")
	assetFolder.Name = "BrainworldAssets"
	assetFolder.Parent = ReplicatedStorage
end

local function stashWorkspaceModel(modelName, templateName)
	local existingTemplate = assetFolder:FindFirstChild(templateName)
	local workspaceModel = Workspace:FindFirstChild(modelName)

	if workspaceModel and workspaceModel:IsA("Model") then
		if existingTemplate then
			existingTemplate:Destroy()
		end
		workspaceModel.Name = templateName
		workspaceModel.Parent = assetFolder
	elseif existingTemplate then
		existingTemplate.Parent = assetFolder
	end
end

stashWorkspaceModel("Strawberry Elephant", "StrawberryElephantTemplate")
stashWorkspaceModel("Dragon Cannelloni", "DragonCannelloniTemplate")

local dataSource = [=[
local BrainworldData = {}

BrainworldData.Tiers = {
	SIMPLE = { label = "Simple", order = 1, spawnWeight = 1000, minLevel = 3, maxLevel = 15 },
	SALVAJE = { label = "Salvaje", order = 2, spawnWeight = 600, minLevel = 16, maxLevel = 40 },
	ELITE = { label = "Elite", order = 3, spawnWeight = 300, minLevel = 41, maxLevel = 80 },
	RARO = { label = "Raro", order = 4, spawnWeight = 150, minLevel = 81, maxLevel = 130 },
	TITAN = { label = "Titan", order = 5, spawnWeight = 70, minLevel = 131, maxLevel = 180 },
	SPECIAL = { label = "SPECIAL", order = 6, spawnWeight = 35, minLevel = 100, maxLevel = 250 },
	GOAT = { label = "GOAT", order = 7, spawnWeight = 10, minLevel = 350, maxLevel = 520 },
	SUPREMO = { label = "Supremo", order = 8, spawnWeight = 3, minLevel = 700, maxLevel = 950 },
}

BrainworldData.Brainrots = {
	{
		name = "Skibidi Sprout",
		tier = "SIMPLE",
		level = 5,
		maxHp = 27,
		color = Color3.fromRGB(110, 224, 105),
		shade = Color3.fromRGB(43, 157, 101),
		moves = {
			{ name = "Vine Meme", power = 8 },
			{ name = "Brain Ping", power = 6 },
			{ name = "Cringe Bark", power = 5 },
			{ name = "Leaf Flex", power = 9 },
		},
	},
	{
		name = "Strawberry Elephant",
		tier = "SUPREMO",
		level = 899,
		maxHp = 38,
		color = Color3.fromRGB(230, 66, 66),
		shade = Color3.fromRGB(167, 39, 53),
		moves = {
			{ name = "Seed Static", power = 8 },
			{ name = "Trunk Bonk", power = 10 },
			{ name = "Berry Blast", power = 9 },
			{ name = "Leaf Flex", power = 7 },
		},
	},
	{
		name = "Dragon Cannelloni",
		tier = "GOAT",
		level = 380,
		maxHp = 64,
		color = Color3.fromRGB(230, 185, 65),
		shade = Color3.fromRGB(143, 90, 37),
		moves = {
			{ name = "Pasta Flame", power = 13 },
			{ name = "Crunch Roll", power = 11 },
			{ name = "Golden Roar", power = 10 },
			{ name = "Sauce Swipe", power = 12 },
		},
	},
	{
		name = "Bombardiro Crocodilo",
		tier = "ELITE",
		level = 160,
		maxHp = 78,
		color = Color3.fromRGB(106, 143, 56),
		shade = Color3.fromRGB(89, 97, 94),
		moves = {
			{ name = "Prop Chomp", power = 12 },
			{ name = "Bomb Dive", power = 14 },
			{ name = "Croc Barrage", power = 11 },
			{ name = "Runway Bite", power = 10 },
		},
	},
	{
		name = "Cappuccino Assassino",
		tier = "RARO",
		level = 150,
		maxHp = 58,
		color = Color3.fromRGB(200, 155, 98),
		shade = Color3.fromRGB(61, 40, 29),
		moves = {
			{ name = "Espresso Cut", power = 13 },
			{ name = "Foam Feint", power = 9 },
			{ name = "Cup Combo", power = 11 },
			{ name = "Latte Lunge", power = 12 },
		},
	},
}

BrainworldData.Starter = {
	name = "Giga Bean",
	tier = "SIMPLE",
	level = 7,
	maxHp = 36,
	hp = 36,
	color = Color3.fromRGB(104, 221, 150),
	shade = Color3.fromRGB(47, 147, 109),
	moves = {
		{ name = "Brain Beam", power = 9 },
		{ name = "Fresh Take", power = 7 },
		{ name = "Focus Tap", power = 6 },
		{ name = "Vibe Guard", power = 0, heal = 8 },
	},
}

local function copyMove(move)
	return {
		name = move.name,
		power = move.power,
		heal = move.heal,
	}
end

function BrainworldData.CloneBrainrot(template)
	local clone = {
		name = template.name,
		tier = template.tier,
		level = template.level,
		maxHp = template.maxHp,
		hp = template.maxHp,
		color = template.color,
		shade = template.shade,
		moves = {},
	}

	for _, move in ipairs(template.moves) do
		table.insert(clone.moves, copyMove(move))
	end

	return clone
end

function BrainworldData.TierLabel(brainrot)
	local tier = BrainworldData.Tiers[brainrot.tier]
	return tier and tier.label or brainrot.tier
end

function BrainworldData.RollDamage(power, attackerLevel, defenderLevel)
	local levelFactor = math.clamp((attackerLevel + 12) / (defenderLevel + 12), 0.55, 1.65)
	local variance = math.random(85, 115) / 100
	return math.max(1, math.floor((power * levelFactor * variance) + 0.5))
end

function BrainworldData.PickWeightedBrainrot(luck)
	for _, brainrot in ipairs(BrainworldData.Brainrots) do
		if brainrot.name == "Strawberry Elephant" then
			return BrainworldData.CloneBrainrot(brainrot)
		end
	end

	return BrainworldData.CloneBrainrot(BrainworldData.Brainrots[1])
end

return BrainworldData
]=]

local worldSource = [=[
local Workspace = game:GetService("Workspace")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Data = require(ReplicatedStorage:WaitForChild("BrainworldData"))

local ROOT_NAME = "BrainworldRobloxPrototype"
local old = Workspace:FindFirstChild(ROOT_NAME)
if old then
	old:Destroy()
end

local root = Instance.new("Folder")
root.Name = ROOT_NAME
root.Parent = Workspace

local function makePart(parent, name, size, cframe, color, material, canCollide)
	local part = Instance.new("Part")
	part.Name = name
	part.Anchored = true
	part.CanCollide = canCollide ~= false
	part.Size = size
	part.CFrame = cframe
	part.Color = color
	part.Material = material or Enum.Material.SmoothPlastic
	part.TopSurface = Enum.SurfaceType.Smooth
	part.BottomSurface = Enum.SurfaceType.Smooth
	part.Parent = parent
	return part
end

local function makeZone(name, center, size)
	local zone = makePart(root, name, Vector3.new(size.X, 0.25, size.Z), CFrame.new(center.X, 0.15, center.Z), Color3.fromRGB(96, 219, 112), Enum.Material.Grass, false)
	zone.Transparency = 0.18
	zone:SetAttribute("TallGrass", true)

	for i = 1, math.floor(size.X * size.Z / 20) do
		local blade = makePart(
			root,
			name .. " Blade",
			Vector3.new(0.18, math.random(9, 18) / 10, 0.18),
			CFrame.new(
				center.X + math.random(-size.X * 45, size.X * 45) / 100,
				0.55,
				center.Z + math.random(-size.Z * 45, size.Z * 45) / 100
			),
			Color3.fromRGB(math.random(62, 120), math.random(175, 230), math.random(70, 115)),
			Enum.Material.Grass,
			false
		)
		blade.Rotation = Vector3.new(0, math.random(0, 360), math.random(-8, 8))
	end

	return zone
end

local function makeHouse(name, x, z, roofColor)
	local house = Instance.new("Model")
	house.Name = name
	house.Parent = root

	makePart(house, "Foundation", Vector3.new(8.2, 0.5, 7.2), CFrame.new(x, 0.25, z), Color3.fromRGB(141, 111, 80), Enum.Material.Cobblestone)
	makePart(house, "Warm walls", Vector3.new(7, 4.8, 6), CFrame.new(x, 2.65, z), Color3.fromRGB(248, 214, 149), Enum.Material.WoodPlanks)
	makePart(house, "Front face trim", Vector3.new(7.25, 0.45, 0.18), CFrame.new(x, 4.45, z - 3.12), Color3.fromRGB(216, 141, 90), Enum.Material.Wood)
	makePart(house, "Lower trim", Vector3.new(7.25, 0.35, 0.18), CFrame.new(x, 0.72, z - 3.12), Color3.fromRGB(216, 141, 90), Enum.Material.Wood)

	makePart(house, "Left roof slope", Vector3.new(8.4, 0.65, 4.35), CFrame.new(x, 5.45, z - 1.15) * CFrame.Angles(math.rad(-22), 0, 0), roofColor, Enum.Material.Slate)
	makePart(house, "Right roof slope", Vector3.new(8.4, 0.65, 4.35), CFrame.new(x, 5.45, z + 1.15) * CFrame.Angles(math.rad(22), 0, 0), roofColor, Enum.Material.Slate)
	makePart(house, "Roof ridge", Vector3.new(8.6, 0.5, 0.55), CFrame.new(x, 6.28, z), roofColor:Lerp(Color3.new(1, 1, 1), 0.12), Enum.Material.Slate)
	makePart(house, "Front roof lip", Vector3.new(8.9, 0.45, 0.48), CFrame.new(x, 4.98, z - 3.55), roofColor:Lerp(Color3.new(0, 0, 0), 0.16), Enum.Material.Slate)

	makePart(house, "Door", Vector3.new(1.45, 2.55, 0.2), CFrame.new(x, 1.65, z - 3.24), Color3.fromRGB(99, 65, 40), Enum.Material.Wood)
	makePart(house, "Door knob", Vector3.new(0.16, 0.16, 0.16), CFrame.new(x + 0.45, 1.62, z - 3.38), Color3.fromRGB(245, 200, 91), Enum.Material.Metal, false)
	makePart(house, "Window L", Vector3.new(1.12, 1.12, 0.16), CFrame.new(x - 2.25, 2.65, z - 3.26), Color3.fromRGB(117, 207, 230), Enum.Material.Glass, false)
	makePart(house, "Window R", Vector3.new(1.12, 1.12, 0.16), CFrame.new(x + 2.25, 2.65, z - 3.26), Color3.fromRGB(117, 207, 230), Enum.Material.Glass, false)
	makePart(house, "Window L cross X", Vector3.new(0.14, 1.22, 0.18), CFrame.new(x - 2.25, 2.65, z - 3.36), Color3.fromRGB(255, 246, 216), Enum.Material.Wood, false)
	makePart(house, "Window L cross Y", Vector3.new(1.22, 0.14, 0.18), CFrame.new(x - 2.25, 2.65, z - 3.36), Color3.fromRGB(255, 246, 216), Enum.Material.Wood, false)
	makePart(house, "Window R cross X", Vector3.new(0.14, 1.22, 0.18), CFrame.new(x + 2.25, 2.65, z - 3.36), Color3.fromRGB(255, 246, 216), Enum.Material.Wood, false)
	makePart(house, "Window R cross Y", Vector3.new(1.22, 0.14, 0.18), CFrame.new(x + 2.25, 2.65, z - 3.36), Color3.fromRGB(255, 246, 216), Enum.Material.Wood, false)
	makePart(house, "Chimney", Vector3.new(0.95, 1.8, 0.95), CFrame.new(x + 2.35, 6.25, z + 0.9), Color3.fromRGB(160, 78, 58), Enum.Material.Brick)
	return house
end

local water = makePart(root, "Water Border", Vector3.new(96, 0.18, 70), CFrame.new(0, -0.08, 0), Color3.fromRGB(117, 207, 230), Enum.Material.Water, true)
water.Transparency = 0.25

makePart(root, "Town Grass", Vector3.new(78, 0.35, 52), CFrame.new(0, 0, 0), Color3.fromRGB(95, 219, 112), Enum.Material.Grass)
makePart(root, "Main Path NS", Vector3.new(8, 0.4, 52), CFrame.new(0, 0.08, 0), Color3.fromRGB(239, 214, 139), Enum.Material.Sand)
makePart(root, "Main Path EW", Vector3.new(78, 0.4, 8), CFrame.new(0, 0.09, 0), Color3.fromRGB(239, 214, 139), Enum.Material.Sand)
makePart(root, "Battle Plaza", Vector3.new(18, 0.45, 14), CFrame.new(18, 0.14, 12), Color3.fromRGB(247, 241, 222), Enum.Material.Pavement)

makeHouse("Blue Home", -26, -15, Color3.fromRGB(67, 113, 219))
makeHouse("Red Home", -9, -15, Color3.fromRGB(215, 80, 121))
makeHouse("Heal Center", 12, -15, Color3.fromRGB(87, 194, 224))
makeHouse("Purple Shop", 29, 2, Color3.fromRGB(139, 91, 211))
makeHouse("Yellow Home", -25, 17, Color3.fromRGB(245, 200, 91))

makeZone("Tall Grass West", Vector3.new(-24, 0, 5), Vector3.new(14, 0, 12))
makeZone("Tall Grass South", Vector3.new(4, 0, 19), Vector3.new(16, 0, 9))
makeZone("Tall Grass East", Vector3.new(25, 0, 16), Vector3.new(15, 0, 9))

makePart(root, "Heal Machine", Vector3.new(3, 3.8, 3), CFrame.new(12, 1.9, -9.5), Color3.fromRGB(75, 196, 210), Enum.Material.Neon)

print("Brainworld Roblox prototype world created.")
]=]

local clientSource = [=[
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")

local Data = require(ReplicatedStorage:WaitForChild("BrainworldData"))

local player = Players.LocalPlayer
local camera = workspace.CurrentCamera

local function findBrainrotTemplate(name)
	for _, brainrot in ipairs(Data.Brainrots) do
		if brainrot.name == name then
			return brainrot
		end
	end
	return nil
end

local activeBrainrot = Data.CloneBrainrot(findBrainrotTemplate("Dragon Cannelloni") or Data.Starter)
local enemy = nil
local inBattle = false
local nextEncounterCheck = 0
local lastEncounterTime = 0
local playerLuck = 1
local wildPreview = nil
local playerPreview = nil
local cinematicActive = false
local battleCameraCFrame = nil
local actionLocked = false

local function makeGui()
	local old = player.PlayerGui:FindFirstChild("BrainworldBattleGui")
	if old then
		old:Destroy()
	end

	local gui = Instance.new("ScreenGui")
	gui.Name = "BrainworldBattleGui"
	gui.ResetOnSpawn = false
	gui.Enabled = false
	gui.Parent = player.PlayerGui

	local root = Instance.new("Frame")
	root.Name = "BattlePanel"
	root.AnchorPoint = Vector2.new(0, 1)
	root.Position = UDim2.fromScale(0.035, 0.965)
	root.Size = UDim2.fromScale(0.56, 0.22)
	root.BackgroundColor3 = Color3.fromRGB(247, 241, 222)
	root.BorderSizePixel = 0
	root.Parent = gui

	local stroke = Instance.new("UIStroke")
	stroke.Color = Color3.fromRGB(38, 50, 74)
	stroke.Thickness = 4
	stroke.Parent = root

	local corner = Instance.new("UICorner")
	corner.CornerRadius = UDim.new(0, 8)
	corner.Parent = root

	local title = Instance.new("TextLabel")
	title.Name = "Title"
	title.BackgroundTransparency = 1
	title.Position = UDim2.fromScale(0.04, 0.06)
	title.Size = UDim2.fromScale(0.92, 0.18)
	title.TextColor3 = Color3.fromRGB(38, 50, 74)
	title.Font = Enum.Font.Arcade
	title.TextScaled = true
	title.TextXAlignment = Enum.TextXAlignment.Left
	title.Parent = root

	local dialogue = Instance.new("TextLabel")
	dialogue.Name = "Dialogue"
	dialogue.BackgroundTransparency = 1
	dialogue.Position = UDim2.fromScale(0.04, 0.29)
	dialogue.Size = UDim2.fromScale(0.45, 0.6)
	dialogue.TextColor3 = Color3.fromRGB(38, 50, 74)
	dialogue.Font = Enum.Font.Arcade
	dialogue.TextScaled = true
	dialogue.TextWrapped = true
	dialogue.TextXAlignment = Enum.TextXAlignment.Left
	dialogue.TextYAlignment = Enum.TextYAlignment.Top
	dialogue.Parent = root

	local buttons = Instance.new("Frame")
	buttons.Name = "MoveButtons"
	buttons.BackgroundTransparency = 1
	buttons.Position = UDim2.fromScale(0.52, 0.29)
	buttons.Size = UDim2.fromScale(0.43, 0.6)
	buttons.Parent = root

	local grid = Instance.new("UIGridLayout")
	grid.CellSize = UDim2.fromScale(0.48, 0.42)
	grid.CellPadding = UDim2.fromScale(0.04, 0.08)
	grid.Parent = buttons

	for i = 1, 4 do
		local button = Instance.new("TextButton")
		button.Name = "Move" .. i
		button.BackgroundColor3 = Color3.fromRGB(255, 246, 216)
		button.TextColor3 = Color3.fromRGB(38, 50, 74)
		button.Font = Enum.Font.Arcade
		button.TextScaled = true
		button.TextWrapped = true
		button.Parent = buttons
		local buttonStroke = Instance.new("UIStroke")
		buttonStroke.Color = Color3.fromRGB(86, 97, 124)
		buttonStroke.Thickness = 2
		buttonStroke.Parent = button
	end

	return gui
end

local gui = makeGui()

local function makeCinematicGui()
	local old = player.PlayerGui:FindFirstChild("BrainworldEncounterCinematic")
	if old then
		old:Destroy()
	end

	local cinematicGui = Instance.new("ScreenGui")
	cinematicGui.Name = "BrainworldEncounterCinematic"
	cinematicGui.ResetOnSpawn = false
	cinematicGui.IgnoreGuiInset = true
	cinematicGui.Enabled = false
	cinematicGui.Parent = player.PlayerGui

	local topBar = Instance.new("Frame")
	topBar.Name = "TopBar"
	topBar.BackgroundColor3 = Color3.new(0, 0, 0)
	topBar.BorderSizePixel = 0
	topBar.Position = UDim2.fromScale(0, -0.18)
	topBar.Size = UDim2.fromScale(1, 0.16)
	topBar.Parent = cinematicGui

	local bottomBar = topBar:Clone()
	bottomBar.Name = "BottomBar"
	bottomBar.Position = UDim2.fromScale(0, 1.02)
	bottomBar.Parent = cinematicGui

	local flash = Instance.new("Frame")
	flash.Name = "Flash"
	flash.BackgroundColor3 = Color3.fromRGB(255, 246, 216)
	flash.BorderSizePixel = 0
	flash.BackgroundTransparency = 1
	flash.Size = UDim2.fromScale(1, 1)
	flash.Parent = cinematicGui

	local text = Instance.new("TextLabel")
	text.Name = "EncounterText"
	text.AnchorPoint = Vector2.new(0.5, 0.5)
	text.BackgroundColor3 = Color3.fromRGB(247, 241, 222)
	text.BackgroundTransparency = 0.08
	text.BorderSizePixel = 0
	text.Position = UDim2.fromScale(0.5, 0.72)
	text.Size = UDim2.fromScale(0.62, 0.12)
	text.Text = ""
	text.TextColor3 = Color3.fromRGB(38, 50, 74)
	text.TextStrokeTransparency = 0.75
	text.Font = Enum.Font.Arcade
	text.TextScaled = true
	text.Visible = false
	text.Parent = cinematicGui

	local textStroke = Instance.new("UIStroke")
	textStroke.Color = Color3.fromRGB(38, 50, 74)
	textStroke.Thickness = 3
	textStroke.Parent = text

	local textCorner = Instance.new("UICorner")
	textCorner.CornerRadius = UDim.new(0, 8)
	textCorner.Parent = text

	return cinematicGui
end

local cinematicGui = makeCinematicGui()

local function setMovementEnabled(enabled)
	local character = player.Character
	local humanoid = character and character:FindFirstChildOfClass("Humanoid")
	if humanoid then
		humanoid.WalkSpeed = enabled and 16 or 0
		humanoid.JumpPower = enabled and 50 or 0
	end
end

local function setCharacterBattleHidden(hidden)
	local character = player.Character
	if not character then
		return
	end

	for _, item in ipairs(character:GetDescendants()) do
		if item:IsA("BasePart") then
			item.LocalTransparencyModifier = hidden and 1 or 0
		elseif item:IsA("Decal") then
			item.Transparency = hidden and 1 or 0
		end
	end
end

local function updateCamera()
	local character = player.Character
	local root = character and character:FindFirstChild("HumanoidRootPart")
	if not root then
		return
	end

	camera.CameraType = Enum.CameraType.Scriptable
	if battleCameraCFrame then
		camera.FieldOfView = cinematicActive and 40 or 43
		camera.CFrame = battleCameraCFrame
		return
	end

	camera.FieldOfView = 45
	local focus = root.Position + Vector3.new(0, 2.5, -4)
	camera.CFrame = CFrame.lookAt(root.Position + Vector3.new(0, 20, 30), focus)
end

local function isInTallGrass()
	local character = player.Character
	local root = character and character:FindFirstChild("HumanoidRootPart")
	if not root then
		return false
	end

	local world = workspace:FindFirstChild("BrainworldRobloxPrototype")
	if not world then
		return false
	end

	for _, part in ipairs(world:GetChildren()) do
		if part:IsA("BasePart") and part:GetAttribute("TallGrass") then
			local localPoint = part.CFrame:PointToObjectSpace(root.Position)
			if math.abs(localPoint.X) <= part.Size.X / 2 and math.abs(localPoint.Z) <= part.Size.Z / 2 then
				return true
			end
		end
	end

	return false
end

local function clearWildPreview()
	if wildPreview then
		wildPreview:Destroy()
		wildPreview = nil
	end
	if playerPreview then
		playerPreview:Destroy()
		playerPreview = nil
	end
	battleCameraCFrame = nil
end

local function makeFallbackStrawberry(position)
	local model = Instance.new("Model")
	model.Name = "Wild Strawberry Elephant"

	local body = Instance.new("Part")
	body.Name = "Berry Body"
	body.Anchored = true
	body.CanCollide = false
	body.Size = Vector3.new(3.2, 3.2, 2.4)
	body.Color = Color3.fromRGB(230, 66, 66)
	body.Material = Enum.Material.SmoothPlastic
	body.CFrame = CFrame.new(position + Vector3.new(0, 2.2, 0))
	body.Parent = model
	model.PrimaryPart = body

	local leaf = Instance.new("Part")
	leaf.Name = "Leaf Crown"
	leaf.Anchored = true
	leaf.CanCollide = false
	leaf.Size = Vector3.new(3.6, 0.4, 2.7)
	leaf.Color = Color3.fromRGB(139, 184, 42)
	leaf.CFrame = body.CFrame * CFrame.new(0, 1.85, 0)
	leaf.Parent = model

	model.Parent = workspace
	return model
end

local function findFirstPart(model, names)
	for _, name in ipairs(names) do
		local part = model:FindFirstChild(name, true)
		if part and part:IsA("BasePart") then
			return part
		end
	end
	return nil
end

local function faceModelEyesToward(model, targetPosition)
	local leftEye = findFirstPart(model, { "Left pixel eye", "Left eye blue", "Left eye white" })
	local rightEye = findFirstPart(model, { "Right pixel eye", "Right eye blue", "Right eye white" })
	if not (leftEye and rightEye and leftEye:IsA("BasePart") and rightEye:IsA("BasePart")) then
		return
	end

	local pivot = model:GetPivot()
	local eyeCenter = (leftEye.Position + rightEye.Position) / 2
	local currentFace = Vector3.new(eyeCenter.X - pivot.Position.X, 0, eyeCenter.Z - pivot.Position.Z)
	local desiredFace = Vector3.new(targetPosition.X - pivot.Position.X, 0, targetPosition.Z - pivot.Position.Z)
	if currentFace.Magnitude < 0.01 or desiredFace.Magnitude < 0.01 then
		return
	end

	currentFace = currentFace.Unit
	desiredFace = desiredFace.Unit
	local angle = math.atan2(currentFace:Cross(desiredFace).Y, currentFace:Dot(desiredFace))
	local pivotPosition = pivot.Position
	model:PivotTo(CFrame.new(pivotPosition) * CFrame.Angles(0, angle, 0) * CFrame.new(-pivotPosition) * pivot)
end

local function cloneBattleModel(templateName, modelName, scale)
	local assets = ReplicatedStorage:FindFirstChild("BrainworldAssets")
	local template = assets and assets:FindFirstChild(templateName)
	if not (template and template:IsA("Model")) then
		return nil
	end

	local clone = template:Clone()
	clone.Name = modelName
	for _, item in ipairs(clone:GetDescendants()) do
		if item.Name == "Display base" then
			item:Destroy()
		elseif item:IsA("Script") or item:IsA("LocalScript") then
			item:Destroy()
		elseif item:IsA("BasePart") then
			item.Anchored = true
			item.CanCollide = false
		end
	end
	clone.Parent = workspace
	pcall(function()
		clone:ScaleTo(scale)
	end)
	return clone
end

local function spawnWildStrawberryPreview()
	clearWildPreview()

	local character = player.Character
	local root = character and character:FindFirstChild("HumanoidRootPart")
	if not root then
		return
	end

	local spawnPosition = root.Position + root.CFrame.LookVector * 10 + Vector3.new(0, 0, 0)
	wildPreview = cloneBattleModel("StrawberryElephantTemplate", "Wild Strawberry Elephant", 0.42)
	if wildPreview then
		local templatePivot = wildPreview:GetPivot()
		local templateRotation = templatePivot - templatePivot.Position
		wildPreview:PivotTo(CFrame.new(spawnPosition + Vector3.new(0, 1.2, 0)) * templateRotation)
		faceModelEyesToward(wildPreview, root.Position)
	else
		wildPreview = makeFallbackStrawberry(spawnPosition)
	end
end

local function spawnPlayerDragonPreview()
	if playerPreview then
		playerPreview:Destroy()
		playerPreview = nil
	end

	local character = player.Character
	local root = character and character:FindFirstChild("HumanoidRootPart")
	if not root or not wildPreview then
		return
	end

	local enemyPosition = wildPreview:GetPivot().Position
	local spawnPosition = root.Position + root.CFrame.LookVector * 2 + root.CFrame.RightVector * 4.8 + Vector3.new(0, 1.2, 0)
	playerPreview = cloneBattleModel("DragonCannelloniTemplate", "Player Dragon Cannelloni", 0.24)
	if not playerPreview then
		return
	end

	local templatePivot = playerPreview:GetPivot()
	local templateRotation = templatePivot - templatePivot.Position
	playerPreview:PivotTo(CFrame.new(spawnPosition) * templateRotation)
	faceModelEyesToward(playerPreview, enemyPosition)
end

local refreshBattleGui

local function playEncounterCinematic()
	local character = player.Character
	local root = character and character:FindFirstChild("HumanoidRootPart")
	if not root or not enemy then
		gui.Enabled = true
		refreshBattleGui(enemy and (enemy.name .. " appeared in the tall grass!") or "A wild brainrot appeared!")
		return
	end

	cinematicActive = true
	cinematicGui.Enabled = true
	cinematicGui.TopBar.Position = UDim2.fromScale(0, -0.18)
	cinematicGui.BottomBar.Position = UDim2.fromScale(0, 1.02)
	cinematicGui.Flash.BackgroundTransparency = 1
	cinematicGui.EncounterText.Visible = false
	gui.Enabled = false

	local grassFocus = root.Position + root.CFrame.LookVector * 5 + Vector3.new(0, 1.6, 0)
	local startCamera = CFrame.lookAt(root.Position + Vector3.new(0, 18, 25), root.Position + Vector3.new(0, 2, -3))
	local zoomCamera = CFrame.lookAt(grassFocus + Vector3.new(0, 8, 13), grassFocus)
	battleCameraCFrame = startCamera

	TweenService:Create(cinematicGui.TopBar, TweenInfo.new(0.22, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), {
		Position = UDim2.fromScale(0, 0),
	}):Play()
	TweenService:Create(cinematicGui.BottomBar, TweenInfo.new(0.22, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), {
		Position = UDim2.fromScale(0, 0.84),
	}):Play()
	task.wait(0.18)

	local cameraValue = Instance.new("CFrameValue")
	cameraValue.Value = startCamera
	cameraValue:GetPropertyChangedSignal("Value"):Connect(function()
		battleCameraCFrame = cameraValue.Value
	end)
	TweenService:Create(cameraValue, TweenInfo.new(0.55, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out), {
		Value = zoomCamera,
	}):Play()
	task.wait(0.48)

	TweenService:Create(cinematicGui.Flash, TweenInfo.new(0.08), { BackgroundTransparency = 0.08 }):Play()
	task.wait(0.1)
	spawnWildStrawberryPreview()

		local previewPivot = wildPreview and wildPreview:GetPivot()
		if previewPivot then
			spawnPlayerDragonPreview()
			local previewPosition = previewPivot.Position
			local dragonPosition = playerPreview and playerPreview:GetPivot().Position or root.Position
			local midpoint = (previewPosition + dragonPosition) / 2
			local cameraPosition = midpoint - root.CFrame.LookVector * 25 + root.CFrame.RightVector * 5 + Vector3.new(0, 11, 0)
			battleCameraCFrame = CFrame.lookAt(cameraPosition, midpoint + Vector3.new(0, 2.6, 0))
		end

	TweenService:Create(cinematicGui.Flash, TweenInfo.new(0.18), { BackgroundTransparency = 1 }):Play()
	cinematicGui.EncounterText.Text = "Wild " .. enemy.name .. " appeared!"
	cinematicGui.EncounterText.Visible = true
	task.wait(0.85)

	gui.Enabled = true
	refreshBattleGui(enemy.name .. " appeared in the tall grass!")
	TweenService:Create(cinematicGui.TopBar, TweenInfo.new(0.22, Enum.EasingStyle.Quad, Enum.EasingDirection.In), {
		Position = UDim2.fromScale(0, -0.18),
	}):Play()
	TweenService:Create(cinematicGui.BottomBar, TweenInfo.new(0.22, Enum.EasingStyle.Quad, Enum.EasingDirection.In), {
		Position = UDim2.fromScale(0, 1.02),
	}):Play()
	cinematicGui.EncounterText.Visible = false
	task.wait(0.25)
	cinematicGui.Enabled = false
	cinematicActive = false
	cameraValue:Destroy()
end

local function pivotTween(model, targetCFrame, duration, style, direction)
	if not model then
		return nil
	end

	local pivotValue = Instance.new("CFrameValue")
	pivotValue.Value = model:GetPivot()
	local connection = pivotValue:GetPropertyChangedSignal("Value"):Connect(function()
		if model.Parent then
			model:PivotTo(pivotValue.Value)
		end
	end)

	local tween = TweenService:Create(
		pivotValue,
		TweenInfo.new(duration, style or Enum.EasingStyle.Quad, direction or Enum.EasingDirection.Out),
		{ Value = targetCFrame }
	)
	tween.Completed:Connect(function()
		connection:Disconnect()
		pivotValue:Destroy()
	end)
	tween:Play()
	return tween
end

local function flashModel(model, color)
	if not model then
		return
	end

	for _, part in ipairs(model:GetDescendants()) do
		if part:IsA("BasePart") then
			local originalColor = part.Color
			part.Color = color
			task.delay(0.13, function()
				if part.Parent then
					part.Color = originalColor
				end
			end)
		end
	end
end

local function makeProjectile(name, color, startPosition, endPosition, size, duration)
	local projectile = Instance.new("Part")
	projectile.Name = name
	projectile.Anchored = true
	projectile.CanCollide = false
	projectile.Shape = Enum.PartType.Ball
	projectile.Material = Enum.Material.Neon
	projectile.Color = color
	projectile.Size = Vector3.new(size, size, size)
	projectile.CFrame = CFrame.new(startPosition)
	projectile.Parent = workspace

	TweenService:Create(projectile, TweenInfo.new(duration, Enum.EasingStyle.Quad, Enum.EasingDirection.In), {
		CFrame = CFrame.new(endPosition),
		Size = Vector3.new(size * 1.6, size * 1.6, size * 1.6),
		Transparency = 0.15,
	}):Play()
	task.delay(duration + 0.08, function()
		if projectile.Parent then
			projectile:Destroy()
		end
	end)
end

local function animateAttack(move)
	if not playerPreview or not wildPreview then
		return
	end

	actionLocked = true
	local dragonStart = playerPreview:GetPivot()
	local enemyPivot = wildPreview:GetPivot()
	local enemyPosition = enemyPivot.Position + Vector3.new(0, 2, 0)
	local dragonPosition = dragonStart.Position + Vector3.new(0, 2, 0)
	local towardEnemy = (enemyPivot.Position - dragonStart.Position)
	if towardEnemy.Magnitude < 0.1 then
		towardEnemy = Vector3.new(0, 0, -1)
	end
	towardEnemy = towardEnemy.Unit

	if move.name == "Pasta Flame" then
		for i = 1, 5 do
			makeProjectile(
				"Pasta Flame",
				Color3.fromRGB(255, 116 + i * 18, 30),
				dragonPosition + Vector3.new(0, 0.25 * i, 0),
				enemyPosition + Vector3.new(math.sin(i) * 0.8, 0.15 * i, 0),
				0.45,
				0.34 + i * 0.04
			)
		end
		pivotTween(playerPreview, dragonStart * CFrame.Angles(0, 0, math.rad(-7)), 0.12)
		task.wait(0.45)
		flashModel(wildPreview, Color3.fromRGB(255, 146, 57))
		pivotTween(playerPreview, dragonStart, 0.15)
	elseif move.name == "Crunch Roll" then
		local lunge = dragonStart + towardEnemy * 4
		pivotTween(playerPreview, lunge * CFrame.Angles(0, math.rad(30), math.rad(10)), 0.16, Enum.EasingStyle.Back)
		task.wait(0.17)
		flashModel(wildPreview, Color3.fromRGB(255, 255, 210))
		pivotTween(wildPreview, enemyPivot * CFrame.new(0, 0.25, 0) * CFrame.Angles(0, 0, math.rad(5)), 0.08)
		task.wait(0.12)
		pivotTween(playerPreview, dragonStart, 0.18, Enum.EasingStyle.Back)
		pivotTween(wildPreview, enemyPivot, 0.14)
	elseif move.name == "Golden Roar" then
		for i = 1, 3 do
			makeProjectile(
				"Golden Roar Ring",
				Color3.fromRGB(255, 225, 70),
				dragonPosition + Vector3.new(0, i * 0.25, 0),
				enemyPosition + towardEnemy * -0.4,
				0.75 + i * 0.22,
				0.38 + i * 0.08
			)
		end
		pivotTween(playerPreview, dragonStart * CFrame.new(0, 0.55, 0) * CFrame.Angles(math.rad(-4), 0, 0), 0.16)
		task.wait(0.45)
		flashModel(wildPreview, Color3.fromRGB(255, 236, 120))
		pivotTween(playerPreview, dragonStart, 0.18)
	elseif move.name == "Sauce Swipe" then
		local swipe = Instance.new("Part")
		swipe.Name = "Sauce Swipe"
		swipe.Anchored = true
		swipe.CanCollide = false
		swipe.Material = Enum.Material.Neon
		swipe.Color = Color3.fromRGB(190, 25, 28)
		swipe.Size = Vector3.new(5.5, 0.25, 0.7)
		swipe.CFrame = CFrame.new(enemyPosition) * CFrame.Angles(0, math.rad(25), math.rad(-18))
		swipe.Parent = workspace
		pivotTween(playerPreview, dragonStart * CFrame.Angles(0, math.rad(-12), 0), 0.1)
		TweenService:Create(swipe, TweenInfo.new(0.22), {
			Transparency = 0.65,
			Size = Vector3.new(7.2, 0.25, 1.0),
		}):Play()
		task.wait(0.24)
		flashModel(wildPreview, Color3.fromRGB(255, 80, 80))
		if swipe.Parent then
			swipe:Destroy()
		end
		pivotTween(playerPreview, dragonStart, 0.16)
	else
		pivotTween(playerPreview, dragonStart + towardEnemy * 2.5, 0.14, Enum.EasingStyle.Back)
		task.wait(0.18)
		flashModel(wildPreview, Color3.fromRGB(255, 255, 255))
		pivotTween(playerPreview, dragonStart, 0.16)
	end

	task.wait(0.22)
	actionLocked = false
end

function refreshBattleGui(message)
	local panel = gui.BattlePanel
	panel.Title.Text = string.format("%s Lv %d HP %d/%d  vs  %s Lv %d HP %d/%d", activeBrainrot.name, activeBrainrot.level, activeBrainrot.hp, activeBrainrot.maxHp, enemy.name, enemy.level, enemy.hp, enemy.maxHp)
	panel.Dialogue.Text = message

	for i = 1, 4 do
		local button = panel.MoveButtons["Move" .. i]
		local move = activeBrainrot.moves[i]
		button.Text = move and (i .. " " .. move.name) or ""
		button.Visible = move ~= nil
	end
end

local function endBattle(message)
	inBattle = false
	gui.Enabled = false
	enemy = nil
	clearWildPreview()
	setCharacterBattleHidden(false)
	setMovementEnabled(true)
	if message then
		print(message)
	end
end

local function enemyTurn()
	if not enemy or not inBattle then
		return
	end

	task.wait(0.55)
	if not enemy or not inBattle then
		actionLocked = false
		return
	end

	local move = enemy.moves[math.random(1, #enemy.moves)]
	local damage = Data.RollDamage(move.power, enemy.level, activeBrainrot.level)
	if wildPreview and playerPreview then
		local enemyStart = wildPreview:GetPivot()
		local targetPosition = playerPreview:GetPivot().Position
		local direction = (targetPosition - enemyStart.Position)
		if direction.Magnitude > 0.1 then
			direction = direction.Unit
			pivotTween(wildPreview, enemyStart + direction * 1.7, 0.12, Enum.EasingStyle.Back)
			task.wait(0.16)
			flashModel(playerPreview, Color3.fromRGB(255, 130, 130))
			pivotTween(wildPreview, enemyStart, 0.16)
			task.wait(0.12)
		end
	end
	activeBrainrot.hp = math.max(0, activeBrainrot.hp - damage)
	refreshBattleGui(enemy.name .. " used " .. move.name .. ".\n" .. damage .. " damage!")

	if activeBrainrot.hp <= 0 then
		task.wait(0.8)
		if not inBattle then
			actionLocked = false
			return
		end
		activeBrainrot.hp = math.ceil(activeBrainrot.maxHp * 0.55)
		endBattle(activeBrainrot.name .. " fainted and recovered.")
	end
	actionLocked = false
end

local function useMove(index)
	if cinematicActive or actionLocked or not enemy or not inBattle then
		return
	end

	local move = activeBrainrot.moves[index]
	if not move then
		return
	end

	actionLocked = true
	if move.heal then
		activeBrainrot.hp = math.min(activeBrainrot.maxHp, activeBrainrot.hp + move.heal)
		refreshBattleGui(activeBrainrot.name .. " used " .. move.name .. ".\nIt healed " .. move.heal .. " HP.")
		if playerPreview then
			local start = playerPreview:GetPivot()
			pivotTween(playerPreview, start * CFrame.new(0, 0.5, 0), 0.16)
			task.wait(0.18)
			pivotTween(playerPreview, start, 0.16)
		end
	else
		refreshBattleGui(activeBrainrot.name .. " used " .. move.name .. "!")
		animateAttack(move)
		if not enemy or not inBattle then
			actionLocked = false
			return
		end
		local damage = Data.RollDamage(move.power, activeBrainrot.level, enemy.level)
		enemy.hp = math.max(0, enemy.hp - damage)
		refreshBattleGui(activeBrainrot.name .. " used " .. move.name .. ".\n" .. damage .. " damage!")
	end
	actionLocked = false

	if enemy.hp <= 0 then
		task.wait(0.75)
		endBattle(enemy.name .. " was defeated.")
	else
		actionLocked = true
		task.spawn(enemyTurn)
	end
end

local function startBattle(wildEnemy)
	if inBattle then
		return
	end

	enemy = wildEnemy
	inBattle = true
	lastEncounterTime = os.clock()
	setMovementEnabled(false)
	setCharacterBattleHidden(true)
	task.spawn(playEncounterCinematic)
end

for i = 1, 4 do
	gui.BattlePanel.MoveButtons["Move" .. i].MouseButton1Click:Connect(function()
		useMove(i)
	end)
end

UserInputService.InputBegan:Connect(function(input, processed)
	if processed then
		return
	end

	if input.KeyCode == Enum.KeyCode.G and not inBattle then
		startBattle(Data.PickWeightedBrainrot(playerLuck))
		return
	end

	if not inBattle then
		return
	end

	if input.KeyCode == Enum.KeyCode.One then
		useMove(1)
	elseif input.KeyCode == Enum.KeyCode.Two then
		useMove(2)
	elseif input.KeyCode == Enum.KeyCode.Three then
		useMove(3)
	elseif input.KeyCode == Enum.KeyCode.Four then
		useMove(4)
	elseif input.KeyCode == Enum.KeyCode.R then
		endBattle("You ran away.")
	end
end)

player.CharacterAdded:Connect(function(character)
	local root = character:WaitForChild("HumanoidRootPart")
	root.CFrame = CFrame.new(0, 4, 8)
	task.wait()
	updateCamera()
end)

RunService.RenderStepped:Connect(function()
	updateCamera()

	if inBattle or os.clock() < nextEncounterCheck or os.clock() - lastEncounterTime < 2.5 then
		return
	end

	nextEncounterCheck = os.clock() + 0.35
	if isInTallGrass() and math.random() < 0.12 then
		startBattle(Data.PickWeightedBrainrot(playerLuck))
	end
end)

print("Brainworld client loaded. Walk into tall grass to battle. Press 1-4 for moves, R to run.")
]=]

local starterScripts = StarterPlayer:FindFirstChild("StarterPlayerScripts")
if not starterScripts then
	starterScripts = Instance.new("StarterPlayerScripts")
	starterScripts.Parent = StarterPlayer
end

putScript(ReplicatedStorage, "ModuleScript", "BrainworldData", dataSource)
putScript(ServerScriptService, "Script", "BrainworldWorld", worldSource)
putScript(starterScripts, "LocalScript", "BrainworldClient", clientSource)

local existingWorld = Workspace:FindFirstChild("BrainworldRobloxPrototype")
if existingWorld then
	existingWorld:Destroy()
end

local worldRunner = Instance.new("Script")
worldRunner.Name = "BrainworldWorldPreviewRunner"
worldRunner.Source = worldSource
worldRunner.Parent = ServerScriptService
task.defer(function()
	worldRunner:Destroy()
end)

print("Brainworld Roblox prototype scripts installed. Press Play, walk into tall grass, and use 1-4 in battles.")
