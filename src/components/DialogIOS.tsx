"use client";
import * as Dialog from "@radix-ui/react-dialog";
import React, { useEffect, useState } from "react";
// import { Button } from "./Button";
import {
	motion,
	useMotionValue,
	useTransform,
	useMotionTemplate,
	AnimatePresence,
    animate,
} from "framer-motion";
const DialogIOS = () => {
	const [height, setHeight] = React.useState(0);
	useEffect(() => {
		let h = window.innerHeight;
		setHeight(h);
	}, [height]);
	useEffect(() => {
		console.log(open), [open];
	});
	const y = useMotionValue(height);
	const opacity = useTransform(y, [0, height], [0.6, 0]);
	const overlayColor = useMotionTemplate`rgba(0, 0, 0, ${opacity})`;

	const [open, setOpen] = useState(false);
	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>
				<button>Open Dialog</button>
			</Dialog.Trigger>
			<AnimatePresence>
				{open ? (
					<Dialog.Portal forceMount>
						<Dialog.Overlay asChild className="fixed inset-0">
							<motion.div
								style={{ backgroundColor: overlayColor }}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							></motion.div>
						</Dialog.Overlay>
						<Dialog.Content
							asChild
							className="fixed bottom-0 z-50 grid w-full gap-4 border bg-background p-6 shadow-lg  sm:rounded-lg md:w-full bg-white text-black rounded-t-lg"
						>
							<motion.div
								initial={{ y: height }}
								animate={{ y: 0 }}
								exit={{ y: height }}
								transition={{
									duration: 0.5,
									ease: [0.32, 0.73, 0, 1],
                                    
								}}
                                dragConstraints={{ top: 50 }}
                                dragElastic={0.13}
                                drag={"y"}
                                onDragEnd={
                                    (event, {offset, velocity}) => {
                                        if (offset.y > height * 0.75 || velocity.y > 10) {
                                            setOpen(false)
                                        }else{
                                            animate(y, 0, {
                                                type: "inertia",
                                                bounceStiffness: 300,
                                                bounceDamping: 40,
                                                timeConstant: 300,
                                                min: 0,
                                                max: 0,
                                            });
                                        }
                                    }
                                }
                                style={{
                                    y: y,
                                    top: 50,
                                    paddingBottom: height + 500,
                                }}
							>
								<h4 className="text-lg">My name is Kshitij</h4>
								<Dialog.Close />
							</motion.div>
						</Dialog.Content>
					</Dialog.Portal>
				) : null}
			</AnimatePresence>
		</Dialog.Root>
	);
};

export default DialogIOS;
