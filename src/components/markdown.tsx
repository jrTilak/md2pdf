import ReactMarkdown, { type Components } from "react-markdown";
import "@/md-themes/default.css";
import "highlight.js/styles/github.css";
import rehypeExternalLinks from "rehype-external-links";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Children, isValidElement, useMemo, type CSSProperties } from "react";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import remarkBreaks from "remark-breaks";
import remarkDirective from "remark-directive";
import remarkEmoji from "remark-emoji";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkGithubBlockquoteAlert from "remark-github-blockquote-alert";
import remarkMath from "remark-math";
import { MermaidDiagram } from "./mermaid-diagram";
import { useMdConfig } from "@/providers/md-config-provider";
import { Hr } from "./ui/hr";
import {
	A,
	Blockquote,
	Code,
	H1,
	H2,
	H3,
	H4,
	H5,
	H6,
	Li,
	Ol,
	P,
	Pre,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Text,
	Ul,
} from "./ui/typography";

type Props = {
	/**
	 * Raw Markdown to render
	 **/
	children: string;
};

const sanitizeSchema = {
	...defaultSchema,
	attributes: {
		...defaultSchema.attributes,
		div: [...(defaultSchema.attributes?.div ?? []), "className", "id"],
		span: [...(defaultSchema.attributes?.span ?? []), "className", "id"],
		p: [...(defaultSchema.attributes?.p ?? []), "className", "id"],
		blockquote: [...(defaultSchema.attributes?.blockquote ?? []), "className", "id"],
		code: [...(defaultSchema.attributes?.code ?? []), "className"],
		pre: [...(defaultSchema.attributes?.pre ?? []), "className"],
		table: [...(defaultSchema.attributes?.table ?? []), "className"],
		thead: [...(defaultSchema.attributes?.thead ?? []), "className"],
		tbody: [...(defaultSchema.attributes?.tbody ?? []), "className"],
		tr: [...(defaultSchema.attributes?.tr ?? []), "className"],
		th: [...(defaultSchema.attributes?.th ?? []), "className"],
		td: [...(defaultSchema.attributes?.td ?? []), "className"],
		img: [...(defaultSchema.attributes?.img ?? []), "className", "src", "alt", "title"],
		a: [...(defaultSchema.attributes?.a ?? []), "className", "target", "rel"],
	},
};

export function Markdown({ children }: Props) {
	const { config } = useMdConfig();
	const previewStyle = useMemo(
		() =>
			({
				"--md-font-all": `"${config.fonts.all}", sans-serif`,
				"--md-font-h1": `"${config.fonts.h1}", ${config.fonts.all}, serif`,
				"--md-font-h2": `"${config.fonts.h2}", ${config.fonts.all}, serif`,
				"--md-font-h3": `"${config.fonts.h3}", ${config.fonts.all}, serif`,
				"--md-font-body": `"${config.fonts.body}", ${config.fonts.all}, sans-serif`,
				"--md-font-code": `"${config.fonts.code}", monospace`,
				"--md-scale": String(config.typography.globalScale),
				"--md-line-height": String(config.typography.lineHeight),
				"--md-paragraph-spacing": `${config.typography.paragraphSpacing}em`,
				"--md-size-h1": `${config.typography.sizes.h1}em`,
				"--md-size-h2": `${config.typography.sizes.h2}em`,
				"--md-size-h3": `${config.typography.sizes.h3}em`,
				"--md-size-h4": `${config.typography.sizes.h4}em`,
				"--md-size-body": `${config.typography.sizes.body}em`,
				"--md-content-padding": `${config.layout.contentPadding}px`,
				"--md-color-page": config.colors.page,
				"--md-color-h1": config.colors.h1,
				"--md-color-h2": config.colors.h2,
				"--md-color-h3": config.colors.h3,
				"--md-color-body": config.colors.body,
				"--md-color-link": config.colors.links,
				"--md-color-code": config.colors.code,
				"--md-color-quote": config.colors.quote,
				"--md-color-divider": config.colors.divider,
			}) as CSSProperties,
		[config],
	);

	const components: Components = {
		h1: (props) => <H1 {...props} />,
		h2: (props) => <H2 {...props} />,
		h3: (props) => <H3 {...props} />,
		h4: (props) => <H4 {...props} />,
		h5: (props) => <H5 {...props} />,
		h6: (props) => <H6 {...props} />,
		p: (props) => <P {...props} />,
		span: (props) => <Text {...props} />,
		a: (props) => <A {...props} />,
		blockquote: (props) => <Blockquote {...props} />,
		ul: (props) => <Ul {...props} />,
		ol: (props) => <Ol {...props} />,
		li: (props) => <Li {...props} />,
		pre: ({ children: preChildren, ...props }) => {
			const firstChild = Children.toArray(preChildren)[0];
			if (
				isValidElement(firstChild) &&
				typeof (firstChild.props as { className?: string }).className === "string" &&
				(firstChild.props as { className?: string }).className?.includes("language-mermaid")
			) {
				return <>{preChildren}</>;
			}
			return <Pre {...props}>{preChildren}</Pre>;
		},
		code: ({ children: codeChildren, className, ...props }) => {
			const rawCode = String(codeChildren).replace(/\n$/, "");
			if (className?.includes("language-mermaid")) {
				return <MermaidDiagram code={rawCode} />;
			}
			return (
				<Code className={className} {...props}>
					{codeChildren}
				</Code>
			);
		},
		table: (props) => <Table {...props} />,
		thead: (props) => <TableHead {...props} />,
		tbody: (props) => <TableBody {...props} />,
		tr: (props) => <TableRow {...props} />,
		th: (props) => <TableHeader {...props} />,
		td: (props) => <TableCell {...props} />,
		hr: (props) => <Hr {...props} />,
	};
	return (
		<article
			id="md-preview"
			className="no-tailwind md-preview-root"
			data-md-theme={config.theme}
			style={previewStyle}
		>
			<ReactMarkdown
				components={components}
				remarkPlugins={[
					remarkGfm,
					remarkMath,
					remarkBreaks,
					remarkDirective,
					remarkFrontmatter,
					remarkEmoji,
					remarkGithubBlockquoteAlert,
				]}
				rehypePlugins={[
					rehypeRaw,
					[rehypeSanitize, sanitizeSchema],
					rehypeKatex,
					rehypeSlug,
					rehypeHighlight,
					[rehypeAutolinkHeadings, { behavior: "append" }],
					[
						rehypeExternalLinks,
						{ target: "_blank", rel: ["noopener", "noreferrer"] },
					],
				]}
			>
				{children}
			</ReactMarkdown>
		</article>
	);
}
