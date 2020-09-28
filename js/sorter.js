/*
 * Returns a random integer between min (inclusive) and max (exclusive)
 */
function getRandomInt(min, max) {
	let r = Math.random();
	return Math.floor(Math.random() * (max - min) + min);
}

/*
 * This function shuffles an array into a random order.
 */
function shuffle(a) {
	for (let i = a.length; i; i--) {
		let j = Math.floor(Math.random() * i);
		[a[i - 1], a[j]] = [a[j], a[i - 1]];
	}
}

/*
 * This function generates an array of increasing integers of length n,
 * with values from 1 to n.
 */
function generateIncreasingArray(n) {
	let a = [...Array(n + 1).keys()].slice(1, n + 1);
	return a;
}

/*
 * This function generates an array of increasing integers of length n.
 */
function generateDecreasingArray(n) {
	let a = generateIncreasingArray(n);
	a.reverse();
	return a;
}


/*
 * This function generates an array of random integers of length n.
 */
function generateRandomArray(n) {
	let a = generateIncreasingArray(n);
	shuffle(a);
	return a;
}

/*
 * This function generates an array of *almost* sorted integers of length n.
 * There are about log(n) pairs that are swapped out of order.
 */
function generateAlmostSortedArray(n) {
	let a = generateIncreasingArray(n);

	for (let i = 0; i < Math.log(a.length); i++) {
		let index = getRandomInt(0, n - 1);
		swap(a, index, index + 1);
	}
	return a;
}

/*
 * This function returns the left-most index between left and
 * right.
 */
function getLeftPivot(array, left, right) {
	return left;
}

/*
 * This function returns the right-most index between left and
 * right.
 */
function getRightPivot(array, left, right) {
	return right;
}

/*
 * This function returns a random index between left and right.
 */
function getRandomPivot(array, left, right) {
	return getRandomInt(left, right);
}

/*
 * This function returns the integer midpoint between left and 
 * right.
 */
function getMidpointPivot(array, left, right) {
	return Math.round((right + left) / 2);
}

/* 
 * This function finds three values: the left-most element, the
 * right-most element, and the center element, and finds the median 
 * of them, and then returns the index of that median. 
 */
function getMedianOfThreePivot(array, left, right) {
	// get middle index using getMidpointPivot function
	let mid = getMidpointPivot(array, left, right);

	// create a list of the items at the three potential pivots, sort it, and get the middle index
	let threePivots = [array[left], array[mid], array[right]];
	threePivots.sort();
	let median = threePivots[1];

	// determine which index to return
	if (array[left] === median) {
		return left;
	} else if (array[right] === median) {
		return right;
	} else {
		return mid;
	}
}

/*
 * This function swaps elements at indices i and j in the provided array.
 */
function swap(array, i, j) {
	let temp = array[i];
	array[i] = array[j];
	array[j] = temp;
}

/*
 * Sort the portion of the given array between the given left and right indices according to a quicksort algorithm.
 */
function quicksort(pivotFunction, array, left, right) {
	// assign the left and right pivots to the value passed in, or to the first and last elements in the list
	left = left || 0;
	right = right || array.length - 1;

	// get the index of the pivot by running the partition function
	let pivot = partition(pivotFunction, array, left, right);

	// update visual by passing the new pivot, left, and right
	displayProgress(array, left, right, pivot)

	// check if the left element is NOT the last element of the "smaller than pivot" portion of the array
	if (left < pivot - 2) {
		// quicksort the array, but pass the last index of the "smaller than pivot" portion as the right index
		quicksort(pivotFunction, array, left, pivot - 2);
	}

	// check if the right index is NOT the first index of the "greater than pivot" portion of the array
	if (right > pivot) {
		// quicksort the "greater than pivot" potion of the array, passing the pivot as the leftmost element
		quicksort(pivotFunction, array, pivot, right);
	}

	// return the fully sorted array
	return array;
}

/*
 * Partitions the section of the given array between the given left and right indices to be properly partitioned.
 * An initial pivot value is chosen based on the pivotFunction passed in.
 */
function partition(pivotFunction, array, left, right) {
	let originalLeft = left;
	// get pivot based on the user's pivot-selection choice
	let pivot = pivotFunction(array, originalLeft, right);
	// get the value at the pivot from the array
	let pivotValue = array[pivot];

	// swap the elements at pivot and original left, then increment left
	swap(array, pivot, originalLeft);
	left++;

	// iterate so long as the left index is less than or equal to the right index
	while (left <= right) {

		// increment the left index until we find an element less than the pivot value
		while (array[left] < pivotValue) {
			left++;
		}

		// increment the right index until we find an element greater than the pivot value
		while (array[right] > pivotValue) {
			right--;
		}

		// swap the elements at the left and right index if left hasn't crossed over right
		if (left <= right) {
			swap(array, left, right);
			left++;
			right--;
		}
	}

	// swap the original left value with the value at the final left index
	swap(array, originalLeft, left - 1);

	// return the left index (one past the "middle")
	return left;
}
