import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Markdown } from "./components/markdown";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./components/ui/sheet";
import { Slider } from "./components/ui/slider";
import { Switch } from "./components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
	FONT_CATEGORY_OPTIONS,
	FONT_LIBRARY,
	MD_THEME_OPTIONS,
	type MdConfig,
	type PaperSize,
	paletteToColors,
	THEME_PALETTES,
	type ViewMode,
	useMdConfig,
} from "./providers/md-config-provider";

const PAGE_SIZE_MAP: Record<PaperSize, string> = {
	A4: "A4",
	A3: "A3",
	LETTER: "Letter",
	LEGAL: "Legal",
};

const SAMPLE_MARKDOWN = `# Welcome to Markdown -> PDF

A powerful converter with **Google Fonts**, syntax highlighting, math equations, and diagrams.

## What's New

- KaTeX math support
- Syntax highlighting for code blocks
- Mermaid diagrams
- Multiple themes
- Auto-save and Ctrl+S export

---

Inline math: $E = mc^2$

\`\`\`mermaid
flowchart LR
  A[Write Markdown] --> B{Preview OK?}
  B -- Yes --> C[Download PDF]
  B -- No --> D[Adjust Settings]
  D --> A
\`\`\`

| Feature | Status |
| --- | --- |
| KaTeX | Yes |
| Mermaid | Yes |
| Themes | Yes |
`;

