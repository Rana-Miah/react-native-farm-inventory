CREATE TABLE `barcode` (
	`id` text PRIMARY KEY NOT NULL,
	`barcode` text NOT NULL,
	`price` real NOT NULL,
	`description` text,
	`item_code_id` text NOT NULL,
	`unit_id` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`item_code_id`) REFERENCES `users_table`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`unit_id`) REFERENCES `unit`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `barcode_id_unique` ON `barcode` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `barcode_barcode_unique` ON `barcode` (`barcode`);--> statement-breakpoint
CREATE TABLE `users_table` (
	`id` text PRIMARY KEY NOT NULL,
	`supplier_id` text NOT NULL,
	`item_code` text NOT NULL,
	`item_description` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`supplier_id`) REFERENCES `supplier`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_id_unique` ON `users_table` (`id`);--> statement-breakpoint
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