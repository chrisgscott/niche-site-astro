declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"articles": {
"wedding-photography-lighting-guide.md": {
	id: "wedding-photography-lighting-guide.md";
  slug: "wedding-photography-lighting-guide";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"wedding-photography-packages.md": {
	id: "wedding-photography-packages.md";
  slug: "wedding-photography-packages";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
};
"config": {
"homepage.md": {
	id: "homepage.md";
  slug: "homepage";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".md"] };
"site.mdx": {
	id: "site.mdx";
  slug: "site";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
};
"posts": {
"Boosting Sales with Effective Search Engine Optimization (SEO).mdx": {
	id: "Boosting Sales with Effective Search Engine Optimization (SEO).mdx";
  slug: "boosting-sales-with-effective-search-engine-optimization-seo";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"Growing Your New YouTube Channel with Effective SEO Strategies.mdx": {
	id: "Growing Your New YouTube Channel with Effective SEO Strategies.mdx";
  slug: "growing-your-new-youtube-channel-with-effective-seo-strategies";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"Leveraging Google Ads for Increased Business Sales.mdx": {
	id: "Leveraging Google Ads for Increased Business Sales.mdx";
  slug: "leveraging-google-ads-for-increased-business-sales";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"Leveraging Social Media Marketing for Business Growth.mdx": {
	id: "Leveraging Social Media Marketing for Business Growth.mdx";
  slug: "leveraging-social-media-marketing-for-business-growth";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"Maximizing Business Growth Through.mdx": {
	id: "Maximizing Business Growth Through.mdx";
  slug: "maximizing-business-growth-through";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"Strategies to Boost Sales Through Your Website.mdx": {
	id: "Strategies to Boost Sales Through Your Website.mdx";
  slug: "strategies-to-boost-sales-through-your-website";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"Using SEO Strategies for Business Growth.mdx": {
	id: "Using SEO Strategies for Business Growth.mdx";
  slug: "using-seo-strategies-for-business-growth";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"Utilizing YouTube for Business Growth.mdx": {
	id: "Utilizing YouTube for Business Growth.mdx";
  slug: "utilizing-youtube-for-business-growth";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"technical-seo-guide.mdx": {
	id: "technical-seo-guide.mdx";
  slug: "technical-seo-guide";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"wedding-photography-pricing.md": {
	id: "wedding-photography-pricing.md";
  slug: "wedding-photography-pricing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
};
"topics": {
"seo-fundamentals.mdx": {
	id: "seo-fundamentals.mdx";
  slug: "seo-fundamentals";
  body: string;
  collection: "topics";
  data: InferEntrySchema<"topics">
} & { render(): Render[".mdx"] };
"social-media-marketing.mdx": {
	id: "social-media-marketing.mdx";
  slug: "social-media-marketing";
  body: string;
  collection: "topics";
  data: InferEntrySchema<"topics">
} & { render(): Render[".mdx"] };
"wedding-photography.md": {
	id: "wedding-photography.md";
  slug: "wedding-photography";
  body: string;
  collection: "topics";
  data: InferEntrySchema<"topics">
} & { render(): Render[".md"] };
"youtube-marketing.mdx": {
	id: "youtube-marketing.mdx";
  slug: "youtube-marketing";
  body: string;
  collection: "topics";
  data: InferEntrySchema<"topics">
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../src/content/config.js");
}