export function App() {
	const { config, updateConfig } = useMdConfig();
	const [text, setText] = useState(() => localStorage.getItem("text") || SAMPLE_MARKDOWN);
	const [fontSearch, setFontSearch] = useState("");

	useEffect(() => {
		localStorage.setItem("text", text);
	}, [text]);

	const wordCount = useMemo(
		() => text.trim().split(/\s+/).filter(Boolean).length,
		[text],
	);

	const contentRef = useRef<HTMLDivElement>(null);
	const editorRef = useRef<HTMLTextAreaElement>(null);
	const pageStyle = useMemo(() => {
		const printSize = config.pageless ? "auto" : PAGE_SIZE_MAP[config.paperSize];
		return `
		@page {
			size: ${printSize};
			margin: 0;
		}
		html,
		body {
			margin: 0 !important;
			padding: 0 !important;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}
		#md-preview {
			--md-print-top-space: 28px;
			--md-print-bottom-space: 30px;
			background: var(--md-color-page) !important;
			box-decoration-break: clone;
			-webkit-box-decoration-break: clone;
			padding-top: var(--md-print-top-space) !important;
			padding-bottom: var(--md-print-bottom-space) !important;
			margin-top: calc(var(--md-print-top-space) * -1) !important;
		}
		`;
	}, [config.pageless, config.paperSize]);

	const reactToPrintFn = useReactToPrint({
		contentRef,
		pageStyle,
	});

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			const isSave = event.key.toLowerCase() === "s" && (event.ctrlKey || event.metaKey);
			if (!isSave) {
				return;
			}
			event.preventDefault();
			reactToPrintFn();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [reactToPrintFn]);

	const currentFonts = FONT_LIBRARY[config.fontCategory];
	const filteredFonts = useMemo(() => {
		const query = fontSearch.trim().toLowerCase();
		if (!query) {
			return currentFonts;
		}
		return currentFonts.filter((font) => font.toLowerCase().includes(query));
	}, [currentFonts, fontSearch]);

	const updateTypography = (
		key: "globalScale" | "lineHeight" | "paragraphSpacing",
		value: number,
	) => {
		updateConfig((prev) => ({
			...prev,
			typography: {
				...prev.typography,
				[key]: value,
			},
		}));
	};

	const updateTypographySize = (
		key: keyof MdConfig["typography"]["sizes"],
		value: number,
	) => {
		updateConfig((prev) => {
			return {
				...prev,
				typography: {
					...prev.typography,
					sizes: {
						...prev.typography.sizes,
						[key]: value,
					},
				},
			};
		});
	};

	const applyFont = (font: string) => {
		updateConfig((prev) => {
			if (prev.fontApplyTarget === "all") {
				return {
					...prev,
					fonts: {
						all: font,
						h1: font,
						h2: font,
						h3: font,
						body: font,
						code: prev.fonts.code,
					},
				};
			}
			return {
				...prev,
				fonts: {
					...prev.fonts,
					[prev.fontApplyTarget]: font,
				},
			};
		});
	};

	const showEditor = config.viewMode === "edit" || config.viewMode === "split";
	const showPreview = config.viewMode === "preview" || config.viewMode === "split";
	const activeThemePalette = THEME_PALETTES[config.theme];

	const resizeEditor = useCallback((node: HTMLTextAreaElement | null) => {
		if (!node) {
			return;
		}
		node.style.height = "auto";
		node.style.height = `${node.scrollHeight}px`;
	}, []);

	useEffect(() => {
		if (!showEditor) {
			return;
		}
		resizeEditor(editorRef.current);
	}, [resizeEditor, showEditor]);

	return (
		<div className="min-h-svh bg-background text-foreground">
			<header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
				<div className="mx-auto flex w-full max-w-350 flex-wrap items-center justify-between gap-3 px-4 py-3">
					<div className="flex flex-wrap items-center gap-2">
						<Tabs
							value={config.viewMode}
							onValueChange={(value) =>
								updateConfig((prev) => ({ ...prev, viewMode: value as ViewMode }))
							}
						>
							<TabsList>
								<TabsTrigger value="edit">Edit</TabsTrigger>
								<TabsTrigger value="split">Split</TabsTrigger>
								<TabsTrigger value="preview">Preview</TabsTrigger>
							</TabsList>
						</Tabs>
						<div className="rounded-md border px-2 py-1 text-xs text-muted-foreground">
							{wordCount} words
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Select
							value={config.paperSize}
							onValueChange={(value) =>
								updateConfig((prev) => ({ ...prev, paperSize: value as PaperSize }))
							}
						>
							<SelectTrigger className="min-w-32">
								<SelectValue placeholder="Paper size" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="A4">A4</SelectItem>
								<SelectItem value="A3">A3</SelectItem>
								<SelectItem value="LETTER">US Letter</SelectItem>
								<SelectItem value="LEGAL">US Legal</SelectItem>
							</SelectContent>
						</Select>
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="outline">Settings</Button>
							</SheetTrigger>
							<SheetContent side="left" className="w-full overflow-y-auto sm:max-w-md">
								<SheetHeader>
									<SheetTitle>Markdown settings</SheetTitle>
								</SheetHeader>
								<div className="space-y-5 px-4 pb-6">
									<section className="space-y-2">
										<h3 className="text-sm font-semibold">Theme</h3>
										<Select
											value={config.theme}
											onValueChange={(theme) =>
												updateConfig((prev) => ({
													...prev,
													theme: theme as MdConfig["theme"],
													colors: paletteToColors(theme as MdConfig["theme"]),
												}))
											}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Theme" />
											</SelectTrigger>
											<SelectContent>
												{MD_THEME_OPTIONS.map((theme) => (
													<SelectItem key={theme} value={theme}>
														{theme}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<div className="rounded-md border p-2">
											<div className="mb-2 text-xs text-muted-foreground">
												Main theme colors
											</div>
											<div className="flex items-center gap-3">
												<ThemeSwatch label="Page" color={activeThemePalette.page} />
												<ThemeSwatch label="Primary" color={activeThemePalette.primary} />
												<ThemeSwatch label="Accent" color={activeThemePalette.accent} />
											</div>
										</div>
									</section>

									<section className="space-y-2">
										<h3 className="text-sm font-semibold">Fonts</h3>
										<div className="grid grid-cols-2 gap-2">
											<Select
												value={config.fontCategory}
												onValueChange={(value) =>
													updateConfig((prev) => ({ ...prev, fontCategory: value as MdConfig["fontCategory"] }))
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="Category" />
												</SelectTrigger>
												<SelectContent>
													{FONT_CATEGORY_OPTIONS.map((option) => (
														<SelectItem key={option} value={option}>
															{option === "all" ? "All fonts" : option}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<Select
												value={config.fontApplyTarget}
												onValueChange={(value) =>
													updateConfig((prev) => ({
														...prev,
														fontApplyTarget: value as MdConfig["fontApplyTarget"],
													}))
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="Apply to" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="all">All</SelectItem>
													<SelectItem value="h1">H1</SelectItem>
													<SelectItem value="h2">H2</SelectItem>
													<SelectItem value="h3">H3</SelectItem>
													<SelectItem value="body">Body</SelectItem>
													<SelectItem value="code">Code</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<Input
											placeholder="Search fonts..."
											value={fontSearch}
											onChange={(e) => setFontSearch(e.target.value)}
										/>
										<div className="grid max-h-64 grid-cols-1 gap-1 overflow-y-auto rounded-md border p-2">
											{filteredFonts.map((font) => (
												<Button
													key={font}
													variant="ghost"
													className="justify-start"
													style={{ fontFamily: `"${font}", sans-serif` }}
													onClick={() => applyFont(font)}
												>
													{font}
												</Button>
											))}
											{filteredFonts.length === 0 ? (
												<div className="px-2 py-3 text-sm text-muted-foreground">
													No fonts found.
												</div>
											) : null}
										</div>
									</section>

									<section className="space-y-3">
										<h3 className="text-sm font-semibold">Typography and scale</h3>
										<SliderRow
											label={`Global scale ${config.typography.globalScale.toFixed(2)}x`}
											value={config.typography.globalScale}
											min={0.7}
											max={1.5}
											step={0.01}
											onChange={(value) => updateTypography("globalScale", value)}
										/>
										<SliderRow
											label={`Line height ${config.typography.lineHeight.toFixed(2)}`}
											value={config.typography.lineHeight}
											min={1.1}
											max={2.2}
											step={0.01}
											onChange={(value) => updateTypography("lineHeight", value)}
										/>
										<SliderRow
											label={`Para spacing ${config.typography.paragraphSpacing.toFixed(2)}em`}
											value={config.typography.paragraphSpacing}
											min={0.2}
											max={1.4}
											step={0.01}
											onChange={(value) => updateTypography("paragraphSpacing", value)}
										/>
										<SliderRow
											label={`H1 size ${config.typography.sizes.h1.toFixed(2)}em`}
											value={config.typography.sizes.h1}
											min={1.2}
											max={3}
											step={0.01}
											onChange={(value) => updateTypographySize("h1", value)}
										/>
										<SliderRow
											label={`H2 size ${config.typography.sizes.h2.toFixed(2)}em`}
											value={config.typography.sizes.h2}
											min={1.1}
											max={2.5}
											step={0.01}
											onChange={(value) => updateTypographySize("h2", value)}
										/>
										<SliderRow
											label={`H3 size ${config.typography.sizes.h3.toFixed(2)}em`}
											value={config.typography.sizes.h3}
											min={1}
											max={2}
											step={0.01}
											onChange={(value) => updateTypographySize("h3", value)}
										/>
										<SliderRow
											label={`H4 size ${config.typography.sizes.h4.toFixed(2)}em`}
											value={config.typography.sizes.h4}
											min={0.9}
											max={1.8}
											step={0.01}
											onChange={(value) => updateTypographySize("h4", value)}
										/>
										<SliderRow
											label={`Body size ${config.typography.sizes.body.toFixed(2)}em`}
											value={config.typography.sizes.body}
											min={0.8}
											max={1.4}
											step={0.01}
											onChange={(value) => updateTypographySize("body", value)}
										/>
									</section>

									<section className="space-y-3">
										<h3 className="text-sm font-semibold">Colors</h3>
										<ColorRow
											label="Page"
											value={config.colors.page}
											onChange={(value) =>
												updateConfig((prev) => ({
													...prev,
													colors: { ...prev.colors, page: value },
												}))
											}
										/>
										<ColorRow
											label="H1"
											value={config.colors.h1}
											onChange={(value) =>
												updateConfig((prev) => ({
													...prev,
													colors: { ...prev.colors, h1: value },
												}))
											}
										/>
										<ColorRow
											label="H2"
											value={config.colors.h2}
											onChange={(value) =>
												updateConfig((prev) => ({
													...prev,
													colors: { ...prev.colors, h2: value },
												}))
											}
										/>
										<ColorRow
											label="H3"
											value={config.colors.h3}
											onChange={(value) =>
												updateConfig((prev) => ({
													...prev,
													colors: { ...prev.colors, h3: value },
												}))
											}
										/>
										<ColorRow
											label="Body"
											value={config.colors.body}
											onChange={(value) =>
												updateConfig((prev) => ({
													...prev,
													colors: { ...prev.colors, body: value },
												}))
											}
										/>
										<ColorRow
											label="Links"
											value={config.colors.links}
											onChange={(value) =>
												updateConfig((prev) => ({
													...prev,
													colors: { ...prev.colors, links: value },
												}))
											}
										/>
										<ColorRow
											label="Code"
											value={config.colors.code}
											onChange={(value) =>
												updateConfig((prev) => ({
													...prev,
													colors: { ...prev.colors, code: value },
												}))
											}
										/>
										<ColorRow
											label="Quote"
											value={config.colors.quote}
											onChange={(value) =>
												updateConfig((prev) => ({
													...prev,
													colors: { ...prev.colors, quote: value },
												}))
											}
										/>
										<ColorRow
											label="Divider"
											value={config.colors.divider}
											onChange={(value) =>
												updateConfig((prev) => ({
													...prev,
													colors: { ...prev.colors, divider: value },
												}))
											}
										/>
									</section>

									<section className="space-y-3">
										<h3 className="text-sm font-semibold">Page layout</h3>
										<SliderRow
											label={`Content padding ${config.layout.contentPadding}px`}
											value={config.layout.contentPadding}
											min={0}
											max={120}
											step={1}
											onChange={(value) =>
												updateConfig((prev) => ({
													...prev,
													layout: { ...prev.layout, contentPadding: value },
												}))
											}
										/>
										<div className="flex items-center justify-between rounded-md border p-2">
											<span className="text-sm">Pageless</span>
											<Switch
												checked={config.pageless}
												onCheckedChange={(checked) =>
													updateConfig((prev) => ({ ...prev, pageless: checked }))
												}
											/>
										</div>
									</section>
								</div>
							</SheetContent>
						</Sheet>
						<Button onClick={reactToPrintFn}>Save as PDF</Button>
					</div>
				</div>
			</header>
			<main
				className={[
					"mx-auto grid w-full max-w-350 gap-4 p-4",
					config.viewMode === "split" ? "md:grid-cols-2" : "grid-cols-1",
				].join(" ")}
			>
				{showEditor ? (
					<textarea
						ref={editorRef}
						className="min-h-[70vh] w-full resize-none overflow-hidden rounded-md border bg-background p-3 font-mono text-sm"
						value={text}
						onChange={(e) => {
							setText(e.target.value);
							resizeEditor(e.target);
						}}
						placeholder="Write markdown here..."
					/>
				) : null}
				{showPreview ? (
					<div ref={contentRef} className="min-h-[70vh] rounded-md border">
						<Markdown>{text}</Markdown>
					</div>
				) : null}
			</main>
		</div>
	);
}

type SliderRowProps = {
	label: string;
	value: number;
	min: number;
	max: number;
	step: number;
	onChange: (value: number) => void;
};

function SliderRow({ label, value, min, max, step, onChange }: SliderRowProps) {
	return (
		<div className="space-y-1">
			<div className="text-xs text-muted-foreground">{label}</div>
			<Slider
				value={[value]}
				min={min}
				max={max}
				step={step}
				onValueChange={(next) => onChange(next[0] ?? value)}
			/>
		</div>
	);
}

type ColorRowProps = {
	label: string;
	value: string;
	onChange: (value: string) => void;
};

function ColorRow({ label, value, onChange }: ColorRowProps) {
	return (
		<div className="flex items-center justify-between gap-3 rounded-md border p-2 text-sm">
			<span>{label}</span>
			<div className="flex items-center gap-2">
				<Input
					type="text"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="h-8 w-28"
				/>
				<Input
					type="color"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="h-8 w-12 p-1"
				/>
			</div>
		</div>
	);
}

type ThemeSwatchProps = {
	label: string;
	color: string;
};

function ThemeSwatch({ label, color }: ThemeSwatchProps) {
	return (
		<div className="flex items-center gap-2">
			<span
				className="inline-block h-5 w-5 rounded-full border"
				style={{ backgroundColor: color }}
			/>
			<div className="leading-tight">
				<div className="text-xs font-medium">{label}</div>
				<div className="text-[11px] text-muted-foreground">{color}</div>
			</div>
		</div>
	);
}

export default App;
