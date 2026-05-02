import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type H1Props = ComponentProps<"h1">;
export function H1({ className, ...rest }: H1Props) {
	return <h1 data-slot="h1" className={cn("md-h1", className)} {...rest} />;
}

type H2Props = ComponentProps<"h2">;
export function H2({ className, ...rest }: H2Props) {
	return <h2 data-slot="h2" className={cn("md-h2", className)} {...rest} />;
}

type H3Props = ComponentProps<"h3">;
export function H3({ className, ...rest }: H3Props) {
	return <h3 data-slot="h3" className={cn("md-h3", className)} {...rest} />;
}

type H4Props = ComponentProps<"h4">;
export function H4({ className, ...rest }: H4Props) {
	return <h4 data-slot="h4" className={cn("md-h4", className)} {...rest} />;
}

type H5Props = ComponentProps<"h5">;
export function H5({ className, ...rest }: H5Props) {
	return <h5 data-slot="h5" className={cn("md-h5", className)} {...rest} />;
}

type H6Props = ComponentProps<"h6">;
export function H6({ className, ...rest }: H6Props) {
	return <h6 data-slot="h6" className={cn("md-h6", className)} {...rest} />;
}

type PProps = ComponentProps<"p">;
export function P({ className, ...rest }: PProps) {
	return <p data-slot="p" className={cn("md-p", className)} {...rest} />;
}

type TextProps = ComponentProps<"span">;
export function Text({ className, ...rest }: TextProps) {
	return <span data-slot="text" className={cn("md-text", className)} {...rest} />;
}

type AProps = ComponentProps<"a">;
export function A({ className, ...rest }: AProps) {
	return <a data-slot="a" className={cn("md-a", className)} {...rest} />;
}

type BlockquoteProps = ComponentProps<"blockquote">;
export function Blockquote({ className, ...rest }: BlockquoteProps) {
	return (
		<blockquote
			data-slot="blockquote"
			className={cn("md-blockquote", className)}
			{...rest}
		/>
	);
}

type UlProps = ComponentProps<"ul">;
export function Ul({ className, ...rest }: UlProps) {
	return <ul data-slot="ul" className={cn("md-ul", className)} {...rest} />;
}

type OlProps = ComponentProps<"ol">;
export function Ol({ className, ...rest }: OlProps) {
	return <ol data-slot="ol" className={cn("md-ol", className)} {...rest} />;
}

type LiProps = ComponentProps<"li">;
export function Li({ className, ...rest }: LiProps) {
	return <li data-slot="li" className={cn("md-li", className)} {...rest} />;
}

type CodeProps = ComponentProps<"code">;
export function Code({ className, ...rest }: CodeProps) {
	return <code data-slot="code" className={cn("md-code", className)} {...rest} />;
}

type PreProps = ComponentProps<"pre">;
export function Pre({ className, ...rest }: PreProps) {
	return <pre data-slot="pre" className={cn("md-pre", className)} {...rest} />;
}

type TableProps = ComponentProps<"table">;
export function Table({ className, ...rest }: TableProps) {
	return (
		<div data-slot="table-wrap" className="md-table-wrap">
			<table data-slot="table" className={cn("md-table", className)} {...rest} />
		</div>
	);
}

type TableHeadProps = ComponentProps<"thead">;
export function TableHead({ className, ...rest }: TableHeadProps) {
	return (
		<thead data-slot="thead" className={cn("md-thead", className)} {...rest} />
	);
}

type TableBodyProps = ComponentProps<"tbody">;
export function TableBody({ className, ...rest }: TableBodyProps) {
	return (
		<tbody data-slot="tbody" className={cn("md-tbody", className)} {...rest} />
	);
}

type TableRowProps = ComponentProps<"tr">;
export function TableRow({ className, ...rest }: TableRowProps) {
	return <tr data-slot="tr" className={cn("md-tr", className)} {...rest} />;
}

type TableHeaderProps = ComponentProps<"th">;
export function TableHeader({ className, ...rest }: TableHeaderProps) {
	return <th data-slot="th" className={cn("md-th", className)} {...rest} />;
}

type TableCellProps = ComponentProps<"td">;
export function TableCell({ className, ...rest }: TableCellProps) {
	return <td data-slot="td" className={cn("md-td", className)} {...rest} />;
}
