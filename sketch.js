/////////////////////////////
//Globals to define general behaviour
var g_WindowLength = 800;
var g_WindowHeight = 600;

var g_BackgroundColor = 51; //Greyscale

//Globals to define branch behaviour
var g_InitialBranchWidth = 7.0;
var g_InitialBranchLength = 150.0;
var g_InitialBranchColor = 0x222222;

var g_MinimumBranchLength = 2;

var g_BranchLengthMultiplier = 0.67;
var g_BranchWidthMultiplier = 0.8;

var g_BranchRotationAngle = 0;
var g_ColorIncrementFactor = 0;
///////////////////////////

//////////////////////////
//Variables to control the tree
var g_BranchRotationAngleSlider; //Slider to control the rotation angle
var g_InitialBranchHexColorSlider; //Slider to control the initial branch color
var g_ColorIncrementFactorSlider; //Slider to control the color incrementation

var g_BranchWidthMultiplierSlider;
var g_BranchLengthMultiplierSlider;
/////////////////////////

function setup()
{
	createCanvas(g_WindowLength, g_WindowHeight);
	textSize(15);

	g_BranchRotationAngleSlider = createSlider(0, TWO_PI, PI / 4, 0.01);
	g_BranchRotationAngleSlider.position((g_WindowLength / 2) - 30, 0);

	g_InitialBranchHexColorSlider = createSlider(0x000000, 0xFFFFFF, 0x222222, 0);
	g_InitialBranchHexColorSlider.position((g_WindowLength / 2) - 30, 30);

	g_ColorIncrementFactorSlider = createSlider(0x000000, 0x7FFFFF, 0x000011, 0);
	g_ColorIncrementFactorSlider.position((g_WindowLength / 2) - 30, 60);	

	g_BranchWidthMultiplierSlider = createSlider(0.0, 1.0, 0.8, 0);
	g_BranchWidthMultiplierSlider.position((g_WindowLength / 2) - 30, 90);	

	g_BranchLengthMultiplierSlider = createSlider(0.0, 1.0, 0.6, 0);
	g_BranchLengthMultiplierSlider.position((g_WindowLength / 2) - 30, 120);	
}

function draw()
{
	//Fetch slider values. Must be done here so it can be updated per frame
	g_BranchRotationAngle = g_BranchRotationAngleSlider.value();
	g_InitialBranchColor = g_InitialBranchHexColorSlider.value();
	g_ColorIncrementFactor = g_ColorIncrementFactorSlider.value();
	g_BranchWidthMultiplier = g_BranchWidthMultiplierSlider.value();
	g_BranchLengthMultiplier = g_BranchLengthMultiplierSlider.value();

	background(g_BackgroundColor);
	drawFractalTree();
	drawControlPanel();
}

function drawControlPanel()
{
	push();
	fill(0);
	text("Rotation Angle", g_BranchRotationAngleSlider.x + g_BranchRotationAngleSlider.width + 15, g_BranchRotationAngleSlider.y + 20);
	text("Initial Branch Color", g_InitialBranchHexColorSlider.x + g_InitialBranchHexColorSlider.width + 15, g_InitialBranchHexColorSlider.y + 20);
	text("Branch Color Increment Factor", g_ColorIncrementFactorSlider.x + g_ColorIncrementFactorSlider.width + 15, g_ColorIncrementFactorSlider.y + 20);
	text("Branch Width Multiplier", g_BranchWidthMultiplierSlider.x + g_BranchWidthMultiplierSlider.width + 15, g_BranchWidthMultiplierSlider.y + 20);
	text("Branch Length Multiplier", g_BranchLengthMultiplierSlider.x + g_BranchLengthMultiplierSlider.width + 15, g_BranchLengthMultiplierSlider.y + 20);
	pop();
}

function drawFractalTree()
{
	push();
	translate(width / 2, height);
	branch(g_InitialBranchLength, g_InitialBranchWidth, g_InitialBranchColor);
	pop();
}

function branch(branchLength, branchWidth, branchColor)
{
	push();

	stroke(ConvertHexValueToHexColorString(branchColor));
	strokeWeight(branchWidth);
	line(0, 0, 0, -branchLength);
	translate(0, -branchLength);

	if (branchLength > g_MinimumBranchLength)
	{
		//#TODO Remember to add a minimum check for the color coords and branchWidth
		var newBranchColor = ClampHex(IncrementHex(branchColor, g_ColorIncrementFactor), 0xFFFFFF);
		var newBranchWidth = branchWidth * g_BranchWidthMultiplier;
		var newBranchLength = branchLength * g_BranchLengthMultiplier;

		rotate(g_BranchRotationAngle);
		branch(newBranchLength, newBranchWidth, newBranchColor);

		rotate(-g_BranchRotationAngle*2);
		branch(newBranchLength, newBranchWidth, newBranchColor);
	}

	pop();
}

//Increments a hexValue by amount and returns the new value
function IncrementHex(hexValue, incrementAmount)
{
	const newHexValue = hexValue + incrementAmount;

	const testClamp = ClampHex(newHexValue, 0xFFFFFF);
	const testString = ConvertHexValueToHexColorString(testClamp);
	return newHexValue;
}

//Clamps the hex value to the max provided
function ClampHex(hexValue, maxHexValue)
{
	while (hexValue > maxHexValue)
	{
		hexValue -= maxHexValue;
	}

	return hexValue;
}

//Returns p5 color string for hex value
function ConvertHexValueToHexColorString(hexValue)
{
	const colorRed = hexValue >> 16, colorGreen = hexValue >> 8 & 0xff, colorBlue = hexValue & 0xff;

	const testString = '#' + hexValue.toString(16);
	return '#' + colorRed.toString(16) + colorGreen.toString(16) + colorBlue.toString(16);
}