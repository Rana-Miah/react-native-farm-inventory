ALTER TABLE `itemTable` RENAME TO `item`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_item` (
	`id` text PRIMARY KEY NOT NULL,
	`supplier_id` text NOT NULL,
	`item_code` text NOT NULL,
	`item_description` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`supplier_id`) REFERENCES `supplier`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_item`("id", "supplier_id", "item_code", "item_description", "createdAt", "updatedAt") SELECT "id", "supplier_id", "item_code", "item_description", "createdAt", "updatedAt" FROM `item`;--> statement-breakpoint
DROP TABLE `item`;--> statement-breakpoint
ALTER TABLE `__new_item` RENAME TO `item`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `item_id_unique` ON `item` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `item_item_code_unique` ON `item` (`item_code`);--> statement-breakpoint
CREATE TABLE `__new_barcode` (
	`id` text PRIMARY KEY NOT NULL,
	`barcode` text NOT NULL,
	`price` real NOT NULL,
	`description` text,
	`item_code_id` text NOT NULL,
	`unit_id` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`item_code_id`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`unit_id`) REFERENCES `unit`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_barcode`("id", "barcode", "price", "description", "item_code_id", "unit_id", "createdAt", "updatedAt") SELECT "id", "barcode", "price", "description", "item_code_id", "unit_id", "createdAt", "updatedAt" FROM `barcode`;--> statement-breakpoint
DROP TABLE `barcode`;--> statement-breakpoint
ALTER TABLE `__new_barcode` RENAME TO `barcode`;--> statement-breakpoint
CREATE UNIQUE INDEX `barcode_id_unique` ON `barcode` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `barcode_barcode_unique` ON `barcode` (`barcode`);