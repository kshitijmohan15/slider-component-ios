"use client";

import React, { useEffect } from "react";
import {
	AnimatePresence,
	MotionValue,
	animate,
	motion,
	useMotionTemplate,
	useMotionValue,
	useSpring,
	useTransform,
} from "framer-motion";
import useMeasure from "react-use-measure";
import { AiOutlineWifi } from "react-icons/ai";
import { BsBatteryFull } from "react-icons/bs";
import { RiRotateLockLine } from "react-icons/ri";
import { IoIosAirplane, IoIosBluetooth } from "react-icons/io";
import { FaAppStoreIos } from "react-icons/fa";
import * as Dialog from "@radix-ui/react-dialog";
import SliderParent from "../Slider/SliderParent";
import { WeightedSlider } from "../Slider";
import { twMerge } from "tailwind-merge";

const Navbar = () => {
	const PanelItem = ({
		children,
		className,
	}: {
		children?: React.ReactNode;
		className?: string;
	}) => (
		<AnimatePresence>
			{open || panning ? (
				<motion.div
					style={{
						marginTop: gap_template,
						scale: progress_to_panel_scale,
					}}
					className={twMerge(
						"z-20 rounded-2xl bg-black/50  backdrop-blur-lg w-32 h-32 col-span-1",
						className ?? ""
					)}
				>
					{children}
				</motion.div>
			) : null}
		</AnimatePresence>
	);
	let [ref, bounds] = useMeasure();
	const progress = useMotionValue(0.5);
	// hooks dependant on progress
	const progress_to_blur = useTransform(progress, [0, 2], [0, 10]);
	const progress_to_icon_x = useSpring(
		useTransform(progress, [0, 1, 1.1], [0, -20, -70]),
		{
			stiffness: 5000,
			damping: 200,
		}
	);
	const progress_to_icon_y = useSpring(
		useTransform(progress, (prog) => prog * 10),
		{
			stiffness: 4500,
			damping: 200,
		}
	);
	const progress_to_margin_top: MotionValue<string> = useSpring(
		useTransform(progress, (v) => `${10 + v * 2}`),
		{
			stiffness: 4500,
			damping: 200,
		}
	);
	const progress_to_icon_scale = useSpring(
		useTransform(progress, [0, 1], [1, 1.2]),
		{
			stiffness: 4500,
			damping: 200,
		}
	);
	const progress_to_panel_scale = useSpring(
		useTransform(progress, [0, 1], [0.2, 1]),
		{
			stiffness: 4500,
			damping: 200,
		}
	);
	const progress_to_bg_color_overlay = useTransform(
		useTransform(progress, [0, 1], [0, 0.1]),
		(v) => `rgba(255, 255, 255, ${v})`
	);
	const progress_to_opacity_template = useMotionTemplate`${useSpring(
		useTransform(progress, [0, 1], [0, 100]),
		{
			stiffness: 4500,
			damping: 200,
		}
	)}%`;

	// hooks dependent on hooks dependent on progress
	const gap_template = useMotionTemplate`${progress_to_margin_top}px`;
	const blurMeasure = useMotionTemplate`blur(${progress_to_blur}px)`;

	const [open, setOpen] = React.useState(false);
	const [panning, setPanning] = React.useState(false);
	const [showPanel, setShowPanel] = React.useState(false);
	useEffect(() => {
		progress.on("change", (v) => {
			if (v > 1) {
				setShowPanel(true);
			} else {
				setShowPanel(false);
			}
		});
	}, []);
	useEffect(() => {
		if (!open) {
			setShowPanel(false);
			progress.set(0);
		}
	}, [open]);
	return (
		<motion.nav
			ref={ref}
			onPanStart={() => {
				setPanning(true);
			}}
			onPanEnd={(event, { offset, velocity }) => {
				if (offset.y > bounds.height * 0.8 || velocity.y > 30) {
					setOpen(true);
					progress.set(2);
					setPanning(false);
				} else {
					setOpen(false);
					animate(progress, 0, {
						type: "inertia",
						bounceStiffness: 300,
						bounceDamping: 40,
						timeConstant: 300,
						min: 0,
						max: 0,
					});
					setPanning(false);
				}
			}}
			onPan={(event, info) => {
				let deltaInPercent = info.delta.y / bounds.height;
				let newPercent = progress.get() + deltaInPercent;
				progress.set(newPercent);
			}}
			className="touch-none bg-white border-gray-200 dark:bg-gray-900 w-full flex justify-end h-10 items-center relative"
		>
			<Dialog.Root open={open} onOpenChange={setOpen}>
				{/* <Dialog.Trigger asChild>
					<button>Open</button>
				</Dialog.Trigger> */}
				<AnimatePresence>
					{panning || open ? (
						<Dialog.Portal forceMount>
							<Dialog.Overlay
								asChild
								className="fixed inset-0 z-10"
							>
								<motion.div
									initial={{ opacity: 0 }}
									animate={{
										opacity: 1,
									}}
									exit={{ opacity: 0 }}
									style={{
										backdropFilter: blurMeasure,
										backgroundColor:
											progress_to_bg_color_overlay,
									}}
								></motion.div>
							</Dialog.Overlay>
							<Dialog.Content className="z-20 fixed right-0 top-10 mr-20 focus:outline-none">
								<motion.div
									transition={{
										duration: 2,
										type: "spring",
									}}
									style={{
										y: progress_to_icon_y,
										opacity: progress_to_opacity_template,
									}}
									className="absolute right-0 z-20"
								>
									<AnimatePresence>
										{showPanel || open ? (
											<motion.div
												initial={{
													opacity: 0,
												}}
												animate={{
													opacity: 1,
												}}
												transition={{
													duration: 0.4,
												}}
												exit={{
													opacity: 0,
												}}
												className="flex flex-col"
											>
												<div className="flex gap-4">
													<PanelItem>
														<div className="w-full h-full grid grid-cols-2 p-2">
															<div className="w-full h-full flex justify-center items-center">
																<div className="rounded-full bg-gray-300/30 backdrop-blur-sm text-white w-12 h-12 flex items-center justify-center text-2xl">
																	<IoIosAirplane />
																</div>
															</div>
															<div className="w-full h-full flex justify-center items-center">
																<div className="rounded-full bg-gray-300/30 backdrop-blur-sm text-white w-12 h-12 flex items-center justify-center text-2xl">
																	<FaAppStoreIos />
																</div>
															</div>
															<div className="w-full h-full flex justify-center items-center">
																<div className="rounded-full bg-gray-300/30 backdrop-blur-sm text-white w-12 h-12 flex items-center justify-center text-2xl">
																	<AiOutlineWifi />
																</div>
															</div>
															<div className="w-full h-full flex justify-center items-center">
																<div className="rounded-full bg-gray-300/30 backdrop-blur-sm text-white w-12 h-12 flex items-center justify-center text-2xl">
																	<IoIosBluetooth />
																</div>
															</div>
														</div>
													</PanelItem>
													<PanelItem />
												</div>
												<div className="flex gap-4 col-span-2">
													<PanelItem className="col-span-2 w-full h-full">
														<WeightedSlider
															className="w-full h-10"
															divisions={5}
															range={[0, 100]}
															label="Brightness"
														/>
													</PanelItem>
												</div>
												<div className="flex gap-4">
													<PanelItem />
													<PanelItem />
												</div>
											</motion.div>
										) : null}
									</AnimatePresence>
								</motion.div>
							</Dialog.Content>
						</Dialog.Portal>
					) : null}
				</AnimatePresence>
			</Dialog.Root>
			<motion.div className="z-20 absolute right-0 top-0">
				<div className="flex flex-col z-30">
					<motion.ul
						style={{
							x: progress_to_icon_x,
							y: progress_to_icon_y,
							scale: progress_to_icon_scale,
						}}
						className="p-2 flex text-2xl items-center h-full gap-2"
					>
						<motion.li>
							<AiOutlineWifi />
						</motion.li>
						<motion.li>
							<BsBatteryFull />
						</motion.li>
						<motion.li>
							<RiRotateLockLine />
						</motion.li>
					</motion.ul>
				</div>
			</motion.div>
		</motion.nav>
	);
};

export default Navbar;
