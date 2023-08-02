export function getProgressValue(
	currentNum: number,
	progressArray: number[]
): number {
	for (let i = 0; i < progressArray.length - 1; i++) {
		if (
			progressArray[i] <= currentNum &&
			currentNum < progressArray[i + 1]
		) {
			return progressArray[i];
		} 
		else if (currentNum === 1) {
			return 1;
		}
	}
	return progressArray[progressArray.length - 1];
}
export function getDivisionArray(divisions: number) {
	let arr = [];
	const one = 100 / divisions;
	for (let i = 0; i < divisions; i++) {
		arr.push((i * one) / 100);
	}
	return arr;
}
