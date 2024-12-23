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
"top-courses-boudoir-photographers.md": {
	id: "top-courses-boudoir-photographers.md";
  slug: "top-courses-boudoir-photographers";
  body: string;
  collection: "articles";
  data: any
} & { render(): Render[".md"] };
"top-courses-newborn-photographers.md": {
	id: "top-courses-newborn-photographers.md";
  slug: "top-courses-newborn-photographers";
  body: string;
  collection: "articles";
  data: any
} & { render(): Render[".md"] };
"top-courses-wedding-photographers.md": {
	id: "top-courses-wedding-photographers.md";
  slug: "top-courses-wedding-photographers";
  body: string;
  collection: "articles";
  data: any
} & { render(): Render[".md"] };
"top-podcasts-boudoir-photographers.md": {
	id: "top-podcasts-boudoir-photographers.md";
  slug: "top-podcasts-boudoir-photographers";
  body: string;
  collection: "articles";
  data: any
} & { render(): Render[".md"] };
"top-podcasts-newborn-photographers.md": {
	id: "top-podcasts-newborn-photographers.md";
  slug: "top-podcasts-newborn-photographers";
  body: string;
  collection: "articles";
  data: any
} & { render(): Render[".md"] };
"top-podcasts-wedding-photographers.md": {
	id: "top-podcasts-wedding-photographers.md";
  slug: "top-podcasts-wedding-photographers";
  body: string;
  collection: "articles";
  data: any
} & { render(): Render[".md"] };
"top-youtubers-boudoir-photographers.md": {
	id: "top-youtubers-boudoir-photographers.md";
  slug: "top-youtubers-boudoir-photographers";
  body: string;
  collection: "articles";
  data: any
} & { render(): Render[".md"] };
"top-youtubers-newborn-photographers.md": {
	id: "top-youtubers-newborn-photographers.md";
  slug: "top-youtubers-newborn-photographers";
  body: string;
  collection: "articles";
  data: any
} & { render(): Render[".md"] };
"top-youtubers-wedding-photographers.md": {
	id: "top-youtubers-wedding-photographers.md";
  slug: "top-youtubers-wedding-photographers";
  body: string;
  collection: "articles";
  data: any
} & { render(): Render[".md"] };
};
"config": {
"cta.mdx": {
	id: "cta.mdx";
  slug: "cta";
  body: string;
  collection: "config";
  data: any
} & { render(): Render[".mdx"] };
"homepage.md": {
	id: "homepage.md";
  slug: "homepage";
  body: string;
  collection: "config";
  data: any
} & { render(): Render[".md"] };
"site.mdx": {
	id: "site.mdx";
  slug: "site";
  body: string;
  collection: "config";
  data: any
} & { render(): Render[".mdx"] };
};
"posts": {
"camera-buying-guide.md": {
	id: "camera-buying-guide.md";
  slug: "camera-buying-guide";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"client-management-guide.md": {
	id: "client-management-guide.md";
  slug: "client-management-guide";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"essential-camera-lenses.md": {
	id: "essential-camera-lenses.md";
  slug: "essential-camera-lenses";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"family-portrait-guide.md": {
	id: "family-portrait-guide.md";
  slug: "family-portrait-guide";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"lightroom-editing-guide.md": {
	id: "lightroom-editing-guide.md";
  slug: "lightroom-editing-guide";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"photography-accessories-guide.md": {
	id: "photography-accessories-guide.md";
  slug: "photography-accessories-guide";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"photography-business-startup.md": {
	id: "photography-business-startup.md";
  slug: "photography-business-startup";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"photography-marketing-strategies.md": {
	id: "photography-marketing-strategies.md";
  slug: "photography-marketing-strategies";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"photoshop-techniques.md": {
	id: "photoshop-techniques.md";
  slug: "photoshop-techniques";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"portrait-lighting-guide.md": {
	id: "portrait-lighting-guide.md";
  slug: "portrait-lighting-guide";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"portrait-posing-techniques.md": {
	id: "portrait-posing-techniques.md";
  slug: "portrait-posing-techniques";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"raw-processing-workflow.md": {
	id: "raw-processing-workflow.md";
  slug: "raw-processing-workflow";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"wedding-photography-gear.md": {
	id: "wedding-photography-gear.md";
  slug: "wedding-photography-gear";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"wedding-photography-pricing.md": {
	id: "wedding-photography-pricing.md";
  slug: "wedding-photography-pricing";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
};
"topics": {
"camera-gear.md": {
	id: "camera-gear.md";
  slug: "camera-gear";
  body: string;
  collection: "topics";
  data: any
} & { render(): Render[".md"] };
"photo-editing.md": {
	id: "photo-editing.md";
  slug: "photo-editing";
  body: string;
  collection: "topics";
  data: any
} & { render(): Render[".md"] };
"photography-business.md": {
	id: "photography-business.md";
  slug: "photography-business";
  body: string;
  collection: "topics";
  data: any
} & { render(): Render[".md"] };
"portrait-photography.md": {
	id: "portrait-photography.md";
  slug: "portrait-photography";
  body: string;
  collection: "topics";
  data: any
} & { render(): Render[".md"] };
"wedding-photography.md": {
	id: "wedding-photography.md";
  slug: "wedding-photography";
  body: string;
  collection: "topics";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = never;
}
