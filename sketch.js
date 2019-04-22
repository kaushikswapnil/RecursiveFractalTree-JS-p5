/////////////////////////////
//Globals to define general behaviour
var g_WindowLength = 800;
var g_WindowHeight = 600;

var g_BackgroundColor = 51; //Greyscale

//Globals to define branch behaviour
var g_InitialBranchWidth = 7;
var g_InitialBranchLength = 200;

var g_InitialBranchColor;

var g_MinimumBranchLength = 2;
var g_BranchLengthMultiplier = 0.67;

var g_BranchWidthMultiplier = 0.9;

var g_BranchRotationAngle = 0;
///////////////////////////

//////////////////////////
//Variables to control the tree
var g_BranchRotationAngleSlider;
/////////////////////////

function setup()
{
	createCanvas(g_WindowLength, g_WindowHeight);

	g_BranchRotationAngleSlider = createSlider(0, TWO_PI, PI / 4, 0.01);
	g_BranchRotationAngleSlider.position((g_WindowLength / 2) - 30, 0);

	g_InitialBranchColor = createVector(255, 255, 255);
}

function draw()
{
	//Fetch slider values. Must be done here so it can be updated per frame
	g_BranchRotationAngle = g_BranchRotationAngleSlider.value();

	background(g_BackgroundColor);
	drawFractalTree();
}

function drawFractalTree()
{
	stroke(g_InitialBranchColor.x, g_InitialBranchColor.y, g_InitialBranchColor.z);
	strokeWeight(g_InitialBranchWidth);

	translate(width / 2, height);
	branch(g_InitialBranchLength, g_InitialBranchWidth, g_InitialBranchColor);
}

function branch(branchLength, branchWidth, branchColor)
{
	line(0, 0, 0, -branchLength);
	translate(0, -branchLength);

	if (branchLength > g_MinimumBranchLength)
	{
		//#TODO Remember to add a minimum check for the color coords and branchWidth
		var newBranchColor = createVector(branchColor.x - 5, branchColor.y - 40, branchColor.z - 10);
		var newBranchWidth = branchWidth * g_BranchWidthMultiplier;
		var newBranchLength = branchLength * g_BranchLengthMultiplier;
		var newBranchWidth = branchWidth * g_BranchWidthMultiplier;

		push();
		stroke(newBranchColor.x, newBranchColor.y, newBranchColor.z);
		strokeWeight(newBranchWidth);
		rotate(g_BranchRotationAngle);
		branch(newBranchLength, newBranchWidth, newBranchColor);
		pop();
		push();
		stroke(newBranchColor.x, newBranchColor.y, newBranchColor.z);
		strokeWeight(newBranchWidth);
		rotate(-g_BranchRotationAngle);
		branch(newBranchLength, newBranchWidth, newBranchColor);
		pop();
	}
}