var arrayTypes = undefined;
var pivotTypes = undefined;
var displaying = undefined;

function getColor(value, minValue, maxValue) {
	let s = 100;
	let l = 45;
	let h = (value - minValue) / (maxValue - minValue) * 360;

	let color = "hsl(" + h + ", " + s + "%, " + l + "%)";
	return color;
}

/*
 * this function displays an array to the screen
 * note that the max element is at most the length of arr
 */
function showArray(arr, parentID) {
	// get the table with id="parentID" so we can add elements to it
	let $displayTable = $('<table class="displaySort"></table>');
	// set the width proportional to the size of the array
	$displayTable.width(arr.length * 7 + 'px');
	// loop through each row in the table
	for (let i = 0; i < arr.length; i++) {
		// create a row in the table
		let $tableRow = $('<tr class="mazeRow"></tr>')
		let rowColor = getColor(arr[i], 1, arr.length);
		for (let j = 0; j < arr.length; j++) {
			// create the cell
			let $cell = $('<td>&nbsp;</td>')
				// colorize the cell
			if (j < arr[i]) {
				$cell.css('background', rowColor);
			} else {
				$cell.css('background', 'white');
			}
			$tableRow.append($cell);
		}
		// add the row to the table
		$displayTable.append($tableRow);
	}
	// get the parent and add the table to the parent.
	let $parentDiv = $('#' + parentID);
	$parentDiv.append($displayTable);
}

/*
 * This function displays incremental intermediate steps of the sorting
 * algorithm.
 */
function displayProgress(arr, startIndex, endIndex, pivotIndex) {
	// get the table with id="parentID" so we can add elements to it
	let $displayTable = $('<table class="displaySort"></table>');
	// set the width proportional to the size of the array
	$displayTable.width(arr.length * 7 + 'px');
	// loop through each row in the table
	for (let i = 0; i < arr.length; i++) {
		// add a pivot row if it's the pivot
		if (i === pivotIndex) {
			let $pivotRow = $('<tr class="mazeRow padder"></tr>');
			for (let j = 0; j < arr.length + 2; j++) {
				let $pivotCell = $('<td class="padder">&nbsp;</td>')
				$pivotRow.append($pivotCell);
			}
			$displayTable.append($pivotRow);
		}
		// create a row in the table
		let $tableRow = $('<tr class="mazeRow"></tr>')
		let rowColor = "#ddd";
		if (i >= startIndex && i <= endIndex) {
			rowColor = getColor(arr[i], 1, arr.length);
		}
		for (let j = 0; j < arr.length + 2; j++) {
			// create the cell
			let $cell = $('<td>&nbsp;</td>')
				// colorize the cell
			if (j < arr[i]) {
				$cell.css('background', rowColor);
			} else {
				$cell.css('background', 'white');
			}
			$tableRow.append($cell);
		}
		// add the row to the table
		$displayTable.append($tableRow);
	}
	// get the parent and add the table to the parent.
	let $parentDiv = $('#sortResults');
	$parentDiv.append($displayTable);
}

/*
 * This function handles the transitions between incremental sorting
 * steps using the next and prev buttons. Increment is 1 for next
 * and -1 for prev.
 */
function displayNextStep(increment) {
	if ((displaying === $("#sortResults").children().length - 1 && increment > 0) ||
		(displaying === 0 && increment < 0)) {
		alert("I can't go any farther! There aren't any more steps!");
		return;
	}
	$("#sortResults").children().eq(displaying).hide();
	displaying += increment;
	$("#sortResults").children().eq(displaying).show();
	$("#stepNumber").html(displaying + 1);
}

/*
 * This function takes care of everything involved in creating an array,
 * sorting it, and updating all appropriate visualizations.
 */
function displayForNewChoice() {
	let numElements = 40;

	// make sure results views are empty
	$("#sortResults").html('');
	$("#unsortedArray").html('');
	$("#sortedArray").html('');

	// get/display an array of the requested type
	let arrayType = $("#arrayType").val();
	let unsorted = arrayTypes[arrayType](numElements);
	showArray(unsorted, 'unsortedArray');

	// sort/display the array with the requested pivot type
	let pivotType = $("#pivotType").val();
	let pivotFunction = pivotTypes[pivotType];
	let sorted = quicksort(pivotFunction, unsorted);
	showArray(sorted, 'sortedArray');

	// hide intermediate steps, show the first step
	$("#sortResults").children().hide();
	$("#sortResults").children().first().show();

	// update the step numbers
	displaying = 0;
	$("#stepNumber").html(displaying + 1);
	$("#totalSteps").html($("#sortResults").children().length)

	// update now displaying
	$("#displayingLabel").html("Now Displaying Results for <br/>Array Type: " + arrayType + " & Pivot Type: " + pivotType);
}

/*
 * This is the "main" method, the method that will set the random array
 * creation and sorting into motion.
 */
$(document).ready(function () {
	// initialize the array types
	arrayTypes = [];
	arrayTypes['Random'] = generateRandomArray;
	arrayTypes['Increasing'] = generateIncreasingArray;
	arrayTypes['Decreasing'] = generateDecreasingArray;
	arrayTypes['AlmostSorted'] = generateAlmostSortedArray;

	// initialize the pivot types
	pivotTypes = [];
	pivotTypes['Left'] = getLeftPivot;
	pivotTypes['Right'] = getRightPivot;
	pivotTypes['Random'] = getRandomPivot;
	pivotTypes['Midpoint'] = getMidpointPivot;
	pivotTypes['MedianOfThree'] = getMedianOfThreePivot;

	// add listeners to the next and prev buttons
	$("#nextButton").click(function () {
		displayNextStep(1);
	});
	$("#prevButton").click(function () {
		displayNextStep(-1);
	});

	// add a listener to the display button
	$("#displayChoice").click(function () {
		displayForNewChoice()
	})

	// display the default choice
	displayForNewChoice();
});
