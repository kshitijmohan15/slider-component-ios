"use client";

import { getDivisionArray, getProgressValue } from "@/utils/helpers";
import {
	AnimatePresence,
	motion,
	useMotionValue,
	useSpring,
	useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import useMeasure from "react-use-measure";
import { twMerge } from "tailwind-merge";

let clamp = (num: number, min: number, max: number) =>
	Math.max(Math.min(num, max), min);

const Slider = ({
	divisions = 10,
	range = [0, 100],
	className,
	label,
}: {
	divisions: number;
	range: [number, number];
	className?: string;
	label?: string;
}) => {
	if (range[0] > range[1]) {
		throw new Error("Range[0] must be less than Range[1]");
	}
	const [rangeValue, setRangeValue] = useState(range[0]);

	const divisionArray = getDivisionArray(divisions);
	let [ref, bounds] = useMeasure();
	const progress = useMotionValue(0);
	const actual_progress = useMotionValue(0);
	const [showDragBox, setShowDragBox] = useState(true);
	const spring = useSpring(actual_progress, {
		stiffness: 4500,
		damping: 200,
	});
	let width = useTransform(spring, (v) => `${v * 100}%`);

	useEffect(() => {
		actual_progress.on("change", (v) => {
			setRangeValue(Math.floor(range[0] + v * (range[1] - range[0])));
			if (
				v < (labelRef.current?.clientWidth ?? 72) / bounds.width ||
				v > 1 - (valueRef.current?.clientWidth ?? 72) / bounds.width
			) {
				setShowDragBox(false);
			} else {
				setShowDragBox(true);
			}
		});
	}, [actual_progress, bounds.width]);
	const [panning, setPanning] = useState(false);
	const labelRef = useRef<HTMLDivElement>(null);
	const valueRef = useRef<HTMLDivElement>(null);
	return (
		<AnimatePresence>
			<motion.div
				ref={ref}
				className={twMerge(
					"relative flex-col flex w-[400px] h-10 bg-white/10 rounded-xl backdrop-blur-sm border-white/50 border-[1px] overflow-hidden group cursor-grab",
					panning && "cursor-grabbing",
					className ?? ""
				)}
			>
				{rangeValue === range[0] && (
					<motion.div
						className={
							"absolute h-2/3 w-1 bg-gray-500/50 rounded-full left-2 top-[50%] translate-x-[-50%] translate-y-[-50%]"
						}
					></motion.div>
				)}
				<motion.div
					onPanStart={() => {
						setPanning(true);
					}}
					onPanEnd={() => {
						setPanning(false);
					}}
					onPan={(event, info) => {
						let deltaInPercent = info.delta.x / bounds.width;
						let newPercent = clamp(
							progress.get() + deltaInPercent,
							0,
							1
						);
						progress.set(newPercent);
						actual_progress.set(
							getProgressValue(newPercent, divisionArray)
						);
					}}
					onMouseDown={({ clientX, currentTarget }) => {
						let { left } = currentTarget.getBoundingClientRect();
						let xPosition = clientX - left;
						let newPercent = clamp(xPosition / bounds.width, 0, 1);

						if (
							newPercent >
							divisionArray.at(-1)!! + 1 / divisions / 2
						) {
							newPercent = 1;
						}

						progress.set(newPercent);
						actual_progress.set(
							getProgressValue(newPercent, divisionArray)
						);
					}}
					className="touch-none relative w-full h-full bg-white/30 rounded-none "
				>
					<motion.div
						className="bg-white/50 flex items-center h-full rounded-r-lg relative"
						style={{ width }}
					>
						{showDragBox && (
							<motion.div
								className={
									"absolute h-2/3 w-1 bg-gray-500/40 rounded-full right-1"
								}
							></motion.div>
						)}
						{rangeValue === range[1] && (
							<motion.div
								className={
									"absolute h-2/3 w-1 bg-gray-500/50 rounded-full right-1 top-[50%] translate-x-[-50%] translate-y-[-50%]"
								}
							></motion.div>
						)}
					</motion.div>
					<div
						ref={labelRef}
						className="px-4 pointer-events-none z-50 text-gray-200 group-hover:text-gray-100 absolute left-0 top-[50%] translate-y-[-50%]"
					>
						{label}
					</div>
					<div
						ref={valueRef}
						className="px-4 z-50 pointer-events-none text-gray-200 group-hover:text-gray-100 absolute right-0 top-[50%] translate-y-[-50%]"
					>
						{rangeValue}
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};

export default Slider;
