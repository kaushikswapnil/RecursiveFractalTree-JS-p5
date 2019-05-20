/////////////////////////////
//Globals to define general behaviour
const g_BackgroundColor = 51; //Greyscale

//Globals to define branch behaviour
var g_InitialBranchWidth = 7.0;
var g_InitialBranchLength = 200.0;
var g_InitialBranchColor = 0x222222;

var g_MinimumBranchLength = 3;
var g_BranchLengthMultiplier = 0.67;
var g_BranchWidthMultiplier = 0.8;

var g_BranchRotationAngle = 0;
var g_ColorIncrementFactor = 0;

var g_Stochastic = false;
var g_TimeOfLastStochasticRefresh = 0;
var g_TimeBetweenStochasticRefreshes = 3000; //in millis

///////////////////////////

//////////////////////////
//Variables to control the tree
var g_BranchRotationAngleSlider; //Slider to control the rotation angle
var g_InitialBranchHexColorSlider; //Slider to control the initial branch color
var g_ColorIncrementFactorSlider; //Slider to control the color incrementation

var g_BranchWidthMultiplierSlider;
var g_BranchLengthMultiplierSlider;
var g_StochasticSlider;
/////////////////////////

function setup()
{
	createCanvas(800, 800);
	textSize(15);

	g_BranchRotationAngleSlider = createSlider(0, TWO_PI, PI / 4, 0.01);
	g_BranchRotationAngleSlider.position((width / 2) - 30, 0);

	g_InitialBranchHexColorSlider = createSlider(0x000000, 0xFFFFFF, 0x222222, 0);
	g_InitialBranchHexColorSlider.position((width / 2) - 30, 30);

	g_ColorIncrementFactorSlider = createSlider(0x000000, 0x7FFFFF, 0x000011, 0);
	g_ColorIncrementFactorSlider.position((width / 2) - 30, 60);	

	g_BranchWidthMultiplierSlider = createSlider(0.0, 1.0, 0.84, 0.01);
	g_BranchWidthMultiplierSlider.position((width / 2) - 30, 90);	

	g_BranchLengthMultiplierSlider = createSlider(0.0, 0.8, 0.6, 0.01);
	g_BranchLengthMultiplierSlider.position((width / 2) - 30, 120);

	g_StochasticSlider = createSlider(0.0, 1.0, 0.0, 1.0);
	g_StochasticSlider.position((width / 2) - 30, 150);	
}

function draw()
{
	//only draw stochastic trees once between refreshes
	var stochastic = g_StochasticSlider.value();
	if (stochastic == true)
	{
		if (g_Stochastic == false && g_TimeOfLastStochasticRefresh == 0)
		{
			g_TimeOfLastStochasticRefresh = millis();
			g_Stochastic = true;
			
			HideBranchControlVariablesSliders();
		}

		if (millis() - g_TimeOfLastStochasticRefresh > g_TimeBetweenStochasticRefreshes)
		{
			background(g_BackgroundColor);

			FetchBranchControlVariableValues();

			DrawFractalTree();

			g_TimeOfLastStochasticRefresh = millis();
		}
		
	}
	else 
	{
		if (g_Stochastic == true)
		{
			ShowBranchControlVariablesSliders();
			g_Stochastic = false;
		}

		background(g_BackgroundColor);

		FetchBranchControlVariableValues();

		DrawFractalTree();
	}
	
	DrawControlPanel();
}

function HideBranchControlVariablesSliders()
{
	g_BranchRotationAngleSlider.hide();
	g_InitialBranchHexColorSlider.hide();
	g_ColorIncrementFactorSlider.hide();	
	g_BranchWidthMultiplierSlider.hide();	
	g_BranchLengthMultiplierSlider.hide();
}

function ShowBranchControlVariablesSliders()
{
	g_BranchRotationAngleSlider.show();
	g_InitialBranchHexColorSlider.show();
	g_ColorIncrementFactorSlider.show();	
	g_BranchWidthMultiplierSlider.show();	
	g_BranchLengthMultiplierSlider.show();
}

