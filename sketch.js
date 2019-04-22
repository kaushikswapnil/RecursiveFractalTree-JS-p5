// var g_MinimumBranchLength = 4;
// var g_BranchRotationAngle = PI / 4;
// var g_BranchLengthMultiplier = 0.67;

var angle = 0;

var slider;

function setup()
{
	createCanvas(400, 400);
	slider = createSlider(0, TWO_PI, PI / 4, 0.01);
}

function draw()
{
	background(51);
	stroke(255);
	angle = slider.value();
	translate(200, height);
	branch(100);
}

function branch(branchLength)
{
	line(0, 0, 0, -branchLength);
	translate(0, -branchLength);

	if (branchLength > 4)//g_MinimumBranchLength)
	{
		push();
		rotate(angle);
		branch(branchLength * 0.67);
		pop();
		push();
		rotate(-angle);
		branch(branchLength * 0.67);
		pop();
	}
}