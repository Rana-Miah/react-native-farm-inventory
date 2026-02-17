CREATE TABLE `barcode` (
	`id` text PRIMARY KEY NOT NULL,
	`barcode` text NOT NULL,
	`price` real NOT NULL,
	`promo_price` real,
	`description` text,
	`item_code_id` text NOT NULL,
	`unit_id` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`item_code_id`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`unit_id`) REFERENCES `unit`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `barcode_id_unique` ON `barcode` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `barcode_barcode_unique` ON `barcode` (`barcode`);--> statement-breakpoint
CREATE TABLE `item` (
	`id` text PRIMARY KEY NOT NULL,
	`supplier_id` text NOT NULL,
	`item_code` text NOT NULL,
	`item_description` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`supplier_id`) REFERENCES `supplier`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `item_id_unique` ON `item` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `item_item_code_unique` ON `item` (`item_code`);--> statement-breakpoint
CREATE TABLE `stored_scanned_item` (
	`id` text PRIMARY KEY NOT NULL,
	`barcode_id` text NOT NULL,
	`unit_id` text NOT NULL,
	`quantity` real NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`barcode_id`) REFERENCES `barcode`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`unit_id`) REFERENCES `unit`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stored_scanned_item_id_unique` ON `stored_scanned_item` (`id`);--> statement-breakpoint
CREATE TABLE `supplier` (
	`id` text PRIMARY KEY NOT NULL,
	`supplier_code` text NOT NULL,
	`supplier_name` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `supplier_id_unique` ON `supplier` (`id`);--> statement-breakpoint
CREATE TABLE `unit` (
	`id` text PRIMARY KEY NOT NULL,
	`unit_name` text NOT NULL,
	`packing` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unit_id_unique` ON `unit` (`id`);