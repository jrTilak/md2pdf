import {
	createContext,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

export const MD_THEME_OPTIONS = [
	"minimal",
	"github",
	"academic",
	"elegant",
	"dark",
	"retro",
	"ocean",
	"forest",
	"rose",
	"solarized",
	"nord",
	"dracula",
	"slate",
] as const;

export type MdTheme = (typeof MD_THEME_OPTIONS)[number];
export type ViewMode = "edit" | "split" | "preview";
export type PaperSize = "A4" | "A3" | "LETTER" | "LEGAL";
export type FontApplyTarget = "all" | "h1" | "h2" | "h3" | "body" | "code";

export const FONT_CATEGORY_OPTIONS = [
	"all",
	"handwritten",
	"serif",
	"sans",
	"mono",
	"display",
] as const;
export type FontCategory = (typeof FONT_CATEGORY_OPTIONS)[number];

type ThemePalette = {
	page: string;
	primary: string;
	accent: string;
};

export const THEME_PALETTES: Record<MdTheme, ThemePalette> = {
	minimal: { page: "#ffffff", primary: "#111827", accent: "#2563eb" },
	github: { page: "#ffffff", primary: "#1f2328", accent: "#0969da" },
	academic: { page: "#fffdf7", primary: "#1f2937", accent: "#6d28d9" },
	elegant: { page: "#fdfcf9", primary: "#262626", accent: "#7c3aed" },
	dark: { page: "#0f172a", primary: "#e2e8f0", accent: "#60a5fa" },
	retro: { page: "#fff7ed", primary: "#7c2d12", accent: "#9a3412" },
	ocean: { page: "#ecfeff", primary: "#164e63", accent: "#0e7490" },
	forest: { page: "#f0fdf4", primary: "#14532d", accent: "#15803d" },
	rose: { page: "#fff1f2", primary: "#881337", accent: "#e11d48" },
	solarized: { page: "#fdf6e3", primary: "#073642", accent: "#268bd2" },
	nord: { page: "#eceff4", primary: "#2e3440", accent: "#5e81ac" },
	dracula: { page: "#282a36", primary: "#f8f8f2", accent: "#8be9fd" },
	slate: { page: "#f8fafc", primary: "#0f172a", accent: "#334155" },
};

const HANDWRITTEN_FONTS = [
	"Caveat",
	"Dancing Script",
	"Pacifico",
	"Shadows Into Light",
	"Satisfy",
	"Indie Flower",
	"Architects Daughter",
	"Kalam",
	"Amatic SC",
	"Patrick Hand",
	"Permanent Marker",
	"Sacramento",
	"Handlee",
	"Covered By Your Grace",
	"Gloria Hallelujah",
	"Great Vibes",
	"Kaushan Script",
	"Yellowtail",
	"Allura",
	"Alex Brush",
];

const SERIF_FONTS = [
	"Merriweather",
	"Lora",
	"Playfair Display",
	"PT Serif",
	"Libre Baskerville",
	"Crimson Pro",
	"Cormorant Garamond",
	"EB Garamond",
	"Vollkorn",
	"Noto Serif",
	"Bitter",
	"Domine",
	"Alegreya",
	"Arvo",
	"Zilla Slab",
	"Cardo",
	"Prata",
	"Sorts Mill Goudy",
	"Libre Caslon Text",
	"Nanum Myeongjo",
];

const SANS_FONTS = [
	"Inter",
	"Roboto",
	"Open Sans",
	"Poppins",
	"Outfit",
	"Nunito",
	"Lato",
	"Source Sans 3",
	"Ubuntu",
	"Work Sans",
	"Manrope",
	"Mulish",
	"Rubik",
	"Karla",
	"Figtree",
	"DM Sans",
	"Noto Sans",
	"Public Sans",
	"Barlow",
	"Mukta",
	"Plus Jakarta Sans",
	"Hind",
	"Assistant",
	"Cabin",
	"Prompt",
	"Josefin Sans",
	"Libre Franklin",
	"Urbanist",
	"Varela Round",
	"Titillium Web",
];

const MONO_FONTS = [
	"JetBrains Mono",
	"Fira Code",
	"Source Code Pro",
	"Inconsolata",
	"Space Mono",
	"IBM Plex Mono",
	"Ubuntu Mono",
	"Roboto Mono",
	"Anonymous Pro",
	"Courier Prime",
	"Noto Sans Mono",
	"PT Mono",
	"Oxygen Mono",
	"Red Hat Mono",
	"Share Tech Mono",
];

const DISPLAY_FONTS = [
	"Oswald",
	"Montserrat",
	"Bebas Neue",
	"Raleway",
	"Cinzel",
	"Abril Fatface",
	"Alfa Slab One",
	"Anton",
	"Archivo Black",
	"Bungee",
	"Exo 2",
	"Fjalla One",
	"Lobster",
	"Merriweather Sans",
	"Orbitron",
	"Play",
	"Poiret One",
	"Questrial",
	"Righteous",
	"Sora",
	"Teko",
	"Unbounded",
	"Yanone Kaffeesatz",
	"Chakra Petch",
	"Archivo Narrow",
];

const ALL_FONTS = [
	...HANDWRITTEN_FONTS,
	...SERIF_FONTS,
	...SANS_FONTS,
	...MONO_FONTS,
	...DISPLAY_FONTS,
];

const sortFonts = (fonts: string[]) => [...fonts].sort((a, b) => a.localeCompare(b));

export const FONT_LIBRARY: Record<FontCategory, string[]> = {
	all: sortFonts([...new Set(ALL_FONTS)]),
	handwritten: sortFonts(HANDWRITTEN_FONTS),
	serif: sortFonts(SERIF_FONTS),
	sans: sortFonts(SANS_FONTS),
	mono: sortFonts(MONO_FONTS),
	display: sortFonts(DISPLAY_FONTS),
};

export type MdConfig = {
	theme: MdTheme;
	viewMode: ViewMode;
	paperSize: PaperSize;
	pageless: boolean;
	fontCategory: FontCategory;
	fontApplyTarget: FontApplyTarget;
	fonts: Record<FontApplyTarget, string>;
	typography: {
		globalScale: number;
		lineHeight: number;
		paragraphSpacing: number;
		sizes: { h1: number; h2: number; h3: number; h4: number; body: number };
	};
	layout: {
		contentPadding: number;
		printMargin: number;
	};
	colors: {
		page: string;
		h1: string;
		h2: string;
		h3: string;
		body: string;
		links: string;
		code: string;
		quote: string;
		divider: string;
	};
};

export const DEFAULT_MD_CONFIG: MdConfig = {
	theme: "minimal",
	viewMode: "split",
	paperSize: "A4",
	pageless: true,
	fontCategory: "sans",
	fontApplyTarget: "all",
	fonts: {
		all: "Inter",
		h1: "Playfair Display",
		h2: "Playfair Display",
		h3: "Playfair Display",
		body: "Inter",
		code: "JetBrains Mono",
	},
	typography: {
		globalScale: 1,
		lineHeight: 1.7,
		paragraphSpacing: 0.75,
		sizes: {
			h1: 2.25,
			h2: 1.875,
			h3: 1.5,
			h4: 1.25,
			body: 1,
		},
	},
	layout: {
		contentPadding: 52,
		printMargin: 0,
	},
	colors: {
		page: "#ffffff",
		h1: "#111827",
		h2: "#1f2937",
		h3: "#374151",
		body: "#111827",
		links: "#2563eb",
		code: "#0f172a",
		quote: "#6b7280",
		divider: "#d1d5db",
	},
};

export function paletteToColors(theme: MdTheme): MdConfig["colors"] {
	const palette = THEME_PALETTES[theme];
	return {
		page: palette.page,
		h1: palette.primary,
		h2: palette.primary,
		h3: palette.primary,
		body: palette.primary,
		links: palette.accent,
		code: palette.primary,
		quote: palette.primary,
		divider: palette.accent,
	};
}

const STORAGE_KEY = "md2pdf:config";

type MdConfigContextValue = {
	config: MdConfig;
	setConfig: Dispatch<SetStateAction<MdConfig>>;
	updateConfig: (updater: (prev: MdConfig) => MdConfig) => void;
};

const MdConfigContext = createContext<MdConfigContextValue | null>(null);

function ensureFontLink(fonts: string[]) {
	const uniqueFonts = [...new Set(fonts)];
	const familyQuery = uniqueFonts
		.map((font) => `family=${encodeURIComponent(font).replace(/%20/g, "+")}:wght@300;400;500;600;700`)
		.join("&");
	const href = `https://fonts.googleapis.com/css2?${familyQuery}&display=swap`;
	const existing = document.getElementById("md2pdf-google-fonts") as HTMLLinkElement | null;
	if (existing) {
		existing.href = href;
		return;
	}
	const link = document.createElement("link");
	link.id = "md2pdf-google-fonts";
	link.rel = "stylesheet";
	link.href = href;
	document.head.append(link);
}

function applyCssConfig(config: MdConfig) {
	const root = document.documentElement;
	root.dataset.mdTheme = config.theme;
	root.style.setProperty("--md-font-all", `"${config.fonts.all}", sans-serif`);
	root.style.setProperty("--md-font-h1", `"${config.fonts.h1}", ${config.fonts.all}, serif`);
	root.style.setProperty("--md-font-h2", `"${config.fonts.h2}", ${config.fonts.all}, serif`);
	root.style.setProperty("--md-font-h3", `"${config.fonts.h3}", ${config.fonts.all}, serif`);
	root.style.setProperty("--md-font-body", `"${config.fonts.body}", ${config.fonts.all}, sans-serif`);
	root.style.setProperty("--md-font-code", `"${config.fonts.code}", monospace`);
	root.style.setProperty("--md-scale", String(config.typography.globalScale));
	root.style.setProperty("--md-line-height", String(config.typography.lineHeight));
	root.style.setProperty("--md-paragraph-spacing", `${config.typography.paragraphSpacing}em`);
	root.style.setProperty("--md-size-h1", `${config.typography.sizes.h1}em`);
	root.style.setProperty("--md-size-h2", `${config.typography.sizes.h2}em`);
	root.style.setProperty("--md-size-h3", `${config.typography.sizes.h3}em`);
	root.style.setProperty("--md-size-h4", `${config.typography.sizes.h4}em`);
	root.style.setProperty("--md-size-body", `${config.typography.sizes.body}em`);
	root.style.setProperty("--md-content-padding", `${config.layout.contentPadding}px`);
	root.style.setProperty("--md-print-margin", `${config.layout.printMargin}px`);
	root.style.setProperty("--md-color-page", config.colors.page);
	root.style.setProperty("--md-color-h1", config.colors.h1);
	root.style.setProperty("--md-color-h2", config.colors.h2);
	root.style.setProperty("--md-color-h3", config.colors.h3);
	root.style.setProperty("--md-color-body", config.colors.body);
	root.style.setProperty("--md-color-link", config.colors.links);
	root.style.setProperty("--md-color-code", config.colors.code);
	root.style.setProperty("--md-color-quote", config.colors.quote);
	root.style.setProperty("--md-color-divider", config.colors.divider);
}

function loadConfigFromStorage(): MdConfig {
	if (typeof window === "undefined") {
		return DEFAULT_MD_CONFIG;
	}
	const rawConfig = localStorage.getItem(STORAGE_KEY);
	if (!rawConfig) {
		return DEFAULT_MD_CONFIG;
	}
	try {
		const parsed = JSON.parse(rawConfig) as MdConfig;
		return {
			...DEFAULT_MD_CONFIG,
			...parsed,
			colors: {
				...DEFAULT_MD_CONFIG.colors,
				...parsed.colors,
			},
		};
	} catch {
		return DEFAULT_MD_CONFIG;
	}
}

export function MdConfigProvider({ children }: PropsWithChildren) {
	const [config, setConfig] = useState<MdConfig>(loadConfigFromStorage);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
		ensureFontLink(Object.values(config.fonts));
		applyCssConfig(config);
	}, [config]);

	const value = useMemo<MdConfigContextValue>(
		() => ({
			config,
			setConfig,
			updateConfig: (updater) => setConfig((prev) => updater(prev)),
		}),
		[config],
	);

	return <MdConfigContext.Provider value={value}>{children}</MdConfigContext.Provider>;
}

export function useMdConfig() {
	const value = useContext(MdConfigContext);
	if (!value) {
		throw new Error("useMdConfig must be used inside MdConfigProvider");
	}
	return value;
}
