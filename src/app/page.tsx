import Slider from "../components/Slider";

export default function Home() {
	return (
		<main className="flex h-full min-h-screen flex-col items-center justify-between p-24 bg-black/80">
			<Slider divisions={10} range={[0, 1000]} label="Drag Me" />
		</main>
	);
}
