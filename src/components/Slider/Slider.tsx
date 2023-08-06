"use client";

import { getDivisionArray, getProgressValue } from "@/utils/helpers";
import { cva, type VariantProps } from "class-variance-authority";
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
	range = [0, 100],
	className,
	label,
	progressBarClasses,
}: {
	divisions: number;
	range: [number, number];
	className?: string;
	label?: string;
	progressBarClasses?: string;
}) => {
	if (range[0] > range[1]) {
		throw new Error(
			"First item in the range must be less than the second item in the range"
		);
	}
	// const divisionArray = getDivisionArray(divisions);

	// framer-motion hooks
	let [ref, bounds] = useMeasure();
	const progress = useMotionValue(0);
	const spring = useSpring(progress, {
		stiffness: 4500,
		damping: 200,
	});
	let width = useTransform(spring, (v) => `${v * 100}%`);

	// react hooks
	const [showDragBox, setShowDragBox] = useState(true);
	const [rangeValue, setRangeValue] = useState(range[0]);
	const [panning, setPanning] = useState(false);
	const labelRef = useRef<HTMLDivElement>(null);
	const valueRef = useRef<HTMLDivElement>(null);
	const interacting = panning;

	useEffect(() => {
		progress.on("change", (v) => {
			setRangeValue(Math.floor(range[0] + v * (range[1] - range[0])));
			if (
				v < (labelRef.current?.clientWidth ?? 72) / bounds.width ||
				v > 1 - (valueRef.current?.clientWidth ?? 72) / bounds.width
			) {
				setShowDragBox(true);
			} else {
				setShowDragBox(true);
			}
		});
	}, [progress, bounds.width]);

	const DragBox = () => (
		<motion.div
			// initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			className={twMerge(
				"absolute h-2/3 w-1 bg-gray-500/40 rounded-full right-1"
			)}
		></motion.div>
	);
	return (
		<motion.div
			ref={ref}
			className={twMerge(
				"relative flex-col flex w-[400px] h-10 bg-white/10 rounded-xl backdrop-blur-sm border-white/50 border-[1px] overflow-hidden group cursor-grab",
				interacting && "cursor-grabbing",
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
				onPan={(_, info) => {
					let deltaInPercent = info.delta.x / bounds.width;
					let newPercent = clamp(
						progress.get() + deltaInPercent,
						0,
						1
					);

					progress.set(newPercent);
				}}
				onMouseDown={({ clientX, currentTarget }) => {
					let { left } = currentTarget.getBoundingClientRect();
					let xPosition = clientX - left;
					let newPercent = clamp(xPosition / bounds.width, 0, 1);
					progress.set(newPercent);
				}}
				className="touch-none relative w-full h-full bg-white/30 rounded-none "
			>
				<motion.div
					className={twMerge(
						"bg-white/50 flex items-center h-full rounded-r-lg relative",
						progressBarClasses ?? ""
					)}
					style={{ width }}
				>
					<AnimatePresence>
						{showDragBox ? <DragBox /> : null}
					</AnimatePresence>
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
	);
};

export default Slider;
