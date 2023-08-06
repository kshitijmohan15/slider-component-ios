"use client";
import React, { useState } from "react";
import { WeightedSlider } from ".";

const SliderParent = () => {
	const [value, setValue] = useState(100);
	return (
		<div className="flex flex-col gap-4">
			<div
				className={"text-2xl transition-all duration-100"}
				style={{ fontWeight: Number(value) ?? 0 }}
			>
				My Name
			</div>
			<WeightedSlider
				setValue={setValue}
				divisions={8}
				range={[100, 200]}
				label="Font Size"
			/>
		</div>
	);
};
export default SliderParent;
