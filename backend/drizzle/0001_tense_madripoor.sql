CREATE TABLE `sales_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`salesperson_id` int NOT NULL,
	`total_sales` int NOT NULL DEFAULT 0,
	`cash_collected` int NOT NULL DEFAULT 0,
	`ltv_sales` int NOT NULL DEFAULT 0,
	`conversion_rate` int NOT NULL DEFAULT 0,
	`churn_rate` int NOT NULL DEFAULT 0,
	`average_ticket` int NOT NULL DEFAULT 0,
	`month` varchar(7) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sales_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `salespeople` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`individual_goal` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `salespeople_id` PRIMARY KEY(`id`)
);