function FetchBranchControlVariableValues()
{
	if (g_Stochastic)
	{
		g_BranchRotationAngle = random(0, TWO_PI);
		g_InitialBranchColor = random(0x000000, 0xFFFFFF);
		g_ColorIncrementFactor = random(0x000000, 0x7FFFFF);
		g_BranchWidthMultiplier = random(0, 1);
		g_BranchLengthMultiplier = random(0.3, 0.6);
	}
	else
	{
		g_BranchRotationAngle = g_BranchRotationAngleSlider.value();
		g_InitialBranchColor = g_InitialBranchHexColorSlider.value();
		g_ColorIncrementFactor = g_ColorIncrementFactorSlider.value();
		g_BranchWidthMultiplier = g_BranchWidthMultiplierSlider.value();
		g_BranchLengthMultiplier = g_BranchLengthMultiplierSlider.value();
	}
}

function DrawControlPanel()
{
	push();
	fill(0);

	if (!g_Stochastic)
	{
		text("Rotation Angle", g_BranchRotationAngleSlider.x + g_BranchRotationAngleSlider.width + 15, g_BranchRotationAngleSlider.y + 20);
		text("Initial Branch Color", g_InitialBranchHexColorSlider.x + g_InitialBranchHexColorSlider.width + 15, g_InitialBranchHexColorSlider.y + 20);
		text("Branch Color Increment Factor", g_ColorIncrementFactorSlider.x + g_ColorIncrementFactorSlider.width + 15, g_ColorIncrementFactorSlider.y + 20);
		text("Branch Width Multiplier", g_BranchWidthMultiplierSlider.x + g_BranchWidthMultiplierSlider.width + 15, g_BranchWidthMultiplierSlider.y + 20);
		text("Branch Length Multiplier", g_BranchLengthMultiplierSlider.x + g_BranchLengthMultiplierSlider.width + 15, g_BranchLengthMultiplierSlider.y + 20);
	}
	
	text("Stochastic", g_StochasticSlider.x + g_StochasticSlider.width + 15, g_StochasticSlider.y + 20);
	pop();
}

function DrawFractalTree()
{
	push();
	translate(width / 2, height);
	Branch(g_InitialBranchLength, g_InitialBranchWidth, g_InitialBranchColor, g_Stochastic);
	pop();
}

function Branch(branchLength, branchWidth, branchColor, stochastic)
{
	push();

	stroke(ConvertHexValueToHexColorString(branchColor));
	strokeWeight(branchWidth);
	line(0, 0, 0, -branchLength);
	translate(0, -branchLength);

	if (branchLength > g_MinimumBranchLength)
	{
		const newBranchColor = ClampHex(IncrementHex(branchColor, g_ColorIncrementFactor), 0xFFFFFF);
		const newBranchWidth = branchWidth * g_BranchWidthMultiplier;
		const newBranchLength = branchLength * g_BranchLengthMultiplier;

		var numBranches = 2;

		if (g_Stochastic)
		{
			//#TODO See if there is a better way for comparision here
			numBranches = random(2, 5);
			var numBranchesString = numBranches.toFixed();
			numBranches = parseInt(numBranchesString);
		}

		if (numBranches % 2 == 0)
		{
			var branchesOnEachSide = numBranches / 2;

			//For even number of branches, we want the tree to look like
			//       _\ /_
			//         |
			//so we draw on each side

			rotate(-g_BranchRotationAngle*branchesOnEachSide);

			var branchIter;
			for (branchIter = 0; branchIter < branchesOnEachSide; ++branchIter)
			{
				Branch(newBranchLength, newBranchWidth, newBranchColor);
				rotate(g_BranchRotationAngle);
			}

			rotate(g_BranchRotationAngle);
			for (branchIter = 0; branchIter < branchesOnEachSide; ++branchIter)
			{
				Branch(newBranchLength, newBranchWidth, newBranchColor);
				rotate(g_BranchRotationAngle);
			}
		}
		else
		{
			//For odd number of branches, we want the tree to look like
			//       _\|/_
			//         |

			rotate(-g_BranchRotationAngle*(numBranches-1)/2);

			for (var branchIter = 0; branchIter < numBranches; ++branchIter)
			{
				Branch(newBranchLength, newBranchWidth, newBranchColor);
				rotate(g_BranchRotationAngle);
			}
		}
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

	const hexColorString = '#' + colorRed.toString(16) + colorGreen.toString(16) + colorBlue.toString(16);
	return hexColorString;
}