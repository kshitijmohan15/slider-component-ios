"use client";

import * as Dialog from "@radix-ui/react-dialog";
import React from "react";
import { motion } from "framer-motion";
const Menu = () => {
	return (
		<Dialog.Root>
			<Dialog.Trigger>
				<button>Open</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay asChild className="fixed inset-0">
					<motion.div
						style={{
							backdropFilter: "blur(10px)",
						}}
					></motion.div>
				</Dialog.Overlay>
				<Dialog.Content></Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default Menu;
