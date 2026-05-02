import { useEffect, useId, useRef, useState } from "react";
import mermaid from "mermaid";

type MermaidDiagramProps = {
	code: string;
};

let initialized = false;

function initMermaid() {
	if (initialized) {
		return;
	}
	mermaid.initialize({
		startOnLoad: false,
		securityLevel: "strict",
		theme: "default",
	});
	initialized = true;
}

export function MermaidDiagram({ code }: MermaidDiagramProps) {
	const id = useId().replace(/:/g, "-");
	const containerRef = useRef<HTMLDivElement>(null);
	const [svg, setSvg] = useState("");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		initMermaid();
		const graph = code.trim();
		if (!graph) {
			setSvg("");
			return;
		}
		mermaid
			.render(`mermaid-${id}`, graph)
			.then((result) => {
				if (!mounted) {
					return;
				}
				setSvg(result.svg);
				setError(null);
			})
			.catch((err) => {
				if (!mounted) {
					return;
				}
				setError(err instanceof Error ? err.message : "Invalid mermaid graph.");
			});
		return () => {
			mounted = false;
		};
	}, [code, id]);

	useEffect(() => {
		if (!containerRef.current) {
			return;
		}
		containerRef.current.innerHTML = svg;
	}, [svg]);

	if (error) {
		return <pre data-slot="mermaid-error">{error}</pre>;
	}

	return <div ref={containerRef} data-slot="mermaid" className="md-mermaid" />;
}
